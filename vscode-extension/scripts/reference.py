"""Fetch/check immutable reference and restore archive permissions in build copies."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parent.parent
DIRECTORY = ROOT.parent / 'references/vscode-extension'
PROVENANCE = json.loads((DIRECTORY / 'provenance.json').read_text())
ARCHIVE = DIRECTORY / ('openai.chatgpt-' + PROVENANCE['version'] + '-darwin-arm64.vsix')
EXTRACTED = ARCHIVE.with_suffix('')


def check_archive():
    h = hashlib.sha256()
    with ARCHIVE.open('rb') as f:
        for block in iter(lambda: f.read(1024 * 1024), b''):
            h.update(block)
    if h.hexdigest() != PROVENANCE['sha256']:
        raise ValueError('Reference VSIX SHA-256 differs from recorded Marketplace artifact')


def ensure():
    if not ARCHIVE.exists():
        partial = ARCHIVE.with_suffix('.vsix.partial')
        with urllib.request.urlopen(PROVENANCE['downloadUrl'], timeout=60) as response, partial.open('wb') as output:
            shutil.copyfileobj(response, output)
        h = hashlib.sha256(partial.read_bytes()).hexdigest()
        if h != PROVENANCE['sha256']:
            raise ValueError('Downloaded VSIX failed SHA-256 validation')
        partial.replace(ARCHIVE)
    check_archive()
    if not EXTRACTED.exists():
        temporary = EXTRACTED.with_name(EXTRACTED.name + '.extracting')
        temporary.mkdir()
        with zipfile.ZipFile(ARCHIVE) as archive:
            for info in archive.infolist():
                destination = (temporary / info.filename).resolve()
                if temporary.resolve() not in destination.parents:
                    raise ValueError('Unsafe ZIP member: ' + info.filename)
                archive.extract(info, temporary)
                mode = info.external_attr >> 16
                if mode:
                    destination.chmod(mode & 0o777)
        temporary.rename(EXTRACTED)
    print('Reference SHA-256 verified; extracted reference available.')


def modes(target):
    target = Path(target).resolve()
    if target == (EXTRACTED / 'extension').resolve():
        raise ValueError('Reference extraction is immutable; repair a build copy instead')
    count = 0
    with zipfile.ZipFile(ARCHIVE) as archive:
        for info in archive.infolist():
            if not info.filename.startswith('extension/'):
                continue
            mode = info.external_attr >> 16
            if mode & 0o111:
                destination = target / info.filename[len('extension/'):]
                destination.chmod(mode & 0o777)
                count += 1
    print('Restored executable permissions on %d build files.' % count)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--modes', type=Path)
    args = parser.parse_args()
    if args.modes:
        modes(args.modes)
    else:
        ensure()

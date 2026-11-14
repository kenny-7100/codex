"""Build from editable payloads while preserving unchanged ZIP records byte-for-byte.

This is an artifact-assisted packer, not a recreation of the unpublished VSCE
toolchain. Changed entries are freshly deflated; central-directory offsets and
the EOCD are rebuilt. The original VSIX is never modified.
"""
import argparse
import hashlib
import json
from pathlib import Path
import struct
import zipfile
import zlib

ROOT = Path(__file__).resolve().parent.parent
REFERENCE = ROOT.parent / 'references/vscode-extension/openai.chatgpt-26.51111.21308-darwin-arm64.vsix'
OUTPUT = ROOT / 'dist/openai.chatgpt-26.51111.21308-darwin-arm64-reconstructed.vsix'


def digest_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for block in iter(lambda: f.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def central_records(data, start, count):
    records = []
    cursor = start
    for _ in range(count):
        if data[cursor:cursor + 4] != b'PK\x01\x02':
            raise ValueError('Invalid central directory')
        name, extra, comment = struct.unpack_from('<HHH', data, cursor + 28)
        end = cursor + 46 + name + extra + comment
        records.append(bytearray(data[cursor:end]))
        cursor = end
    return records, cursor


def pack(reference=REFERENCE, stage=None, output=OUTPUT):
    stage = Path(stage or ROOT / 'build')
    data = Path(reference).read_bytes()
    end = data.rfind(b'PK\x05\x06')
    if end < 0:
        raise ValueError('Missing end of central directory')
    disk, cd_disk, disk_count, count, cd_size, cd_start, comment_size = struct.unpack_from('<HHHHIIH', data, end + 4)
    if disk or cd_disk or disk_count != count or count == 65535 or cd_start == 0xffffffff:
        raise ValueError('Multidisk/ZIP64 archives are not supported')
    if end + 22 + comment_size != len(data):
        raise ValueError('Unexpected archive trailer')
    records, cd_end = central_records(data, cd_start, count)
    if cd_end != cd_start + cd_size or cd_end != end:
        raise ValueError('Unexpected central-directory trailer/signature; requires explicit support')
    with zipfile.ZipFile(reference) as source:
        infos = source.infolist()
        if [i.header_offset for i in infos] != sorted(i.header_offset for i in infos):
            raise ValueError('Unexpected local-file order')
        output = Path(output)
        output.parent.mkdir(parents=True, exist_ok=True)
        temporary = output.with_suffix(output.suffix + '.tmp')
        changed = []
        additions = []
        original_names = {i.filename for i in infos}
        for p in sorted(stage.rglob('*')):
            if p.is_file() and p.relative_to(stage).as_posix() not in original_names:
                additions.append(p.relative_to(stage).as_posix())
        with temporary.open('wb') as out:
            out.write(data[:infos[0].header_offset])
            new_records = []
            for index, (info, record) in enumerate(zip(infos, records)):
                new_offset = out.tell()
                payload_path = stage / info.filename
                # Root package metadata defaults to the reference unless explicitly overridden.
                if not payload_path.exists() and info.filename.startswith('extension/'):
                    raise FileNotFoundError('Missing build payload: ' + info.filename)
                payload = payload_path.read_bytes() if payload_path.is_file() else source.read(info)
                original = source.read(info)
                if payload == original:
                    next_offset = infos[index + 1].header_offset if index + 1 < len(infos) else cd_start
                    out.write(data[info.header_offset:next_offset])
                else:
                    changed.append(info.filename)
                    flags = info.flag_bits & ~8
                    if flags & 1:
                        raise ValueError('Encrypted entry unsupported')
                    name_size, extra_size = struct.unpack_from('<HH', data, info.header_offset + 26)
                    name_extra = data[info.header_offset + 30:info.header_offset + 30 + name_size + extra_size]
                    compressor = zlib.compressobj(9, zlib.DEFLATED, -15)
                    compressed = compressor.compress(payload) + compressor.flush()
                    crc = zlib.crc32(payload) & 0xffffffff
                    header = bytearray(data[info.header_offset:info.header_offset + 30])
                    struct.pack_into('<H', header, 6, flags)
                    struct.pack_into('<H', header, 8, 8)
                    struct.pack_into('<III', header, 14, crc, len(compressed), len(payload))
                    out.write(header); out.write(name_extra); out.write(compressed)
                    struct.pack_into('<H', record, 8, flags)
                    struct.pack_into('<H', record, 10, 8)
                    struct.pack_into('<III', record, 16, crc, len(compressed), len(payload))
                struct.pack_into('<I', record, 42, new_offset)
                new_records.append(record)
            # Use the standard library to construct valid local/central records for added assets.
            if additions:
                import io
                extra_zip = io.BytesIO()
                with zipfile.ZipFile(extra_zip, 'w', zipfile.ZIP_DEFLATED) as z:
                    for name in additions:
                        info = zipfile.ZipInfo(name, (2026, 11, 13, 0, 0, 0))
                        info.compress_type = zipfile.ZIP_DEFLATED
                        info.external_attr = 0o100644 << 16
                        z.writestr(info, (stage / name).read_bytes())
                extra_data = extra_zip.getvalue()
                with zipfile.ZipFile(io.BytesIO(extra_data)) as z:
                    extra_records, _ = central_records(extra_data, z.start_dir, len(additions))
                    base = out.tell()
                    out.write(extra_data[:z.start_dir])
                    for record in extra_records:
                        offset = struct.unpack_from('<I', record, 42)[0]
                        struct.pack_into('<I', record, 42, base + offset)
                        new_records.append(record)
            start = out.tell()
            for record in new_records:
                out.write(record)
            size = out.tell() - start
            if len(new_records) >= 65535 or max(start, size) >= 0xffffffff:
                raise ValueError('Output requires ZIP64')
            eocd = bytearray(data[end:])
            struct.pack_into('<HHII', eocd, 8, len(new_records), len(new_records), size, start)
            out.write(eocd)
        temporary.replace(output)
    return {'output': str(output), 'changedEntries': changed, 'addedEntries': additions, 'sha256': digest_file(output), 'referenceSha256': digest_file(reference)}


def verify(reference=REFERENCE, output=OUTPUT, expect_identical=True):
    differences = []
    with zipfile.ZipFile(reference) as a, zipfile.ZipFile(output) as b:
        if b.testzip() is not None:
            raise ValueError('Output ZIP CRC verification failed')
        names_a, names_b = a.namelist(), b.namelist()
        added = sorted(set(names_b) - set(names_a))
        removed = sorted(set(names_a) - set(names_b))
        for name in names_a:
            if name in names_b and a.read(name) != b.read(name):
                differences.append(name)
        metadata_differences = []
        for ai, bi in zip(a.infolist(), b.infolist()):
            fields = ['filename', 'date_time', 'compress_type', 'external_attr', 'flag_bits', 'extra', 'comment']
            changed = [key for key in fields if getattr(ai, key) != getattr(bi, key)]
            if changed:
                metadata_differences.append({'name': ai.filename, 'fields': changed})
        report = {'referenceSha256': digest_file(reference), 'outputSha256': digest_file(output), 'referenceEntries': len(names_a), 'outputEntries': len(names_b), 'sameOrder': names_a == names_b, 'addedEntries': added, 'removedEntries': removed, 'payloadDifferences': differences, 'metadataDifferences': metadata_differences, 'crcValid': True}
    report['byteIdentical'] = report['referenceSha256'] == report['outputSha256']
    report['payloadIdentical'] = not (added or removed or differences)
    if expect_identical and not report['byteIdentical']:
        raise ValueError('Expected identical archive: ' + json.dumps(report))
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['pack', 'verify'])
    parser.add_argument('--allow-changes', action='store_true')
    args = parser.parse_args()
    report = pack() if args.command == 'pack' else verify(expect_identical=not args.allow_changes)
    target = ROOT / 'reports' / (args.command + '.json')
    target.parent.mkdir(exist_ok=True)
    target.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()

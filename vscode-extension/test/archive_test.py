"""Exercise real archive mutations, not just a copied baseline."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
import zipfile

SPEC = importlib.util.spec_from_file_location('archive', Path(__file__).resolve().parents[1] / 'scripts/archive.py')
archive = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(archive)


class ArchiveTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.original = self.root / 'original.vsix'
        self.output = self.root / 'built.vsix'
        self.stage = self.root / 'stage'
        (self.stage / 'extension').mkdir(parents=True)
        with zipfile.ZipFile(self.original, 'w', zipfile.ZIP_DEFLATED) as z:
            z.comment = b'reproducibility-test'
            z.writestr('extension.vsixmanifest', '<manifest/>')
            z.writestr('extension/a.js', 'module.exports = 1;')
            z.writestr('extension/b.js', 'module.exports = "unchanged";')
        with zipfile.ZipFile(self.original) as z:
            for name in z.namelist():
                target = self.stage / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(z.read(name))

    def tearDown(self):
        self.temp.cleanup()

    def test_exact_baseline(self):
        archive.pack(self.original, self.stage, self.output)
        report = archive.verify(self.original, self.output)
        self.assertTrue(report['byteIdentical'])

    def test_changed_entry_offsets_crc_and_unmodified_neighbor(self):
        (self.stage / 'extension/a.js').write_text('module.exports = 2000;\n' * 1000)
        result = archive.pack(self.original, self.stage, self.output)
        self.assertEqual(result['changedEntries'], ['extension/a.js'])
        report = archive.verify(self.original, self.output, expect_identical=False)
        self.assertEqual(report['payloadDifferences'], ['extension/a.js'])
        self.assertTrue(report['crcValid'])
        with zipfile.ZipFile(self.output) as z:
            self.assertEqual(z.read('extension/b.js'), b'module.exports = "unchanged";')

    def test_additional_module(self):
        (self.stage / 'extension/custom.js').write_text('export const custom = true;')
        archive.pack(self.original, self.stage, self.output)
        report = archive.verify(self.original, self.output, expect_identical=False)
        self.assertEqual(report['addedEntries'], ['extension/custom.js'])
        self.assertFalse(report['removedEntries'])
        self.assertTrue(report['crcValid'])

    def test_missing_payload_fails(self):
        (self.stage / 'extension/a.js').unlink()
        with self.assertRaises(FileNotFoundError):
            archive.pack(self.original, self.stage, self.output)


if __name__ == '__main__':
    unittest.main()

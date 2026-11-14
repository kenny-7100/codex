import path from 'node:path';
import { GenMapping, addSegment, setSourceContent, toEncodedMap } from '@jridgewell/gen-mapping';

export function hostSourceMap(fragments, sourcePaths, outputPath) {
  const map = new GenMapping({ file: path.basename(outputPath) });
  let generatedLine = 0;
  fragments.forEach((content, index) => {
    const source = path.relative(path.dirname(outputPath), sourcePaths[index]).split(path.sep).join('/');
    setSourceContent(map, source, content);
    const lines = content.split('\n');
    lines.forEach((_, line) => addSegment(map, generatedLine + line, 0, source, line, 0));
    generatedLine += lines.length;
  });
  return toEncodedMap(map);
}

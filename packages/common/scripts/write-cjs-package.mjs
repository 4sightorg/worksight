import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
writeFileSync(join(root, 'dist/cjs/package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
writeFileSync(join(root, 'dist/esm/package.json'), JSON.stringify({ type: 'module' }, null, 2) + '\n');

/**
 * Copy @worksight/assets logos into VitePress public/ so /assets/logos/*
 * resolves at build and on Vercel. Avoids a symlink into packages/assets
 * (wrong path shape + flaky outside Root Directory).
 */
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, '../../packages/assets/src/logos');
const dest = join(root, 'website/public/assets/logos');

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log(`synced logos → ${dest}`);

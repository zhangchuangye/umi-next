import { existsSync, readFileSync } from 'fs';
import { join } from 'pathe';
import { parse } from '../../compiled/dotenv';

export function loadEnv(opts: { cwd: string; envFile: string }) {
  const files = [
    join(opts.cwd, opts.envFile),
    join(opts.cwd, `${opts.envFile}.local`),
  ];
  for (const file of files) {
    if (!existsSync(file)) continue;
    const parsed: Record<string, string> = parse(readFileSync(file)) || {};
    for (const key of Object.keys(parsed)) {
      process.env[key] = parsed[key];
    }
  }
}

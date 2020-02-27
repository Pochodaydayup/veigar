import path from 'path';
import fs from 'fs-extra';
import Config from 'webpack-chain';
import { fatal } from '../util/logger';

export interface AppConfig {
  pages: { path: string; style: any }[];
  globalStyle: any;
}

export function getAppConfig(): AppConfig {
  const src = path.join(process.cwd(), 'src');

  return require(path.join(src, 'app.config.js'));
}

export function getEntry(): { page: string; filePath: string }[] {
  const src = path.join(process.cwd(), 'src');

  if (!fs.existsSync(path.join(src, 'app.config.js'))) {
    fatal(`app.config.js dont exists`);
  }

  const config = getAppConfig();

  return config.pages.map(({ path: page }: { path: string }) => ({
    page,
    filePath: path.join(src, `${page}.js`),
  }));
}

export default function setEntry(config: Config) {
  const entries = getEntry();

  config
    .entry('main')
    .add(path.join(process.cwd(), 'src/main'))
    .end();

  for (const { page, filePath } of entries) {
    config
      .entry(page)
      .add(filePath)
      .end();
  }
}

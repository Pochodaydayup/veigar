import path from 'path';
import fs from 'fs-extra';
import Config from 'webpack-chain';
import { fatal } from '../util/logger';

function getEntry(): { page: string; filePath: string }[] {
  const src = path.join(process.cwd(), 'src');
  const configPath = path.join(src, 'veigar.config.js');

  if (!fs.existsSync(configPath)) {
    fatal(`veigar.config.js dont exists`);
  }

  const config = require(path.join(src, 'veigar.config.js'));

  return config.pages.map((page: string) => ({
    page,
    filePath: path.join(src, page),
  }));
}

export default function setEntry(config: Config) {
  const entries = getEntry();
  for (const { page, filePath } of entries) {
    config
      .entry(page)
      .add(filePath)
      .end();
  }
}

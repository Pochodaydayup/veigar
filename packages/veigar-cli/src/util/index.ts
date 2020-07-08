/*
 * Created Date: January 7th 2020, 2:42:16 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 5th 2020, 3:57:51 pm
 */
import path from 'path';
import fs from 'fs-extra';
import { fatal } from './logger';

export const getVeigarConfig = () => {
  const src = path.join(process.cwd(), 'src');
  const configPath = path.join(src, 'veigar.config.js');

  if (!fs.existsSync(configPath)) {
    fatal(`veigar.config.js don't exists`);
  }

  return require(path.join(src, 'veigar.config.js'));
};

export const resolve = (dir: string) => path.join(process.cwd(), dir);

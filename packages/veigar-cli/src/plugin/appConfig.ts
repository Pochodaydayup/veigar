/*
 * Created Date: January 8th 2020, 6:19:20 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 8th 2020, 6:19:20 pm
 */
import path from 'path';
import fs from 'fs-extra';
import { parse } from '@vue/compiler-sfc';

export default function emitAppConfig(assets: any) {
  const appVuePath = path.join(process.cwd(), 'src/app.vue');

  const appVue = fs.readFileSync(appVuePath).toString();

  const { descriptor } = parse(appVue);

  const code = descriptor.script;

  console.log(code);
}

// 等 vue 3.0 正式发布后移除
const path = require('path');
const fs = require('fs');
const execa = require('execa');
const cwd = process.cwd();
const vuePath = path.join(cwd, 'vue-next');

const runtimeCorePath = path.join(vuePath, 'packages/runtime-core');

const exec = async (...args) => {
  const execCommend = execa(...args);
  execCommend.stdout.pipe(process.stdout);
  await execCommend;
};

async function bootstrap() {
  if (!fs.existsSync(vuePath)) {
    console.log('clone vue-next ...');
    await exec('git', ['clone', 'git@github.com:vuejs/vue-next.git']);
  } else {
    console.log('update vue-next ...');
    await exec('git', ['pull']);
  }

  console.log('yarn intall ...');
  await exec('yarn', [], {
    cwd: vuePath,
  });

  fs.writeFileSync(
    path.join(runtimeCorePath, 'index.js'),
    `export * from './dist/runtime-core.esm'`
  );

  // 修改 runtime-core
  const pkgPath = path.join(runtimeCorePath, 'package.json');

  const pkg = require(pkgPath);
  pkg.types = 'dist/packages/runtime-core/src/index.d.ts';

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  // 修改根目录的 package.json
  const rootPkgPath = path.join(vuePath, 'package.json');
  const rootPkg = require(rootPkgPath);

  rootPkg.scripts.build = 'node scripts/build.js runtime-core -f esm';

  fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2));

  // 修改 rollup.config.js
  const rollupPath = path.join(vuePath, 'rollup.config.js');
  const rollupConfig = fs.readFileSync(rollupPath).toString();

  fs.writeFileSync(
    rollupPath,
    rollupConfig.replace(
      'declaration: shouldEmitDeclarations',
      'declaration: true'
    )
  );

  console.log('yarn build vue next ...');
  await exec('yarn', ['build'], {
    cwd: vuePath,
  });

  console.log('bootstrap done');
}

bootstrap();

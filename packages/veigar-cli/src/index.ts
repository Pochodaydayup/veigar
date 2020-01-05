import program from 'commander';
import build from './build';

export function run(argv: any) {
  program
    .command('build')
    .description('build project')
    .option('-t, --target [target]', 'Which target to be build')
    .option('-w, --watch', 'watch dev')
    .action(function(options) {
      const { target, watch } = options;
      build(target, watch);
    });

  program.parse(argv);
}

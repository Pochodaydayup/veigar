import chalk from 'chalk';
import { format } from 'util';

const prefix = '  reigar-cli';
const sep = chalk.gray('·');

function handleErrorMsg(message: Error | string) {
  if (message instanceof Error) {
    message = message.message.trim();
  }
  const msg = format(message);

  console.error(chalk.red(prefix), sep, msg);
}

export const normal = function normal(...args: any[]) {
  const msg = format(args);

  console.log(msg);
};

export const warn = function warn(...args: any[]) {
  const msg = format(args);

  console.log(chalk.yellow(prefix), sep, msg);
};

export const log = function log(...args: any[]) {
  const msg = format(args);

  console.log(chalk.white(prefix), sep, msg);
};

export const success = function success(...args: any[]) {
  const msg = format(args);

  console.log(chalk.green(prefix), sep, msg);
};

export const error = function error(message: Error | string) {
  handleErrorMsg(message);
};

export const fatal = function fatal(message: Error | string) {
  handleErrorMsg(message);
  process.exit(-1);
};

import {Command, flags} from '@oclif/command';
import chalk from 'chalk';
import {exec} from 'child_process';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import {dirname} from 'path';

import checkPkg from './check-pkg-json';

class Prompt4NpmScripts extends Command {
  static description = 'Prompt for npm-scripts and run them in a sub shell';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    path: flags.string({
      char: 'p',
      description: 'path to your package.json. If no path is given it uses the current working directory `process.cwd()`',
      default: `${process.cwd()}/package.json`,
    }
      ),
  };

  static args = [];

  async run() {
    const {flags} = this.parse(Prompt4NpmScripts);
    const path = flags.path;
    const status = await checkPkg(path);
    this.log(status as unknown as string);

    // fs.promises.stat(path as fs.PathLike).then((res: any) => {
    //   if (res.isFile()) {
    //     return true;
    //   } else if (res.isDirectory()) {
    //     this.error(chalk.red(`"${path}"\nis not a file! It is a directory.`));
    //     return false;
    //   }
    // })
    // .catch((err: any) => {
    //   if (err.code === 'ENOENT') {
    //     return false;
    //   } else {
    //     throw err;
    //   }
    // });

    if (status.exists === false) {
      this.exit(1);
    }
    if (status.exists === true && status.isFile !== true) {
      this.error(chalk.red(`"${path}"\nis not a file! It is a directory.`));
      this.exit(1);
    }
    const pkgString = await fs.promises.readFile(path as string, 'utf8')
     .then((data: any) => {
       return data;
    }).catch((err: Error) => {
      throw err;
    });

    const pkg = await Promise.resolve(pkgString)
    .then(JSON.parse)
    .catch(err => {
      throw err;
    });
    const choices: object[] = [];
    // tslint:disable-next-line:no-for-in
    for (let key in pkg.scripts) {
      if (pkg.scripts.hasOwnProperty(key)) {
        choices.push({name: `${key} ==> ${pkg.scripts[key]}`});
      }
    }
    let responses: any = await inquirer.prompt([{
      name: 'script',
      message: 'select a script',
      type: 'list',

      choices: [...choices],
    }]);
    const match: string[] = [];
    responses.script.replace(/(?:(?! ==>).)*/, (res: string) => {
      match.push(res);
    });
    exec(`cd ${dirname(path as string)} && npm run ${match[0]}`, (error, stdout, stderr) => {
      if (error) {
        this.log(chalk.red(`${error}`));
        // this.error(`exec error: ${error}`);
      }
      if (stdout) {
        this.log(chalk.green(`${stdout}`));
      }
      if (stderr) {
        this.log(chalk.red(`${stderr}`));
      }
    });
  }
}

export = Prompt4NpmScripts;

import {Command, flags} from '@oclif/command';
import chalk from 'chalk';
// import {promises as fsPromises} from 'fs';
import * as fs from 'fs';

class Prompt4NpmScripts extends Command {
  static description = 'Prompt for npm-scripts and run them in a sub shell';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    path: flags.string({
      char: 'p',
      description: 'path to your package.json',
      default: `${process.cwd()}/package.json`,
    }
      ),
    // flag with no value (-f, --force)
  };

  static args = [];

  async run() {
    const {flags} = this.parse(Prompt4NpmScripts);

    this.log(flags.path);
    const path = flags.path;

    const status = await fs.promises.stat(path as fs.PathLike).then((res: any) => {
      if (res.isFile()) {
        return true;
      } else if (res.isDirectory()) {
        this.error(chalk.red(`"${path}"\nis not a file! It is a directory.`));
        return false;
      }
    })
    .catch((err: any) => {
      if (err.code === 'ENOENT') {
        return false;
      } else {
        throw err;
      }
    });

    if (status === false) {
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
    this.log(pkg.scripts);
    // try {
    //   pkg = JSON.parse(pkgString);
    // } catch (err) {
    //   if (err instanceof SyntaxError) {
    //     this.error(err);
    //     this.exit(1);
    //   } else {
    //     throw err;
    //   }
    // }

    // this.log(status as unknown as string);
    // const name = flags.name || 'world'
    // this.log(`hello ${name} from ./src/index.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}

export = Prompt4NpmScripts;

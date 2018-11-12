import {expect, test} from '@oclif/test';
// import {DOWN, ENTER, UP} from 'inquirer-test';
const inquirerTest = require('inquirer-test');
const run = inquirerTest;
const DOWN = inquirerTest.DOWN;
const UP = inquirerTest.UP;
const ENTER = inquirerTest.ENTER;
import {resolve} from 'path';

// const clipath = '../bin/run';
// import cmd = require('../src');
const clipath = resolve(__dirname, '../bin/run');

describe('prompt-4-scripts', () => {
  test
    .stderr()
    .do(() => run([`${clipath} -p ${resolve(__dirname, './manual/package.json')}`], [ENTER]))
    .it('runs ', (ctx, done) => {
      expect(ctx.stderr).to.contain('echo "Error: no test specified" && exit 1');
      done();
    });

  // test
  //   .stdout()
  //   .do(() => cmd.run(['--name', 'jeff']))
  //   .it('runs hello --name jeff', (ctx, done) => {
  //     expect(ctx.stdout).to.contain('hello jeff');
  //     done();
  //   });
});

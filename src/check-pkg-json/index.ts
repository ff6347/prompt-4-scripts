import * as fs from 'fs';
const status = {isFile: false, exists: false};

export default async function checkPkg(path) {
  // tslint:disable-next-line:no-console
  fs.promises.stat(path as fs.PathLike).then((res: any) => {
    if (res.isFile()) {
      // console.log('in module',path);
      status.isFile = true;
      status.exists = true;
      return status;
    } else if (res.isDirectory()) {
      status.exists = true;
      return status;
    }
  })
    .catch((err: any) => {
      if (err.code === 'ENOENT') {
        return status;
      } else {
        throw err;
      }
    });
}

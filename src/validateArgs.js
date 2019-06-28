const fs = require('fs');
const util = require('util');

async function createDir(dir) {
  try {
    return await util.promisify(fs.mkdir)(dir);
  } catch(e) {
    throw 'Could not create output directory.'
  }
}

module.exports = {
  async validate(args) {
    if(args._.length < 1) {
      throw 'No input files specified.';
    }

    const outDir = args['--out'] || 'man';

    let stat;
    try {
      stat = await util.promisify(fs.stat)(outDir);
    } catch(e) {
      await createDir(outDir);
    }

    if(!stat.isDirectory()) {
      throw 'Output path is not a directory'
    }
  }
}
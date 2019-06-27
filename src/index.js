const package = require('../package.json');
const fs = require('fs');
const path = require('path');
const arg = require('arg');
const fg = require('fast-glob');
const util = require('util');
const { generator } = require('./generator');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const args = arg({
  '--dark': Boolean,
  '--nojs': Boolean,
  '--version': Boolean,
  '--out': String,

  '-v': '--version',
  '-o': '--out'
});

function ready([htmlTemplate, vueTemplate, filesArray]) {
  const files = filesArray.reduce((a, b) => a.concat(b), []);

  if(files.length === 0) {
    console.log('Could not find any JSON files.');
  }

  files.forEach(async (file) => {
    const data = await readFile(file, 'utf-8');

    const html = await generator(args, htmlTemplate, vueTemplate, data);

    let filePath = path.parse(file);
    filePath.ext = '.html';

    const outDir = args['--out'] ? args['--out'] : 'man';
    const exists = await util.promisify(fs.exists)(outDir);
    if(!exists) {
      await util.promisify(fs.mkdir)(outDir);
    }
    const outPath = outDir  + '/' + filePath.name + filePath.ext;
    writeFile(outPath, html);
  });
}

if(args['--version']) {
  console.log(`ManualHTML v${package.version}`);
  return;
}

if(args._.length < 1) {
  console.log('No input files specified.');
  return;
}

Promise.all([
  readFile(__dirname + '/view/template.html', 'utf-8'),
  readFile(__dirname + '/view/manual.html', 'utf-8'),
  Promise.all(args._.map(x => fg(x)))
]).then(ready);
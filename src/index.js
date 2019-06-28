const package = require('../package.json');
const fs = require('fs');
const path = require('path');
const arg = require('arg');
const fg = require('fast-glob');
const util = require('util');
const { generator } = require('./generator');
const { validate } = require('./validateArgs');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const args = arg({
  '--dark': Boolean,
  '--nojs': Boolean,
  '--version': Boolean,
  '--verbose': Boolean,
  '--out': String,

  '-v': '--version',
  '-o': '--out'
});

function ready([htmlTemplate, vueTemplate, filesArray]) {
  let files = filesArray.reduce((a, b) => a.concat(b), []);
  files = files.filter(x => x.endsWith('.json'));

  if(files.length === 0) {
    console.log('Could not find any JSON files.');
  }

  files.forEach(async (file) => {
    if(args['--verbose']) console.log(`Generating manual for ${file}`);

    const data = await readFile(file, 'utf-8');

    let json;
    try {
      json = JSON.parse(data);
    } catch(e) {
      console.error(`Failed to parse JSON in ${file}`);
      return;
    }

    const html = await generator(args, htmlTemplate, vueTemplate, json);

    let filePath = path.parse(file);
    filePath.ext = '.html';

    const outDir = args['--out'] || 'man';
    const outPath = outDir  + '/' + filePath.name + filePath.ext;

    if(args['--verbose']) console.log(`Writing to ${outPath}`);

    try {
      await writeFile(outPath, html);
    } catch(e) {
      throw `Failed to write ${outPath}`;
    }
  });
}


if(args['--version']) {
  console.log(`ManualHTML v${package.version}`);
  return;
}

Promise.all([
  readFile(__dirname + '/view/template.html', 'utf-8'),
  readFile(__dirname + '/view/manual.html', 'utf-8'),
  Promise.all(args._.map(x => fg(x))),
  validate(args)
]).then(ready).catch((e) => {
  console.error(e);
});
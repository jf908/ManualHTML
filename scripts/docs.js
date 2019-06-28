const path = require('path');
const { exec } = require('child_process');

const bin = path.join(__dirname, '../src/index');
const input = path.posix.join(__dirname, '../docs/index.json');
const output = path.join(__dirname, '../docs');
const cmd = `node ${bin} ${input} -o ${output}`;

exec(cmd, (err, stdout, stderr) => {
  if(err) console.err(err);
  console.log(stdout);
  console.error(stderr);
});
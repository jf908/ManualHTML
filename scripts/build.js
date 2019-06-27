const { exec } = require('pkg');

let targets = 'node10';

if(process.argv[2] === '--all') {
  targets = ['linux','macos','win'].map(x => `${targets}-${x}`).join(',');
}

exec([
  __dirname + '/../',
  '--out-path', 'dist',
  '--targets', targets
]);
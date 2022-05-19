const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Input some data...\n');

stdin.on('data', data => {
  if(data.toString().trim() === 'exit') {
    process.exit();
  } else {
    output.write(data);
  }
});

process.on('exit', () => stdout.write('Thank you!'));
process.on('SIGINT', process.exit);
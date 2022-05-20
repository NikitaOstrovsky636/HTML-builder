const path = require('path');
const fs = require('fs');
const { readdir, writeFile } = require('fs/promises');

const sourcePath = path.join(__dirname, 'styles');
const targetFolder = path.join(__dirname, 'project-dist');

let arrayOfStyles = [];

async function createCSSBundle(source, target) {
  try {
    const files = await readdir(source, {withFileTypes: true});

    for await (const file of files) {
      if (file.isFile() && file.name.split('.')[1] === 'css') {
        const stream = fs.createReadStream(path.join(source, file.name), 'utf-8');
        
        for await (const chunk of stream) {
          arrayOfStyles.push(chunk);
        }
      }
    }

    await writeFile(path.join(target, 'bundle.css'), arrayOfStyles.join(''), 'utf-8');
  } catch (error) {
    console.log(error);
  }
}

createCSSBundle(sourcePath, targetFolder);
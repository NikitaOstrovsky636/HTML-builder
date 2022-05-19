const path = require('path');
const { readdir, stat } = require('fs/promises');

const sourceFolder = path.join(__dirname, 'secret-folder');

async function readFiles(source) {
  
  try {
    const files = await readdir(source, {withFileTypes: true});

    for await (let file of files) {
      if(file.isFile()) {
        const filePath = path.join(source, file.name);
        const fileData = await stat(filePath);

        file = file.name.split('.');
        console.log(`${ file[0] } - ${ file[1] } - ${ fileData.size / 1000 }kb`);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

readFiles(sourceFolder);

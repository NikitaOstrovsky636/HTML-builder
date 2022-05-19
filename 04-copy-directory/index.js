const path = require('path');
const { readdir, copyFile, mkdir, rm } = require('fs/promises');

const sourcePath = path.join(__dirname, 'files');
const targetPath = path.join(__dirname, 'files-copy');

async function copyDir(source, target) {
  
  try {
    await rm(target, {recursive: true, force: true});
    await mkdir(target, { recursive: true });

    const files = await readdir(source , {withFileTypes: true});
    
    files.forEach(file => {
      copyFile(path.join(source, file.name), path.join(target, file.name));
    });

  } catch (err) {
    console.log(err);
  }
}

copyDir(sourcePath, targetPath);
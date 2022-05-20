const path = require('path');
const fs = require('fs');
const { readdir, writeFile, readFile, mkdir, rm, copyFile} = require('fs/promises');

const targetFolder = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const cssSourceFolder = path.join(__dirname, 'styles');
const cssTargetFolder = path.join(targetFolder, 'style.css');
const assetsSourceFolder = path.join(__dirname, 'assets');
const assetsTargetFolder = path.join(targetFolder, 'assets');

async function createHtmlBuilder() {

  try {
    let templateFile = await readFile(templatePath);
    templateFile = templateFile.toString();
    const componentsArray = [];

    const componentFiles = await readdir(componentsFolder, {withFileTypes: true});

    for await (const component of componentFiles) {
      const componentName = component.name.split('.')[0];
      const templateFile = fs.createReadStream(path.join(componentsFolder, component.name), 'utf-8');
      let text = '';

      for await (const chunk of templateFile) {
        text += chunk;
      }

      componentsArray.push({ 
        name: componentName,
        value: text
      });
    }

    for (const component of componentsArray) {

      if (templateFile.includes(`{{${component.name}}}`)){
        const templateFragment = templateFile.split(`{{${component.name}}}`);
        templateFile = templateFragment[0] + component.value + templateFragment[1];
      }
    }

    await writeFile(path.join(targetFolder, 'index.html'), templateFile, 'utf-8');
  } catch (error) {
    console.log(error);
  }
}

async function createCSSBundle(source, target) {

  try {
    const files = await readdir(source, {withFileTypes: true});
    const arrayOfStyles = [];
  
    for await (const file of files) {

      if (file.isFile() && file.name.split('.')[1] === 'css') {
        const stream = fs.createReadStream(path.join(source, file.name), 'utf-8');
          
        for await (const chunk of stream) {
          arrayOfStyles.push(chunk);
        }
      }
    }
  
    await writeFile(path.join(target), arrayOfStyles.join(''), 'utf-8');
  } catch (error) {
    console.log(error);
  }
}

async function copyAssets(source, target) {

  try {
    await mkdir(target, { recursive: true });
    const files = await readdir(source , {withFileTypes: true});
      
    files.forEach(file => {

      if(file.isDirectory()) {
        copyAssets(path.join(source, file.name), path.join(target, file.name));
      } else {
        copyFile(path.join(source, file.name), path.join(target, file.name));
      }
    });
  
  } catch (err) {
    console.log(err);
  }
}

(async function() {
  await rm(targetFolder, {recursive: true, force: true});
  await mkdir(targetFolder, {recursive: true});
  createHtmlBuilder();
  createCSSBundle(cssSourceFolder, cssTargetFolder);
  copyAssets(assetsSourceFolder, assetsTargetFolder);
}) ();

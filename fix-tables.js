const fs = require('fs');
const path = require('path');
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getAllFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = getAllFiles('./src/app');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const original = content;
  content = content.replace(/className="bg-white border rounded-xl overflow-hidden">\s*<table/g, 'className="bg-white border rounded-xl overflow-x-auto">\n          <table');
  content = content.replace(/className="bg-white border rounded-xl overflow-hidden overflow-x-auto">\s*<table/g, 'className="bg-white border rounded-xl overflow-x-auto">\n          <table');
  if (original !== content) {
    fs.writeFileSync(f, content);
    console.log(`Updated ${f}`);
  }
});
console.log('Done');

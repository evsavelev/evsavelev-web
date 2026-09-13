const fs = require('node:fs');
const path = require('node:path');
const source = __dirname;
const output = path.resolve(source, '../dist/stitch-v2');
fs.mkdirSync(output, {recursive: true});
for (const file of ['index.html', 'styles.css', 'app.js']) fs.copyFileSync(path.join(source, file), path.join(output, file));
fs.cpSync(path.join(source, 'assets'), path.join(output, 'assets'), {recursive: true});
console.log('Built standalone comparison → dist/stitch-v2/');

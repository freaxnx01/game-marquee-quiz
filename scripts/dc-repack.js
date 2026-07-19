const fs = require('fs');
const srcPath = process.argv[2] || 'index.html';
const outPath = process.argv[3] || 'index.html';
const data = fs.readFileSync(srcPath, 'utf8');
const html = fs.readFileSync('template.html', 'utf8');
const re = /(<script type="__bundler\/template">)([\s\S]*?)(<\/script>)/;
const m = data.match(re);
if (!m) throw new Error('__bundler/template script not found in ' + srcPath);
// Escape every "/" so no literal "</script" sequence can appear inside the JSON
// string and prematurely close the wrapping <script> tag in the browser's HTML
// parser (this is why the original file encodes "/" as "/" — "\/" is the
// JSON-equivalent escape and is just as safe).
let encoded = JSON.stringify(html).replace(/\//g, '\\/');
const newData = data.slice(0, m.index) + m[1] + encoded + m[3] +
  data.slice(m.index + m[0].length);
fs.writeFileSync(outPath, newData, 'utf8');
console.log('wrote', outPath, 'length', newData.length, '(was', data.length, ')');

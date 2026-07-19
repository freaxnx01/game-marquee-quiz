const fs = require('fs');
const path = process.argv[2] || 'index.html';
const data = fs.readFileSync(path, 'utf8');
const re = /(<script type="__bundler\/template">)([\s\S]*?)(<\/script>)/;
const m = data.match(re);
if (!m) throw new Error('__bundler/template script not found in ' + path);
const html = JSON.parse(m[2]);
fs.writeFileSync('template.html', html, 'utf8');
console.log('wrote template.html, length', html.length);

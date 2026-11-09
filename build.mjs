import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname);
const files=['index.html','manifest.webmanifest','sw.js','src','icons'];
await fs.mkdir(path.join(root,'dist'),{recursive:true});
for(const name of files)await fs.cp(path.join(root,name),path.join(root,'dist',name),{recursive:true});
console.log('Build ready: dist');

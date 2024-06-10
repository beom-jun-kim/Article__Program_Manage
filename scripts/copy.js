const fs = require('fs-extra');
const path = require('path');

const rootPath = path.resolve(__dirname, '..');
const standalonePath = path.resolve(rootPath, '.next', 'standalone');

const publicPath = path.resolve(rootPath, 'public');
const staticPath = path.resolve(rootPath, '.next', 'static');
const dockerEntrypointPath = path.resolve(rootPath, 'scripts', 'docker-entrypoint.sh');

const publicTargetPath = path.resolve(standalonePath, 'public');
const staticTargetPath = path.resolve(standalonePath, '.next', 'static');
const dockerEntrypointTargetPath = path.resolve(standalonePath, 'docker-entrypoint.sh');

console.log('Root Path :', rootPath);
console.log('Standalone Path :', standalonePath);
console.log('Public Path :', publicPath);
console.log('Static Path :', dockerEntrypointPath);
console.log('Docker Entrypoint Path :', staticPath);
console.log('Public Target Path :', publicTargetPath);
console.log('Static Target Path :', staticTargetPath);
console.log('Docker Entrypoint Target Path :', dockerEntrypointTargetPath, '\n');

if (!fs.existsSync(standalonePath)) throw new Error('Cannot find ".next/standalone" directory.');
if (fs.existsSync(publicPath)) {
  fs.copySync(publicPath, publicTargetPath);
  console.log('Public Copy Success !!');
}
if (fs.existsSync(staticPath)) {
  fs.copySync(staticPath, staticTargetPath);
  console.log('Static Copy Success !!');
}
if (fs.existsSync(dockerEntrypointPath)) {
  fs.copySync(dockerEntrypointPath, dockerEntrypointTargetPath);
  console.log('Docker Entrypoint Copy Success !!');
}
console.log('\nCopy Complete.');

const fs = require('fs-extra')
const pathmodule = require('path')
const workbox = require('workbox-build')
const outputPath = 'build'

async function build() {
  const cwd = process.cwd();
  const pkgPath = `${cwd}/node_modules/workbox-sw/package.json`;
  const pkg = require(pkgPath);
  const readPath = `${cwd}/node_modules/workbox-sw/${pkg.main}`;
  let data = fs.readFileSync(readPath, 'utf8');
  let path = `${cwd}/${outputPath}/workbox-sw.js`;
  console.log(`Writing ${path}.`);
  fs.writeFileSync(path, data, 'utf8');
  data = fs.readFileSync(`${readPath}.map`, 'utf8');
  path = `${cwd}/${outputPath}/${pathmodule.basename(pkg.main)}.map`;
  console.log(`Writing ${path}.`);
  fs.writeFileSync(path, data, 'utf8');

  const configString = fs.readFileSync('./src/config.ts', 'utf8');
  const configJSON = configString.replace('export', '');
  fs.writeFileSync('./build/config.js', configJSON);

  await workbox.injectManifest({
    globDirectory: `./${outputPath}/`,
    globPatterns: ['**\/*.{html,js,css,png,jpg,json}'],
    globIgnores: ['sw-default.js', 'service-worker.js', 'workbox-sw.js', 'index.html'],
    swSrc: './src/sw-template.js',
    swDest: `./${outputPath}/sw-default.js`,
  }).then(_ => {
    console.log('Service worker generated.')
  })
}

build();


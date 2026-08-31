// Bundles the no-login preview export (see scripts/build-preview.sh)
// into a single self-contained HTML file — no separate asset files
// alongside it, since a published Artifact only ever hosts the one
// page. Every font the bundle references gets inlined as a base64
// data URI directly into the JS before it's embedded.
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'web-preview');
const OUT_DIR = path.join(__dirname, '..', 'dist-preview');
const OUT_FILE = path.join(OUT_DIR, 'alive-preview.html');

const jsDir = path.join(BUILD_DIR, '_expo/static/js/web');
if (!fs.existsSync(jsDir)) {
  throw new Error(`No web bundle at ${jsDir} — did "expo export --platform web" succeed?`);
}
const jsFile = fs.readdirSync(jsDir).find((f) => f.endsWith('.js'));
if (!jsFile) throw new Error(`No .js bundle found in ${jsDir}`);
let js = fs.readFileSync(path.join(jsDir, jsFile), 'utf8');

const fontUrls = [...new Set(js.match(/\/assets\/node_modules[^"']*\.ttf/g) || [])];
for (const url of fontUrls) {
  const assetPath = path.join(BUILD_DIR, url);
  const b64 = fs.readFileSync(assetPath).toString('base64');
  js = js.split(url).join(`data:font/ttf;base64,${b64}`);
}

// No <!doctype>/<html>/<head>/<body> here on purpose — this file is
// meant to be handed to the Artifact publisher, which wraps content
// like this in its own page skeleton.
const html = `<title>ALIVE Preview</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<style>
  html, body {
    height: 100%;
    height: 100dvh;
    margin: 0;
    background: #d8cbb0;
  }
  body {
    overflow: hidden;
    display: flex;
    align-items: stretch;
    justify-content: center;
    font-family: -apple-system, sans-serif;
  }
  #phone-frame {
    width: 100%;
    height: 100%;
  }
  #root { display: flex; height: 100%; flex: 1; }

  @media (min-width: 481px) {
    body { padding: 40px 0; overflow: auto; align-items: flex-start; }
    #phone-frame {
      max-width: 430px;
      width: 430px;
      height: 900px;
      margin: 0 auto;
      border-radius: 40px;
      box-shadow: 0 24px 70px rgba(30, 25, 15, 0.35);
      overflow: hidden;
      position: relative;
    }
  }
</style>
<div id="phone-frame">
  <div id="root"></div>
</div>
<script>${js}</script>
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, html);
console.log('Wrote', OUT_FILE, (fs.statSync(OUT_FILE).size / 1024 / 1024).toFixed(2), 'MB');

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function write(relativePath, content) {
  const target = path.join(dist, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function copyDirectory(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(source, target);
      continue;
    }
    fs.copyFileSync(source, target);
  }
}

function minifyHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function chunk(value, size) {
  const chunks = [];
  for (let index = 0; index < value.length; index += size) {
    chunks.push(value.slice(index, index + size));
  }
  return chunks;
}

function obfuscateJs(source) {
  const payload = Buffer.from(source, "utf8").toString("base64");
  const chunks = chunk(payload, 96).reverse();
  const encodedChunks = JSON.stringify(chunks);
  return `(()=>{const p=${encodedChunks}.reverse().join("");const b=atob(p);const bytes=Uint8Array.from(b,c=>c.charCodeAt(0));const code=typeof TextDecoder==="function"?new TextDecoder().decode(bytes):decodeURIComponent(escape(b));Function(code)();})();`;
}

function cleanDist() {
  const resolvedDist = path.resolve(dist);
  if (!resolvedDist.startsWith(root + path.sep)) {
    throw new Error(`Ruta dist invalida: ${resolvedDist}`);
  }
  fs.rmSync(resolvedDist, { recursive: true, force: true });
  fs.mkdirSync(resolvedDist, { recursive: true });
}

cleanDist();
copyDirectory(path.join(root, "assets"), path.join(dist, "assets"));
write("index.html", minifyHtml(read("index.html")));
write("styles.css", minifyCss(read("styles.css")));
write("app.js", obfuscateJs(read("app.js")));

console.log("dist generado en", dist);

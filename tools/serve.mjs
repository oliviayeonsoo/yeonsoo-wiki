/* 연수위키 로컬 미리보기 서버
 *
 *   node tools/serve.mjs      →  http://localhost:8123
 *
 * python -m http.server 를 쓰지 않는 이유:
 * 그쪽은 Cache-Control 을 보내지 않아 브라우저가 임의로 캐시해 버린다.
 * 내용을 고쳐도 옛 화면이 계속 보여서 편집 중에 매우 헷갈린다.
 * 여기서는 전부 no-store 로 내려 항상 최신 파일을 보게 한다.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8123;

const MIME = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.webp':'image/webp', '.ico':'image/x-icon', '.woff2':'font/woff2'
};

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith('/')) p += 'index.html';

  const file = normalize(join(ROOT, p));
  if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { 'content-type':'text/plain; charset=utf-8', 'cache-control':'no-store' });
    return res.end('404 Not Found');
  }

  let body = await readFile(file);

  // index.html 을 내보낼 때 자산 URL에 파일 수정시각을 붙인다.
  // no-store 만으로는 이미 브라우저에 남아 있는 캐시 항목을 밀어내지 못해서,
  // 파일을 고쳐도 옛 app.js / style.css 가 계속 쓰이는 일이 생긴다.
  if (file.endsWith('index.html')) {
    const v = f => { try { return statSync(join(ROOT, f)).mtimeMs.toString(36); } catch { return '0'; } };
    body = body.toString('utf8')
      .replace('assets/style.css', `assets/style.css?v=${v('assets/style.css')}`)
      .replace('assets/app.js',    `assets/app.js?v=${v('assets/app.js')}`);
  }

  res.writeHead(200, {
    'content-type': MIME[extname(file)] || 'application/octet-stream',
    'cache-control': 'no-store'
  });
  res.end(body);
}).listen(PORT, () => console.log(`\n  연수위키\n  → http://localhost:${PORT}\n`));

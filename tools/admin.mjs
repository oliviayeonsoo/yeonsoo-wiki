/* 연수위키 로컬 관리자 서버
 *
 *   node tools/admin.mjs      →  http://127.0.0.1:8124
 *
 * 127.0.0.1 에만 바인딩하므로 같은 네트워크의 다른 기기에서도 접근 불가.
 * 실질적인 보호는 이 "로컬 바인딩"이고, 아래 비밀번호는 실수 방지용 잠금장치다.
 * 비밀번호 변경: ADMIN_PASS 환경변수 또는 tools/.adminpass 파일.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, copyFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { randomBytes } from 'node:crypto';
import { execFile } from 'node:child_process';

const ROOT     = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT  = join(ROOT, 'data', 'content.json');
const BACKUPS  = join(ROOT, 'data', 'backups');
const PORT     = 8124;

let PASS = process.env.ADMIN_PASS || 'yeonsu';
if (existsSync(join(ROOT, 'tools', '.adminpass')))
  PASS = (await readFile(join(ROOT, 'tools', '.adminpass'), 'utf8')).trim();

const tokens = new Set();

/* git 실행 헬퍼 — 배포 버튼이 쓴다 */
const git = args => new Promise((ok, fail) => {
  execFile('git', args, { cwd: ROOT, timeout: 120000 }, (err, stdout, stderr) => {
    if (err) { err.stderr = stderr; return fail(err); }
    ok(stdout);
  });
});

const send = (res, code, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

const readBody = req => new Promise((ok, fail) => {
  let s = '';
  req.on('data', c => { s += c; if (s.length > 8e6) { fail(new Error('too large')); req.destroy(); } });
  req.on('end', () => ok(s));
});

const authed = req => tokens.has((req.headers.authorization || '').replace('Bearer ', ''));

const MIME = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
               '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8' };

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const p = url.pathname;

  try {
    /* --- 로그인 --- */
    if (p === '/api/login' && req.method === 'POST') {
      const { pass } = JSON.parse(await readBody(req) || '{}');
      if (pass !== PASS) return send(res, 401, { error: '비밀번호가 틀렸습니다.' });
      const t = randomBytes(24).toString('hex');
      tokens.add(t);
      return send(res, 200, { token: t });
    }

    /* --- 콘텐츠 읽기 --- */
    if (p === '/api/content' && req.method === 'GET') {
      if (!authed(req)) return send(res, 401, { error: 'unauthorized' });
      return send(res, 200, await readFile(CONTENT, 'utf8'));
    }

    /* --- 콘텐츠 저장 (백업 후 덮어쓰기) --- */
    if (p === '/api/content' && req.method === 'POST') {
      if (!authed(req)) return send(res, 401, { error: 'unauthorized' });
      const raw = await readBody(req);
      let parsed;
      try { parsed = JSON.parse(raw); }
      catch (e) { return send(res, 400, { error: 'JSON 형식 오류: ' + e.message }); }
      if (!parsed?.docs || !parsed?.meta)
        return send(res, 400, { error: 'meta 또는 docs 키가 없습니다. 저장을 중단했습니다.' });

      await mkdir(BACKUPS, { recursive: true });
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      await copyFile(CONTENT, join(BACKUPS, `content-${stamp}.json`));
      await writeFile(CONTENT, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
      return send(res, 200, { ok: true, backup: `data/backups/content-${stamp}.json` });
    }

    /* --- 배포 상태: 아직 안 올라간 변경이 있는지 --- */
    if (p === '/api/deploy' && req.method === 'GET') {
      if (!authed(req)) return send(res, 401, { error: 'unauthorized' });
      const dirty  = (await git(['status', '--porcelain'])).trim();
      let ahead = '0';
      try { ahead = (await git(['rev-list', '--count', '@{u}..HEAD'])).trim(); } catch {}
      return send(res, 200, {
        pending: dirty.split('\n').filter(Boolean).length + Number(ahead || 0),
        dirty: dirty.split('\n').filter(Boolean),
        ahead: Number(ahead || 0)
      });
    }

    /* --- 배포: 커밋 후 푸시 (GitHub Actions가 이어받아 배포) --- */
    if (p === '/api/deploy' && req.method === 'POST') {
      if (!authed(req)) return send(res, 401, { error: 'unauthorized' });
      const { message } = JSON.parse(await readBody(req) || '{}');
      const log = [];
      try {
        const dirty = (await git(['status', '--porcelain'])).trim();
        if (dirty) {
          await git(['add', '-A']);
          const when = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
          await git(['commit', '-m', (message?.trim() || '내용 수정') + `\n\n관리자 화면에서 저장 · ${when}`]);
          log.push('커밋 완료');
        } else {
          log.push('새로 커밋할 변경 없음');
        }
        const ahead = Number((await git(['rev-list', '--count', '@{u}..HEAD'])).trim() || 0);
        if (ahead === 0) return send(res, 200, { ok: true, log: [...log, '이미 최신 상태입니다'], pushed: false });

        await git(['push', 'origin', 'HEAD']);
        return send(res, 200, { ok: true, log: [...log, `푸시 완료 (커밋 ${ahead}개)`], pushed: true });
      } catch (e) {
        return send(res, 500, { error: (e.stderr || e.message || '').toString().slice(0, 500), log });
      }
    }

    /* --- 백업 목록 --- */
    if (p === '/api/backups' && req.method === 'GET') {
      if (!authed(req)) return send(res, 401, { error: 'unauthorized' });
      if (!existsSync(BACKUPS)) return send(res, 200, []);
      const files = (await readdir(BACKUPS)).filter(f => f.endsWith('.json')).sort().reverse();
      return send(res, 200, files.slice(0, 30));
    }

    /* --- 백업에서 되돌리기 --- */
    if (p === '/api/restore' && req.method === 'POST') {
      if (!authed(req)) return send(res, 401, { error: 'unauthorized' });
      const { file } = JSON.parse(await readBody(req) || '{}');
      if (!file || file.includes('/') || file.includes('..') || !file.endsWith('.json'))
        return send(res, 400, { error: '잘못된 파일명입니다.' });
      const src = join(BACKUPS, file);
      if (!existsSync(src)) return send(res, 404, { error: '백업을 찾을 수 없습니다.' });

      // 되돌리기 직전 상태도 백업해 둔다 (되돌리기의 되돌리기)
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      await copyFile(CONTENT, join(BACKUPS, `content-${stamp}.json`));
      await copyFile(src, CONTENT);
      return send(res, 200, { ok: true });
    }

    /* --- 정적 파일 --- */
    const file = p === '/' ? join(ROOT, 'tools', 'admin.html') : join(ROOT, p.replace(/^\/+/, ''));
    if (!file.startsWith(ROOT)) return send(res, 403, 'forbidden', 'text/plain');
    if (!existsSync(file))      return send(res, 404, 'not found', 'text/plain');
    return send(res, 200, await readFile(file), MIME[extname(file)] || 'application/octet-stream');

  } catch (e) {
    send(res, 500, { error: e.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  연수위키 관리자\n  → http://127.0.0.1:${PORT}\n  비밀번호: ${PASS === 'yeonsu' ? 'yeonsu (기본값 — tools/.adminpass 로 변경하세요)' : '(설정됨)'}\n`);
});

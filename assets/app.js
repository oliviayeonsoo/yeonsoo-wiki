/* 연수위키 — 렌더러
   콘텐츠는 전부 data/content.json 에 있음. 이 파일은 렌더링/인터랙션만 담당. */
(() => {
'use strict';

let DATA = null;
let fnSeq = {};                 // 각주 참조 id 중복 방지용 (문서마다 초기화)
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------------- 유틸 ---------------- */
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const docExists = name => !!(DATA && DATA.docs[name]);
const daysSince = iso => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);

/* 생년월일에서 나이를 계산한다. 값을 고정해두면 해가 바뀔 때마다 손봐야 하므로 매번 계산. */
function ages(iso){
  const b = new Date(iso), now = new Date();
  let man = now.getFullYear() - b.getFullYear();
  const before = now.getMonth() < b.getMonth() ||
                (now.getMonth() === b.getMonth() && now.getDate() < b.getDate());
  if (before) man--;
  return { korean: now.getFullYear() - b.getFullYear() + 1, man };
}

function timeAgo(sec){
  if (sec < 60) return `${sec}초 전`;
  if (sec < 3600) return `${Math.floor(sec/60)}분 전`;
  if (sec < 86400) return `${Math.floor(sec/3600)}시간 전`;
  return `${Math.floor(sec/86400)}일 전`;
}
function fmtDateTime(iso){
  const d = new Date(iso), p = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/* 특수 액션 링크 (실제 문서가 아닌 기능) */
const ACTIONS = { '편집 요청':'contact', '방명록':'discuss', '역사':'history' };

/* ---------------- 인라인 파서 ----------------
   '''굵게'''  [fn:N]  [[문서]] / [[문서|라벨]]  [라벨](url)  {{미확인값}}
   본문에 <br>, <span class="muted"> 정도의 제한적 HTML은 허용(작성자 = 본인). */
function inline(s, ctx){
  s = String(s ?? '');
  s = s.replace(/'''(.+?)'''/g, '<strong>$1</strong>');

  // 같은 각주를 여러 곳에서 참조할 수 있으므로 id는 참조마다 고유하게 매긴다.
  s = s.replace(/\[fn:(\d+)\]/g, (_, n) => {
    const k = (fnSeq[n] = (fnSeq[n] || 0) + 1);
    if (ctx) ctx.refs.add(n);
    return `<sup class="fnref" data-fn="${n}" id="fnref-${n}-${k}" role="link" tabindex="0">[${n}]</sup>`;
  });

  s = s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, name, label) => {
    name = name.trim(); label = (label || name).trim();
    if (ACTIONS[name]) return `<a href="#/act/${ACTIONS[name]}">${esc(label)}</a>`;
    if (docExists(name)) return `<a href="#/${encodeURIComponent(name)}">${esc(label)}</a>`;
    return `<a class="new" href="#/act/missing" title="이 문서는 아직 작성되지 않았습니다">${esc(label)}</a>`;
  });

  s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+|mailto:[^)\s]+)\)/g,
    (_, label, url) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`);

  s = s.replace(/\{\{([^}]*)\}\}/g,
    (_, v) => `<span class="ph" title="관리자 화면에서 입력 필요">${esc(v)}</span>`);

  return s;
}

/* ---------------- 블록 렌더 ---------------- */
function block(b, ctx){
  switch (b.t){
    case 'p':
      return `<p>${inline(b.v, ctx)}</p>`;

    case 'list':
      return `<ul>${b.v.map(i => `<li>${inline(i, ctx)}</li>`).join('')}</ul>`;

    case 'table':
      return `<div class="wtable-scroll"><table class="wtable">
        <thead><tr>${b.head.map(h => `<th>${inline(h, ctx)}</th>`).join('')}</tr></thead>
        <tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${inline(c, ctx)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>`;

    case 'cards':
      return b.v.map(c => `<div class="pcard">
        <div class="pname">${inline(c.name, ctx)}
          ${c.doc && docExists(c.doc)
            ? `<a class="pmore" href="#/${encodeURIComponent(c.doc)}">자세히 보기 ›</a>` : ''}</div>
        <div class="ptag">${inline(c.tagline, ctx)}</div>
        <div class="pbody">${inline(c.body, ctx)}</div>
        ${c.award ? `<span class="pawd">🏆 ${esc(c.award)}</span>` : ''}
      </div>`).join('');

    case 'badges':
      return `<div class="bgrid">${b.v.map(g => `<div class="brow">
        <div class="bkey">${esc(g.group)}</div>
        <div class="bitems">${g.items.map(i => `<span class="badge">${esc(i)}</span>`).join('')}</div>
      </div>`).join('')}</div>`;

    case 'gallery': {
      // 페이지 이미지는 워터마크가 구워져 있고 원본 PDF 는 배포하지 않는다.
      // 캡처 자체는 어떤 방법으로도 막을 수 없으므로 '흔적을 남기는' 쪽으로 설계.
      const id = 'gal-' + Math.random().toString(36).slice(2, 8);
      return `<div class="gallery" id="${id}" data-dir="${esc(b.dir)}" data-pages="${b.pages}" data-i="1">
        <div class="gal-head">
          <span class="gal-title">${esc(b.title || '발표자료')}</span>
          <span class="gal-count"><b>1</b> / ${b.pages}</span>
        </div>
        <div class="gal-stage">
          <img class="gal-img" alt="${esc(b.title || '')} 1쪽" draggable="false">
          <div class="gal-shield"></div>
          <button class="gal-nav prev" data-gal="prev" aria-label="이전 장">‹</button>
          <button class="gal-nav next" data-gal="next" aria-label="다음 장">›</button>
        </div>
        <div class="gal-thumbs"></div>
        <div class="gal-foot">
          <span class="gal-note">열람용입니다. 화면의 자료는 워터마크가 포함된 축소본입니다.</span>
          <button class="gal-dl" data-act="getfile">원본 파일 요청</button>
        </div>
      </div>`;
    }

    case 'quote':
      return `<div class="wquote"><div class="q">"${inline(b.v, ctx)}"</div>
        ${b.by ? `<div class="by">${inline(b.by, ctx)}</div>` : ''}</div>`;

    default:
      return '';
  }
}

function section(s, ctx, depth = 2){
  const tag = depth === 2 ? 'h2' : 'h3';
  const body = (s.blocks || []).map(b => block(b, ctx)).join('')
    + (s.children || []).map(c => section(c, ctx, 3)).join('');
  return `<section class="sec" id="${s.id}" data-folded="false">
    <div class="sec-h">
      <button class="sec-fold" aria-label="섹션 접기">⌄</button>
      <${tag}>${s.num}. ${inline(s.title, ctx)}</${tag}>
      ${s.subdoc && docExists(s.subdoc)
        ? `<a class="secmore" href="#/${encodeURIComponent(s.subdoc)}">자세히 보기 ›</a>` : ''}
      <span class="edit" data-act="edit">[편집]</span>
    </div>
    <div class="sec-body">${body}</div>
  </section>`;
}

/* ---------------- 인포박스 ---------------- */
function infobox(mini){
  const ib = DATA.infobox, m = DATA.meta;
  const rows = (mini ? ib.rows.filter(r => ['학력','포지션','주력 도구'].includes(r.label)) : ib.rows)
    .map((r, i) => {
      let v;
      if (r.type === 'collapse'){
        v = `<button class="ib-mini-toggle" data-ibmini="${i}">[ 펼치기 · 접기 ]</button>
             <div class="ib-mini" id="ibmini-${i}" hidden>${
               r.value.map(([a, b]) => `<div><span>${inline(a)}</span><span>${inline(b)}</span></div>`).join('')
             }</div>`;
      } else if (r.type === 'debut'){
        v = `${inline(r.value)}<br><span class="ib-days">(데뷔일로부터 +${daysSince(m.debutDate).toLocaleString()}일째)</span>`;
      } else {
        v = inline(r.value);
      }
      return `<div class="ib-row"><div class="k">${esc(r.label)}</div><div class="v">${v}</div></div>`;
    }).join('');

  return `<aside class="infobox">
    ${mini ? '' : `<div class="ib-photo${ib.photo ? ' has-img' : ''}">${ib.photo
        ? `<img src="${esc(ib.photo)}" alt="${esc(ib.name)}" width="720" height="1080">`
        : '프로필 사진<br>(관리자 화면에서 등록)'}</div>`}
    <div class="ib-banner"><div class="org">${esc(ib.banner.org)}</div><div class="sub">${esc(ib.banner.sub)}</div></div>
    <div class="ib-name">
      <div class="kr">${esc(ib.name)} <span class="muted">${inline(ib.hanja)}</span></div>
      <div class="rm">${esc(ib.roman)}</div>
    </div>
    ${rows}
    <div class="ib-links">${ib.links.map(l =>
      `<a href="${esc(l.url)}" target="_blank" rel="noopener" title="${esc(l.label)}">${esc(l.icon)} ${esc(l.label)}</a>`
    ).join('')}</div>
  </aside>`;
}

/* ---------------- 목차 ---------------- */
function toc(secs){
  const li = s => `<li><a href="#${s.id}" class="${s.subdoc ? 'sub' : ''}">${s.num}. ${esc(s.title)}</a>
    ${s.children?.length ? `<ul>${s.children.map(li).join('')}</ul>` : ''}</li>`;
  return `<nav class="toc" id="toc"><div class="toc-title">목차</div><ul>${secs.map(li).join('')}</ul></nav>`;
}

/* ---------------- 문서 렌더 ---------------- */
function renderDoc(name){
  const d = DATA.docs[name];
  if (!d){ renderMissing(name); return; }
  const m = DATA.meta;
  const ctx = { refs: new Set() };
  const age = ages(m.birthDate);
  fnSeq = {};

  const cats = d.categories.map((c, i) =>
    `<span class="${i >= 5 ? 'hidden-cat' : ''}">${i ? '<span class="sep">|</span>' : ''}${esc(c)}</span>`).join('');

  // 각주 참조 번호(fnSeq)가 화면 순서대로 매겨지도록 DOM에 나오는 순서대로 만든다.
  const hatHtml  = d.hatnotes.map(h => `<div class="hatnote">${inline(h)}</div>`).join('');
  const ibHtml   = d.showInfobox ? infobox(d.showInfobox === 'mini') : '';
  const secsHtml = d.sections.map(s => section(s, ctx)).join('');

  const nav = d.navbox ? `<div class="navbox" data-collapsed="true">
      <div class="navbox-head">
        <div class="nb-title">${esc(d.navbox.title)}</div>
        <div class="nb-sub">${esc(d.navbox.subtitle)}</div>
      </div>
      <button class="navbox-toggle">[ 펼치기 · 접기 ]</button>
      <div class="navbox-body">${d.navbox.groups.map(g => `<div class="navbox-row">
        <div class="pos">
          <span class="pi">${esc(g.icon || '')}</span>
          <span class="pc">${esc(g.pos)}</span>
          <span class="pl">${esc(g.label || '')}</span>
        </div>
        <div class="items">${g.items.map(i => {
          const inner = `<span class="ry">${i.year ? inline(i.year) : ''}</span>
            <span class="rn">${esc(i.name)}</span>
            ${i.tag ? `<span class="rt">${esc(i.tag)}</span>` : ''}`;
          return i.doc && docExists(i.doc)
            ? `<a class="ritem" href="#/${encodeURIComponent(i.doc)}">${inner}</a>`
            : `<span class="ritem">${inner}</span>`;
        }).join('')}</div>
      </div>`).join('')}</div>
    </div>` : '';

  const fns = (d.footnotes || []).length ? `<div class="fnlist">${
      d.footnotes.map((f, i) => `<div class="fn" id="fn-${i+1}">
        <span class="fn-n">[${i+1}]</span>
        <span class="fn-back" data-back="${i+1}" title="본문으로 돌아가기">↩</span>
        <span>${inline(f)}</span>
      </div>`).join('')}</div>` : '';

  $('#doc').innerHTML = `
    ${d.parent ? `<div class="doc-parent">상위 문서: <a href="#/${encodeURIComponent(d.parent)}">${esc(d.parent)}</a></div>` : ''}
    <div class="doc-head">
      <div class="doc-title-row">
        <h1 class="doc-title">${esc(d.title)}</h1>
        <span class="edit-badge" title="나이 (만 ${age.man}세)">${age.korean}</span>
        <div class="doc-actions">
          <button data-act="star">★</button>
          <button data-act="contact" class="primary">편집 요청</button>
          <button data-act="discuss">토론</button>
          <button data-act="history">역사</button>
          <button data-act="more">⋮</button>
        </div>
      </div>
      <div class="doc-meta">최근 수정 시각: ${fmtDateTime(m.updated)}</div>
    </div>
    <div class="cats"><b>분류</b>: ${cats}
      ${d.categories.length > 5 ? '<span class="sep">|</span><span class="more">더 보기</span>' : ''}</div>
    ${hatHtml}
    ${nav}
    ${ibHtml}
    ${toc(d.sections)}
    ${secsHtml}
    ${fns}
    <div class="license">${esc(m.license)}<br>문의: <a href="mailto:${m.contact}">${m.contact}</a></div>
  `;

  initGalleries();
  document.title = `${d.title} - ${m.siteName}`;
  window.scrollTo(0, 0);
}

function renderMissing(name){
  $('#doc').innerHTML = `
    <div class="doc-head"><div class="doc-title-row"><h1 class="doc-title">${esc(name)}</h1></div></div>
    <p style="margin-top:20px">해당 문서는 존재하지 않습니다.</p>
    <p><a href="#/${encodeURIComponent(DATA.meta.mainDoc)}">${esc(DATA.meta.mainDoc)} 문서로 돌아가기</a></p>`;
  document.title = `${name} - ${DATA.meta.siteName}`;
}

/* ---------------- 사이드바 (실시간 갱신 연출) ---------------- */
let sideT0 = Date.now(), sideBuilt = false;
function renderSide(){
  const s = DATA.sidebar;

  // 컨택 위젯은 한 번만 만든다. (관심사만 주기적으로 순환)
  if (!sideBuilt){
    const c = s.contact || {};
    $('#side').innerHTML = `
      <div class="widget">
        <div class="widget-h">요즘 관심사</div>
        <div class="widget-b" id="interest-list"></div>
      </div>
      <div class="widget">
        <div class="widget-h">${esc(c.title || '컨택')}</div>
        <div class="widget-b contact">
          <p class="cnote">${inline(c.note || '')}</p>
          <button class="cbtn" data-act="contact">${esc(c.cta || '제안 보내기')}</button>
          <div class="clinks">${DATA.infobox.links.map(l =>
            `<a href="${esc(l.url)}" target="_blank" rel="noopener">
               <span class="ci">${esc(l.icon)}</span>${esc(l.label)}</a>`).join('')}</div>
        </div>
      </div>`;
    sideBuilt = true;
  }

  const shift = Math.floor((Date.now() - sideT0) / 4000) % s.interests.length;
  const rotated = s.interests.slice(shift).concat(s.interests.slice(0, shift));
  $('#interest-list').innerHTML = rotated.map((t, i) =>
    `<div class="wrow"><span class="rank">${i+1}</span><span class="wname">${esc(t)}</span></div>`).join('');
}

/* ---------------- 모달 ---------------- */
function modal(title, html){
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = html;
  $('#modal').hidden = false;
}
const MODALS = {
  contact: () => modal('채용 · 협업 제안', `<p>제안, 문의, 이 문서에 대한 수정 요청 모두 환영합니다.</p>
    <p><a href="mailto:${DATA.meta.contact}">${DATA.meta.contact}</a></p>
    ${DATA.infobox.links.filter(l => l.label !== 'Email').map(l =>
      `<p><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} 바로가기</a></p>`).join('')}`),
  getfile: () => {
    const ig = DATA.infobox.links.find(l => l.label === 'Instagram');
    modal('원본 파일 요청', `
      <p>발표자료 원본은 공개하지 않고, 요청해주시면 직접 보내드립니다.</p>
      <p class="muted" style="font-size:13px">어떤 자료가 필요하신지와 간단한 소개를 함께 적어주시면 빠르게 회신드릴 수 있습니다.</p>
      <p><a href="mailto:${DATA.meta.contact}?subject=${encodeURIComponent('[연수위키] 발표자료 원본 요청')}">
        메일로 요청하기 — ${DATA.meta.contact}</a></p>
      ${ig ? `<p><a href="${esc(ig.url)}" target="_blank" rel="noopener">인스타그램 DM 보내기</a></p>` : ''}`);
  },
  discuss: () => modal('토론', '<p>방명록은 준비 중입니다. 하고 싶은 말은 편집 요청으로 보내주세요.</p>'),
  history: () => modal('연혁', `<ol class="timeline">${
    (DATA.timeline || []).map(([when, what]) =>
      `<li><span class="tl-when">${esc(when)}</span><span class="tl-what">${inline(what)}</span></li>`).join('')
  }</ol>`),
  more:    () => modal('더 보기', '<p>이 문서는 나무위키 문서 구조를 분석해 재현한 포트폴리오입니다.</p>'),
  star:    () => modal('즐겨찾기', '<p>즐겨찾기에 추가했습니다. (되진 않았습니다)</p>'),
  edit:    () => modal('편집', '<p>이 문서는 본인만 편집할 수 있습니다.</p><p class="muted">로컬 관리자 화면에서 수정하세요.</p>'),
  missing: () => modal('없는 문서', '<p>아직 작성되지 않은 문서입니다.</p>'),
  random:  () => { const k = Object.keys(DATA.docs); location.hash = '#/' + encodeURIComponent(k[Math.floor(Math.random()*k.length)]); },
  recent:  () => modal('최근 변경', `<ul>${DATA.sidebar.recent.map(r =>
             `<li><a href="#/${encodeURIComponent(r.doc)}">${esc(r.doc)}</a> — ${esc(r.note)}</li>`).join('')}</ul>`)
};

/* ---------------- 갤러리 ----------------
   앞뒤 한 장씩만 미리 받아 41장짜리도 가볍게 넘어가도록 한다. */
function galShow(g, n){
  const pages = +g.dataset.pages;
  n = Math.min(Math.max(1, n), pages);
  g.dataset.i = n;
  const src = i => `${g.dataset.dir}/${String(i).padStart(2,'0')}.jpg`;

  const img = $('.gal-img', g);
  img.src = src(n);
  img.alt = `${$('.gal-title', g).textContent} ${n}쪽`;
  $('.gal-count b', g).textContent = n;
  $('.gal-nav.prev', g).disabled = n === 1;
  $('.gal-nav.next', g).disabled = n === pages;

  [n-1, n+1].forEach(i => { if (i >= 1 && i <= pages) new Image().src = src(i); });

  const strip = $('.gal-thumbs', g);
  $$('.gal-th', strip).forEach(t => t.classList.toggle('on', +t.dataset.n === n));
  const on = $('.gal-th.on', strip);
  if (on) on.scrollIntoView({ block:'nearest', inline:'center' });
}

function initGalleries(){
  $$('.gallery').forEach(g => {
    const pages = +g.dataset.pages;
    $('.gal-thumbs', g).innerHTML = Array.from({ length: pages }, (_, k) =>
      `<button class="gal-th" data-n="${k+1}" aria-label="${k+1}쪽">
         <img src="${g.dataset.dir}/${String(k+1).padStart(2,'0')}.jpg" loading="lazy" alt="" draggable="false">
       </button>`).join('');
    galShow(g, 1);
    g.addEventListener('contextmenu', e => e.preventDefault());
    g.addEventListener('dragstart', e => e.preventDefault());
  });
}

document.addEventListener('click', e => {
  const g = e.target.closest?.('.gallery'); if (!g) return;
  const nav = e.target.closest('[data-gal]');
  if (nav) return galShow(g, +g.dataset.i + (nav.dataset.gal === 'next' ? 1 : -1));
  const th = e.target.closest('.gal-th');
  if (th) return galShow(g, +th.dataset.n);
});
document.addEventListener('keydown', e => {
  if (!/Arrow(Left|Right)/.test(e.key)) return;
  const g = document.activeElement?.closest?.('.gallery') || $('.gallery');
  if (!g || $('#modal').hidden === false) return;
  if (document.activeElement?.tagName === 'INPUT') return;
  galShow(g, +g.dataset.i + (e.key === 'ArrowRight' ? 1 : -1));
});

/* ---------------- 각주 미리보기 ----------------
   각주 번호에 커서를 올리면 내용이 바로 뜬다. 클릭 시 하단 이동은 그대로 유지. */
let tipEl = null, tipTimer = null;

function showTip(ref){
  const n = +ref.dataset.fn;
  const text = DATA.docs[currentDoc]?.footnotes?.[n - 1];
  if (!text) return;

  if (!tipEl){
    tipEl = document.createElement('div');
    tipEl.className = 'fntip';
    tipEl.addEventListener('mouseenter', () => clearTimeout(tipTimer));
    tipEl.addEventListener('mouseleave', hideTip);
    document.body.appendChild(tipEl);
  }
  tipEl.innerHTML = `<b>[${n}]</b> ${inline(text)}`;
  tipEl.hidden = false;

  // 화면 밖으로 나가지 않도록 위치 보정
  const r = ref.getBoundingClientRect();
  tipEl.style.left = '0px'; tipEl.style.top = '0px';
  const w = tipEl.offsetWidth, h = tipEl.offsetHeight, pad = 8;
  let left = r.left + window.scrollX + r.width / 2 - w / 2;
  left = Math.max(pad, Math.min(left, window.innerWidth - w - pad));
  const above = r.top > h + 16;
  const top = above ? r.top + window.scrollY - h - 8 : r.bottom + window.scrollY + 8;
  tipEl.style.left = left + 'px';
  tipEl.style.top  = top + 'px';
  tipEl.dataset.dir = above ? 'up' : 'down';
}
const hideTip = () => { if (tipEl) tipEl.hidden = true; };

document.addEventListener('mouseover', e => {
  const ref = e.target.closest?.('.fnref');
  if (ref){ clearTimeout(tipTimer); showTip(ref); }
});
document.addEventListener('mouseout', e => {
  if (e.target.closest?.('.fnref')){ clearTimeout(tipTimer); tipTimer = setTimeout(hideTip, 180); }
});
document.addEventListener('focusin',  e => { if (e.target.classList?.contains('fnref')) showTip(e.target); });
document.addEventListener('focusout', e => { if (e.target.classList?.contains('fnref')) hideTip(); });
window.addEventListener('scroll', hideTip, { passive: true });

/* ---------------- 검색 ---------------- */
function search(q){
  const box = $('#search-results');
  q = q.trim();
  if (!q){ box.hidden = true; return; }

  const hits = [];
  for (const [name, d] of Object.entries(DATA.docs)){
    if (name.includes(q)) hits.push({ doc: name, hash: `#/${encodeURIComponent(name)}`, txt: '문서' });
    const walk = ss => ss.forEach(s => {
      if (s.title.includes(q)) hits.push({ doc: name, hash: `#/${encodeURIComponent(name)}`, txt: `${s.num}. ${s.title}`, anchor: s.id });
      if (s.children) walk(s.children);
    });
    walk(d.sections);
  }

  box.innerHTML = hits.length
    ? hits.slice(0, 12).map(h =>
        `<a href="${h.hash}" data-anchor="${h.anchor || ''}"><span class="sr-doc">${esc(h.doc)}</span> · ${esc(h.txt)}</a>`).join('')
    : '<div class="sr-empty">검색 결과가 없습니다.</div>';
  box.hidden = false;
}

/* ---------------- 라우터 ---------------- */
function route(){
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  if (h.startsWith('act/')){
    const a = h.slice(4);
    (MODALS[a] || MODALS.more)();
    history.replaceState(null, '', '#/' + encodeURIComponent(currentDoc));
    return;
  }
  if (h && !h.startsWith('s-')){ currentDoc = h; renderDoc(h); }
}
let currentDoc = '';

/* ---------------- 이벤트 ---------------- */
document.addEventListener('click', e => {
  const t = e.target;

  // 섹션 접기
  if (t.classList.contains('sec-fold')){
    const sec = t.closest('.sec');
    sec.dataset.folded = sec.dataset.folded === 'true' ? 'false' : 'true';
    return;
  }
  // 네브박스 접기
  if (t.classList.contains('navbox-toggle')){
    const nb = t.closest('.navbox');
    nb.dataset.collapsed = nb.dataset.collapsed === 'true' ? 'false' : 'true';
    return;
  }
  // 인포박스 중첩 접기
  if (t.dataset.ibmini !== undefined){
    const el = $('#ibmini-' + t.dataset.ibmini);
    el.hidden = !el.hidden;
    return;
  }
  // 분류 더 보기
  if (t.classList.contains('more')){ t.closest('.cats').classList.add('expanded'); t.remove(); return; }

  // 각주 → 하단 점프
  if (t.classList.contains('fnref')){
    const n = t.dataset.fn, el = $('#fn-' + n);
    if (el){ el.scrollIntoView({ block:'center' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1200); }
    return;
  }
  // 각주 → 본문 복귀 (원본에는 없는 개선)
  if (t.dataset.back){
    const el = $(`#fnref-${t.dataset.back}-1`);   // 여러 번 참조된 각주는 첫 참조로 돌아간다
    if (el) el.scrollIntoView({ block:'center' });
    return;
  }

  // 액션 버튼
  const act = t.dataset.act;
  if (act && MODALS[act]){ MODALS[act](); return; }

  // FAB
  const fab = t.dataset.fab;
  if (fab === 'toc')    { $('#toc')?.scrollIntoView({ block:'start' }); return; }
  if (fab === 'top')    { window.scrollTo({ top:0 }); return; }
  if (fab === 'bottom') { window.scrollTo({ top:document.body.scrollHeight }); return; }

  // 모달 닫기
  if (t.id === 'modal-close' || t.id === 'modal'){ $('#modal').hidden = true; return; }

  // 검색 결과 클릭
  const sr = t.closest('#search-results a');
  if (sr){
    $('#search-results').hidden = true; $('#search').value = '';
    if (sr.dataset.anchor) setTimeout(() => $('#' + sr.dataset.anchor)?.scrollIntoView({ block:'start' }), 60);
    return;
  }
  if (!t.closest('.gnb-search')) $('#search-results').hidden = true;
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){ $('#modal').hidden = true; $('#search-results').hidden = true; }
  if (e.key === 'Enter' && e.target.classList?.contains('fnref')) e.target.click();
});

$('#search').addEventListener('input', e => search(e.target.value));

$('#theme-toggle').addEventListener('click', () => {
  const cur = document.documentElement.dataset.theme;
  const next = cur === 'dark' ? 'light' : cur === 'light' ? '' : 'dark';
  if (next) document.documentElement.dataset.theme = next;
  else delete document.documentElement.dataset.theme;
  try { localStorage.setItem('ysw-theme', next); } catch {}
});

window.addEventListener('hashchange', route);

/* ---------------- 부트 ---------------- */
// no-cache: 내용을 갱신했을 때 브라우저가 옛 JSON을 계속 쓰지 않도록 매번 재검증(대개 304)
fetch('data/content.json', { cache: 'no-cache' })
  .then(r => { if (!r.ok) throw new Error(`content.json ${r.status}`); return r.json(); })
  .then(d => {
    DATA = d;
    try { const t = localStorage.getItem('ysw-theme'); if (t) document.documentElement.dataset.theme = t; } catch {}
    if (!location.hash) location.hash = '#/' + encodeURIComponent(d.meta.mainDoc);
    currentDoc = d.meta.mainDoc;
    route();
    if (!location.hash.includes('act/')) renderDoc(currentDoc);
    renderSide();
    setInterval(renderSide, 4000);   // 실시간 위젯 연출
  })
  .catch(err => {
    $('#doc').innerHTML = `<p style="padding:40px 0">콘텐츠를 불러오지 못했습니다.<br>
      <span class="muted">${esc(err.message)} — 로컬 파일을 직접 열지 말고 서버로 실행하세요.</span></p>`;
  });

})();

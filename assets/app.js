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

/* 브랜드 로고 (24x24 viewBox, currentColor) — 인포박스·컨택 위젯의 아이콘 버튼 */
const svg = d => `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
const BRAND = {
  github: svg('M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'),
  linkedin: svg('M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'),
  instagram: svg('M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z'),
  mail: svg('M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.236-8 4.8-8-4.8V6.2l8 4.8 8-4.8v2.036z'),
  link: svg('M10.59 13.41a1 1 0 0 1 0-1.41l3-3a1 1 0 0 1 1.41 1.41l-3 3a1 1 0 0 1-1.41 0zM7.05 16.95a4 4 0 0 1 0-5.66l2.12-2.12 1.42 1.42-2.12 2.12a2 2 0 0 0 2.82 2.82l2.12-2.12 1.42 1.42-2.12 2.12a4 4 0 0 1-5.66 0zm9.9-9.9a4 4 0 0 1 0 5.66l-2.12 2.12-1.42-1.42 2.12-2.12a2 2 0 1 0-2.82-2.82L10.59 10.6 9.17 9.17l2.12-2.12a4 4 0 0 1 5.66 0z')
};

const ADMIN_URL = 'http://127.0.0.1:8124';

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
      // 썸네일은 발표자료 첫 장. 링크가 있으면 이미지도 같은 곳으로 들어간다.
      return b.v.map(c => {
        const inner = `<div class="pcard-body">
            <div class="pname">${inline(c.name, ctx)}
              ${c.doc && docExists(c.doc)
                ? `<a class="pmore" href="#/${encodeURIComponent(c.doc)}">자세히 보기 ›</a>` : ''}</div>
            <div class="ptag">${inline(c.tagline, ctx)}</div>
            <div class="pbody">${inline(c.body, ctx)}</div>
            ${c.award ? `<span class="pawd">🏆 ${esc(c.award)}</span>` : ''}
          </div>`;
        const thumb = c.thumb
          ? (c.doc && docExists(c.doc)
              ? `<a class="pthumb" href="#/${encodeURIComponent(c.doc)}" aria-label="${esc(c.name)} 자세히 보기">
                   <img src="${esc(c.thumb)}" alt="" loading="lazy" draggable="false"></a>`
              : `<span class="pthumb"><img src="${esc(c.thumb)}" alt="" loading="lazy" draggable="false"></span>`)
          : '';
        return `<div class="pcard${c.thumb ? ' has-thumb' : ''}">${thumb}${inner}</div>`;
      }).join('');

    case 'badges':
      return `<div class="bgrid">${b.v.map(g => `<div class="brow">
        <div class="bkey">${esc(g.group)}</div>
        <div class="bitems">${g.items.map(i => `<span class="badge">${esc(i)}</span>`).join('')}</div>
      </div>`).join('')}</div>`;

    case 'preview': {
      // 상위 목록 문서용. 앞쪽 몇 장만 보여주고 전체는 상세 문서로 넘긴다.
      const n = Math.min(b.show || 4, b.pages);
      const linked = b.doc && docExists(b.doc);
      const thumbs = Array.from({ length: n }, (_, k) => {
        const src = `${b.dir}/${String(k+1).padStart(2,'0')}.jpg`;
        return `<img src="${src}" alt="" loading="lazy" draggable="false">`;
      }).join('');
      const inner = `<div class="pv-strip">${thumbs}</div>`;
      return `<div class="preview">
        ${linked ? `<a class="pv-link" href="#/${encodeURIComponent(b.doc)}">${inner}</a>` : inner}
        <div class="pv-foot">
          <span class="pv-title">${esc(b.title || '발표자료')} · 총 ${b.pages}쪽</span>
          ${linked ? `<a class="pv-more" href="#/${encodeURIComponent(b.doc)}">전체 보기 ›</a>` : ''}
        </div>
      </div>`;
    }

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
      `<a class="ib-lk ${esc((l.icon || '').toLowerCase())}" href="${esc(l.url)}"
          target="_blank" rel="noopener" title="${esc(l.label)}" aria-label="${esc(l.label)}">
         ${BRAND[l.icon] || BRAND.link}</a>`
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
    <div class="license">
      <div class="lic-txt">${esc(m.license)}<br>문의: <a href="mailto:${m.contact}">${m.contact}</a></div>
      <button class="lic-gear" data-act="admin" title="관리자 화면" aria-label="관리자 화면">⚙</button>
    </div>
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
               <span class="ci ${esc((l.icon || '').toLowerCase())}">${BRAND[l.icon] || BRAND.link}</span>
               ${esc(l.label)}</a>`).join('')}</div>
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
  admin: () => {
    // 관리자는 로컬 전용 서버라 다른 기기에서는 열리지 않는다.
    const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    if (local){ window.open(ADMIN_URL, '_blank', 'noopener'); return; }
    modal('관리자 화면', `
      <p>이 사이트의 내용을 고치는 편집기는 <b>제작자 본인의 컴퓨터에서만</b> 실행됩니다.</p>
      <p class="muted" style="font-size:13px">터미널에서 <code>node tools/admin.mjs</code> 를 실행한 뒤
        <code>${ADMIN_URL}</code> 로 접속하세요.</p>
      <p><a href="${ADMIN_URL}" target="_blank" rel="noopener">그래도 열어보기</a></p>`);
  },
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


/* ---------------- 방문 통계 ----------------
   개인 신원은 수집하지 않는다. 로그인 없는 사이트에서 방문자가 누구인지 알 방법은 없고,
   IP 는 개인정보라 보관 자체가 위험하다. 여기서는 익명 집계(조회수·유입 경로·국가·기기)만 다룬다.
   통계 대시보드는 제공자 계정으로 로그인해야 보이므로 본인만 확인할 수 있다. */
function initAnalytics(){
  const a = DATA.meta.analytics;
  if (!a || !a.id) return;                       // 설정 전에는 아무것도 로드하지 않는다
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;  // 내 작업 중 조회수는 세지 않는다

  const s = document.createElement('script');
  if (a.provider === 'goatcounter'){
    // 통계에 남는 주소를 문서 이름 그대로 보이게 한다.
    // 그냥 두면 해시가 이미 퍼센트 인코딩된 상태로 한 번 더 인코딩돼
    // 대시보드에 %EA%B3%B5... 같은 문자열이 쌓인다.
    const docPath = () => {
      const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
      return '/' + (h || DATA.meta.mainDoc);
    };
    const hit = () => window.goatcounter?.count({ path: docPath(), title: document.title });

    window.goatcounter = { no_onload: true };   // 자동 집계를 끄고 직접 보낸다
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${a.id}.goatcounter.com/count`;
    s.onload = hit;
    // 해시 라우팅이라 문서를 옮길 때마다 직접 알려야 한다
    window.addEventListener('hashchange', hit);
  } else if (a.provider === 'plausible'){
    s.defer = true;
    s.dataset.domain = a.id;
    s.src = 'https://plausible.io/js/script.hash.js';
  } else if (a.provider === 'cloudflare'){
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: a.id }));
  } else return;

  document.head.appendChild(s);
}

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
    setInterval(renderSide, 4000);
    initAnalytics();   // 실시간 위젯 연출
  })
  .catch(err => {
    $('#doc').innerHTML = `<p style="padding:40px 0">콘텐츠를 불러오지 못했습니다.<br>
      <span class="muted">${esc(err.message)} — 로컬 파일을 직접 열지 말고 서버로 실행하세요.</span></p>`;
  });

})();

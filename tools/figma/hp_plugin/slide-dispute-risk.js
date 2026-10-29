// 덱 '특히 외국인 직원을 둔 사장님에게는 급여 분쟁은 큰 리스크가 됩니다' 슬라이드 (1:355, 쪽번호 05)
// '한국은 이미 체류외국인이…' 슬라이드(2162:855)의 틀을 차용: 왼쪽 정렬 제목, 큰 숫자 세 개, 박스 없이 넓게 깔린 면 차트,
// 도넛 콜아웃, 마지막 점의 빛 번짐. 문제를 말하는 장이라 차트는 붉은색.
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
// 다시 실행하면 이전 결과는 숨기고 '(이전)'을 붙인다. 기존 요소는 지우지 않고 숨긴다.
(async () => {
  try {
    const F = 'Pretendard';
    const C = {
      navy: '#0B1F4F', navy2: '#3B4E7E', navy3: '#8C98B8', navy4: '#D9DEEA', ink: '#191F28', gray: '#6B7684',
      lgray: '#B0B8C1', card: '#F2F4F6', line: '#E5E8EB', yellow: '#FFE300', lyellow: '#FFF7C2', white: '#FFFFFF',
      kakao: '#B2C7D9', bg: '#F5F7FB', blue: '#0114A7',
      red: '#E5484D', red2: '#F7A1A6', red3: '#FDECEC', grid: '#ECEEF2',
    };
    const SLIDE_ID = '1:355';
    const TITLE_ID = '2020:138'; // '특히 외국인 직원을 둔 사장님에게는…' 제목
    const KEEP = ['1:356', '2027:90']; // 하단 바, 쪽번호
    const GROUP = '체불 리스크 장면';

    for (const s of ['Regular', 'Medium', 'SemiBold', 'Bold']) await figma.loadFontAsync({ family: F, style: s });

    // 슬라이드 이름은 팀원이 번호를 다시 매기며 바뀔 수 있어, ID와 제목 텍스트로 확인한다
    const slide = await figma.getNodeByIdAsync(SLIDE_ID);
    const title = slide && slide.children.find((c) => c.id === TITLE_ID);
    if (!slide || slide.type !== 'SLIDE' || !title || title.type !== 'TEXT' || !title.characters.startsWith('특히 외국인 직원을 둔')) {
      throw new Error(`슬라이드 ${SLIDE_ID}(특히 외국인 직원을 둔…)를 찾지 못함`);
    }

    // 기존 요소 숨기기 (지우지 않음)
    for (const ch of slide.children) {
      if (ch.name === GROUP) { ch.visible = false; ch.name = GROUP + ' (이전)'; continue; }
      if (KEEP.includes(ch.id) || ch.name.endsWith('(이전)')) continue;
      ch.visible = false;
    }

    // ---------- 기본 도구 (slide36.js와 같음) ----------
    const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
    const paint = (h) => [{ type: 'SOLID', color: rgb(h) }];
    const shadow = (a, y, r) => [{ type: 'DROP_SHADOW', color: Object.assign(rgb(C.navy), { a }), offset: { x: 0, y }, radius: r, spread: 0, visible: true, blendMode: 'NORMAL' }];

    function T(s, o = {}) {
      const t = figma.createText();
      t.fontName = { family: F, style: o.w || 'Regular' };
      t.characters = s;
      t.fontSize = o.size || 15;
      t.fills = paint(o.color || C.ink);
      if (o.lh) t.lineHeight = { unit: 'PERCENT', value: o.lh };
      if (o.align) t.textAlignHorizontal = o.align;
      t.name = o.name || s.slice(0, 20);
      return t;
    }
    function fixW(t, w) { t.resize(w, t.height); t.textAutoResize = 'HEIGHT'; return t; }
    function box(name, o = {}) {
      const f = figma.createFrame();
      f.name = name;
      f.resize(o.w || 10, o.h || 10);
      f.fills = o.fill ? paint(o.fill) : [];
      f.clipsContent = !!o.clip;
      if (o.radius) f.cornerRadius = o.radius;
      if (o.stroke) { f.strokes = paint(o.stroke); f.strokeWeight = o.sw || 2; f.strokeAlign = 'INSIDE'; }
      if (o.dir) {
        f.layoutMode = o.dir;
        f.itemSpacing = o.gap || 0;
        const [pv, ph] = Array.isArray(o.pad) ? o.pad : [o.pad || 0, o.pad || 0];
        f.paddingTop = f.paddingBottom = pv;
        f.paddingLeft = f.paddingRight = ph;
        const v = o.dir === 'VERTICAL';
        f.primaryAxisSizingMode = (v ? o.h : o.w) ? 'FIXED' : 'AUTO';
        f.counterAxisSizingMode = (v ? o.w : o.h) ? 'FIXED' : 'AUTO';
        if (o.align) f.counterAxisAlignItems = o.align;
        if (o.justify) f.primaryAxisAlignItems = o.justify;
        f.resize(o.w || f.width, o.h || f.height);
      }
      return f;
    }
    function add(p, c, fill) {
      p.appendChild(c);
      if (fill) {
        c.layoutSizingHorizontal = 'FILL';
        if (c.type === 'TEXT') c.textAutoResize = 'HEIGHT';
      }
      return c;
    }
    function pill(s, o = {}) {
      const f = box('pill ' + s, { dir: 'HORIZONTAL', pad: [o.pv || 5, o.ph || 10], radius: 999, fill: o.fill || C.card });
      f.appendChild(T(s, { w: o.w || 'Medium', size: o.size || 13, color: o.color || C.ink }));
      return f;
    }
    function spacer(h) { return box('spacer', { w: 10, h }); }
    function divider() { const r = figma.createRectangle(); r.name = 'divider'; r.resize(100, 1); r.fills = paint(C.line); return r; }
    function checkIcon(size, bg, fg) {
      const f = box('check', { w: size, h: size, radius: size / 2, fill: bg });
      const s = size / 22;
      const v = figma.createVector();
      v.vectorPaths = [{ windingRule: 'NONE', data: `M 0 ${3.5 * s} L ${3.5 * s} ${7 * s} L ${10 * s} 0` }];
      v.fills = [];
      v.strokes = paint(fg);
      v.strokeWeight = Math.max(2, 2 * s);
      v.strokeCap = 'ROUND';
      v.strokeJoin = 'ROUND';
      f.appendChild(v);
      v.x = (size - 10 * s) / 2;
      v.y = (size - 7 * s) / 2;
      return f;
    }
    function infoIcon() {
      const f = box('info', { dir: 'HORIZONTAL', w: 16, h: 16, radius: 8, justify: 'CENTER', align: 'CENTER' });
      f.strokes = paint(C.lgray);
      f.strokeWeight = 1.2;
      f.strokeAlign = 'INSIDE';
      f.appendChild(T('i', { w: 'Bold', size: 10, color: C.gray }));
      return f;
    }
    function row(label, value, o = {}) {
      const r = box('row ' + label, { dir: 'HORIZONTAL', justify: 'SPACE_BETWEEN', align: 'CENTER', pad: [4, 0] });
      const left = box('left', { dir: 'HORIZONTAL', gap: 4, align: 'CENTER' });
      left.appendChild(T(label, { size: o.size || 15, color: o.lc || C.gray, w: o.lw }));
      if (o.info) left.appendChild(infoIcon());
      r.appendChild(left);
      r.appendChild(T(value, { w: o.vw || 'Medium', size: o.vsize || o.size || 15, color: o.vc || C.ink }));
      return r;
    }
    function checkRow(label, o = {}) {
      const r = box('check ' + label, { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
      r.appendChild(checkIcon(o.icon || 22, C.navy, C.white));
      r.appendChild(T(label, { w: o.w || 'Medium', size: o.size || 15 }));
      return r;
    }
    function button(label, o = {}) {
      const b = box('button ' + label, { dir: 'HORIZONTAL', h: o.h || 56, radius: o.radius || 16, fill: o.primary ? C.navy : (o.fill || C.card), justify: 'CENTER', align: 'CENTER' });
      b.appendChild(T(label, { w: 'SemiBold', size: o.size || 17, color: o.primary ? C.white : C.ink }));
      return b;
    }
    function card(name, o = {}) {
      return box(name, {
        dir: 'VERTICAL', gap: o.gap == null ? 8 : o.gap, pad: o.pad || 16, w: o.w, radius: o.radius || 16, clip: true,
        fill: o.fill || (o.isNew ? C.white : C.card), stroke: o.isNew ? C.yellow : null,
      });
    }
    function newBadge() {
      const b = box('NEW', { dir: 'HORIZONTAL', pad: [3, 8], radius: 10, fill: C.yellow });
      b.appendChild(T('NEW', { w: 'Bold', size: 11 }));
      return b;
    }

    const nodes = [];
    const put = (n, x, y) => { slide.appendChild(n); n.x = x; n.y = y; nodes.push(n); return n; };

    const rgba = (h, a) => Object.assign(rgb(h), { a });
    function vec(name, data, x, y) {
      const v = figma.createVector();
      v.name = name;
      v.vectorPaths = [{ windingRule: 'NONZERO', data }];
      put(v, x, y);
      return v;
    }

    // ---------- 제목 (8번 장과 같은 자리, 같은 스타일) ----------
    put(T('특히 외국인 직원을 둔 사장님에게는 급여 분쟁이 큰 리스크가 됩니다.', { w: 'Bold', size: 32, color: C.blue }), 162, 120);
    put(T('외국인 체불은 매년 약 1천억 원, 대부분 소규모 사업장에서 발생합니다.', { size: 20, color: C.gray }), 162, 178);

    // ---------- 큰 숫자 세 개 ----------
    const kpis = [
      ['외국인 근로자 체불액 (매년)', '약 1천억 원', 162],
      ['체불 피해 외국인 근로자 (2025)', '30,684명', 500],
      ['2024년 체불액 중 30인 미만 사업장', '약 89%', 838],
    ];
    kpis.forEach(([label, num, x], i) => {
      put(T(label, { w: 'Medium', size: 15, color: C.red }), x, 270);
      const n = T(num, { w: 'Medium', size: 46, color: C.red });
      if (i === 2) {
        const hl = figma.createRectangle(); hl.name = '강조 밑줄'; hl.resize(n.width + 8, 20); hl.fills = paint(C.red3);
        put(hl, x - 4, 330);
      }
      put(n, x, 294);
    });

    // ---------- 오른쪽 위: 법은 있지만 지킬 도구가 없다 ----------
    {
      const col = box('법과 공백', { dir: 'VERTICAL', gap: 10, w: 500 });
      add(col, T('법은 이미 있어요', { w: 'SemiBold', size: 14, color: C.gray }), true);
      const law = box('제48조', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
      const tag = box('조항', { dir: 'HORIZONTAL', pad: [5, 12], radius: 999, fill: C.white, stroke: C.ink, sw: 1 });
      tag.appendChild(T('근로기준법 제48조', { w: 'SemiBold', size: 14 }));
      law.appendChild(tag);
      law.appendChild(T('임금을 줄 때마다 명세서를 교부해야 해요', { w: 'Medium', size: 16 }));
      add(col, law, true);
      add(col, T('1인 이상 전 사업장, 문자와 이메일도 인정', { size: 13, color: C.gray }), true);
      col.appendChild(spacer(6));
      add(col, T('그런데 사장님이 명세서를 못 주는 이유 (가설)', { w: 'SemiBold', size: 14, color: C.gray }), true);
      ['매달 급여 계산과 별도로 명세서를 또 작성해야 해요', '숙식비, 4대보험 같은 공제를 직원 언어로 설명하기 어려워요', '급여는 은행 앱, 명세서는 엑셀과 종이로 흩어져 있어요'].forEach((s, i) => {
        const r = box('이유 ' + (i + 1), { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
        const n = box('번호', { dir: 'HORIZONTAL', w: 22, h: 22, radius: 11, fill: C.red3, justify: 'CENTER', align: 'CENTER' });
        n.appendChild(T(String(i + 1), { w: 'Bold', size: 12, color: C.red }));
        r.appendChild(n);
        add(r, T(s, { size: 16, color: C.ink }), true);
        add(col, r, true);
      });
      put(col, 1340, 270);
      // 결론 한 줄은 오른쪽 열 아래, 차트 바닥선 높이에 맞춘다
      const fin = fixW(T('법은 사장님에게 명세서 의무를 주지만, 쉽게 지킬 도구는 비어 있고 그 공백이 외국인 직원과의 오해와 체불 분쟁으로 이어집니다.', { w: 'SemiBold', size: 18, color: C.ink, lh: 155 }), 480);
      const bar = figma.createRectangle(); bar.name = '결론 막대'; bar.resize(4, fin.height); bar.fills = paint(C.red);
      put(bar, 1340, 930 - fin.height);
      put(fin, 1358, 930 - fin.height);
    }

    // ---------- 넓게 깔린 면 차트: 체불 피해 외국인 근로자 수 ----------
    const BASE = 930, TOP = 520;
    const data = [
      { year: '2023', v: 27155, label: '27,155명', per: '1인당 447.5만 원', x: 600 },
      { year: '2024', v: 23254, label: '23,254명', per: '1인당 476.6만 원', x: 900 },
      { year: '2025', v: 30684, label: '30,684명', per: '1인당 503.5만 원', x: 1200 },
    ];
    const yOf = (v) => BASE - (v - 20000) / 12000 * (BASE - 470);
    data.forEach((d) => { d.y = yOf(d.v); });
    const [p1, p2, p3] = data;

    // 격자선 (8번 장처럼 화면 끝까지)
    for (const gy of [600, 720, 840, BASE]) {
      const g = figma.createRectangle(); g.name = '격자'; g.resize(1290, 1); g.fills = paint(gy === BASE ? '#DADDE3' : C.grid);
      put(g, 0, gy);
    }
    // 마지막 점의 빛 번짐
    for (const [r, a] of [[180, 0.10], [118, 0.16], [62, 0.24]]) {
      const e = figma.createEllipse(); e.name = '빛 번짐'; e.resize(r * 2, r * 2); e.fills = [{ type: 'SOLID', color: rgb(C.red), opacity: a }];
      put(e, p3.x - r, p3.y - r);
    }
    // 면과 선 (좌표는 (p1.x, p3.y) 기준)
    const ox = p1.x, oy = p3.y;
    const curve = `M 0 ${p1.y - oy} C ${(p1.x + p2.x) / 2 - ox} ${p1.y - oy} ${(p1.x + p2.x) / 2 - ox} ${p2.y - oy} ${p2.x - ox} ${p2.y - oy} C ${(p2.x + p3.x) / 2 - ox} ${p2.y - oy} ${(p2.x + p3.x) / 2 - ox} 0 ${p3.x - ox} 0`;
    const area = vec('면', `${curve} L ${p3.x - ox} ${BASE - oy} L 0 ${BASE - oy} Z`, ox, oy);
    area.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]], gradientStops: [
      { position: 0, color: rgba(C.red, 0.22) }, { position: 1, color: rgba(C.red, 0) },
    ] }];
    area.strokes = [];
    const ln = vec('선', curve, ox, oy);
    ln.vectorPaths = [{ windingRule: 'NONE', data: curve }];
    ln.fills = [];
    ln.strokes = paint(C.red);
    ln.strokeWeight = 5;
    ln.strokeCap = 'ROUND';
    ln.strokeJoin = 'ROUND';

    data.forEach((d, i) => {
      const last = i === data.length - 1;
      const dot = figma.createEllipse(); dot.name = '점 ' + d.year; dot.resize(20, 20); dot.fills = paint(C.white);
      dot.strokes = paint(C.red); dot.strokeWeight = 4;
      put(dot, d.x - 10, d.y - 10);
      const v = T(d.label, { w: last ? 'Bold' : 'SemiBold', size: last ? 30 : 18, color: last ? C.red : C.ink });
      put(v, d.x - v.width / 2, d.y - (last ? 58 : 40));
      const yl = T(d.year, { w: last ? 'Bold' : 'Medium', size: last ? 24 : 16, color: last ? C.red : C.lgray });
      put(yl, d.x - yl.width / 2, BASE + 12);
      const pl = T(d.per, { w: last ? 'SemiBold' : 'Regular', size: 13, color: last ? C.red : C.gray });
      put(pl, d.x - pl.width / 2, BASE + (last ? 44 : 38));
    });
    const cap = T('체불 피해 외국인 근로자 수 (명)', { size: 14, color: C.gray });
    put(cap, 520, BASE - 26);

    // ---------- 도넛 콜아웃: E-9 퇴사 사유 ----------
    {
      const D = 300, CX = 150, CY = 560;
      const back = figma.createEllipse(); back.name = '도넛 바탕'; back.resize(D, D); back.fills = paint(C.white);
      back.effects = [{ type: 'DROP_SHADOW', color: rgba(C.red, 0.10), offset: { x: 0, y: 12 }, radius: 40, spread: 0, visible: true, blendMode: 'NORMAL' }];
      put(back, CX, CY);
      const RD = D - 36;
      const ring = (name, color, a0, a1) => {
        const e = figma.createEllipse(); e.name = name; e.resize(RD, RD); e.fills = paint(color);
        e.arcData = { startingAngle: a0, endingAngle: a1, innerRadius: 0.86 };
        put(e, CX + 18, CY + 18);
      };
      const top = -Math.PI / 2, full = Math.PI * 2;
      ring('도넛 바탕 고리', C.red3, top, top + full);
      ring('임금이 낮아서 24.5%', C.red2, top, top + full * 0.245);
      ring('임금이 체불되어서 10.2%', C.red, top + full * 0.245, top + full * (0.245 + 0.102));
      const mid = box('도넛 가운데', { dir: 'VERTICAL', gap: 6, w: 220, align: 'CENTER' });
      mid.appendChild(T('E-9 퇴사 사유', { w: 'Medium', size: 15, color: C.gray }));
      mid.appendChild(T('10.2%', { w: 'Bold', size: 52, color: C.red }));
      mid.appendChild(pill('“임금이 체불되어서”', { fill: C.red, color: C.white, w: 'SemiBold', size: 13, pv: 4, ph: 10 }));
      mid.appendChild(T('“임금이 낮아서” 24.5%', { w: 'Medium', size: 13, color: C.gray }));
      put(mid, CX + D / 2 - 110, 0);
      mid.y = CY + D / 2 - mid.height / 2;
    }

    // ---------- 출처 ----------
    const s1 = T('[고용노동부 노동포털] https://labor.moel.go.kr/arrstat/sttcStusList.do', { size: 11, color: C.lgray });
    const s2 = T('[더불어민주당 국감자료실] https://theminjoo.kr/main/sub/news/view.php?brd=17&post=1213810&search&sno=0&utm_source', { size: 11, color: C.lgray });
    put(s1, 1900 - s1.width, 1006);
    put(s2, 1900 - s2.width, 1024);

    const g = figma.group(nodes, slide);
    g.name = GROUP;
    figma.closePlugin('체불 리스크 슬라이드 수정 완료');
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

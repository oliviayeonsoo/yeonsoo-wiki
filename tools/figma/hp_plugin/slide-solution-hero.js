// 덱 솔루션 첫 장 ('사장님의 급여 이체 한 번으로' 러프, 슬라이드 2164:370) — 문제 다음 "짜잔, 이게 우리 솔루션" 장
// 레퍼런스: 66 DAYS Challenge 슬라이드. 어두운 배경 + 큰 노란 반원 위 대표 화면 하나(E2 모국어 명세서),
// 주위에 사장님과 직원의 말풍선으로 핵심 가치, 흐린 소프트 3D 아이콘, 오른쪽 아래 확대 카드와 캡션.
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
// 다시 실행하면 이전 결과는 숨기고 '(이전)'을 붙인다. 기존 요소는 지우지 않고 숨긴다.
(async () => {
  try {
    const F = 'Pretendard';
    const C = {
      navy: '#0B1F4F', navy2: '#3B4E7E', navy3: '#8C98B8', navy4: '#D9DEEA', ink: '#191F28', gray: '#6B7684',
      lgray: '#B0B8C1', card: '#F2F4F6', line: '#E5E8EB', yellow: '#FFE300', lyellow: '#FFF7C2', white: '#FFFFFF',
      kakao: '#B2C7D9', bg: '#F5F7FB', blue: '#0114A7', soft: '#AEB6E8',
    };
    const SLIDE_ID = '2164:370';
    const TITLE_ID = '2164:374'; // '사장님의 급여 이체 한 번으로,' 러프 제목
    const KEEP = [];
    const GROUP = '솔루션 시작 장면';

    for (const s of ['Regular', 'Medium', 'SemiBold', 'Bold']) await figma.loadFontAsync({ family: F, style: s });

    // 슬라이드 이름은 팀원이 번호를 다시 매기며 바뀔 수 있어, ID와 제목 텍스트로 확인한다
    const slide = await figma.getNodeByIdAsync(SLIDE_ID);
    const title = slide && slide.children.find((c) => c.id === TITLE_ID);
    if (!slide || slide.type !== 'SLIDE' || !title || title.type !== 'TEXT' || !title.characters.startsWith('사장님의 급여 이체')) {
      throw new Error(`슬라이드 ${SLIDE_ID}(사장님의 급여 이체 한 번으로)를 찾지 못함`);
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

    function chevron() {
      const v = figma.createVector();
      v.name = 'back';
      v.vectorPaths = [{ windingRule: 'NONE', data: 'M 7 0 L 0 7 L 7 14' }];
      v.fills = [];
      v.strokes = paint(C.ink);
      v.strokeWeight = 2;
      v.strokeCap = 'ROUND';
      v.strokeJoin = 'ROUND';
      return v;
    }
    function toggle() {
      const f = box('toggle 켜짐', { w: 48, h: 28, radius: 14, fill: C.navy });
      const k = figma.createEllipse();
      k.resize(22, 22);
      k.fills = paint(C.white);
      f.appendChild(k);
      k.x = 23; k.y = 3;
      return f;
    }
    function wideButton(label, w, primary, fill) {
      const b = button(label, { primary, fill, h: 56 });
      b.primaryAxisSizingMode = 'FIXED';
      b.resize(w, 56);
      return b;
    }

    // ---------- 와이어 화면 (code.js의 S2, S3, S4, S5, S6, E2와 같은 내용) ----------
    function phone(name, build) {
      const scr = box(name + ' 화면', { w: 402, h: 874, radius: 44, fill: C.white, clip: true });
      const sp = (n, x, y) => { scr.appendChild(n); n.x = x; n.y = y; return n; };
      sp(T('9:41', { w: 'SemiBold', size: 16 }), 32, 16);
      const bat = figma.createRectangle(); bat.resize(26, 12); bat.cornerRadius = 3; bat.fills = paint(C.ink); sp(bat, 346, 20);
      const ui = {
        sp,
        nav(t) { sp(chevron(), 20, 68); sp(fixW(T(t, { w: 'SemiBold', size: 17, align: 'CENTER' }), 290), 56, 63); },
        title(t, y) { const n = sp(fixW(T(t, { w: 'Bold', size: 24, lh: 135 }), 362), 20, y || 115); return n.y + n.height; },
        badge(c) { const b = newBadge(); sp(b, c.x + c.width - b.width - 12, c.y - 10); },
        primary(label) { sp(wideButton(label, 362, true), 20, 790); },
      };
      build(ui);
      const p = box(name, { w: 426, h: 898, radius: 56, fill: C.ink, clip: true });
      p.appendChild(scr);
      scr.x = 12; scr.y = 12;
      p.effects = shadow(0.18, 16, 40);
      return p;
    }

    const E2 = () => phone('E2 모국어 명세서', (u) => {
      u.sp(T('Bảng lương tháng 9', { w: 'Bold', size: 20 }), 20, 60);
      const lang = pill('Tiếng Việt');
      u.sp(lang, 402 - 20 - lang.width, 61);
      let y = 119;
      const k1 = card('입금 대조 결과', { w: 362, gap: 6, isNew: true });
      k1.appendChild(checkRow('명세서 금액과 입금액이 같아요', { w: 'SemiBold', size: 16 }));
      const d = box('detail', { dir: 'VERTICAL', gap: 4 });
      d.paddingLeft = 30;
      add(d, T('Số tiền khớp', { w: 'Medium', size: 14, color: C.navy }), true);
      add(d, T('은행이 9월 25일 14:02 지급을 확인했어요', { size: 13, color: C.gray }), true);
      add(k1, d, true);
      u.sp(k1, 20, y); u.badge(k1); y += k1.height + 20;
      const k2 = card('지급 명세', { w: 362, gap: 4 });
      add(k2, T('지급 명세', { size: 13, color: C.gray }), true);
      add(k2, row('기본급', '2,600,000'), true);
      const food = add(k2, row('숙식비', '-150,000', { info: true }), true);
      add(k2, row('보험료', '-70,000', { info: true }), true);
      k2.appendChild(spacer(4));
      add(k2, divider(), true);
      k2.appendChild(spacer(4));
      add(k2, row('실수령', '2,380,000', { lw: 'SemiBold', lc: C.ink, vw: 'Bold', vsize: 17 }), true);
      const hl = figma.createRectangle(); hl.name = '숙식비 강조'; hl.fills = paint(C.lyellow); hl.cornerRadius = 8;
      k2.insertChild(0, hl);
      hl.layoutPositioning = 'ABSOLUTE';
      hl.resize(346, food.height + 4); hl.x = 8; hl.y = food.y - 2;
      u.sp(k2, 20, y); y += k2.height + 20;
      const k3 = card('공제 설명', { w: 362, gap: 6, isNew: true, fill: C.lyellow });
      add(k3, T('숙식비란?', { w: 'SemiBold', size: 15 }), true);
      add(k3, T('숙식비는 사장님이 제공한 숙소와 식사 비용이에요\n(서면 동의 기준)', { size: 14, lh: 145 }), true);
      u.sp(k3, 20, y); u.badge(k3);
      u.primary('사장님에게 문의하기');
    });


    // 폰 껍데기를 부드러운 화이트 3D로 (slide-overview-bezel.js와 같은 처리)
    function whiteBezel(p) {
      const scr = p.children[0];
      const k = p.width / 426;
      p.fills = [{
        type: 'GRADIENT_LINEAR',
        gradientTransform: [[0.6, 0.8, -0.2], [-0.8, 0.6, 0.6]],
        gradientStops: [
          { position: 0, color: Object.assign(rgb('#FFFFFF'), { a: 1 }) },
          { position: 0.55, color: Object.assign(rgb('#F4F6FA'), { a: 1 }) },
          { position: 1, color: Object.assign(rgb('#DDE2EB'), { a: 1 }) },
        ],
      }];
      p.strokes = paint('#D3D9E4');
      p.strokeWeight = 1;
      p.strokeAlign = 'INSIDE';
      p.effects = [
        { type: 'DROP_SHADOW', color: Object.assign(rgb('#000000'), { a: 0.28 }), offset: { x: 0, y: 30 * k }, radius: 60 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
        { type: 'INNER_SHADOW', color: Object.assign(rgb('#FFFFFF'), { a: 0.95 }), offset: { x: 3 * k, y: 3 * k }, radius: 4 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
        { type: 'INNER_SHADOW', color: Object.assign(rgb('#8C98B8'), { a: 0.35 }), offset: { x: -3 * k, y: -4 * k }, radius: 6 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
      ];
      const t = 3 * k;
      const rim = figma.createRectangle();
      rim.name = '화면 테두리';
      rim.fills = paint('#1C2230');
      p.insertChild(0, rim);
      rim.resize(scr.width + t * 2, scr.height + t * 2);
      rim.x = scr.x - t; rim.y = scr.y - t;
      rim.cornerRadius = scr.cornerRadius + t;
      return p;
    }

    // ---------- 어두운 배경 ----------
    const bgr = figma.createRectangle(); bgr.name = '배경'; bgr.resize(1920, 1080); bgr.fills = paint('#151A2E');
    put(bgr, 0, 0);

    // ---------- 제목 ----------
    put(T('OUR SOLUTION', { w: 'Bold', size: 20, color: C.yellow }), 300, 132);
    put(fixW(T('사장님은 이체만 하세요.\n나머지는 은행이 맡아요', { w: 'Bold', size: 52, color: C.white, lh: 132 }), 680), 300, 168);
    put(fixW(T('사장님의 급여 이체 한 번으로, 은행이 점검하고 지급을 확인한\n모국어 명세서가 외국인 직원에게 도착합니다.', { size: 20, color: C.white, lh: 160 }), 600), 1020, 176);
    put(fixW(T('케이뱅크와 카카오뱅크 이체 화면에 붙이는\n은행 앱 탑재형 서비스', { size: 18, color: '#7E879E', lh: 160 }), 600), 1020, 268);

    // ---------- 노란 반원 ----------
    const dome = figma.createEllipse();
    dome.name = '노란 반원';
    dome.resize(1460, 1460);
    dome.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]], gradientStops: [
      { position: 0, color: Object.assign(rgb('#FFE94D'), { a: 1 }) },
      { position: 0.4, color: Object.assign(rgb(C.yellow), { a: 1 }) },
    ] }];
    put(dome, 960 - 730, 640);

    // ---------- 흐린 소프트 3D 아이콘 (배경 깊이) ----------
    function blurIcon(name, size, glyph, x, y, op, tone) {
      const f = box(name, { w: size, h: size, radius: size / 2 });
      f.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[0.6, 0.8, -0.2], [-0.8, 0.6, 0.6]], gradientStops: [
        { position: 0, color: Object.assign(rgb(tone[0]), { a: 1 }) },
        { position: 1, color: Object.assign(rgb(tone[1]), { a: 1 }) },
      ] }];
      f.appendChild(glyph);
      glyph.x = (size - glyph.width) / 2; glyph.y = (size - glyph.height) / 2;
      f.effects = [{ type: 'LAYER_BLUR', radius: 5, visible: true }];
      f.opacity = op;
      put(f, x, y);
    }
    blurIcon('흐린 원화 동전', 170, T('₩', { w: 'Bold', size: 84, color: '#2A3766' }), 210, 470, 0.75, ['#6E5A1E', '#3B3420']);
    {
      const doc = box('문서', { w: 70, h: 90, radius: 8, fill: '#2A3766' });
      for (let i = 0; i < 3; i++) { const l = figma.createRectangle(); l.resize(i === 2 ? 26 : 42, 7); l.cornerRadius = 4; l.fills = paint('#8C98B8'); doc.appendChild(l); l.x = 14; l.y = 20 + i * 18; }
      blurIcon('흐린 명세서', 150, doc, 1580, 420, 0.8, ['#4A5578', '#2A3354']);
    }

    // ---------- 대표 화면 하나: E2 모국어 명세서 (아래는 슬라이드 밖으로 잘림) ----------
    const hero = whiteBezel(E2());
    put(hero, 960 - 213, 440);

    // ---------- 말풍선: 왼쪽 사장님, 오른쪽 직원 ----------
    function bubble(text, who, dim) {
      const b = box('말풍선 ' + text, { dir: 'HORIZONTAL', gap: 10, align: 'CENTER', pad: [14, 20], radius: 16, fill: dim ? '#5B6582' : C.white });
      b.effects = shadow(0.25, 10, 24);
      let ic;
      if (who === 'owner') {
        ic = box('사장님 표시', { dir: 'HORIZONTAL', w: 26, h: 26, radius: 13, justify: 'CENTER', align: 'CENTER', fill: C.navy2 });
        ic.appendChild(T('₩', { w: 'Bold', size: 14, color: C.white }));
      } else {
        ic = checkIcon(26, C.yellow, C.navy);
        ic.name = '직원 표시';
      }
      b.appendChild(ic);
      b.appendChild(T(text, { w: 'SemiBold', size: 19, color: dim ? '#E3E7F1' : C.ink }));
      const w = figma.createFrame(); w.name = '말풍선 ' + text; w.fills = []; w.clipsContent = false;
      w.resize(b.width, b.height + 10);
      w.appendChild(b); b.x = 0; b.y = 0;
      const tail = figma.createVector();
      tail.vectorPaths = [{ windingRule: 'NONZERO', data: 'M 0 0 L 20 0 L 10 11 Z' }];
      tail.fills = paint(dim ? '#5B6582' : C.white);
      tail.strokes = [];
      w.appendChild(tail);
      tail.x = b.width / 2 - 10; tail.y = b.height - 1;
      return w;
    }
    // 사장님 (왼쪽): 이체 한 번, 사전 점검, 증빙
    const l1 = bubble('이체 한 번이면 끝', 'owner', true); put(l1, 740 - l1.width, 566);
    const l2 = bubble('보내기 전에 은행이 점검해 줘요', 'owner'); put(l2, 690 - l2.width, 690);
    const l3 = bubble('분쟁이 나도 기록이 남아요', 'owner'); put(l3, 760 - l3.width, 816);
    // 직원 (오른쪽): 지급 확인, 대조, 모국어 설명
    const r1 = bubble('은행이 지급을 확인했어요', 'staff', true); put(r1, 1180, 522);
    const r2 = bubble('입금액과 명세서가 같아요', 'staff'); put(r2, 1240, 646);
    const r3 = bubble('숙식비가 뭔지 이제 알겠어요', 'staff'); put(r3, 1180, 770);

    // ---------- 오른쪽 아래: 확대 카드 + 캡션 ----------
    {
      const k = card('입금 대조 확대', { w: 330, pad: 22, gap: 8, radius: 22, fill: C.white });
      k.effects = shadow(0.3, 16, 40);
      add(k, T('Bảng lương tháng 9', { w: 'SemiBold', size: 13, color: C.gray }), true);
      k.appendChild(checkRow('명세서 금액과 입금액이 같아요', { w: 'SemiBold', size: 16 }));
      const d = box('detail', { dir: 'VERTICAL', gap: 3 });
      d.paddingLeft = 30;
      add(d, T('Số tiền khớp', { w: 'Medium', size: 14, color: C.blue }), true);
      add(d, T('은행이 9월 25일 14:02 지급을 확인했어요', { size: 13, color: C.gray }), true);
      add(k, d, true);
      put(k, 1520, 870);
      const cap = pill('이체 한 번으로 명세서까지', { fill: '#252B42', color: C.white, w: 'Medium', size: 15, pv: 10, ph: 18 });
      put(cap, 1520 + 330 - cap.width, 870 + k.height + 16);
    }

    const g = figma.group(nodes, slide);
    g.name = GROUP;
    figma.closePlugin('솔루션 시작 슬라이드 수정 완료');
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

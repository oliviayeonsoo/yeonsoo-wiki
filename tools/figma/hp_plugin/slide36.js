// 덱 36번 슬라이드 (② 직원의 입금 대조, 쪽번호 15) — 레퍼런스: UT 결과 / Result & Edit 구성
// 왼쪽 네이비 패널(AS-IS) + 오른쪽 폰 목업(E2) + 확대 카드 + 콜아웃. 폰 화면은 code.js 와이어(E1, E2)와 같은 방식으로 그린다.
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
// 다시 실행하면 이전 결과는 숨기고 '(이전)'을 붙인다. 기존 요소는 지우지 않고 숨긴다.
(async () => {
  try {
    const F = 'Pretendard';
    const C = {
      navy: '#0B1F4F', navy2: '#3B4E7E', navy3: '#8C98B8', navy4: '#D9DEEA', ink: '#191F28', gray: '#6B7684',
      lgray: '#B0B8C1', card: '#F2F4F6', line: '#E5E8EB', yellow: '#FFE300', lyellow: '#FFF7C2', white: '#FFFFFF',
      kakao: '#B2C7D9', bg: '#EEF1F7',
    };
    const SLIDE_ID = '1:393';
    const KEEP = ['2028:101', '1:394']; // 쪽번호, 하단 바
    const GROUP = '36 입금 대조 장면';

    for (const s of ['Regular', 'Medium', 'SemiBold', 'Bold']) await figma.loadFontAsync({ family: F, style: s });

    const slide = await figma.getNodeByIdAsync(SLIDE_ID);
    // 슬라이드 이름은 팀원이 번호를 다시 매기며 바뀔 수 있어, ID와 레퍼런스 이미지(2174:499)로 확인한다
    if (!slide || slide.type !== 'SLIDE' || !slide.children.some((c) => c.id === '2174:499')) {
      throw new Error(`슬라이드 ${SLIDE_ID}(레퍼런스 이미지 있는 장)를 찾지 못함`);
    }

    // 기존 요소 숨기기 (지우지 않음)
    for (const ch of slide.children) {
      if (ch.name === GROUP) { ch.visible = false; ch.name = GROUP + ' (이전)'; continue; }
      if (KEEP.includes(ch.id) || ch.name.endsWith('(이전)')) continue;
      ch.visible = false;
    }

    // ---------- 기본 도구 (code.js와 같음) ----------
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

    // ---------- 왼쪽: AS-IS 패널 ----------
    {
      const panel = box('AS-IS 패널', { w: 620, h: 1046, fill: C.navy });
      put(panel, 0, 0);
      put(pill('지금의 급여일', { fill: C.yellow, color: C.navy, w: 'Bold', size: 16, pv: 6, ph: 14 }), 100, 120);
      put(fixW(T('덜 받은 건지,\n공제된 건지 몰라요', { w: 'Bold', size: 40, color: C.white, lh: 135 }), 440), 100, 172);
      let y = 330;
      for (const [h, b] of [
        ['명세서가 한국어로만 와요', '숙식비와 보험료가 무엇인지 모른 채\n금액만 보고 넘겨요'],
        ['명세서와 입금을 따로 봐요', '금액이 다르면 덜 받았다는 오해가\n분쟁으로 번져요'],
      ]) {
        put(T(h, { w: 'SemiBold', size: 21, color: C.white }), 100, y);
        put(T(b, { size: 17, color: C.navy3, lh: 150 }), 100, y + 36);
        y += 120;
      }

      // AS-IS 장면: 한국어로만 된 명세서
      const scene = box('AS-IS 장면', { w: 420, h: 400, radius: 40, fill: C.navy2, clip: true });
      put(scene, 100, 590);
      const lab = fixW(T('AS-IS', { w: 'SemiBold', size: 18, color: C.white, align: 'CENTER' }), 420);
      scene.appendChild(lab);
      lab.y = 26;
      const slip = card('한국어 명세서', { w: 300, pad: 20, gap: 6, radius: 18, fill: C.white });
      add(slip, T('임금명세서 (9월)', { w: 'Bold', size: 17 }), true);
      add(slip, T('OO식당  응우옌 반 A', { size: 13, color: C.gray }), true);
      slip.appendChild(spacer(6));
      add(slip, row('기본급', '2,600,000원', { size: 14 }), true);
      const food = add(slip, row('숙식비', '-150,000원', { size: 14 }), true);
      const ins = add(slip, row('보험료', '-70,000원', { size: 14 }), true);
      slip.appendChild(spacer(4));
      add(slip, divider(), true);
      slip.appendChild(spacer(4));
      add(slip, row('실수령', '2,380,000원', { size: 15, lw: 'SemiBold', lc: C.ink, vw: 'Bold' }), true);
      scene.appendChild(slip);
      slip.x = 60; slip.y = 76;
      // 직원이 이해하지 못하는 항목에 물음표
      for (const r of [food, ins]) {
        const q = box('물음표', { dir: 'HORIZONTAL', w: 26, h: 26, radius: 13, fill: C.yellow, justify: 'CENTER', align: 'CENTER' });
        q.appendChild(T('?', { w: 'Bold', size: 15, color: C.navy }));
        scene.appendChild(q);
        q.x = slip.x + slip.width - 6;
        q.y = slip.y + r.y + (r.height - 26) / 2;
      }
    }

    // ---------- 오른쪽: 제목 ----------
    put(T('② 직원의 입금 대조', { w: 'SemiBold', size: 20, color: C.navy2 }), 720, 110);
    put(fixW(T('모국어 명세서로 받고\n입금액과 바로 맞춰 봐요', { w: 'Bold', size: 46, color: C.navy, lh: 132 }), 560), 720, 146);
    put(fixW(T('은행은 체불을 판정하지 않아요. 명세서와 입금을 보여 주고, 오해가 분쟁이 되기 전에 대화로 잇습니다.', { size: 17, color: C.gray, lh: 150 }), 540), 720, 283);

    // 콜아웃: 점 + 라벨 (레퍼런스의 초록 점 → 네이비 점)
    function dot() {
      const d = figma.createEllipse();
      d.name = 'callout dot';
      d.resize(22, 22);
      d.fills = paint(C.navy);
      d.strokes = paint(C.white);
      d.strokeWeight = 4;
      d.strokeAlign = 'INSIDE';
      d.effects = shadow(0.25, 2, 8);
      return d;
    }
    function callout(x, y, label, lineLen) {
      // (x, y) = 카드 오른쪽 가장자리 위의 점. 점선으로 이어서 라벨
      const d1 = put(dot(), x - 11, y - 11);
      const ln = figma.createLine();
      ln.name = 'callout line';
      ln.resize(lineLen, 0);
      ln.strokes = paint(C.navy3);
      ln.strokeWeight = 1.5;
      ln.dashPattern = [4, 4];
      put(ln, x + 11, y);
      const t = put(T(label, { w: 'Medium', size: 17, color: C.ink, lh: 140 }), x + 11 + lineLen + 10, 0);
      t.y = y - t.height / 2;
      return [d1, ln, t];
    }

    // ---------- 폰 목업 (E2 모국어 명세서) ----------
    {
      const lab = box('폰 라벨', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
      lab.appendChild(dot());
      lab.appendChild(T('명세서 금액과 실제 입금액을 은행이 대조해요', { w: 'Medium', size: 18 }));
      put(lab, 740, 372);

      const back = box('폰 배경', { w: 540, h: 600, radius: 48, fill: C.bg, clip: true });
      put(back, 720, 420);

      const scr = box('E2 화면', { w: 402, h: 874, radius: 44, fill: C.white, clip: true });
      const clock = T('9:41', { w: 'SemiBold', size: 16 });
      scr.appendChild(clock);
      clock.x = 32; clock.y = 16;
      const bat = figma.createRectangle(); bat.resize(26, 12); bat.cornerRadius = 3; bat.fills = paint(C.ink); scr.appendChild(bat); bat.x = 346; bat.y = 20;
      const sp = (n, x, y) => { scr.appendChild(n); n.x = x; n.y = y; return n; };
      sp(T('Bảng lương tháng 9', { w: 'Bold', size: 20 }), 20, 60);
      const lang = pill('Tiếng Việt');
      sp(lang, 402 - 20 - lang.width, 61);

      const k1 = card('입금 대조 결과', { isNew: true, gap: 6, w: 362 });
      k1.appendChild(checkRow('명세서 금액과 입금액이 같아요', { w: 'SemiBold', size: 16 }));
      const d = box('detail', { dir: 'VERTICAL', gap: 4 });
      d.paddingLeft = 30;
      add(d, T('Số tiền khớp', { w: 'Medium', size: 14, color: C.navy }), true);
      add(d, T('은행이 9월 25일 14:02 지급을 확인했어요', { size: 13, color: C.gray }), true);
      add(k1, d, true);
      sp(k1, 20, 119);
      const b1 = newBadge(); sp(b1, 20 + 362 - b1.width - 12, 109);

      const k2 = card('지급 명세', { gap: 4, w: 362 });
      add(k2, T('지급 명세', { size: 13, color: C.gray }), true);
      add(k2, row('기본급', '2,600,000'), true);
      add(k2, row('숙식비', '-150,000', { info: true }), true);
      add(k2, row('보험료', '-70,000', { info: true }), true);
      k2.appendChild(spacer(4));
      add(k2, divider(), true);
      k2.appendChild(spacer(4));
      add(k2, row('실수령', '2,380,000', { lw: 'SemiBold', lc: C.ink, vw: 'Bold', vsize: 17 }), true);
      sp(k2, 20, k1.y + k1.height + 20);

      const phone = box('폰', { w: 426, h: 898, radius: 56, fill: C.ink });
      phone.appendChild(scr);
      scr.x = 12; scr.y = 12;
      back.appendChild(phone);
      phone.rescale(1.1);
      phone.x = (540 - phone.width) / 2;
      phone.y = 40;
    }

    // ---------- 오른쪽 열: 확대 카드 3장 + 콜아웃 ----------
    const COL_X = 1272, COL_W = 400;
    let y = 352;
    {
      // 1) 카톡 알림톡 (E1)
      const k = box('카톡 알림톡', { w: COL_W, h: 10, radius: 28, fill: C.kakao, clip: true });
      k.effects = shadow(0.12, 12, 40);
      const av = box('프로필', { dir: 'HORIZONTAL', w: 36, h: 36, radius: 12, fill: C.navy, justify: 'CENTER', align: 'CENTER' });
      av.appendChild(T('K', { w: 'Bold', size: 15, color: C.white }));
      k.appendChild(av); av.x = 20; av.y = 20;
      const nm = T('케이뱅크', { size: 12, color: '#3D4A57' }); k.appendChild(nm); nm.x = 66; nm.y = 20;
      const bubble = box('알림톡 말풍선', { dir: 'VERTICAL', w: 300, radius: 14, fill: C.white, stroke: C.yellow, clip: true });
      const head = box('노란 머리', { dir: 'VERTICAL', pad: [12, 16], fill: C.yellow });
      add(head, T('Bảng lương tháng 9 đã đến', { w: 'Bold', size: 15 }), true);
      add(bubble, head, true);
      const body = box('본문', { dir: 'VERTICAL', gap: 4, pad: [14, 16] });
      add(bubble, body, true);
      add(body, T('9월 급여명세서가 도착했어요', { size: 13, color: C.gray }), true);
      add(body, T('2,380,000원', { w: 'Bold', size: 20 }), true);
      body.appendChild(checkRow('입금 확인 완료', { size: 13, icon: 18 }));
      k.appendChild(bubble); bubble.x = 66; bubble.y = 42;
      k.resize(COL_W, bubble.y + bubble.height + 22);
      put(k, COL_X, y);
      callout(COL_X + COL_W, y + k.height / 2, '카톡 알림톡으로\n모국어 명세서 도착', 26);
      y += k.height + 18;
    }
    {
      // 2) 공제 설명 확대
      const k = card('공제 설명 확대', { w: COL_W, pad: 24, gap: 4, radius: 28, fill: C.white });
      k.effects = shadow(0.12, 12, 40);
      add(k, T('지급 명세', { size: 13, color: C.gray }), true);
      add(k, row('기본급', '2,600,000'), true);
      const food = add(k, row('숙식비', '-150,000', { info: true, lc: C.ink, lw: 'SemiBold' }), true);
      add(k, row('보험료', '-70,000', { info: true }), true);
      k.appendChild(spacer(8));
      const ex = box('숙식비 설명', { dir: 'VERTICAL', gap: 4, pad: [12, 14], radius: 12, fill: C.lyellow });
      add(ex, T('Tiền ăn ở là gì?', { w: 'Bold', size: 14 }), true);
      add(ex, T('숙식비는 사장님이 제공한 숙소와 식사 비용이에요 (서면 동의 기준)', { size: 13, lh: 145 }), true);
      add(k, ex, true);
      // 숙식비 행 강조 테두리 (레퍼런스의 빨간 박스 → 노랑)
      const hl = figma.createRectangle();
      hl.name = '숙식비 강조';
      hl.fills = paint(C.lyellow);
      hl.strokes = paint(C.yellow);
      hl.strokeWeight = 2;
      hl.cornerRadius = 8;
      k.insertChild(0, hl);
      hl.layoutPositioning = 'ABSOLUTE';
      hl.resize(COL_W - 32, food.height + 8);
      hl.x = 16;
      hl.y = food.y - 4;
      put(k, COL_X, y);
      callout(COL_X + COL_W, y + k.height / 2, '공제 항목마다\n모국어 설명', 26);
      y += k.height + 18;
    }
    {
      // 3) 다르면 바로 문의
      const k = card('문의 연결', { w: COL_W, pad: 20, gap: 10, radius: 28, fill: C.white });
      k.effects = shadow(0.12, 12, 40);
      add(k, button('사장님에게 문의하기', { primary: true, h: 48, size: 16 }), true);
      add(k, button('외국인력상담센터 1577-0071', { h: 48, size: 16 }), true);
      put(k, COL_X, y);
      callout(COL_X + COL_W, y + k.height / 2, '금액이 다르면\n바로 묻고 상담 연결', 26);
      y += k.height;
    }
    if (y > 1030) throw new Error('오른쪽 열이 하단 바와 겹침: ' + Math.round(y));

    const g = figma.group(nodes, slide);
    g.name = GROUP;
    figma.closePlugin('36번 슬라이드 수정 완료');
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

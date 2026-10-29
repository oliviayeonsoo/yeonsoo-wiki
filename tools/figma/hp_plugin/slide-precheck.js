// 덱 ① 이체 직전 점검 슬라이드 (쪽번호 14) — 바로 다음 장(② 입금 대조, slide36.js)의 레이아웃을 그대로 차용
// 왼쪽 네이비 패널(AS-IS) + 오른쪽 폰 목업(S4 이체 확인) + 확대 카드 + 콜아웃.
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
    const SLIDE_ID = '2180:74';
    const TITLE_ID = '2180:77'; // '① 이체 직전 최저임금과 숙식비 한도를 점검해…' 제목
    const KEEP = ['2180:80', '2180:75']; // 쪽번호, 하단 바
    const GROUP = '① 이체 전 점검 장면';

    for (const s of ['Regular', 'Medium', 'SemiBold', 'Bold']) await figma.loadFontAsync({ family: F, style: s });

    // 슬라이드 이름은 팀원이 번호를 다시 매기며 바뀔 수 있어, ID와 제목 텍스트로 확인한다
    const slide = await figma.getNodeByIdAsync(SLIDE_ID);
    const title = slide && slide.children.find((c) => c.id === TITLE_ID);
    if (!slide || slide.type !== 'SLIDE' || !title || title.type !== 'TEXT' || !title.characters.startsWith('① 이체 직전')) {
      throw new Error(`슬라이드 ${SLIDE_ID}(① 이체 직전 점검)를 찾지 못함`);
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
    function warnIcon(size) {
      const f = box('warn', { dir: 'HORIZONTAL', w: size, h: size, radius: size / 2, fill: C.yellow, justify: 'CENTER', align: 'CENTER' });
      f.appendChild(T('!', { w: 'Bold', size: Math.round(size * 0.6), color: C.navy }));
      return f;
    }

    // ---------- 왼쪽: AS-IS 패널 ----------
    {
      const panel = box('AS-IS 패널', { w: 620, h: 1046, fill: C.navy });
      put(panel, 0, 0);
      put(pill('지금의 급여일', { fill: C.yellow, color: C.navy, w: 'Bold', size: 16, pv: 6, ph: 14 }), 100, 120);
      put(fixW(T('틀린 급여인지\n보내고 나서야 알아요', { w: 'Bold', size: 40, color: C.white, lh: 135 }), 440), 100, 172);
      let y = 330;
      for (const [h, b] of [
        ['공제 한도를 혼자 따져야 해요', '숙식비는 서면 동의와 한도 안에서만\n뗄 수 있는데, 이체 화면은 알려주지 않아요'],
        ['명세서는 이체와 따로 만들어요', '보낸 뒤에 다시 입력하다 보니\n명세서를 빠뜨리기 쉬워요'],
      ]) {
        put(T(h, { w: 'SemiBold', size: 21, color: C.white }), 100, y);
        put(T(b, { size: 17, color: C.navy3, lh: 150 }), 100, y + 36);
        y += 120;
      }

      // AS-IS 장면: 점검 없이 바로 보내는 이체 확인 화면
      const scene = box('AS-IS 장면', { w: 420, h: 400, radius: 40, fill: C.navy2, clip: true });
      put(scene, 100, 590);
      const lab = fixW(T('AS-IS', { w: 'SemiBold', size: 18, color: C.white, align: 'CENTER' }), 420);
      scene.appendChild(lab);
      lab.y = 26;
      const tr = card('지금의 이체 확인', { w: 300, pad: 20, gap: 6, radius: 18, fill: C.white });
      add(tr, T('3명에게 9,520,000원', { w: 'Bold', size: 17 }), true);
      add(tr, T('받는 사람', { size: 13, color: C.gray }), true);
      tr.appendChild(spacer(4));
      const a = add(tr, row('응우옌 반 A', '2,380,000원', { size: 14 }), true);
      add(tr, row('쩐 티 B', '2,420,000원', { size: 14 }), true);
      add(tr, row('람 C', '4,720,000원', { size: 14 }), true);
      tr.appendChild(spacer(10));
      add(tr, button('보내기', { primary: true, h: 44, size: 15, radius: 12 }), true);
      scene.appendChild(tr);
      tr.x = 60; tr.y = 76;
      // 숙식비가 한도를 넘었는지 모른 채 보내는 행에 물음표
      const q = box('물음표', { dir: 'HORIZONTAL', w: 26, h: 26, radius: 13, fill: C.yellow, justify: 'CENTER', align: 'CENTER' });
      q.appendChild(T('?', { w: 'Bold', size: 15, color: C.navy }));
      scene.appendChild(q);
      q.x = tr.x + tr.width - 6;
      q.y = tr.y + a.y + (a.height - 26) / 2;
    }

    // ---------- 오른쪽: 제목 ----------
    put(T('① 이체 전 점검', { w: 'SemiBold', size: 20, color: C.navy2 }), 720, 110);
    put(fixW(T('보내기 전에\n틀린 급여를 먼저 막아요', { w: 'Bold', size: 46, color: C.navy, lh: 132 }), 560), 720, 146);
    put(fixW(T('이체 직전에 최저임금과 숙식비 한도를 점검하고, 실제 이체 기록으로 명세서의 법정 기재사항을 채웁니다.', { size: 17, color: C.gray, lh: 150 }), 540), 720, 283);

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
      put(dot(), x - 11, y - 11);
      const ln = figma.createLine();
      ln.name = 'callout line';
      ln.resize(lineLen, 0);
      ln.strokes = paint(C.navy3);
      ln.strokeWeight = 1.5;
      ln.dashPattern = [4, 4];
      put(ln, x + 11, y);
      const t = put(T(label, { w: 'Medium', size: 17, color: C.ink, lh: 140 }), x + 11 + lineLen + 10, 0);
      t.y = y - t.height / 2;
    }

    // ---------- 폰 목업 (S4 이체 확인) ----------
    {
      const lab = box('폰 라벨', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
      lab.appendChild(dot());
      lab.appendChild(T('이체 확인 화면에서 바로 점검해요', { w: 'Medium', size: 18 }));
      put(lab, 740, 372);

      const back = box('폰 배경', { w: 540, h: 600, radius: 48, fill: C.bg, clip: true });
      put(back, 720, 420);

      const scr = box('S4 화면', { w: 402, h: 874, radius: 44, fill: C.white, clip: true });
      const sp = (n, x, y) => { scr.appendChild(n); n.x = x; n.y = y; return n; };
      sp(T('9:41', { w: 'SemiBold', size: 16 }), 32, 16);
      const bat = figma.createRectangle(); bat.resize(26, 12); bat.cornerRadius = 3; bat.fills = paint(C.ink); sp(bat, 346, 20);
      sp(chevron(), 20, 68);
      sp(fixW(T('이체 확인', { w: 'SemiBold', size: 17, align: 'CENTER' }), 290), 56, 63);
      const ttl = sp(fixW(T('3명에게 9,520,000원을 보낼게요', { w: 'Bold', size: 24, lh: 135 }), 362), 20, 115);

      const k1 = card('받는 사람', { gap: 4, w: 362 });
      add(k1, T('받는 사람', { size: 13, color: C.gray }), true);
      add(k1, row('응우옌 반 A', '2,380,000원'), true);
      add(k1, row('쩐 티 B', '2,420,000원'), true);
      add(k1, row('람 C', '4,720,000원'), true);
      sp(k1, 20, ttl.y + ttl.height + 24);

      const k2 = card('이체 전 점검 경고', { isNew: true, fill: C.lyellow, gap: 6, w: 362 });
      add(k2, T('이체 전에 확인해 주세요', { w: 'SemiBold', size: 16 }), true);
      add(k2, T('응우옌 반 A의 숙식비 공제가 서면 동의 금액(300,000원)보다 많아요', { size: 14, lh: 145 }), true);
      add(k2, T('판정이 아닌 참고 알림이에요', { size: 12, color: C.gray }), true);
      sp(k2, 20, k1.y + k1.height + 20);
      const b1 = newBadge(); sp(b1, 20 + 362 - b1.width - 12, k2.y - 10);

      let yy = k2.y + k2.height + 24;
      sp(checkRow('최저임금 확인 완료'), 20, yy);
      yy += 40;
      const tg = box('명세서 함께 보내기', { dir: 'HORIZONTAL', w: 362, justify: 'SPACE_BETWEEN', align: 'CENTER' });
      tg.appendChild(T('명세서 함께 보내기', { w: 'Medium', size: 15 }));
      tg.appendChild(toggle());
      sp(tg, 20, yy);

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
      // 1) 점검 기준 3가지
      const k = card('점검 기준', { w: COL_W, pad: 24, gap: 10, radius: 28, fill: C.white });
      k.effects = shadow(0.12, 12, 40);
      add(k, T('이체 직전 점검', { size: 13, color: C.gray }), true);
      for (const [label, result, ok] of [
        ['최저임금', '통과', true],
        ['숙식비 공제 한도', '확인 필요', false],
        ['서면 동의', '300,000원까지', true],
      ]) {
        const r = box('점검 ' + label, { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
        r.appendChild(ok ? checkIcon(22, C.navy, C.white) : warnIcon(22));
        add(r, T(label, { w: 'Medium', size: 15 }), true);
        r.appendChild(T(result, { w: ok ? 'Medium' : 'Bold', size: 15, color: ok ? C.gray : C.navy }));
        add(k, r, true);
      }
      put(k, COL_X, y);
      callout(COL_X + COL_W, y + k.height / 2, '최저임금과 숙식비 한도,\n서면 동의를 미리 점검', 26);
      y += k.height + 18;
    }
    {
      // 2) 경고는 참고 알림
      const k = card('참고 알림', { w: COL_W, pad: 24, gap: 6, radius: 28, fill: C.lyellow, stroke: null });
      k.strokes = paint(C.yellow);
      k.strokeWeight = 2;
      k.strokeAlign = 'INSIDE';
      k.effects = shadow(0.12, 12, 40);
      const hd = box('head', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
      hd.appendChild(warnIcon(20));
      hd.appendChild(T('숙식비 공제가 동의 금액보다 많아요', { w: 'SemiBold', size: 16 }));
      add(k, hd, true);
      add(k, T('응우옌 반 A, 서면 동의 금액 300,000원 기준', { size: 14, lh: 145 }), true);
      k.appendChild(spacer(6));
      const btns = box('buttons', { dir: 'HORIZONTAL', gap: 8 });
      add(k, btns, true);
      add(btns, button('수정하기', { h: 44, size: 15, radius: 12, fill: C.white }), true);
      add(btns, button('그대로 보내기', { primary: true, h: 44, size: 15, radius: 12 }), true);
      put(k, COL_X, y);
      callout(COL_X + COL_W, y + k.height / 2, '판정이 아닌 참고 알림,\n고칠지는 사장님이', 26);
      y += k.height + 18;
    }
    {
      // 3) 이체 기록으로 채우는 법정 기재사항
      const k = card('법정 기재사항', { w: COL_W, pad: 24, gap: 10, radius: 28, fill: C.white });
      k.effects = shadow(0.12, 12, 40);
      add(k, T('명세서에 자동으로 채워져요', { w: 'SemiBold', size: 15 }), true);
      const chips = box('chips', { dir: 'HORIZONTAL', gap: 6, w: COL_W - 48 });
      chips.layoutWrap = 'WRAP';
      chips.counterAxisSpacing = 6;
      for (const s of ['성명', '지급일', '임금 총액', '항목별 금액', '계산 방법', '공제 내역']) {
        chips.appendChild(pill(s, { fill: C.card, color: C.navy, size: 13 }));
      }
      add(k, chips, true);
      add(k, T('근로기준법 시행령 제27조의2', { size: 12, color: C.gray }), true);
      put(k, COL_X, y);
      callout(COL_X + COL_W, y + k.height / 2, '실제 이체 기록으로\n명세서까지 한 번에', 26);
      y += k.height;
    }
    if (y > 1030) throw new Error('오른쪽 열이 하단 바와 겹침: ' + Math.round(y));

    const g = figma.group(nodes, slide);
    g.name = GROUP;
    figma.closePlugin('① 이체 전 점검 슬라이드 수정 완료');
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

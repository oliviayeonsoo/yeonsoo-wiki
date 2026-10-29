// 와이어프레임 8장 (S1~S6, E1~E2) — 명세: docs/wireframe-spec.md, 규칙: .claude/CLAUDE.md
// 실행: Figma 데스크톱 > 플러그인 > 개발 > HP Add Slides (UXUI 작업 파일, 페이지 'k bank & kakao bank')
// 다시 실행하면 이전 결과는 지우지 않고 숨긴 뒤 '(이전)'을 붙인다.
(async () => {
  try {
    const F = 'Pretendard';
    const C = {
      navy: '#0B1F4F', ink: '#191F28', gray: '#6B7684', lgray: '#B0B8C1', card: '#F2F4F6',
      line: '#E5E8EB', yellow: '#FFE300', lyellow: '#FFF7C2', white: '#FFFFFF', kakao: '#B2C7D9',
    };
    const W = 402, CW = 362, BTN_Y = 790;
    const FRAMES = {
      S1: ['1:2', '1 연결'], S2: ['1:3', '1 연결-2'], S3: ['1:20', '2 준비'], S4: ['22:8', '3 점검'],
      S5: ['22:24', '4 지급'], S6: ['22:40', '5 증명과 보상'], E1: ['22:73', '직원 화면'], E2: ['22:89', '직원 화면'],
    };

    for (const s of ['Regular', 'Medium', 'SemiBold', 'Bold']) await figma.loadFontAsync({ family: F, style: s });

    // 프레임 확인 — 이름이나 크기가 다르면 아무것도 그리지 않고 멈춘다
    const phones = {};
    for (const code in FRAMES) {
      const [id, name] = FRAMES[code];
      const n = await figma.getNodeByIdAsync(id);
      if (!n || n.type !== 'FRAME' || n.name !== name || Math.round(n.width) !== 402 || Math.round(n.height) !== 874) {
        throw new Error(`${code} 프레임(${id} '${name}')이 명세와 다름`);
      }
      phones[code] = n;
    }
    const page = phones.S1.parent;

    // 이전 결과 숨기기
    for (const code in phones) {
      for (const ch of phones[code].children) {
        if (ch.name === `${code} 와이어`) { ch.visible = false; ch.name = `${code} 와이어 (이전)`; }
      }
    }
    for (const ch of page.children) {
      if (ch.name === '와이어 컴포넌트') { ch.visible = false; ch.name = '와이어 컴포넌트 (이전)'; }
    }

    // ---------- 기본 도구 ----------
    const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
    const paint = (h) => [{ type: 'SOLID', color: rgb(h) }];

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
      if (o.stroke) { f.strokes = paint(o.stroke); f.strokeWeight = 2; f.strokeAlign = 'INSIDE'; }
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
    // 오토레이아웃 부모에 넣고, fill이면 가로로 꽉 채운다
    function add(p, c, fill) {
      p.appendChild(c);
      if (fill) {
        c.layoutSizingHorizontal = 'FILL';
        if (c.type === 'TEXT') c.textAutoResize = 'HEIGHT';
      }
      return c;
    }
    function card(name, o = {}) {
      return box(name, {
        dir: o.dir || 'VERTICAL', gap: o.gap == null ? 8 : o.gap, pad: 16, w: CW, radius: 16, clip: true,
        fill: o.fill || (o.isNew ? C.white : C.card), stroke: o.isNew ? C.yellow : null, align: o.align,
      });
    }
    function pill(s, o = {}) {
      const f = box('pill ' + s, { dir: 'HORIZONTAL', pad: [5, 10], radius: 999, fill: o.fill || C.card });
      f.appendChild(T(s, { w: o.w || 'Medium', size: o.size || 13, color: o.color || C.ink }));
      return f;
    }
    function spacer(h) { return box('spacer', { w: 10, h }); }
    function divider() { const r = figma.createRectangle(); r.name = 'divider'; r.resize(330, 1); r.fills = paint(C.line); return r; }
    function checkIcon(size, bg, fg) {
      const f = box('check', { w: size, h: size, radius: size / 2, fill: bg });
      const s = size / 22;
      const v = figma.createVector();
      v.name = 'mark';
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
    function infoIcon() {
      const f = box('info', { dir: 'HORIZONTAL', w: 16, h: 16, radius: 8, justify: 'CENTER', align: 'CENTER' });
      f.strokes = paint(C.lgray);
      f.strokeWeight = 1.2;
      f.strokeAlign = 'INSIDE';
      f.appendChild(T('i', { w: 'Bold', size: 10, color: C.gray }));
      return f;
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
    function col(texts, gap) {
      const f = box('text', { dir: 'VERTICAL', gap: gap == null ? 4 : gap });
      for (const t of texts) add(f, t, true);
      return f;
    }

    // ---------- 로컬 컴포넌트 ----------
    const holder = box('와이어 컴포넌트', { dir: 'VERTICAL', gap: 32, pad: 40, fill: C.white });
    page.appendChild(holder);
    holder.x = 0; holder.y = 1116;
    holder.appendChild(T('와이어 컴포넌트', { w: 'Bold', size: 20 }));
    holder.appendChild(T('NEW = 노란 테두리 + badge/new. 나머지는 기존 은행 앱 화면 그대로', { size: 13, color: C.gray }));

    const comps = {};
    function prop(comp, node, key, type, def, field) {
      const k = comp.addComponentProperty(key, type, def);
      node.componentPropertyReferences = Object.assign({}, node.componentPropertyReferences, { [field]: k });
      return k;
    }

    {
      const c = figma.createComponent();
      c.name = 'nav/top';
      c.resize(W, 56);
      c.fills = paint(C.white);
      holder.appendChild(c);
      const b = chevron(); c.appendChild(b); b.x = 20; b.y = 21;
      const t = T('제목', { w: 'SemiBold', size: 17, align: 'CENTER', name: 'title' });
      c.appendChild(t);
      t.textAutoResize = 'NONE'; t.resize(290, 24); t.textAlignVertical = 'CENTER'; t.x = 56; t.y = 16;
      comps.nav = { node: c, keys: { title: prop(c, t, 'title', 'TEXT', '제목', 'characters') } };
    }
    function button(name, bg, fg) {
      const c = figma.createComponent();
      c.name = name;
      c.layoutMode = 'HORIZONTAL';
      c.primaryAxisAlignItems = 'CENTER';
      c.counterAxisAlignItems = 'CENTER';
      c.primaryAxisSizingMode = 'FIXED';
      c.counterAxisSizingMode = 'FIXED';
      c.resize(CW, 56);
      c.cornerRadius = 16;
      c.fills = paint(bg);
      holder.appendChild(c);
      const t = T('버튼', { w: 'SemiBold', size: 17, color: fg, name: 'label' });
      c.appendChild(t);
      return { node: c, keys: { label: prop(c, t, 'label', 'TEXT', '버튼', 'characters') } };
    }
    comps.primary = button('button/primary', C.navy, C.white);
    comps.secondary = button('button/secondary', C.card, C.ink);
    {
      const c = figma.createComponent();
      c.name = 'row/kv';
      c.layoutMode = 'HORIZONTAL';
      c.primaryAxisAlignItems = 'SPACE_BETWEEN';
      c.counterAxisAlignItems = 'CENTER';
      c.primaryAxisSizingMode = 'FIXED';
      c.counterAxisSizingMode = 'AUTO';
      c.paddingTop = c.paddingBottom = 4;
      c.fills = [];
      c.resize(330, 28);
      holder.appendChild(c);
      const left = box('left', { dir: 'HORIZONTAL', gap: 4, align: 'CENTER' });
      c.appendChild(left);
      const l = T('항목', { size: 15, color: C.gray, name: 'label' });
      left.appendChild(l);
      const info = infoIcon();
      left.appendChild(info);
      info.visible = false;
      const v = T('값', { w: 'Medium', size: 15, name: 'value' });
      c.appendChild(v);
      comps.row = {
        node: c,
        keys: {
          label: prop(c, l, 'label', 'TEXT', '항목', 'characters'),
          value: prop(c, v, 'value', 'TEXT', '값', 'characters'),
          info: prop(c, info, 'info', 'BOOLEAN', false, 'visible'),
        },
      };
    }
    {
      const c = figma.createComponent();
      c.name = 'item/check';
      c.layoutMode = 'HORIZONTAL';
      c.counterAxisAlignItems = 'CENTER';
      c.primaryAxisSizingMode = 'AUTO';
      c.counterAxisSizingMode = 'AUTO';
      c.itemSpacing = 8;
      c.fills = [];
      holder.appendChild(c);
      c.appendChild(checkIcon(22, C.navy, C.white));
      const t = T('확인 항목', { w: 'Medium', size: 15, name: 'label' });
      c.appendChild(t);
      comps.check = { node: c, keys: { label: prop(c, t, 'label', 'TEXT', '확인 항목', 'characters') } };
    }
    {
      const c = figma.createComponent();
      c.name = 'badge/new';
      c.layoutMode = 'HORIZONTAL';
      c.primaryAxisSizingMode = 'AUTO';
      c.counterAxisSizingMode = 'AUTO';
      c.paddingTop = c.paddingBottom = 3;
      c.paddingLeft = c.paddingRight = 8;
      c.cornerRadius = 10;
      c.fills = paint(C.yellow);
      holder.appendChild(c);
      c.appendChild(T('NEW', { w: 'Bold', size: 11 }));
      comps.badge = { node: c, keys: {} };
    }

    function I(comp, props) {
      const i = comp.node.createInstance();
      if (props) {
        const p = {};
        for (const k in props) p[comp.keys[k]] = props[k];
        i.setProperties(p);
      }
      return i;
    }
    const row = (label, value, info) => I(comps.row, info ? { label, value, info: true } : { label, value });
    function style(inst, name, o) {
      const t = inst.findOne((n) => n.name === name);
      if (o.color) t.fills = paint(o.color);
      if (o.w) t.fontName = { family: F, style: o.w };
      if (o.size) t.fontSize = o.size;
      return inst;
    }

    // ---------- 화면 틀 ----------
    function screen(code) {
      const ph = phones[code];
      const nodes = [];
      const put = (n, x, y) => { ph.appendChild(n); n.x = x; n.y = y; nodes.push(n); return n; };
      return {
        put,
        badge(c) { const b = I(comps.badge); put(b, c.x + c.width - b.width - 12, c.y - 10); },
        nav(title) { return put(I(comps.nav, { title }), 0, 47); },
        title(s, y) { const t = fixW(T(s, { w: 'Bold', size: 24, lh: 135 }), CW); put(t, 20, y || 115); return t.y + t.height; },
        primary(label) { return put(I(comps.primary, { label }), 20, BTN_Y); },
        finish() { const g = figma.group(nodes, ph, 0); g.name = `${code} 와이어`; return g; },
      };
    }

    // ---------- S1 사장님 홈 ----------
    {
      const s = screen('S1');
      s.put(T('홈', { w: 'Bold', size: 22 }), 20, 58);
      const p = pill('사장님');
      s.put(p, W - 20 - p.width, 61);
      const banner = box('이벤트 배너 자리', { dir: 'HORIZONTAL', w: CW, h: 120, radius: 16, fill: C.card, justify: 'CENTER', align: 'CENTER' });
      banner.appendChild(T('이벤트 배너', { size: 14, color: C.lgray }));
      s.put(banner, 20, 107);

      const k = card('NEW 외국인 직원 급여 진입 카드', { isNew: true, dir: 'HORIZONTAL', gap: 14, align: 'CENTER' });
      const ic = box('icon', { dir: 'HORIZONTAL', w: 44, h: 44, radius: 14, fill: C.navy, justify: 'CENTER', align: 'CENTER' });
      ic.appendChild(T('₩', { w: 'Bold', size: 20, color: C.white }));
      k.appendChild(ic);
      add(k, col([
        T('외국인 직원 급여', { w: 'SemiBold', size: 17 }),
        T('이체하면 모국어 명세서까지 자동으로', { size: 14, color: C.gray }),
        T('직원 3명, 다음 급여일 9월 25일', { w: 'Medium', size: 13, color: C.navy }),
      ]), true);
      k.appendChild(T('›', { size: 26, color: C.lgray }));
      s.put(k, 20, 251);
      s.badge(k);

      let y = k.y + k.height + 36;
      s.put(T('사장님 편의', { w: 'SemiBold', size: 17 }), 20, y);
      y += 40;
      ['거래처조회', '신용리포트', '근태관리', '더보기'].forEach((label, i) => {
        const cell = box('편의 ' + label, { dir: 'VERTICAL', gap: 8, w: 90, align: 'CENTER' });
        cell.appendChild(box('icon', { w: 52, h: 52, radius: 16, fill: C.card }));
        cell.appendChild(T(label, { size: 13, color: C.gray }));
        s.put(cell, 20 + i * (CW / 4), y);
      });

      const tab = box('하단 탭바 자리', { w: W, h: 84, fill: '#F9FAFB' });
      tab.strokes = paint(C.line);
      tab.strokeAlign = 'INSIDE';
      tab.strokeTopWeight = 1; tab.strokeBottomWeight = 0; tab.strokeLeftWeight = 0; tab.strokeRightWeight = 0;
      ['홈', '이체', '혜택', '전체'].forEach((label, i) => {
        const it = box('탭 ' + label, { dir: 'VERTICAL', gap: 4, w: W / 4, align: 'CENTER' });
        it.appendChild(box('icon', { w: 22, h: 22, radius: 6, fill: i === 0 ? C.ink : C.lgray }));
        it.appendChild(T(label, { w: 'Medium', size: 11, color: i === 0 ? C.ink : C.lgray }));
        tab.appendChild(it);
        it.x = i * (W / 4); it.y = 10;
      });
      s.put(tab, 0, BTN_Y);
      s.finish();
    }

    // ---------- S2 직원 등록 ----------
    {
      const s = screen('S2');
      s.nav('직원 등록');
      let y = s.title('외국인 직원을 등록해요') + 24;

      const k1 = card('직원 카드', { gap: 10 });
      add(k1, T('응우옌 반 A', { w: 'SemiBold', size: 17 }), true);
      const chips = box('chips', { dir: 'HORIZONTAL', gap: 6 });
      for (const c of ['베트남', '베트남어', 'E-9']) chips.appendChild(pill(c, { fill: C.white, color: C.gray }));
      k1.appendChild(chips);
      add(k1, row('급여 계좌', 'OO은행 1234'), true);
      s.put(k1, 20, y);
      y += k1.height + 20;

      const k2 = card('NEW 공제 템플릿', { isNew: true, gap: 4 });
      add(k2, T('공제 템플릿', { w: 'SemiBold', size: 16 }), true);
      k2.appendChild(spacer(4));
      add(k2, row('숙식비', '월 300,000원'), true);
      add(k2, row('4대보험', '자동 계산'), true);
      add(k2, style(row('서면 동의서', '업로드 완료'), 'value', { color: C.navy }), true);
      s.put(k2, 20, y);
      s.badge(k2);
      y += k2.height + 20;

      const k3 = card('사장이지 연동', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
      add(k3, col([
        T('사장이지 연동', { w: 'SemiBold', size: 16 }),
        T('출퇴근 기록과 급여 계산값을 불러와요', { size: 14, color: C.gray }),
      ]), true);
      k3.appendChild(toggle());
      s.put(k3, 20, y);

      s.primary('등록 완료');
      s.finish();
    }

    // ---------- S3 급여일 미리보기 ----------
    {
      const s = screen('S3');
      s.nav('9월 급여');
      s.put(pill('D-3', { fill: C.navy, color: C.white, w: 'Bold' }), 20, 113);
      let y = s.title('급여일까지 3일 남았어요', 149) + 24;

      const k1 = card('이번 달 급여', { gap: 6 });
      add(k1, T('이번 달 급여 (사장이지 계산)', { size: 14, color: C.gray }), true);
      add(k1, T('9,520,000원', { w: 'Bold', size: 28 }), true);
      add(k1, T('직원 3명', { size: 14, color: C.gray }), true);
      s.put(k1, 20, y);
      y += k1.height + 20;

      const k2 = card('NEW 잔액 부족 알림', { isNew: true, fill: C.lyellow, gap: 6 });
      add(k2, T('잔액이 1,200,000원 부족해요', { w: 'SemiBold', size: 17 }), true);
      add(k2, T('급여일 전에 사업자 운전자금으로 채울 수 있어요', { size: 14, lh: 145 }), true);
      k2.appendChild(spacer(6));
      const b = add(k2, I(comps.secondary, { label: '한도 확인하기' }), true);
      b.fills = paint(C.white);
      b.resize(b.width, 44);
      s.put(k2, 20, y);
      s.badge(k2);

      s.primary('급여 보내기');
      s.finish();
    }

    // ---------- S4 이체 확인 ----------
    {
      const s = screen('S4');
      s.nav('이체 확인');
      let y = s.title('3명에게 9,520,000원을 보낼게요') + 24;

      const k1 = card('받는 사람', { gap: 4 });
      add(k1, T('받는 사람', { size: 13, color: C.gray }), true);
      add(k1, row('응우옌 반 A', '2,380,000원'), true);
      add(k1, row('쩐 티 B', '2,420,000원'), true);
      add(k1, row('람 C', '4,720,000원'), true);
      s.put(k1, 20, y);
      y += k1.height + 20;

      const k2 = card('NEW 이체 전 점검 경고', { isNew: true, fill: C.lyellow, gap: 6 });
      add(k2, T('이체 전에 확인해 주세요', { w: 'SemiBold', size: 16 }), true);
      add(k2, T('응우옌 반 A의 숙식비 공제가 서면 동의 금액(300,000원)보다 많아요', { size: 14, lh: 145 }), true);
      add(k2, T('판정이 아닌 참고 알림이에요', { size: 12, color: C.gray }), true);
      s.put(k2, 20, y);
      s.badge(k2);
      y += k2.height + 24;

      s.put(I(comps.check, { label: '최저임금 확인 완료' }), 20, y);
      y += 22 + 18;
      const tr = box('명세서 함께 보내기', { dir: 'HORIZONTAL', w: CW, justify: 'SPACE_BETWEEN', align: 'CENTER' });
      tr.appendChild(T('명세서 함께 보내기', { w: 'Medium', size: 15 }));
      tr.appendChild(toggle());
      s.put(tr, 20, y);

      const b1 = s.put(I(comps.secondary, { label: '수정하기' }), 20, BTN_Y);
      b1.resize(140, 56);
      const b2 = s.put(I(comps.primary, { label: '그대로 보내기' }), 168, BTN_Y);
      b2.resize(214, 56);
      s.finish();
    }

    // ---------- S5 이체 완료 ----------
    {
      const s = screen('S5');
      s.put(checkIcon(72, C.navy, C.white), (W - 72) / 2, 140);
      s.put(fixW(T('9,520,000원', { w: 'Bold', size: 28, align: 'CENTER' }), CW), 20, 232);
      s.put(fixW(T('3명에게 보냈어요', { size: 16, color: C.gray, align: 'CENTER' }), CW), 20, 274);

      const k = card('NEW 명세서 발송', { isNew: true, gap: 4 });
      add(k, T('지급 확인 명세서를 보냈어요', { w: 'SemiBold', size: 16 }), true);
      k.appendChild(spacer(4));
      add(k, row('응우옌 반 A', '베트남어 카톡'), true);
      add(k, row('쩐 티 B', '베트남어 카톡'), true);
      add(k, row('람 C', '네팔어 카톡'), true);
      k.appendChild(spacer(6));
      add(k, divider(), true);
      k.appendChild(spacer(6));
      k.appendChild(style(I(comps.check, { label: '은행이 9월 25일 14:02 지급을 확인했어요' }), 'label', { size: 14 }));
      s.put(k, 20, 334);
      s.badge(k);

      s.primary('확인');
      s.finish();
    }

    // ---------- S6 급여 기록 ----------
    {
      const s = screen('S6');
      s.nav('급여 기록');
      let y = s.title('9월 급여, 모두 확인됐어요') + 24;

      const k1 = card('NEW 열람과 대조', { isNew: true, gap: 4 });
      add(k1, T('열람과 대조', { w: 'SemiBold', size: 16 }), true);
      k1.appendChild(spacer(4));
      add(k1, style(row('응우옌 반 A', '열람과 대조 완료'), 'value', { color: C.navy }), true);
      add(k1, style(row('쩐 티 B', '열람과 대조 완료'), 'value', { color: C.navy }), true);
      add(k1, style(row('람 C', '문의 1건'), 'value', { w: 'Bold' }), true);
      s.put(k1, 20, y);
      s.badge(k1);
      y += k1.height + 20;

      const k2 = card('람 C의 문의', { gap: 6 });
      add(k2, T('람 C의 문의', { size: 13, color: C.gray }), true);
      add(k2, T('“숙식비가 뭐예요?”', { w: 'SemiBold', size: 17 }), true);
      add(k2, T('네팔어에서 한국어로 번역됨', { size: 12, color: C.gray }), true);
      k2.appendChild(spacer(4));
      const b = add(k2, I(comps.secondary, { label: '답장하기' }), true);
      b.fills = paint(C.white);
      b.resize(b.width, 40);
      style(b, 'label', { size: 15 });
      s.put(k2, 20, y);
      y += k2.height + 20;

      const k3 = card('NEW 성실 지급 혜택', { isNew: true, dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
      add(k3, col([
        T('성실 지급 12개월째', { w: 'SemiBold', size: 16 }),
        T('사업자 대출 금리 우대 대상이에요', { size: 14, color: C.gray }),
      ]), true);
      k3.appendChild(T('혜택 보기 ›', { w: 'Medium', size: 14, color: C.navy }));
      s.put(k3, 20, y);
      s.badge(k3);

      s.primary('기록 PDF 내려받기');
      s.finish();
    }

    // ---------- E1 카카오톡 알림 ----------
    {
      const s = screen('E1');
      const bg = figma.createRectangle();
      bg.name = '카톡 배경';
      bg.resize(W, 874);
      bg.fills = paint(C.kakao);
      s.put(bg, 0, 0);
      const nav = s.nav('케이뱅크');
      nav.fills = [];
      nav.findOne((n) => n.name === 'title').textAlignHorizontal = 'LEFT';

      const date = pill('2026년 9월 25일 금요일', { fill: '#9DB2C5', color: C.white, w: 'Regular', size: 12 });
      s.put(date, (W - date.width) / 2, 115);

      const av = box('프로필', { dir: 'HORIZONTAL', w: 40, h: 40, radius: 14, fill: C.navy, justify: 'CENTER', align: 'CENTER' });
      av.appendChild(T('K', { w: 'Bold', size: 16, color: C.white }));
      s.put(av, 16, 160);
      s.put(T('케이뱅크', { size: 13, color: '#3D4A57' }), 64, 160);

      const bubble = box('NEW 모국어 알림톡 말풍선', { dir: 'VERTICAL', w: 270, radius: 14, fill: C.white, stroke: C.yellow, clip: true });
      const head = box('노란 머리', { dir: 'VERTICAL', pad: [14, 16], fill: C.yellow });
      add(head, T('Bảng lương tháng 9 đã đến', { w: 'Bold', size: 15 }), true);
      add(bubble, head, true);
      const body = box('본문', { dir: 'VERTICAL', gap: 6, pad: 16 });
      add(bubble, body, true);
      add(body, T('9월 급여명세서가 도착했어요', { size: 14, color: C.gray }), true);
      add(body, T('2,380,000원', { w: 'Bold', size: 22 }), true);
      body.appendChild(style(I(comps.check, { label: '입금 확인 완료' }), 'label', { size: 14 }));
      body.appendChild(spacer(6));
      const b = add(body, I(comps.secondary, { label: '명세서 보기' }), true);
      b.resize(b.width, 44);
      style(b, 'label', { size: 15 });
      s.put(bubble, 64, 182);
      s.badge(bubble);
      s.put(T('오후 2:02', { size: 11, color: '#556677' }), 64 + 270 + 6, bubble.y + bubble.height - 15);
      s.finish();
    }

    // ---------- E2 모국어 명세서 ----------
    {
      const s = screen('E2');
      s.put(T('Bảng lương tháng 9', { w: 'Bold', size: 20 }), 20, 60);
      const lang = pill('Tiếng Việt', { fill: C.card });
      s.put(lang, W - 20 - lang.width, 61);
      let y = 119;

      const k1 = card('NEW 입금 대조 결과', { isNew: true, gap: 6 });
      k1.appendChild(style(I(comps.check, { label: '명세서 금액과 입금액이 같아요' }), 'label', { w: 'SemiBold', size: 16 }));
      const d = col([
        T('Số tiền khớp', { w: 'Medium', size: 14, color: C.navy }),
        T('은행이 9월 25일 14:02 지급을 확인했어요', { size: 13, color: C.gray }),
      ]);
      d.name = 'detail';
      d.paddingLeft = 30;
      add(k1, d, true);
      s.put(k1, 20, y);
      s.badge(k1);
      y += k1.height + 20;

      const k2 = card('지급 명세', { gap: 4 });
      add(k2, T('지급 명세', { size: 13, color: C.gray }), true);
      add(k2, row('기본급', '2,600,000'), true);
      const food = add(k2, row('숙식비', '-150,000', true), true);
      add(k2, row('보험료', '-70,000', true), true);
      k2.appendChild(spacer(4));
      add(k2, divider(), true);
      k2.appendChild(spacer(4));
      add(k2, style(style(row('실수령', '2,380,000'), 'value', { w: 'Bold', size: 17 }), 'label', { w: 'SemiBold', color: C.ink }), true);
      // 숙식비 행만 연노랑으로 강조 (정렬이 흐트러지지 않게 행 뒤에 깐다)
      const hl = figma.createRectangle();
      hl.name = '숙식비 강조';
      hl.fills = paint(C.lyellow);
      hl.cornerRadius = 8;
      k2.insertChild(0, hl);
      hl.layoutPositioning = 'ABSOLUTE';
      hl.resize(CW - 16, food.height + 4);
      hl.x = 8;
      hl.y = food.y - 2;
      s.put(k2, 20, y);
      y += k2.height + 20;

      const k3 = card('NEW 공제 설명', { isNew: true, fill: C.lyellow, gap: 6 });
      add(k3, T('숙식비란?', { w: 'SemiBold', size: 15 }), true);
      add(k3, T('숙식비는 사장님이 제공한 숙소와 식사 비용이에요 (서면 동의 기준)', { size: 14, lh: 145 }), true);
      s.put(k3, 20, y);
      s.badge(k3);

      s.primary('사장님에게 문의하기');
      s.finish();
    }

    figma.closePlugin('와이어프레임 8장 완료 (S1~S6, E1~E2)');
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

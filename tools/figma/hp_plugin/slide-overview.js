// 덱 '사장님이 이체하면 명세서까지 만들어집니다' 슬라이드 (쪽번호 12) — 뒤 솔루션 장들을 먼저 요약하는 장
// 레퍼런스: Sign Up 여정 슬라이드. 가로 타임라인 위 다섯 단계(연결, 준비, 점검, 지급, 증명과 보상)마다
// 와이어 화면(S2, S3, S4, S5+E2)을 순서대로 놓고, 마지막 단계(S6)는 큰 화면 + 은행이 이미 가진 것(소프트 3D 아이콘).
// 각 단계에 그 가치를 자세히 다루는 뒤 장(① 점검, ② 대조, ③ 기록, ④ 모국어 설명)을 태그로 붙인다.
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
// 다시 실행하면 이전 결과는 숨기고 '(이전)'을 붙인다. 기존 요소는 지우지 않고 숨긴다.
(async () => {
  try {
    const F = 'Pretendard';
    const C = {
      navy: '#0B1F4F', navy2: '#3B4E7E', navy3: '#8C98B8', navy4: '#D9DEEA', ink: '#191F28', gray: '#6B7684',
      lgray: '#B0B8C1', card: '#F2F4F6', line: '#E5E8EB', yellow: '#FFE300', lyellow: '#FFF7C2', white: '#FFFFFF',
      kakao: '#B2C7D9', bg: '#F5F7FB',
    };
    const SLIDE_ID = '1:345';
    const TITLE_ID = '2021:138'; // '사장님이 이체하면 명세서까지 만들어집니다.' 제목
    const PAGE_NO = '2028:98'; // 쪽번호 (이 장은 팀원이 하단 바를 지웠다)
    const KEEP = [PAGE_NO];
    const GROUP = '솔루션 한눈에 장면';

    for (const s of ['Regular', 'Medium', 'SemiBold', 'Bold']) await figma.loadFontAsync({ family: F, style: s });

    // 슬라이드 이름은 팀원이 번호를 다시 매기며 바뀔 수 있어, ID와 제목 텍스트로 확인한다
    const slide = await figma.getNodeByIdAsync(SLIDE_ID);
    const title = slide && slide.children.find((c) => c.id === TITLE_ID);
    if (!slide || slide.type !== 'SLIDE' || !title || title.type !== 'TEXT' || !title.characters.startsWith('사장님이 이체하면')) {
      throw new Error(`슬라이드 ${SLIDE_ID}(사장님이 이체하면 명세서까지)를 찾지 못함`);
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

    const S2 = () => phone('S2 직원 등록', (u) => {
      u.nav('직원 등록');
      let y = u.title('외국인 직원을 등록해요') + 24;
      const k1 = card('직원 카드', { w: 362, gap: 10 });
      add(k1, T('응우옌 반 A', { w: 'SemiBold', size: 17 }), true);
      const chips = box('chips', { dir: 'HORIZONTAL', gap: 6 });
      for (const c of ['베트남', '베트남어', 'E-9']) chips.appendChild(pill(c, { fill: C.white, color: C.gray }));
      k1.appendChild(chips);
      add(k1, row('급여 계좌', 'OO은행 1234'), true);
      u.sp(k1, 20, y); y += k1.height + 20;
      const k2 = card('공제 템플릿', { w: 362, gap: 4, isNew: true });
      add(k2, T('공제 템플릿', { w: 'SemiBold', size: 16 }), true);
      k2.appendChild(spacer(4));
      add(k2, row('숙식비', '월 300,000원'), true);
      add(k2, row('4대보험', '자동 계산'), true);
      add(k2, row('서면 동의서', '업로드 완료', { vc: C.navy }), true);
      u.sp(k2, 20, y); u.badge(k2); y += k2.height + 20;
      const k3 = box('사장이지 연동', { dir: 'HORIZONTAL', gap: 12, pad: 16, w: 362, radius: 16, fill: C.card, align: 'CENTER' });
      const c3 = box('text', { dir: 'VERTICAL', gap: 4 });
      add(k3, c3, true);
      add(c3, T('사장이지 연동', { w: 'SemiBold', size: 16 }), true);
      add(c3, T('출퇴근 기록과 급여 계산값을 불러와요', { size: 14, color: C.gray }), true);
      k3.appendChild(toggle());
      u.sp(k3, 20, y);
      u.primary('등록 완료');
    });

    const S3 = () => phone('S3 급여일 미리보기', (u) => {
      u.nav('9월 급여');
      u.sp(pill('D-3', { fill: C.navy, color: C.white, w: 'Bold' }), 20, 113);
      let y = u.title('급여일까지 3일 남았어요', 149) + 24;
      const k1 = card('이번 달 급여', { w: 362, gap: 6 });
      add(k1, T('이번 달 급여 (사장이지 계산)', { size: 14, color: C.gray }), true);
      add(k1, T('9,520,000원', { w: 'Bold', size: 28 }), true);
      add(k1, T('직원 3명', { size: 14, color: C.gray }), true);
      u.sp(k1, 20, y); y += k1.height + 20;
      const k2 = card('잔액 부족 알림', { w: 362, gap: 6, isNew: true, fill: C.lyellow });
      add(k2, T('잔액이 1,200,000원 부족해요', { w: 'SemiBold', size: 17 }), true);
      add(k2, T('급여일 전에 사업자 운전자금으로 채울 수 있어요', { size: 14, lh: 145 }), true);
      k2.appendChild(spacer(6));
      add(k2, button('한도 확인하기', { fill: C.white, h: 44, size: 16 }), true);
      u.sp(k2, 20, y); u.badge(k2);
      u.primary('급여 보내기');
    });

    const S4 = () => phone('S4 이체 확인', (u) => {
      u.nav('이체 확인');
      let y = u.title('3명에게 9,520,000원을 보낼게요') + 24;
      const k1 = card('받는 사람', { w: 362, gap: 4 });
      add(k1, T('받는 사람', { size: 13, color: C.gray }), true);
      add(k1, row('응우옌 반 A', '2,380,000원'), true);
      add(k1, row('쩐 티 B', '2,420,000원'), true);
      add(k1, row('람 C', '4,720,000원'), true);
      u.sp(k1, 20, y); y += k1.height + 20;
      const k2 = card('이체 전 점검 경고', { w: 362, gap: 6, isNew: true, fill: C.lyellow });
      add(k2, T('이체 전에 확인해 주세요', { w: 'SemiBold', size: 16 }), true);
      add(k2, T('응우옌 반 A의 숙식비 공제가 서면 동의 금액(300,000원)보다 많아요', { size: 14, lh: 145 }), true);
      add(k2, T('판정이 아닌 참고 알림이에요', { size: 12, color: C.gray }), true);
      u.sp(k2, 20, y); u.badge(k2); y += k2.height + 24;
      u.sp(checkRow('최저임금 확인 완료'), 20, y); y += 40;
      const tg = box('명세서 함께 보내기', { dir: 'HORIZONTAL', w: 362, justify: 'SPACE_BETWEEN', align: 'CENTER' });
      tg.appendChild(T('명세서 함께 보내기', { w: 'Medium', size: 15 }));
      tg.appendChild(toggle());
      u.sp(tg, 20, y);
      u.sp(wideButton('수정하기', 140, false), 20, 790);
      u.sp(wideButton('그대로 보내기', 214, true), 168, 790);
    });

    const S5 = () => phone('S5 이체 완료', (u) => {
      u.sp(checkIcon(72, C.navy, C.white), 165, 140);
      u.sp(fixW(T('9,520,000원', { w: 'Bold', size: 28, align: 'CENTER' }), 362), 20, 232);
      u.sp(fixW(T('3명에게 보냈어요', { size: 16, color: C.gray, align: 'CENTER' }), 362), 20, 274);
      const k = card('명세서 발송', { w: 362, gap: 4, isNew: true });
      add(k, T('지급 확인 명세서를 보냈어요', { w: 'SemiBold', size: 16 }), true);
      k.appendChild(spacer(4));
      add(k, row('응우옌 반 A', '베트남어 카톡'), true);
      add(k, row('쩐 티 B', '베트남어 카톡'), true);
      add(k, row('람 C', '네팔어 카톡'), true);
      k.appendChild(spacer(6));
      add(k, divider(), true);
      k.appendChild(spacer(6));
      k.appendChild(checkRow('은행이 9월 25일 14:02 지급을 확인했어요', { size: 14 }));
      u.sp(k, 20, 334); u.badge(k);
      u.primary('확인');
    });

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

    const S6 = () => phone('S6 급여 기록', (u) => {
      u.nav('급여 기록');
      let y = u.title('9월 급여, 모두 확인됐어요') + 24;
      const k1 = card('열람과 대조', { w: 362, gap: 4, isNew: true });
      add(k1, T('열람과 대조', { w: 'SemiBold', size: 16 }), true);
      k1.appendChild(spacer(4));
      add(k1, row('응우옌 반 A', '열람과 대조 완료', { vc: C.navy }), true);
      add(k1, row('쩐 티 B', '열람과 대조 완료', { vc: C.navy }), true);
      add(k1, row('람 C', '문의 1건', { vw: 'Bold' }), true);
      u.sp(k1, 20, y); u.badge(k1); y += k1.height + 20;
      const k2 = card('람 C의 문의', { w: 362, gap: 6 });
      add(k2, T('람 C의 문의', { size: 13, color: C.gray }), true);
      add(k2, T('“숙식비가 뭐예요?”', { w: 'SemiBold', size: 17 }), true);
      add(k2, T('네팔어에서 한국어로 번역됨', { size: 12, color: C.gray }), true);
      k2.appendChild(spacer(4));
      add(k2, button('답장하기', { fill: C.white, h: 40, size: 15 }), true);
      u.sp(k2, 20, y); y += k2.height + 20;
      const k3 = box('성실 지급 혜택', { dir: 'HORIZONTAL', gap: 12, pad: 16, w: 362, radius: 16, fill: C.white, align: 'CENTER', stroke: C.yellow, clip: true });
      const c3 = box('text', { dir: 'VERTICAL', gap: 4 });
      add(k3, c3, true);
      add(c3, T('성실 지급 12개월째', { w: 'SemiBold', size: 16 }), true);
      add(c3, T('사업자 대출 금리 우대 대상이에요', { size: 14, color: C.gray }), true);
      k3.appendChild(T('혜택 보기 ›', { w: 'Medium', size: 14, color: C.navy }));
      u.sp(k3, 20, y); u.badge(k3);
      u.primary('기록 PDF 내려받기');
    });

    // ---------- 배경과 제목 ----------
    const bg = figma.createRectangle(); bg.name = '배경'; bg.resize(1920, 1080); bg.fills = paint(C.bg);
    put(bg, 0, 0);
    put(T('솔루션 한눈에', { w: 'SemiBold', size: 20, color: C.navy2 }), 120, 104);
    put(fixW(T('사장님이 이체하면\n명세서까지 만들어집니다', { w: 'Bold', size: 48, color: C.navy, lh: 130 }), 760), 120, 140);
    put(fixW(T('사장님이 급여를 이체하기 직전에 점검하고, 실제 이체 기록으로 지급이 확인된 명세서가 만들어지며, 직원은 받은 명세서와 실제 입금을 바로 대조합니다.', { size: 19, color: C.ink, lh: 160 }), 720), 1080, 148);
    {
      // 범례: 노란 테두리 = 새로 만드는 부분 / 둥근 아이콘 = 은행이 이미 가진 것
      const lg = box('범례', { dir: 'HORIZONTAL', gap: 28, align: 'CENTER' });
      const a = box('범례 새로', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
      const sw = box('노란 테두리', { w: 22, h: 16, radius: 4, fill: C.white, stroke: C.yellow });
      a.appendChild(sw);
      a.appendChild(T('노란 테두리는 새로 만드는 부분', { size: 15, color: C.gray }));
      const b = box('범례 이미', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
      const o = figma.createEllipse(); o.resize(18, 18); o.fills = paint(C.navy4); b.appendChild(o);
      b.appendChild(T('둥근 아이콘은 은행이 이미 가진 것', { size: 15, color: C.gray }));
      lg.appendChild(a); lg.appendChild(b);
      put(lg, 1080, 246);
    }

    // ---------- 타임라인 ----------
    const LINE_Y = 352;
    const TH = 0.5; // 작은 화면 배율
    const thumbW = 426 * TH;
    const cols = [
      { x: 120, w: thumbW, n: '01', name: '연결', when: '처음 한 번', value: '직원과 공제 템플릿을\n한 번만 등록', tags: [], screens: [S2] },
      { x: 375, w: thumbW, n: '02', name: '준비', when: '급여일 전', value: '잔액이 모자라면 미리 알리고\n운전자금으로 채워요', tags: [], screens: [S3] },
      { x: 630, w: thumbW, n: '03', name: '점검', when: '이체 직전', value: '최저임금과 숙식비 한도를\n보내기 전에 점검', tags: ['① 이체 전 점검'], screens: [S4] },
      { x: 885, w: 360, n: '04', name: '지급', when: '이체 순간', value: '모국어 명세서가 카톡으로 가고\n직원은 입금과 바로 대조', tags: ['② 입금 대조', '④ 모국어 설명'], screens: [S5, E2] },
      { x: 1290, w: 426 * 0.72, n: '05', name: '증명과 보상', when: '이후', value: '지급과 교부 기록이 증빙이 되고\n성실 지급은 대출 우대로', tags: ['③ 교부 기록'], screens: [S6], hero: true },
    ];
    const cx = (c) => c.x + c.w / 2;
    const line = figma.createRectangle(); line.name = '타임라인'; line.resize(cx(cols[4]) - 120, 2); line.fills = paint(C.navy4);
    put(line, 120, LINE_Y - 1);
    const active = figma.createRectangle(); active.name = '타임라인 진행'; active.resize(cx(cols[4]) - cx(cols[0]), 2); active.fills = paint(C.navy);
    put(active, cx(cols[0]), LINE_Y - 1);

    for (const c of cols) {
      const x0 = cx(c);
      if (c.hero) {
        const st = figma.createStar(); st.name = '마지막 단계'; st.pointCount = 10; st.innerRadius = 0.62; st.resize(40, 40); st.fills = paint(C.yellow);
        put(st, x0 - 20, LINE_Y - 20);
      } else {
        const halo = figma.createEllipse(); halo.name = '단계 점 바깥'; halo.resize(24, 24); halo.fills = paint(C.navy4); put(halo, x0 - 12, LINE_Y - 12);
        const d = figma.createEllipse(); d.name = '단계 점'; d.resize(12, 12); d.fills = paint(C.navy); put(d, x0 - 6, LINE_Y - 6);
      }
      // 단계 이름과 가치
      const head = box('단계 ' + c.n, { dir: 'VERTICAL', gap: 6, w: c.w, align: 'CENTER' });
      const nm = box('이름', { dir: 'HORIZONTAL', gap: 6, align: 'CENTER' });
      nm.appendChild(T(c.n, { w: 'Bold', size: 15, color: c.hero ? C.navy : C.navy3 }));
      nm.appendChild(T(c.name, { w: 'Bold', size: c.hero ? 20 : 18, color: C.navy }));
      nm.appendChild(T(c.when, { size: 14, color: C.gray }));
      head.appendChild(nm);
      add(head, T(c.value, { size: 15, color: C.ink, lh: 145, align: 'CENTER' }), true);
      if (c.tags.length) {
        const tg = box('뒤 장', { dir: 'HORIZONTAL', gap: 6 });
        for (const t of c.tags) tg.appendChild(pill(t, { fill: C.yellow, color: C.navy, w: 'SemiBold', size: 12, pv: 4, ph: 10 }));
        head.appendChild(tg);
      }
      put(head, c.x, LINE_Y + 26);
    }

    // 작은 화면들
    const THUMB_Y = 506;
    for (const c of cols.slice(0, 4)) {
      c.screens.forEach((mk, i) => {
        const p = mk();
        p.rescale(TH);
        put(p, c.x + i * 147, THUMB_Y + i * 36);
      });
    }

    // 마지막 단계: 큰 화면 (아래는 하단 바 위에서 잘림)
    {
      const c = cols[4];
      const clipF = box('큰 화면 영역', { w: 400, h: 1080 - THUMB_Y + 10, clip: true });
      put(clipF, c.x - 40, THUMB_Y - 10);
      const p = S6();
      p.rescale(0.72);
      clipF.appendChild(p);
      p.x = 40; p.y = 10;
    }

    // 은행이 이미 가진 것: 소프트 3D 아이콘 (흰색 → 연한 네이비 그라데이션, 옅은 그림자, 원형 배지)
    {
      function soft(name, glyph) {
        const f = box(name, { w: 92, h: 92, radius: 46 });
        f.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]], gradientStops: [
          { position: 0, color: Object.assign(rgb(C.white), { a: 1 }) },
          { position: 1, color: Object.assign(rgb(C.navy4), { a: 1 }) },
        ] }];
        f.effects = shadow(0.18, 14, 28);
        f.appendChild(glyph);
        glyph.x = (92 - glyph.width) / 2; glyph.y = (92 - glyph.height) / 2;
        const ok = checkIcon(26, C.navy, C.white);
        ok.strokes = paint(C.white); ok.strokeWeight = 3; ok.strokeAlign = 'OUTSIDE';
        return { f, ok };
      }
      const won = T('₩', { w: 'Bold', size: 38, color: C.navy });
      const talk = box('말풍선', { w: 46, h: 40 });
      { const e = figma.createEllipse(); e.resize(46, 34); e.fills = paint(C.navy); talk.appendChild(e);
        const tl = figma.createVector(); tl.vectorPaths = [{ windingRule: 'NONZERO', data: 'M 0 0 L 12 0 L 2 10 Z' }]; tl.fills = paint(C.navy); talk.appendChild(tl); tl.x = 10; tl.y = 28; }
      const globe = box('지구', { w: 42, h: 42 });
      { const o = figma.createEllipse(); o.resize(42, 42); o.fills = []; o.strokes = paint(C.navy); o.strokeWeight = 3; globe.appendChild(o);
        const m = figma.createEllipse(); m.resize(18, 42); m.fills = []; m.strokes = paint(C.navy); m.strokeWeight = 2.5; globe.appendChild(m); m.x = 12;
        const h = figma.createRectangle(); h.resize(42, 2.5); h.fills = paint(C.navy); globe.appendChild(h); h.y = 20; }

      const items = [
        ['사업자 계좌', '급여 이체와 거래내역 데이터', won, 1676, 540],
        ['카카오톡', '알림톡으로 직원에게 전달', talk, 1676, 704],
        ['해외송금', '외국인 직원의 본국 송금 연계', globe, 1676, 868],
      ];
      const hdr = pill('은행이 이미 가진 것', { fill: C.white, color: C.navy2, w: 'SemiBold', size: 13 });
      put(hdr, 1722 - hdr.width / 2, 492);
      for (const [nm, desc, g, x, y] of items) {
        const { f, ok } = soft('아이콘 ' + nm, g);
        put(f, x, y);
        put(ok, x + 70, y - 2);
        const lab = box('라벨 ' + nm, { dir: 'VERTICAL', gap: 2, w: 200, align: 'CENTER' });
        lab.appendChild(T(nm, { w: 'Bold', size: 16, color: C.navy }));
        lab.appendChild(T(desc, { size: 13, color: C.gray }));
        put(lab, x + 46 - 100, y + 100);
      }
    }

    // 쪽번호가 배경 위에 보이도록 쪽번호 바로 아래에 넣는다
    const pageNo = slide.children.find((c) => c.id === PAGE_NO);
    const g = figma.group(nodes, slide, pageNo ? slide.children.indexOf(pageNo) : slide.children.length);
    g.name = GROUP;
    figma.closePlugin('솔루션 한눈에 슬라이드 수정 완료');
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

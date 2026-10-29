// 덱 ③ 지급 확인과 교부 기록 슬라이드 (쪽번호 16) — ② 입금 대조(slide36.js)와 같은 틀
// 왼쪽 네이비 패널: 분쟁이 생기면 어떻게 되는지 플로우 차트 / 오른쪽: 문서 목업(9월 교부 기록) + 확대 카드 + 콜아웃.
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
    const SLIDE_ID = '1:418';
    const TITLE_ID = '2029:72'; // '③ 은행이 지급과 교부 사실을 기록해…' 제목
    const KEEP = ['2028:102', '1:419']; // 쪽번호, 하단 바
    const GROUP = '③ 교부 기록 장면';

    for (const s of ['Regular', 'Medium', 'SemiBold', 'Bold']) await figma.loadFontAsync({ family: F, style: s });

    // 슬라이드 이름은 팀원이 번호를 다시 매기며 바뀔 수 있어, ID와 제목 텍스트로 확인한다
    const slide = await figma.getNodeByIdAsync(SLIDE_ID);
    const title = slide && slide.children.find((c) => c.id === TITLE_ID);
    if (!slide || slide.type !== 'SLIDE' || !title || title.type !== 'TEXT' || !title.characters.startsWith('③ 은행이')) {
      throw new Error(`슬라이드 ${SLIDE_ID}(③ 교부 기록)를 찾지 못함`);
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

    function vec(name, data, o = {}) {
      const v = figma.createVector();
      v.name = name;
      v.vectorPaths = [{ windingRule: o.fill ? 'NONZERO' : 'NONE', data }];
      v.fills = o.fill ? paint(o.fill) : [];
      v.strokes = o.stroke ? paint(o.stroke) : [];
      if (o.stroke) { v.strokeWeight = o.sw || 2; v.strokeCap = 'ROUND'; v.strokeJoin = 'ROUND'; }
      if (o.dash) v.dashPattern = o.dash;
      return v;
    }
    // 아래로 내려가는 화살표: (x, y1) → (x, y2), 끝에 삼각형
    function arrowDown(x, y1, y2) {
      put(vec('flow line', `M 0 0 L 0 ${y2 - y1 - 8}`, { stroke: C.navy3, sw: 2 }), x, y1);
      put(vec('flow head', 'M 0 0 L 12 0 L 6 9 Z', { fill: C.navy3 }), x - 6, y2 - 9);
    }

    // ---------- 왼쪽: 분쟁이 생기면 (플로우 차트) ----------
    {
      const LX = 90, LW = 440;
      const panel = box('플로우 패널', { w: 620, h: 1046, fill: C.navy });
      put(panel, 0, 0);
      put(pill('분쟁이 생기면', { fill: C.yellow, color: C.navy, w: 'Bold', size: 16, pv: 6, ph: 14 }), LX, 120);
      put(fixW(T('말이 아니라\n기록으로 답해요', { w: 'Bold', size: 40, color: C.white, lh: 135 }), LW), LX, 172);

      // 노드 스타일: event(점선, 일어난 일) / step(은행 앱에서 하는 일, 번호) / end(결과, 노랑)
      function node(kind, title, sub, w, num) {
        const isEnd = kind === 'end';
        const f = box('노드 ' + title, {
          dir: 'HORIZONTAL', gap: 12, align: 'CENTER', pad: [16, 18], w, radius: 16,
          fill: kind === 'step' ? C.navy2 : (isEnd ? C.yellow : null),
        });
        if (kind === 'event') { f.strokes = paint(C.navy3); f.strokeWeight = 1.5; f.strokeAlign = 'INSIDE'; f.dashPattern = [6, 5]; }
        if (num) {
          const n = box('번호', { dir: 'HORIZONTAL', w: 28, h: 28, radius: 14, fill: C.yellow, justify: 'CENTER', align: 'CENTER' });
          n.appendChild(T(String(num), { w: 'Bold', size: 15, color: C.navy }));
          f.appendChild(n);
        }
        const c = box('text', { dir: 'VERTICAL', gap: 3 });
        add(f, c, true);
        add(c, T(title, { w: isEnd ? 'Bold' : 'SemiBold', size: 18, color: isEnd ? C.navy : C.white, align: isEnd ? 'CENTER' : 'LEFT' }), true);
        if (sub) add(c, T(sub, { size: 15, color: isEnd ? C.navy2 : C.navy4, align: isEnd ? 'CENTER' : 'LEFT' }), true);
        return f;
      }

      const cx = LX + LW / 2;
      let y = 336;
      const a = put(node('event', '직원이 “덜 받았다”고 해요', '9월 급여에 이의를 제기', LW), LX, y);
      y += a.height;
      arrowDown(cx, y + 8, y + 72); y += 80;
      const b = put(node('step', '교부 기록 조회', '은행 앱에서 9월 기록을 열어요', LW, 1), LX, y);
      y += b.height;
      arrowDown(cx, y + 8, y + 72); y += 80;
      const c = put(node('step', '필요한 기간만 골라 PDF로', '지급, 발송, 열람, 대조가 한 장에', LW, 2), LX, y);
      y += c.height;

      // 두 갈래로 나뉘는 연결선
      const DW = (LW - 16) / 2;
      const d1x = LX + DW / 2, d2x = LX + DW + 16 + DW / 2;
      put(vec('flow split', `M ${cx - d1x} 0 L ${cx - d1x} 30 M 0 30 L ${d2x - d1x} 30 M 0 30 L 0 63 M ${d2x - d1x} 30 L ${d2x - d1x} 63`, { stroke: C.navy3, sw: 2 }), d1x, y + 8);
      put(vec('flow head', 'M 0 0 L 12 0 L 6 9 Z', { fill: C.navy3 }), d1x - 6, y + 80 - 9);
      put(vec('flow head', 'M 0 0 L 12 0 L 6 9 Z', { fill: C.navy3 }), d2x - 6, y + 80 - 9);
      y += 80;
      const d1 = put(node('end', '노무사에게 제출', '상담과 조정 자료로', DW), LX, y);
      const d2 = put(node('end', '교부 의무 이행', '명세서를 줬다는 증빙', DW), LX + DW + 16, y);
      y += Math.max(d1.height, d2.height) + 40;

      put(fixW(T('은행은 이체 사실과 교부 사실을 확인할 뿐, 명세서 내용의 정확성은 사장님 입력을 따릅니다. [ 법률 검토 필요 ]', { size: 14, color: C.navy3, lh: 150 }), LW), LX, y);
    }

    // ---------- 오른쪽: 제목 ----------
    put(T('③ 지급 확인과 교부 기록', { w: 'SemiBold', size: 20, color: C.navy2 }), 720, 110);
    put(fixW(T('보낸 사실이\n그대로 증빙으로 남아요', { w: 'Bold', size: 46, color: C.navy, lh: 132 }), 560), 720, 146);
    put(fixW(T('은행이 실제 지급 사실을 확인하고, 언제 누구에게 보냈는지 함께 남깁니다.', { size: 17, color: C.gray, lh: 150 }), 540), 720, 283);

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

    // ---------- 문서 목업 (9월 교부 기록) ----------
    {
      const lab = box('문서 라벨', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
      lab.appendChild(dot());
      lab.appendChild(T('은행이 확인한 지급과 교부를 한 장에', { w: 'Medium', size: 18 }));
      put(lab, 740, 372);

      const back = box('문서 배경', { w: 540, h: 600, radius: 48, fill: C.bg, clip: true });
      put(back, 720, 420);

      const PW = 440, PH = 640;
      // 겹친 종이 (뒷장)
      const under = box('뒷장', { w: PW, h: PH, radius: 6, fill: '#F7F8FB' });
      under.effects = shadow(0.08, 6, 20);
      back.appendChild(under);
      under.x = 58; under.y = 52;
      under.rotation = 3;

      const doc = box('9월 교부 기록', { w: PW, h: PH, radius: 6, fill: C.white, clip: true });
      doc.effects = shadow(0.12, 10, 30);
      back.appendChild(doc);
      doc.x = 50; doc.y = 40;
      const dp = (n, x, y) => { doc.appendChild(n); n.x = x; n.y = y; return n; };
      const M = 32, IW = PW - M * 2;

      dp(T('9월 교부 기록', { w: 'Bold', size: 22 }), M, 34);
      const no = T('기록 번호 KB-20260925-000123', { size: 11, color: C.gray });
      dp(no, PW - M - no.width, 44);
      const bar = figma.createRectangle(); bar.resize(IW, 2); bar.fills = paint(C.navy); dp(bar, M, 76);

      dp(T('지급 확인서', { w: 'SemiBold', size: 15 }), M, 94);
      let yy = 124;
      for (const [k, v] of [['성명', '응우옌 반 A'], ['사업장명', 'OO식당'], ['지급액', '2,380,000원'], ['교부 일시', '2026.09.25 14:02']]) {
        dp(T(k, { size: 13, color: C.gray }), M, yy + 7);
        dp(T(v, { w: 'Medium', size: 13 }), M + 90, yy + 7);
        const l = figma.createRectangle(); l.resize(IW, 1); l.fills = paint(C.line); dp(l, M, yy + 30);
        yy += 31;
      }

      // 은행 지급 확인 도장
      const stamp = box('지급 확인 도장', { dir: 'VERTICAL', w: 92, h: 92, radius: 46, justify: 'CENTER', align: 'CENTER', gap: 1 });
      stamp.strokes = paint(C.navy);
      stamp.strokeWeight = 3;
      stamp.strokeAlign = 'INSIDE';
      stamp.appendChild(T('은행', { w: 'Bold', size: 12, color: C.navy }));
      stamp.appendChild(T('지급 확인', { w: 'Bold', size: 15, color: C.navy }));
      stamp.appendChild(T('09.25', { w: 'Medium', size: 11, color: C.navy }));
      dp(stamp, 300, 140);
      stamp.rotation = 12;
      stamp.opacity = 0.9;

      yy += 26;
      dp(T('발송과 열람 이력', { w: 'SemiBold', size: 15 }), M, yy);
      yy += 32;
      const cols = [M, M + 92, M + 210, M + 304];
      ['항목', '확인 내용', '일시', '기록'].forEach((h, i) => dp(T(h, { size: 12, color: C.gray }), cols[i], yy));
      yy += 22;
      const hl0 = figma.createRectangle(); hl0.resize(IW, 2); hl0.fills = paint(C.ink); dp(hl0, M, yy);
      yy += 2;
      const rows = [
        ['명세서 발송', '카카오톡 알림톡', '09.25 14:02', '발송 완료'],
        ['직원 열람', '베트남어', '09.25 18:40', '열람 확인'],
        ['입금 대조', '일치', '09.25 18:41', '대조 완료'],
      ];
      rows.forEach((r, ri) => {
        if (ri === 1) {
          const h = figma.createRectangle(); h.resize(IW, 34); h.fills = paint(C.lyellow); dp(h, M, yy);
        }
        r.forEach((cell, i) => dp(T(cell, { w: i === 3 ? 'SemiBold' : (i === 0 ? 'Medium' : 'Regular'), size: 13, color: i === 3 ? C.navy : C.ink }), cols[i], yy + 9));
        const l = figma.createRectangle(); l.resize(IW, 1); l.fills = paint(C.line); dp(l, M, yy + 34);
        yy += 35;
      });

      // 하단: 안내와 QR 자리
      yy += 28;
      dp(fixW(T('이 기록은 은행이 확인한 이체와 발송 사실을 기준으로 합니다.', { size: 11, color: C.gray, lh: 150 }), 290), M, yy + 8);
      const qr = box('QR', { w: 56, h: 56, fill: C.white });
      qr.strokes = paint(C.ink); qr.strokeWeight = 1; qr.strokeAlign = 'INSIDE';
      for (const [qx, qy] of [[4, 4], [36, 4], [4, 36]]) {
        const s = figma.createRectangle(); s.resize(16, 16); s.fills = paint(C.ink); qr.appendChild(s); s.x = qx; s.y = qy;
      }
      for (const [qx, qy] of [[26, 26], [38, 30], [28, 40], [42, 44], [24, 10]]) {
        const s = figma.createRectangle(); s.resize(6, 6); s.fills = paint(C.ink); qr.appendChild(s); s.x = qx; s.y = qy;
      }
      dp(qr, PW - M - 56, yy);
    }

    // ---------- 오른쪽 열: 확대 카드 3장 + 콜아웃 ----------
    const COL_X = 1272, COL_W = 400;
    let y = 352;
    {
      // 1) 기록에 남는 것
      const k = card('기록에 남는 것', { w: COL_W, pad: 24, gap: 12, radius: 28, fill: C.white });
      k.effects = shadow(0.12, 12, 40);
      add(k, T('기록에 남는 것', { size: 13, color: C.gray }), true);
      for (const [label, desc] of [
        ['지급', '은행이 확인한 이체 일시와 금액'],
        ['발송', '언제, 어떤 방법으로 보냈는지'],
        ['열람', '직원이 언제 확인했는지'],
        ['대조', '입금액과 일치했는지'],
      ]) {
        const r = box('기록 ' + label, { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
        r.appendChild(checkIcon(22, C.navy, C.white));
        r.appendChild(T(label, { w: 'SemiBold', size: 15 }));
        add(r, T(desc, { size: 14, color: C.gray }), true);
        add(k, r, true);
      }
      put(k, COL_X, y);
      callout(COL_X + COL_W, y + k.height / 2, '지급부터 대조까지\n네 가지가 남아요', 26);
      y += k.height + 18;
    }
    {
      // 2) 열람 이력 확대
      const k = card('열람 이력 확대', { w: COL_W, pad: 24, gap: 10, radius: 28, fill: C.white });
      k.effects = shadow(0.12, 12, 40);
      add(k, T('발송과 열람 이력', { size: 13, color: C.gray }), true);
      const r = box('직원 열람 행', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER', pad: [12, 14], radius: 12, fill: C.lyellow });
      r.strokes = paint(C.yellow); r.strokeWeight = 2; r.strokeAlign = 'INSIDE';
      add(r, T('직원 열람', { w: 'SemiBold', size: 15 }), true);
      r.appendChild(T('베트남어', { size: 14, color: C.gray }));
      r.appendChild(T('09.25 18:40', { w: 'Medium', size: 14 }));
      add(k, r, true);
      put(k, COL_X, y);
      callout(COL_X + COL_W, y + k.height / 2, '직원이 읽은 시각까지\n기록돼요', 26);
      y += k.height + 18;
    }
    {
      // 3) 기간 골라 PDF
      const k = card('PDF 내려받기', { w: COL_W, pad: 24, gap: 10, radius: 28, fill: C.white });
      k.effects = shadow(0.12, 12, 40);
      add(k, T('교부 기록 내려받기', { size: 13, color: C.gray }), true);
      const per = box('기간', { dir: 'HORIZONTAL', justify: 'SPACE_BETWEEN', align: 'CENTER', pad: [12, 14], radius: 12, fill: C.card });
      per.appendChild(T('기간', { size: 14, color: C.gray }));
      per.appendChild(T('2026.07 ~ 2026.09', { w: 'SemiBold', size: 15 }));
      add(k, per, true);
      add(k, button('PDF로 내려받기', { primary: true, h: 48, size: 16, radius: 12 }), true);
      put(k, COL_X, y);
      callout(COL_X + COL_W, y + k.height / 2, '필요한 기간만\nPDF로 제출', 26);
      y += k.height;
    }
    if (y > 1030) throw new Error('오른쪽 열이 하단 바와 겹침: ' + Math.round(y));

    const g = figma.group(nodes, slide);
    g.name = GROUP;
    figma.closePlugin('③ 교부 기록 슬라이드 수정 완료');
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

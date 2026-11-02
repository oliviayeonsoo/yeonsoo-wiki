// 덱 22번 슬라이드 "직접 현장에 물어봤어요" — 현장 PoC 테스트 결과를 담을 빈 레이아웃.
// 레퍼런스(image 33)의 구도를 따른다: 왼쪽 위 개요 문단, 왼쪽 아래 도넛 카드 2장, 오른쪽 반응 막대 3개와 캐릭터 2명, 오른쪽 아래 각주.
// 내용은 모두 [ ] 빈칸. 결과가 나오면 글자와 도넛 링의 endingAngle만 바꾸면 된다.
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
(async () => {
  try {
    const SLIDE = '2380:164';
    const TITLE = '2380:167';
    const SUBTITLE = '2380:168';
    const REF = '2389:130';
    const OWNER_IMG = '2239:128'; // 마지막 장의 사장님 캐릭터
    const WORKER_IMG = '2239:129'; // 마지막 장의 직원 캐릭터
    const GROUP = '현장 반응 레이아웃 (내용 비움)';

    const F = 'Pretendard';
    for (const s of ['Regular', 'Medium', 'SemiBold', 'Bold']) await figma.loadFontAsync({ family: F, style: s });

    const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
    const BLUE = rgb('#0114A7'), NAVY = rgb('#0B1F4F'), INK = rgb('#1E1E1E'), BODY = rgb('#4E5968');
    const GRAY = rgb('#9AA1AC'), PALE = rgb('#E6E9F7'), WHITE = rgb('#FFFFFF');

    const S = await figma.getNodeByIdAsync(SLIDE);
    if (!S) throw new Error('22번 슬라이드를 찾지 못함: ' + SLIDE);
    if (S.children.some((n) => n.name === GROUP && n.visible)) {
      figma.closePlugin('이미 레이아웃이 있어요. 다시 만들려면 기존 그룹을 숨긴 뒤 실행하세요.');
      return;
    }

    // 슬라이드에서는 appendChild 다음에 x, y를 정해야 좌표가 어긋나지 않는다
    function T(style, size, color, chars, x, y, w, align, lh) {
      const t = figma.createText();
      S.appendChild(t);
      t.fontName = { family: F, style };
      t.fontSize = size;
      t.characters = chars;
      t.fills = [{ type: 'SOLID', color }];
      if (lh) t.lineHeight = { unit: 'PERCENT', value: lh };
      if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); }
      t.textAlignHorizontal = align || 'LEFT';
      t.x = x; t.y = y;
      return t;
    }
    function R(x, y, w, h, fill, radius, stroke) {
      const n = figma.createRectangle();
      S.appendChild(n);
      n.resize(w, h);
      n.fills = fill ? [{ type: 'SOLID', color: fill }] : [];
      n.cornerRadius = radius || 0;
      if (stroke) { n.strokes = [{ type: 'SOLID', color: stroke }]; n.strokeWeight = 2; n.strokeAlign = 'INSIDE'; }
      n.x = x; n.y = y;
      return n;
    }
    function ring(cx, cy, d, ratio) {
      const track = figma.createEllipse();
      S.appendChild(track);
      track.resize(d, d);
      track.fills = [{ type: 'SOLID', color: PALE }];
      track.arcData = { startingAngle: 0, endingAngle: 2 * Math.PI, innerRadius: 0.84 };
      track.x = cx - d / 2; track.y = cy - d / 2;
      track.name = '링 배경';
      const arc = figma.createEllipse();
      S.appendChild(arc);
      arc.resize(d, d);
      arc.fills = [{ type: 'SOLID', color: BLUE }];
      arc.arcData = { startingAngle: -Math.PI / 2, endingAngle: -Math.PI / 2 + 2 * Math.PI * ratio, innerRadius: 0.84 };
      arc.x = cx - d / 2; arc.y = cy - d / 2;
      arc.name = '진행 링 (비율에 맞게 endingAngle 조정)';
      return [track, arc];
    }
    const shadow = [{ type: 'DROP_SHADOW', color: Object.assign({}, NAVY, { a: 0.08 }), offset: { x: 0, y: 8 }, radius: 28, spread: 0, visible: true, blendMode: 'NORMAL' }];
    const all = [];

    // 레퍼런스 이미지는 지우지 않고 숨긴다
    const ref = await figma.getNodeByIdAsync(REF);
    if (ref) { ref.visible = false; ref.name = '[숨김·레퍼런스] ' + ref.name; }

    // 제목과 부제를 레퍼런스처럼 왼쪽 위로
    const title = await figma.getNodeByIdAsync(TITLE);
    const sub = await figma.getNodeByIdAsync(SUBTITLE);
    if (title) { title.x = 200; title.y = 150; }
    if (sub) { sub.x = 200; sub.y = 200; }

    // 왼쪽 위: 테스트 개요
    const d1 = T('Regular', 20, BODY, '[ 테스트 개요: 언제, 어디서, 누구에게 PoC를 직접 써 보게 했는지 두 줄 정도로 적어요. 예: 11월 ○일, 노원과 대전의 외국인 고용 매장 ○곳에서 사장님 ○명과 외국인 직원 ○명이 직접 눌러 봤어요. ]', 200, 290, 760, 'LEFT', 160);
    const d2 = T('Regular', 15, GRAY, '[ 진행 방식: 사장님은 "이번 달 급여를 보내 보세요" 과제, 직원은 한국어 명세서와 모국어 명세서를 비교했어요 ]', 200, d1.y + d1.height + 12, 760, 'LEFT', 150);
    const gDesc = figma.group([d1, d2], S);
    gDesc.name = '테스트 개요';
    all.push(gDesc);

    // 왼쪽 아래: 도넛 카드 2장
    const CY = 470, CW = 310, CH = 400;
    const cards = [
      { x: 200, who: '사장님', q: '[ 도움 없이 경고를 찾아\n고쳐서 보낸 사장님 ]', cap: '[ 0명 / 0명 ]', extra: null },
      { x: 540, who: '외국인 직원', q: '[ 숙식비가 왜 빠졌는지\n맞힌 직원 ]', cap: '[ 0명 / 0명 ]', extra: '한국어 명세서일 땐 [ 00% ]' },
    ];
    for (const c of cards) {
      const items = [];
      const card = R(c.x, CY, CW, CH, WHITE, 24);
      card.effects = shadow;
      card.name = '카드 배경';
      items.push(card);
      const tagT = T('Bold', 13, BLUE, c.who, c.x + 36, CY + 29);
      const tag = R(c.x + 24, CY + 24, tagT.width + 24, 26, PALE, 13);
      S.insertChild(S.children.indexOf(tagT), tag); // 태그 글자 아래로
      items.push(tag, tagT);
      items.push(T('SemiBold', 20, INK, c.q, c.x + 24, CY + 66, CW - 48, 'LEFT', 140));
      const cx = c.x + CW / 2, cy = CY + 232;
      items.push(...ring(cx, cy, 170, 0.7));
      items.push(T('Bold', 36, BLUE, '[00%]', cx - 80, cy - 24, 160, 'CENTER'));
      items.push(T('Regular', 15, GRAY, c.cap, c.x, CY + CH - 60, CW, 'CENTER'));
      if (c.extra) items.push(T('Medium', 14, BODY, c.extra, c.x, CY + CH - 36, CW, 'CENTER'));
      const g = figma.group(items, S);
      g.name = '도넛 카드 · ' + c.who;
      all.push(g);
    }

    // 오른쪽: "직접 들어 보니," + 반응 막대 3개 (마지막은 보완할 점, 흰 바탕 테두리)
    const RX = 1000, RW = 720, PY = 572;
    const pillItems = [T('Bold', 30, INK, '직접 들어 보니,', RX, 500)];
    const pills = [
      { t: '[ 사장님 반응 한 줄 ] ([00%])', dark: true },
      { t: '[ 직원 반응 한 줄 ] ([00%])', dark: true },
      { t: '[ 보완할 점 한 줄 ] → [ 어떻게 고쳤는지 ]', dark: false },
    ];
    pills.forEach((p, i) => {
      const y = PY + i * 84;
      const r = R(RX, y, RW, 64, p.dark ? NAVY : WHITE, 16, p.dark ? null : NAVY);
      r.name = p.dark ? '반응 막대' : '보완할 점 막대';
      pillItems.push(r, T('Medium', 20, p.dark ? WHITE : NAVY, p.t, RX, y + 18, RW, 'CENTER'));
    });
    const gP = figma.group(pillItems, S);
    gP.name = '반응 막대';

    // 캐릭터 2명: 사장님은 막대 오른쪽 위(막대 뒤), 직원은 막대 왼쪽 아래
    const ownerSrc = await figma.getNodeByIdAsync(OWNER_IMG);
    const workerSrc = await figma.getNodeByIdAsync(WORKER_IMG);
    if (ownerSrc) {
      const owner = ownerSrc.clone();
      S.insertChild(S.children.indexOf(gP), owner);
      owner.resize(210, 210 * ownerSrc.height / ownerSrc.width);
      owner.x = RX + RW - 150; owner.y = PY - owner.height + 40;
      owner.name = '캐릭터 · 사장님';
      all.push(owner);
    }
    all.push(gP);
    if (workerSrc) {
      const worker = workerSrc.clone();
      S.appendChild(worker);
      worker.resize(180, 180 * workerSrc.height / workerSrc.width);
      worker.x = RX - 120; worker.y = PY + 2 * 84 + 20;
      worker.name = '캐릭터 · 직원';
      all.push(worker);
    }

    // 오른쪽 아래: 각주
    all.push(T('Regular', 14, GRAY, '※ [ 테스트 일시, 장소, 참여 인원 ]  얼굴과 이름은 동의를 받고 가렸어요', RX, 830, RW, 'RIGHT'));

    const g = figma.group(all, S);
    g.name = GROUP;

    // 슬라이드 밖으로 나간 글자 확인
    const sb = S.absoluteBoundingBox;
    const out = g.findAll((n) => n.type === 'TEXT').filter((t) => {
      const b = t.absoluteBoundingBox;
      return b.x < sb.x || b.y < sb.y || b.x + b.width > sb.x + sb.width || b.y + b.height > sb.y + sb.height;
    });
    figma.closePlugin(out.length ? `레이아웃 추가, 슬라이드 밖 글자 ${out.length}개 확인 필요` : '22번 현장 반응 레이아웃 추가 완료');
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

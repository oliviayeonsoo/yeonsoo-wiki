// 덱 20번 슬라이드 "실현 가능성 검토" — 플러그인 모델 한 가지 메시지로 다시 정리한다.
// 전할 것: 새 앱이 아니라 지금 쓰는 은행 앱에 꽂는 플러그인이다. 인터뷰한 사장님들은 쓰던 앱과 은행을 바꾸고 싶어 하지 않았다.
// 그래서 은행은 락인 효과를 그대로 지킨다.
// 레퍼런스 2장: (1) 사진 위 말풍선 막대와 노란 강조 하나, (2) 흐려지는 인터뷰 카드 줄, 세로선과 빛나는 점, 아래 큰 호.
// 배경 사진(2273:716)과 그 위 어두운 막(2273:717)은 건드리지 않는다. 나머지 기존 요소는 지우지 않고 숨긴다.
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
(async () => {
  try {
    const SLIDE = '2273:659';
    const KEEP = ['2273:716', '2273:717']; // 배경 사진, 어두운 막
    const GROUP = '플러그인 모델 (새 배치)';

    const F = 'Pretendard';
    for (const s of ['Regular', 'Medium', 'SemiBold', 'Bold']) await figma.loadFontAsync({ family: F, style: s });

    const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
    const rgba = (h, a) => Object.assign(rgb(h), { a });
    const WHITE = rgb('#FFFFFF'), YELLOW = rgb('#FFE300'), NAVY = rgb('#0B1F4F'), DEEP = rgb('#050B1F');

    const S = await figma.getNodeByIdAsync(SLIDE);
    if (!S) throw new Error('20번 슬라이드를 찾지 못함: ' + SLIDE);
    if (S.children.some((n) => n.name === GROUP && n.visible)) {
      figma.closePlugin('이미 새 배치가 있어요. 다시 만들려면 기존 그룹을 숨긴 뒤 실행하세요.');
      return;
    }

    // 기존 요소 숨김 (배경 사진과 어두운 막은 그대로)
    let hidden = 0;
    for (const n of S.children) {
      if (KEEP.includes(n.id) || !n.visible) continue;
      n.visible = false;
      if (!n.name.startsWith('[숨김')) n.name = '[숨김·이전 배치] ' + n.name;
      hidden++;
    }

    // 슬라이드에서는 appendChild 다음에 x, y를 정해야 좌표가 어긋나지 않는다
    function T(style, size, color, chars, x, y, w, align, opacity, lh) {
      const t = figma.createText();
      S.appendChild(t);
      t.fontName = { family: F, style };
      t.fontSize = size;
      t.characters = chars;
      t.fills = [{ type: 'SOLID', color, opacity: opacity === undefined ? 1 : opacity }];
      if (lh) t.lineHeight = { unit: 'PERCENT', value: lh };
      if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } else { t.textAutoResize = 'WIDTH_AND_HEIGHT'; }
      t.textAlignHorizontal = align || 'LEFT';
      t.x = x; t.y = y;
      return t;
    }
    function R(x, y, w, h, fills, radius) {
      const n = figma.createRectangle();
      S.appendChild(n);
      n.resize(w, h);
      n.fills = fills;
      n.cornerRadius = radius || 0;
      n.x = x; n.y = y;
      return n;
    }
    const solid = (c, o) => [{ type: 'SOLID', color: c, opacity: o === undefined ? 1 : o }];
    const vertical = [[0, 1, 0], [-1, 0, 1]];
    const all = [];

    // 글자가 사진 위에서 잘 읽히도록 막 한 겹 (사진 자체는 그대로)
    const veil = R(0, 0, 1920, 1080, [{
      type: 'GRADIENT_LINEAR', gradientTransform: vertical,
      gradientStops: [
        { position: 0, color: rgba('#050B1F', 0.55) },
        { position: 0.5, color: rgba('#050B1F', 0.25) },
        { position: 1, color: rgba('#050B1F', 0.6) },
      ],
    }]);
    veil.name = '가독성 막';
    all.push(veil);

    // 1. 머리말 (레퍼런스 2: 가운데 정렬 눈썹 + 제목 + 설명)
    const head = [];
    head.push(T('Bold', 18, YELLOW, '실현 가능성', 0, 96, 1920, 'CENTER'));
    head.push(T('Bold', 42, WHITE, '새 앱이 아니라, 지금 쓰는 은행 앱에 꽂는 플러그인이에요', 120, 128, 1680, 'CENTER'));
    head.push(T('Regular', 19, WHITE,
      '페이체크는 따로 설치하는 앱이 아니에요. 사장님이 이미 급여를 보내는 은행 앱의 이체 화면에 기능만 붙여요.\n인터뷰한 사장님들도 쓰던 앱과 은행을 바꾸고 싶어 하지 않았어요.',
      240, 204, 1440, 'CENTER', 0.72, 160));
    const gHead = figma.group(head, S);
    gHead.name = '머리말';
    all.push(gHead);

    // 2. 흐려지는 인터뷰 카드 줄 (레퍼런스 2). 인터뷰 응답을 짧게 줄인 문장과 매장명
    const QUOTES = [
      ['평생 쓰던 은행을 옮기진 않을 것 같아요', 'CU 서울과기대점'],
      ['수협을 계속 써서 바꾸는 게 번거로워요', '공차 내포신도시점'],
      ['이미 적응된 걸 옮기긴 힘들어요', '역전할머니맥주 서울공릉점'],
      ['바꾸는 게 많이 귀찮아서 안 갈아타요', '형광커피'],
      ['늘 하던 걸 바꾸는 게 어려워요', '여기꼬치네'],
      ['계좌를 바꾸면 다른 일에도 영향이 있어요', '케렌시아'],
      ['어릴 때부터 써서 쓰는 것뿐이에요', '청년치킨 공릉점'],
      ['지금 방식이 더 좋아요', '아너카페'],
      ['작은 은행이면 바꿀 이득이 없을 것 같아요', '플렉스버거'],
    ];
    const CW = 430, CH = 76, STRIDE = 454, ROWS = [318, 404, 490], ROW_OP = [1, 0.62, 0.3];
    const cardGroups = [];
    let q = 0;
    ROWS.forEach((y, r) => {
      const x0 = -150 - (r % 2) * 227;
      for (let i = 0; i < 5; i++) {
        const x = x0 + i * STRIDE;
        const [quote, src] = QUOTES[q % QUOTES.length];
        q++;
        const box = R(x, y, CW, CH, solid(WHITE, 0.07), 16);
        box.strokes = [{ type: 'SOLID', color: WHITE, opacity: 0.1 }];
        box.strokeWeight = 1;
        box.strokeAlign = 'INSIDE';
        const t1 = T('Medium', 17, WHITE, '“' + quote + '”', x, y + 15, CW, 'CENTER', 0.9);
        const t2 = T('Regular', 13, WHITE, src, x, y + 45, CW, 'CENTER', 0.5);
        const g = figma.group([box, t1, t2], S);
        const edge = Math.max(0.2, 1 - Math.abs(x + CW / 2 - 960) / 1100);
        g.opacity = ROW_OP[r] * edge;
        g.name = '인터뷰 카드 · ' + src;
        cardGroups.push(g);
      }
    });
    const gCards = figma.group(cardGroups, S);
    gCards.name = '인터뷰 카드 줄';
    all.push(gCards);

    // 3. 노란 강조 막대 하나 (레퍼런스 1)
    const pillT = T('Bold', 19, NAVY, '13곳 중 11곳이 쓰던 은행을 바로 바꾸진 않겠다고 했어요', 0, 0);
    const pw = pillT.width + 64;
    const pill = R((1920 - pw) / 2, 592, pw, 52, solid(YELLOW), 26);
    S.insertChild(S.children.indexOf(pillT), pill);
    pillT.x = (1920 - pillT.width) / 2;
    pillT.y = 592 + (52 - pillT.height) / 2;
    const gPill = figma.group([pill, pillT], S);
    gPill.name = '강조 막대';
    all.push(gPill);

    // 4. 세로선과 빛나는 점 (레퍼런스 2)
    const line = R(959, 660, 2, 92, [{
      type: 'GRADIENT_LINEAR', gradientTransform: vertical,
      gradientStops: [{ position: 0, color: rgba('#FFFFFF', 0) }, { position: 1, color: rgba('#FFFFFF', 0.85) }],
    }]);
    const dot = figma.createEllipse();
    S.appendChild(dot);
    dot.resize(14, 14);
    dot.fills = solid(WHITE);
    dot.effects = [{ type: 'DROP_SHADOW', color: rgba('#FFE300', 0.9), offset: { x: 0, y: 0 }, radius: 18, spread: 2, visible: true, blendMode: 'NORMAL' }];
    dot.x = 953; dot.y = 748;
    const gLine = figma.group([line, dot], S);
    gLine.name = '연결선';
    all.push(gLine);

    // 5. 아래 큰 호와 결론 (레퍼런스 2)
    const arc = figma.createEllipse();
    S.appendChild(arc);
    arc.resize(2600, 1000);
    arc.fills = [{
      type: 'GRADIENT_LINEAR', gradientTransform: vertical,
      gradientStops: [
        { position: 0, color: rgba('#3346E0', 1) },
        { position: 0.07, color: rgba('#1A2C8F', 1) },
        { position: 0.25, color: rgba('#0B1F4F', 1) },
        { position: 1, color: rgba('#050B1F', 1) },
      ],
    }];
    arc.effects = [{ type: 'DROP_SHADOW', color: rgba('#3346E0', 0.55), offset: { x: 0, y: -6 }, radius: 80, spread: 0, visible: true, blendMode: 'NORMAL' }];
    arc.x = -340; arc.y = 790;
    arc.name = '큰 호';
    const arcItems = [arc];
    arcItems.push(T('Medium', 18, WHITE, '그래서 은행을 옮기게 하지 않아요', 0, 828, 1920, 'CENTER', 0.8));
    const big = T('Bold', 34, WHITE, '쓰던 은행 앱 그대로, 은행의 락인 효과도 그대로', 0, 862, 1920, 'CENTER');
    const k = '락인 효과';
    const ki = big.characters.indexOf(k);
    big.setRangeFills(ki, ki + k.length, solid(YELLOW));
    arcItems.push(big);
    // 칩 3개 (가운데 정렬)
    const chips = ['새 앱 설치 없음', '이체 화면 그대로', '고객은 지금 은행에'];
    const chipNodes = chips.map((c) => T('Medium', 15, WHITE, c, 0, 0, null, 'CENTER', 0.9));
    const pad = 36, gap = 12;
    const widths = chipNodes.map((t) => t.width + pad);
    let cx = (1920 - (widths.reduce((a, b) => a + b, 0) + gap * (chips.length - 1))) / 2;
    chipNodes.forEach((t, i) => {
      const bg = R(cx, 932, widths[i], 34, solid(WHITE, 0.1), 17);
      S.insertChild(S.children.indexOf(t), bg);
      t.x = cx + pad / 2; t.y = 932 + (34 - t.height) / 2;
      arcItems.push(bg, t);
      cx += widths[i] + gap;
    });
    arcItems.push(T('Regular', 13, WHITE, '인터뷰 응답을 짧게 줄인 문장이에요 (2026.10.9, 직원이 있는 13곳)', 0, 1032, 1920, 'CENTER', 0.4));
    const gArc = figma.group(arcItems, S);
    gArc.name = '결론 호';
    all.push(gArc);

    const g = figma.group(all, S);
    g.name = GROUP;
    figma.closePlugin(`20번 플러그인 모델 새 배치 완료 (이전 요소 ${hidden}개 숨김)`);
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

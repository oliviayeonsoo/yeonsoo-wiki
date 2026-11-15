// 덱 18번 슬라이드 "직접 현장에 물어봤어요"의 외국인 직원 도넛 카드에 스티커 설문 결과를 넣는다.
// 설문: "Why was 150,000 won deducted?" 외국인 38명이 한국어 명세서와 모국어 명세서에 각각 O 또는 △/? 스티커를 붙였다.
//   한국어 명세서: O 9명, △/? 29명 → 24%
//   모국어 명세서: O 38명, △/? 0명 → 100%
// 카드: 모국어 명세서 결과를 도넛(100%)으로, 한국어 명세서 결과를 아래 비교 줄(24%)로 보여 준다.
// 사장님 카드는 건드리지 않는다. 글자와 도넛 링만 바꾸고 지우는 요소는 없다.
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
(async () => {
  try {
    const CARD = '2396:147'; // 도넛 카드 · 외국인 직원
    const ID = {
      tag: '2396:139', // 외국인 직원
      tagBg: '2396:140', // 태그 배경
      head: '2396:141', // [ 숙식비가 왜 빠졌는지 맞힌 직원 ]
      ring: '2396:143', // 진행 링
      pct: '2396:144', // [00%]
      cnt: '2396:145', // [ 0명 / 0명 ]
      ko: '2396:146', // 한국어 명세서일 땐 [ 00% ]
    };
    const NEW = {
      tag: '외국인 38명',
      head: '15만 원이 왜 빠졌는지\n안다고 답한 외국인',
      pct: '100%',
      cnt: '모국어 명세서  38명 / 38명',
      ko: '한국어 명세서일 땐 24% (9명 / 38명)',
    };
    const RATIO = 38 / 38;

    const card = await figma.getNodeByIdAsync(CARD);
    if (!card) throw new Error('외국인 직원 도넛 카드를 찾지 못함: ' + CARD);
    const n = {};
    for (const [k, id] of Object.entries(ID)) {
      n[k] = await figma.getNodeByIdAsync(id);
      if (!n[k]) throw new Error('요소를 찾지 못함: ' + k + ' ' + id);
    }

    // 현재 글꼴을 그대로 불러온다 (Pretendard Bold, SemiBold, Medium, Regular)
    for (const k of ['tag', 'head', 'pct', 'cnt', 'ko']) {
      for (const s of n[k].getStyledTextSegments(['fontName'])) await figma.loadFontAsync(s.fontName);
    }

    // 글자: 가운데 정렬 카드라 x는 그대로 두고 내용만 바꾼다
    for (const k of Object.keys(NEW)) n[k].characters = NEW[k];

    // 태그 배경을 글자 폭에 맞춘다
    const padX = n.tag.x - n.tagBg.x;
    n.tagBg.resize(Math.round(n.tag.width + padX * 2), n.tagBg.height);

    // 도넛: 12시 방향에서 시계 방향으로 비율만큼 (100%는 완전한 고리)
    const start = -Math.PI / 2;
    n.ring.arcData = { startingAngle: start, endingAngle: start + 2 * Math.PI * Math.min(RATIO, 0.99999), innerRadius: n.ring.arcData.innerRadius };

    figma.closePlugin('18번 외국인 도넛 카드: 모국어 100% (38/38), 한국어 24% (9/38)로 바꿈');
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

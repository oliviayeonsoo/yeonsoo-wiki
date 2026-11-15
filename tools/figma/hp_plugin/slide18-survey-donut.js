// 덱 18번 슬라이드 "직접 현장에 물어봤습니다"의 도넛 카드 2장을 채운다.
// 외국인 직원 카드: 스티커 설문 실제 결과.
//   "Why was 150,000 won deducted?" 외국인 38명이 한국어 명세서와 모국어 명세서에 각각 O 또는 △/? 스티커를 붙였다.
//   한국어 명세서: O 9명, △/? 29명 → 24%
//   모국어 명세서: O 38명, △/? 0명 → 100%
// 사장님 카드: 아직 테스트 전이라 [예시 값]. 과제 테스트("이번 달 외국인 직원 급여를 보내 보세요",
//   숙식비 35만 원 > 서면 동의 30만 원 경고를 도움 없이 찾아 고치면 성공) 결과가 나오면 OWNER 값만 바꿔 다시 실행한다.
// 글자와 도넛 링만 바꾼다. 지우는 요소는 없고, 새로 만드는 것은 사장님 카드 아래 비교 줄 하나뿐이다.
// 다시 실행해도 같은 결과가 된다 (비교 줄은 이름으로 찾아서 하나만 둔다).
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱(figma.com/slides/DVCAPusMwJrTZW1ASKYeed)에서 플러그인 > 개발 > HP Add Slides
(async () => {
  try {
    const OWNER = { ok: 10, total: 12, use: 11 }; // [예시 값] 실제 테스트 결과로 바꿀 것
    const WORKER = { ok: 38, total: 38, koOk: 9 };
    const pct = (a, b) => Math.round((a / b) * 100);

    const CARDS = [
      {
        group: '2396:147', // 도넛 카드 · 외국인 직원
        tag: '2396:139', tagBg: '2396:140', ring: '2396:143',
        text: {
          '2396:139': '외국인 38명',
          '2396:141': '15만 원이 왜 빠졌는지\n안다고 답한 외국인',
          '2396:144': `${pct(WORKER.ok, WORKER.total)}%`,
          '2396:145': `모국어 명세서  ${WORKER.ok}명 / ${WORKER.total}명`,
          '2396:146': `한국어 명세서일 땐 ${pct(WORKER.koOk, WORKER.total)}% (${WORKER.koOk}명 / ${WORKER.total}명)`,
        },
        ratio: WORKER.ok / WORKER.total,
      },
      {
        group: '2396:137', // 도넛 카드 · 사장님
        tag: '2396:130', tagBg: '2396:131', ring: '2396:134',
        text: {
          '2396:130': `사장님 ${OWNER.total}명`,
          '2396:132': '숙식비 경고를 도움 없이\n찾아 고쳐서 보낸 사장님',
          '2396:135': `${pct(OWNER.ok, OWNER.total)}%`,
          '2396:136': `${OWNER.ok}명 / ${OWNER.total}명`,
        },
        ratio: OWNER.ok / OWNER.total,
        extra: { name: '비교 줄 (예시 값)', from: '2396:146', text: `은행 앱에 있으면 쓰겠다 ${OWNER.use}명 / ${OWNER.total}명` },
      },
    ];

    const done = [];
    for (const c of CARDS) {
      const group = await figma.getNodeByIdAsync(c.group);
      if (!group) throw new Error('도넛 카드를 찾지 못함: ' + c.group);

      // 글자: 현재 글꼴을 그대로 불러와서 내용만 바꾼다
      for (const [id, text] of Object.entries(c.text)) {
        const t = await figma.getNodeByIdAsync(id);
        if (!t || t.type !== 'TEXT') throw new Error('글자를 찾지 못함: ' + id);
        for (const s of t.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(s.fontName);
        t.characters = text;
      }

      // 태그 배경을 글자 폭에 맞춘다. 태그 글자는 폭이 고정이라 늘어난 글자가 두 줄로 접히므로 먼저 한 줄로 늘린다
      const tag = await figma.getNodeByIdAsync(c.tag);
      tag.textAutoResize = 'WIDTH_AND_HEIGHT';
      const bg = await figma.getNodeByIdAsync(c.tagBg);
      bg.resize(Math.round(tag.width + (tag.x - bg.x) * 2), bg.height);

      // 도넛: 12시 방향에서 시계 방향으로 비율만큼 (100%는 완전한 고리)
      const ring = await figma.getNodeByIdAsync(c.ring);
      const start = -Math.PI / 2;
      ring.arcData = { startingAngle: start, endingAngle: start + 2 * Math.PI * Math.min(c.ratio, 0.99999), innerRadius: ring.arcData.innerRadius };

      // 사장님 카드 아래 비교 줄: 외국인 카드의 "한국어 명세서일 땐" 줄을 복제해 같은 높이에 둔다
      if (c.extra) {
        const src = await figma.getNodeByIdAsync(c.extra.from);
        for (const s of src.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(s.fontName);
        let line = group.findOne((n) => n.type === 'TEXT' && n.name === c.extra.name);
        if (!line) {
          line = src.clone();
          group.appendChild(line);
          line.name = c.extra.name;
        }
        line.characters = c.extra.text;
        // 그룹 x는 복제 직후 외국인 카드 쪽으로 늘어난 경계를 따라가 어긋나므로, 사장님 카드 배경의 x에 맞춘다
        const cardBg = group.children.find((n) => n.name === '카드 배경');
        if (!cardBg) throw new Error('사장님 카드 배경을 찾지 못함: ' + c.group);
        line.x = cardBg.x; line.y = src.y; // 카드 폭(330)과 가운데 정렬은 원본과 같다
        line.visible = true;
      }
      done.push(`${c.text[c.tag]} ${Math.round(c.ratio * 100)}%`);
    }

    figma.closePlugin('18번 도넛 카드 채움: ' + done.join(', ') + ' (사장님은 예시 값)');
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

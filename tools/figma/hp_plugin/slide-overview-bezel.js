// 솔루션 한눈에 슬라이드 — 폰 껍데기(베젤)만 부드러운 화이트 3D로 바꾼다. 화면과 배치는 건드리지 않는다.
// 껍데기: 흰색 → 연회색 그라데이션, 얇은 외곽선, 옅은 그림자, 안쪽 하이라이트 / 화면 가장자리: 화면 뒤에 얇은 검은 테두리
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
(async () => {
  try {
    const SLIDE_ID = '1:345';
    const PHONES = {
      '2209:1500': 'S2 직원 등록', '2209:1523': 'S3 급여일 미리보기', '2209:1562': 'S4 이체 확인',
      '2209:1596': 'S5 이체 완료', '2209:1646': 'E2 모국어 명세서', '2209:1687': 'S6 급여 기록',
    };
    const RIM = '화면 테두리';

    const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
    const rgba = (h, a) => Object.assign(rgb(h), { a });

    const slide = await figma.getNodeByIdAsync(SLIDE_ID);
    if (!slide || slide.type !== 'SLIDE') throw new Error(`슬라이드 ${SLIDE_ID}를 찾지 못함`);

    let done = 0;
    for (const id in PHONES) {
      const p = await figma.getNodeByIdAsync(id);
      if (!p || p.type !== 'FRAME' || p.name !== PHONES[id]) throw new Error(`폰 ${id}(${PHONES[id]})를 찾지 못함`);
      const scr = p.children.find((c) => c.name.endsWith(' 화면'));
      if (!scr) throw new Error(`${PHONES[id]} 화면을 찾지 못함`);
      const k = p.width / 426; // 원래 크기 대비 배율 (작은 화면 0.5, 큰 화면 0.72)

      // 껍데기: 왼쪽 위 흰색 → 오른쪽 아래 연회색
      p.fills = [{
        type: 'GRADIENT_LINEAR',
        gradientTransform: [[0.6, 0.8, -0.2], [-0.8, 0.6, 0.6]],
        gradientStops: [
          { position: 0, color: rgba('#FFFFFF', 1) },
          { position: 0.55, color: rgba('#F4F6FA', 1) },
          { position: 1, color: rgba('#DDE2EB', 1) },
        ],
      }];
      p.strokes = [{ type: 'SOLID', color: rgb('#D3D9E4') }];
      p.strokeWeight = 1;
      p.strokeAlign = 'INSIDE';
      p.effects = [
        { type: 'DROP_SHADOW', color: rgba('#0B1F4F', 0.12), offset: { x: 0, y: 24 * k }, radius: 48 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
        { type: 'DROP_SHADOW', color: rgba('#0B1F4F', 0.08), offset: { x: 0, y: 3 * k }, radius: 8 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
        { type: 'INNER_SHADOW', color: rgba('#FFFFFF', 0.95), offset: { x: 3 * k, y: 3 * k }, radius: 4 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
        { type: 'INNER_SHADOW', color: rgba('#8C98B8', 0.35), offset: { x: -3 * k, y: -4 * k }, radius: 6 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
      ];

      // 화면 가장자리의 얇은 검은 테두리 (화면 뒤에 깔아서 화면은 그대로)
      if (!p.children.some((c) => c.name === RIM)) {
        const t = 3 * k;
        const rim = figma.createRectangle();
        rim.name = RIM;
        rim.fills = [{ type: 'SOLID', color: rgb('#1C2230') }];
        p.insertChild(0, rim);
        rim.resize(scr.width + t * 2, scr.height + t * 2);
        rim.x = scr.x - t;
        rim.y = scr.y - t;
        rim.cornerRadius = scr.cornerRadius + t;
      }
      done++;
    }
    figma.closePlugin(`폰 껍데기 ${done}개를 화이트 3D로 바꿈`);
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

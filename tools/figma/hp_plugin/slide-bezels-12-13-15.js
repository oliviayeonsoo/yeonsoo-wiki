// 덱 12, 13, 15번 슬라이드 — 검은 폰 껍데기를 솔루션 한눈에(slide-overview-bezel.js)처럼 부드러운 화이트 3D로 바꾼다.
// 화면 내용과 배치는 건드리지 않는다. 12, 13번은 '폰' 프레임, 15번은 'bezel shell' 사각형 + 별도 화면 사각형 구조.
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
(async () => {
  try {
    const FRAMES = { '2196:2615': 'S4 화면', '2196:2881': 'E2 화면' }; // 12번, 13번의 '폰' 프레임 → 안쪽 화면 이름
    const SHELL = { slide: '2231:109', bezel: '2231:341', screen: '2231:342', buttons: ['2231:337', '2231:338', '2231:339', '2231:340'] }; // 15번
    const RIM = '화면 테두리';

    const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
    const rgba = (h, a) => Object.assign(rgb(h), { a });

    function whiteShell(node, k) {
      node.fills = [{
        type: 'GRADIENT_LINEAR',
        gradientTransform: [[0.6, 0.8, -0.2], [-0.8, 0.6, 0.6]],
        gradientStops: [
          { position: 0, color: rgba('#FFFFFF', 1) },
          { position: 0.55, color: rgba('#F4F6FA', 1) },
          { position: 1, color: rgba('#DDE2EB', 1) },
        ],
      }];
      node.strokes = [{ type: 'SOLID', color: rgb('#D3D9E4') }];
      node.strokeWeight = 1;
      node.strokeAlign = 'INSIDE';
      node.effects = [
        { type: 'DROP_SHADOW', color: rgba('#0B1F4F', 0.12), offset: { x: 0, y: 24 * k }, radius: 48 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
        { type: 'DROP_SHADOW', color: rgba('#0B1F4F', 0.08), offset: { x: 0, y: 3 * k }, radius: 8 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
        { type: 'INNER_SHADOW', color: rgba('#FFFFFF', 0.95), offset: { x: 3 * k, y: 3 * k }, radius: 4 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
        { type: 'INNER_SHADOW', color: rgba('#8C98B8', 0.35), offset: { x: -3 * k, y: -4 * k }, radius: 6 * k, spread: 0, visible: true, blendMode: 'NORMAL' },
      ];
    }
    function rim(scr, k) {
      const t = 3 * k;
      const r = figma.createRectangle();
      r.name = RIM;
      r.fills = [{ type: 'SOLID', color: rgb('#1C2230') }];
      r.resize(scr.width + t * 2, scr.height + t * 2);
      r.cornerRadius = (typeof scr.cornerRadius === 'number' ? scr.cornerRadius : 44) + t;
      return { r, t };
    }

    let done = 0;
    // 12, 13번: '폰' 프레임 안에 화면 프레임
    for (const id in FRAMES) {
      const p = await figma.getNodeByIdAsync(id);
      const scr = p && p.type === 'FRAME' && p.children.find((c) => c.name === FRAMES[id]);
      if (!p || p.name !== '폰' || !scr) throw new Error(`폰 ${id}(${FRAMES[id]})를 찾지 못함`);
      const k = p.width / 426;
      whiteShell(p, k);
      if (!p.children.some((c) => c.name === RIM)) {
        const { r, t } = rim(scr, k);
        p.insertChild(0, r);
        r.x = scr.x - t; r.y = scr.y - t;
      }
      done++;
    }

    // 15번: 껍데기 사각형 + 화면 사각형 (형제 관계)
    {
      const slide = await figma.getNodeByIdAsync(SHELL.slide);
      const b = await figma.getNodeByIdAsync(SHELL.bezel);
      const scr = await figma.getNodeByIdAsync(SHELL.screen);
      if (!slide || !b || b.name !== 'bezel shell' || !scr || scr.parent !== slide) throw new Error('15번 bezel shell 또는 화면을 찾지 못함');
      const k = b.width / 462;
      whiteShell(b, k);
      if (!slide.children.some((c) => c.name === RIM)) {
        const { r, t } = rim(scr, k);
        slide.insertChild(slide.children.indexOf(scr), r); // 화면 바로 아래, 껍데기 위
        r.x = scr.x - t; r.y = scr.y - t;
      }
      for (const bid of SHELL.buttons) {
        const btn = await figma.getNodeByIdAsync(bid);
        if (btn && btn.name === '측면 버튼') btn.fills = [{ type: 'SOLID', color: rgb('#D3D9E4') }];
      }
      done++;
    }

    figma.closePlugin(`폰 껍데기 ${done}개를 화이트 3D로 바꿈 (12, 13, 15번)`);
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

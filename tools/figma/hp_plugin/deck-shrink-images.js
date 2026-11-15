// 덱(figma.com/slides/DVCAPusMwJrTZW1ASKYeed)의 큰 사진을 슬라이드에 보이는 크기의 3배 해상도로 줄여 PDF 용량을 낮춘다.
// PDF로 내보내면 사진이 원본 해상도(카톡 사진 4096px, 장당 5~9MB)로 들어가 100MB를 넘었다.
// 방법: 사진 레이어를 복제해 보이는 모습(자르기, 필터 포함)을 3배로 내보낸 뒤 그 이미지로 바꾼다.
//   원본 레이어는 지우지 않고 '[숨김·원본 사진]'으로 이름을 바꿔 숨긴다. 숨긴 레이어는 PDF에 들어가지 않는다.
// 대상: 보이는 사진 중 원본이 300KB를 넘고, 원본 가로가 '보이는 폭 x 3'보다 10% 이상 큰 것.
// 다시 실행하면 이미 줄인 사진(' (3x)')과 숨긴 원본은 건너뛴다.
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
(async () => {
  try {
    const SCALE = 3;
    const MIN_BYTES = 300 * 1024;
    const TAG_OLD = '[숨김·원본 사진] ';
    const TAG_NEW = ' (3x)';

    const slides = figma.currentPage.findAllWithCriteria({ types: ['SLIDE'] });
    // 보이는 사진 레이어 모으기 (숨긴 레이어 안쪽은 건너뜀)
    const targets = [];
    const walk = (n, slide) => {
      if (n.visible === false) return;
      if (n.type === 'INSTANCE') return; // 컴포넌트 인스턴스 안쪽 레이어는 복제해 바꿀 수 없어 건너뛴다
      if (n.name.startsWith(TAG_OLD) || n.name.endsWith(TAG_NEW)) return;
      if ('fills' in n && Array.isArray(n.fills) && !n.isMask && n.type !== 'TEXT') {
        const i = n.fills.findIndex((f) => f.type === 'IMAGE' && f.visible !== false && f.imageHash);
        if (i >= 0) targets.push({ node: n, slide, i });
      }
      if ('children' in n) for (const c of n.children) walk(c, slide);
    };
    for (const s of slides) for (const c of s.children) walk(c, s);

    // 이미지 불러오기나 내보내기가 멈추면 플러그인이 조용히 계속 도는 일이 있어, 단계마다 시간 제한을 둔다
    const limit = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(what + ' 시간 초과')), ms))]);

    const info = {};
    async function imageInfo(hash) {
      if (!info[hash]) {
        const img = figma.getImageByHash(hash);
        const bytes = await limit(img.getBytesAsync(), 30000, '원본 읽기');
        const size = await limit(img.getSizeAsync(), 30000, '크기 읽기');
        info[hash] = { bytes: bytes.length, png: bytes[0] === 0x89 && bytes[1] === 0x50, w: size.width, h: size.height };
      }
      return info[hash];
    }

    let done = 0, before = 0, after = 0;
    const skipped = [];
    const fails = [];
    for (const [k, t] of targets.entries()) {
      const n = t.node;
      const paint = n.fills[t.i];
      figma.notify(`사진 확인 중 ${k + 1}/${targets.length} (${t.slide.name}쪽)`, { timeout: 1500 });
      try {
        const im = await imageInfo(paint.imageHash);
        if (im.bytes < MIN_BYTES || im.w <= n.width * SCALE * 1.1) { skipped.push(n.name); continue; }

        // 1) 임시 복제본에서 사진만 남기고 보이는 모습 그대로 3배로 내보낸다
        const tmp = n.clone();
        let out;
        try {
          t.slide.appendChild(tmp);
          if ('children' in tmp) for (const c of [...tmp.children]) c.remove();
          tmp.fills = [Object.assign({}, paint, { opacity: 1, blendMode: 'NORMAL' })];
          if ('strokes' in tmp) tmp.strokes = [];
          if ('effects' in tmp) tmp.effects = [];
          if ('cornerRadius' in tmp && typeof tmp.cornerRadius === 'number') tmp.cornerRadius = 0;
          else if ('topLeftRadius' in tmp) { tmp.topLeftRadius = 0; tmp.topRightRadius = 0; tmp.bottomLeftRadius = 0; tmp.bottomRightRadius = 0; }
          tmp.opacity = 1;
          tmp.rotation = 0;
          out = await limit(tmp.exportAsync({ format: im.png ? 'PNG' : 'JPG', constraint: { type: 'SCALE', value: SCALE } }), 60000, '내보내기');
        } finally {
          tmp.remove(); // 내보내기용 임시 복제본
        }

        // 2) 원본 레이어를 복제해 새 이미지로 바꾸고, 원본은 숨긴다
        const small = figma.createImage(out);
        const copy = n.clone();
        const parent = n.parent;
        parent.insertChild(parent.children.indexOf(n) + 1, copy);
        const fills = JSON.parse(JSON.stringify(n.fills));
        fills[t.i] = { type: 'IMAGE', imageHash: small.hash, scaleMode: 'FILL', opacity: paint.opacity === undefined ? 1 : paint.opacity, blendMode: paint.blendMode || 'NORMAL', visible: true };
        copy.fills = fills;
        copy.name = n.name + TAG_NEW;
        n.name = TAG_OLD + n.name;
        n.visible = false;

        before += im.bytes;
        after += out.length;
        done++;
      } catch (e) {
        fails.push(n.name + ': ' + (e && e.message ? e.message : e));
      }
    }

    const mb = (b) => (b / 1048576).toFixed(1);
    figma.closePlugin(`사진 ${done}장을 3배 해상도로 줄임: ${mb(before)}MB → ${mb(after)}MB` + (fails.length ? ` | 실패 ${fails.length}건: ${fails.join(' / ')}` : '') + ` (작아서 건너뜀 ${skipped.length}장)`);
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

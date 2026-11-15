// deck-shrink-images.js 로 줄인 사진(' (3x)')을 바로잡는다. 덱: figma.com/slides/DVCAPusMwJrTZW1ASKYeed
// 1) 슬라이드 밖으로 걸친 사진은 내보낼 때 슬라이드 경계에서 잘려, 잘린 그림이 레이어 전체에 늘려 채워졌다(19쪽 등)
//    → 임시 복제본을 슬라이드 왼쪽 위(0, 0)로 옮겨서 내보낸다
// 2) 몇 장은 원본 해상도 그대로 나왔다(18쪽) → 배율 대신 '보이는 폭 x 3'으로 폭을 정해 내보낸다
// 3) 마스크 그룹 안 사진(17쪽)은 복제본 위치가 어긋났다 → 원본의 위치와 회전(relativeTransform)을 그대로 복사한다
// 원본('[숨김·원본 사진] ...')은 계속 숨긴 채 두고, 바로 뒤에 있는 ' (3x)' 레이어의 이미지와 위치만 바꾼다.
// 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
(async () => {
  try {
    const SCALE = 3;
    const TAG_OLD = '[숨김·원본 사진] ';
    const TAG_NEW = ' (3x)';
    const limit = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(what + ' 시간 초과')), ms))]);

    const slides = figma.currentPage.findAllWithCriteria({ types: ['SLIDE'] });
    const pairs = [];
    for (const s of slides) {
      for (const copy of s.findAll((n) => n.name.endsWith(TAG_NEW))) {
        const sib = copy.parent.children;
        const orig = sib[sib.indexOf(copy) - 1];
        if (orig && orig.name === TAG_OLD + copy.name.slice(0, -TAG_NEW.length)) pairs.push({ s, orig, copy });
      }
    }

    let done = 0, before = 0, after = 0;
    const fails = [];
    for (const [k, p] of pairs.entries()) {
      const { s, orig, copy } = p;
      figma.notify(`사진 바로잡는 중 ${k + 1}/${pairs.length} (${s.name}쪽)`, { timeout: 1500 });
      try {
        const oi = orig.fills.findIndex((f) => f.type === 'IMAGE' && f.imageHash);
        const ci = copy.fills.findIndex((f) => f.type === 'IMAGE' && f.imageHash);
        if (oi < 0 || ci < 0) throw new Error('사진 칠을 찾지 못함');
        const paint = orig.fills[oi];
        const head = (await limit(figma.getImageByHash(paint.imageHash).getBytesAsync(), 30000, '원본 읽기')).slice(0, 2);
        const png = head[0] === 0x89 && head[1] === 0x50;

        const tmp = orig.clone();
        let out;
        try {
          s.appendChild(tmp);
          if ('children' in tmp) for (const c of [...tmp.children]) c.remove();
          tmp.visible = true;
          tmp.fills = [Object.assign({}, paint, { opacity: 1, blendMode: 'NORMAL' })];
          if ('strokes' in tmp) tmp.strokes = [];
          if ('effects' in tmp) tmp.effects = [];
          if ('cornerRadius' in tmp && typeof tmp.cornerRadius === 'number') tmp.cornerRadius = 0;
          else if ('topLeftRadius' in tmp) { tmp.topLeftRadius = 0; tmp.topRightRadius = 0; tmp.bottomLeftRadius = 0; tmp.bottomRightRadius = 0; }
          tmp.opacity = 1;
          // 회전과 뒤집기를 모두 없애고 슬라이드 왼쪽 위(0, 0)에 둔다. 좌우 뒤집힌 레이어는 rotation이 -180으로 읽혀
          // rotation = 0 만 하면 상하로 뒤집혀 나온다(18쪽). 슬라이드 경계에서 잘리지 않게 위치도 0, 0
          tmp.relativeTransform = [[1, 0, 0], [0, 1, 0]];
          out = await limit(tmp.exportAsync({ format: png ? 'PNG' : 'JPG', constraint: { type: 'WIDTH', value: Math.round(orig.width * SCALE) } }), 60000, '내보내기');
        } finally {
          tmp.remove(); // 내보내기용 임시 복제본
        }

        const oldBytes = (await limit(figma.getImageByHash(copy.fills[ci].imageHash).getBytesAsync(), 30000, '이전 사본 읽기')).length;
        const img = figma.createImage(out);
        const sz = await limit(img.getSizeAsync(), 30000, '새 크기 읽기');
        if (Math.abs(sz.width / sz.height - orig.width / orig.height) > 0.03) {
          // 그래도 비율이 어긋나면 사본을 숨기고 원본을 다시 보인다
          copy.visible = false;
          copy.name = copy.name.slice(0, -TAG_NEW.length) + ' (3x 실패·숨김)';
          orig.name = orig.name.slice(TAG_OLD.length);
          orig.visible = true;
          fails.push(`${s.name}쪽 ${orig.name}: 비율이 달라 원본으로 되돌림`);
          continue;
        }
        const fills = JSON.parse(JSON.stringify(copy.fills));
        fills[ci] = Object.assign({}, fills[ci], { imageHash: img.hash, scaleMode: 'FILL' });
        delete fills[ci].imageTransform;
        delete fills[ci].scalingFactor;
        copy.fills = fills;
        copy.relativeTransform = orig.relativeTransform;
        copy.resize(orig.width, orig.height);
        before += oldBytes;
        after += out.length;
        done++;
      } catch (e) {
        fails.push(`${s.name}쪽 ${copy.name}: ${e && e.message ? e.message : e}`);
      }
    }
    const mb = (b) => (b / 1048576).toFixed(1);
    figma.closePlugin(`사진 ${done}/${pairs.length}장 바로잡음: ${mb(before)}MB → ${mb(after)}MB` + (fails.length ? ` | 실패 ${fails.length}건: ${fails.join(' / ')}` : ''));
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)));
  }
})();

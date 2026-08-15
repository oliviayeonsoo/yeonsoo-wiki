#!/usr/bin/env python3
"""PDF 발표자료를 갤러리용 이미지로 변환한다.

    python3 tools/import_pdf.py "<pdf 경로>" <slug> "<보여줄 제목>" [--doc "문서명"]

하는 일
  1) 각 페이지를 JPEG 로 렌더 (가로 1200px)
  2) 사선 워터마크를 이미지 자체에 굽는다 — 캡처해도 같이 찍히도록
  3) assets/projects/<slug>/ 에 저장
  4) --doc 을 주면 data/content.json 의 해당 문서에 gallery 블록을 등록

원본 PDF 는 저장소에 넣지 않는다. 다운로드는 컨택을 거치게 하는 것이 목적이므로
공개 경로에 원본이 존재하면 안 된다.
"""
import sys, os, json, argparse
import fitz  # PyMuPDF
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIDTH = 1200
QUALITY = 72
FONT = '/System/Library/Fonts/AppleSDGothicNeo.ttc'


def watermark(img, text):
    """사선으로 반복되는 옅은 워터마크. 배경색과 무관하게 보이도록 흰/검 두 겹."""
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    try:
        font = ImageFont.truetype(FONT, max(16, img.width // 46))
    except OSError:
        font = ImageFont.load_default()

    step_x, step_y = img.width // 2, img.height // 4
    for row, y in enumerate(range(-step_y, img.height + step_y, step_y)):
        for x in range(-step_x, img.width + step_x, step_x):
            ox = (row % 2) * (step_x // 2)
            d.text((x + ox + 1, y + 1), text, font=font, fill=(255, 255, 255, 26))
            d.text((x + ox,     y),     text, font=font, fill=(0, 0, 0, 26))

    layer = layer.rotate(30, resample=Image.BICUBIC, expand=False)
    out = Image.alpha_composite(img.convert('RGBA'), layer)

    # 하단 우측 고정 표기
    d2 = ImageDraw.Draw(out)
    try:
        f2 = ImageFont.truetype(FONT, max(11, img.width // 80))
    except OSError:
        f2 = ImageFont.load_default()
    label = 'yeonsoo-wiki'
    tw = d2.textlength(label, font=f2)
    d2.text((img.width - tw - 12, img.height - 26), label, font=f2, fill=(0, 0, 0, 70))
    return out.convert('RGB')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf'); ap.add_argument('slug'); ap.add_argument('title')
    ap.add_argument('--doc', help='content.json 에서 gallery 블록을 넣을 문서명')
    ap.add_argument('--mark', default='공연수 · 무단 사용 금지')
    a = ap.parse_args()

    if not os.path.exists(a.pdf):
        sys.exit(f'PDF 를 찾을 수 없습니다: {a.pdf}')

    outdir = os.path.join(ROOT, 'assets', 'projects', a.slug)
    os.makedirs(outdir, exist_ok=True)

    doc = fitz.open(a.pdf)
    total = 0
    for i, page in enumerate(doc):
        scale = WIDTH / page.rect.width
        pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
        img = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        img = watermark(img, a.mark)
        img.save(os.path.join(outdir, f'{i+1:02d}.jpg'), 'JPEG',
                 quality=QUALITY, optimize=True, progressive=True)
        total += 1
    doc.close()

    size = sum(os.path.getsize(os.path.join(outdir, f)) for f in os.listdir(outdir))
    print(f'{total}쪽 → assets/projects/{a.slug}/  ({size/1048576:.1f}MB)')

    block = {'t': 'gallery', 'dir': f'assets/projects/{a.slug}',
             'pages': total, 'title': a.title}

    if a.doc:
        cpath = os.path.join(ROOT, 'data', 'content.json')
        data = json.load(open(cpath, encoding='utf-8'))
        d = data['docs'].get(a.doc)
        if not d:
            sys.exit(f'문서를 찾을 수 없습니다: {a.doc}')
        for s in d['sections']:
            s['blocks'] = [b for b in s['blocks']
                           if not (b.get('t') == 'gallery' and b.get('dir') == block['dir'])]
        d['sections'][-1]['blocks'].append(block)
        json.dump(data, open(cpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        open(cpath, 'a', encoding='utf-8').write('\n')
        print(f'"{a.doc}" 문서 마지막 섹션에 갤러리 블록을 등록했습니다.')
    else:
        print(json.dumps(block, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()

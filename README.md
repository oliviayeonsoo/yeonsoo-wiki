# 연수위키

나무위키 인물 문서 형식으로 만든 포트폴리오.

빌드 도구도 의존성도 없다. `index.html` + `assets/` + `data/content.json` 이 전부다.

---

## 실행

**사이트 보기**

```bash
python3 -m http.server 8123
```

→ http://localhost:8123

**내용 편집 (관리자)**

```bash
node tools/admin.mjs
```

→ http://127.0.0.1:8124 (기본 비밀번호 `yeonsu`)

관리자 서버는 `127.0.0.1` 에만 바인딩되므로 같은 네트워크의 다른 기기에서도 접속할 수 없고,
배포 대상에서도 제외된다. 비밀번호를 바꾸려면 `tools/.adminpass` 파일에 한 줄로 적으면 된다.

### 저장과 공개는 다르다

| 버튼 | 하는 일 | 어디까지 반영되나 |
|---|---|---|
| **저장** (⌘S) | `data/content.json` 을 고친다 | 이 컴퓨터에서만 |
| **공개하기** | 커밋하고 GitHub 에 푸시한다 | 약 1분 뒤 공개 사이트 |

저장만 하고 공개하기를 누르지 않으면 폰이나 다른 사람 화면에는 예전 내용이 그대로 보인다.
공개할 게 남아 있으면 **공개하기** 버튼에 주황색 숫자가 뜬다.

---

## 구조

```
index.html              페이지 껍데기
assets/style.css        나무위키 시각 언어 (라이트·다크·반응형)
assets/app.js           렌더러 + 인터랙션
data/content.json       ★ 모든 내용이 여기에 있다
data/backups/           저장할 때마다 자동 백업 (배포 제외)
tools/admin.mjs         로컬 관리자 서버 (배포 제외)
tools/admin.html        편집 화면 (배포 제외)
docs/                   설계 문서 (배포 제외)
```

## 본문 표기법

`data/content.json` 의 텍스트에서 쓸 수 있는 문법.

| 표기 | 결과 |
|---|---|
| `'''강조'''` | **굵게** |
| `[[공연수/경력]]` | 내부 문서 링크 (없는 문서면 빨간 링크) |
| `[[공연수/경력\|경력]]` | 라벨을 따로 지정 |
| `[라벨](https://…)` | 외부 링크 |
| `[fn:1]` | 각주 — 해당 문서 `footnotes` 배열의 1번 |
| `{{미확인}}` | 아직 안 채운 값. 노란 형광펜으로 표시되고 관리자 화면에 자동 수집된다 |
| `<br>`, `<span class="muted">` | 제한적 HTML 허용 |

## 배포

`main` 브랜치에 푸시하면 GitHub Actions가 GitHub Pages로 배포한다
(`.github/workflows/deploy.yml`). 저장소 설정에서 **Settings → Pages → Source 를
"GitHub Actions"** 로 한 번 지정해두면 이후로는 자동이다.

`tools/`, `docs/`, `data/backups/` 는 배포에 포함되지 않는다.

---

## 설계 문서

- [`docs/namuwiki-ux-analysis.md`](docs/namuwiki-ux-analysis.md) — 원본 나무위키 문서 UX/UI 실측 분석
- [`docs/content-structure.md`](docs/content-structure.md) — 나무위키 컴포넌트 → 포트폴리오 치환 매핑
- [`docs/content-draft.md`](docs/content-draft.md) — 본문 초안

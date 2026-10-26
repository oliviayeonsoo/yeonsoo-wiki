# 작업 규칙

## 공모전 덱 (Figma Slides)

대상 파일: https://www.figma.com/slides/oHm56PVa1mzuVZtl0KqXN4
배경 자료: `docs/contest-2bank.md`, `docs/contest-2bank-plan.md`, `docs/contest-2bank-differentiation.md`

### 1. 도구
- Figma MCP(`use_figma`)는 **읽기와 스크린샷 확인용**으로 쓴다.
- 쓰기가 막히면 `~/Downloads/hp_plugin` 로컬 개발 플러그인의 `code.js`를 새로 쓰고, computer-use로 Figma 상단 메뉴 **플러그인 > 개발 > HP Add Slides**를 클릭해 실행한다.
  - 코드는 `try/catch`로 감싸고 끝에 `figma.closePlugin('메시지')`를 호출한다.
  - Pretendard 폰트를 로드해서 쓴다.
  - 새 요소는 **이름을 붙인 그룹**으로 묶는다.
  - 기존 요소는 **지우지 말고 숨긴다**(`visible = false`).
  - 이 경로는 사용자 맥(로컬 세션)에서만 가능하다. 클라우드 세션에는 `~/Downloads`와 Figma 데스크톱이 없다.

### 2. 발표자 메모
- `write_clipboard`로 내용을 넣는다 → 메모 칸 클릭 → `cmd+a` → `Backspace` → 상단 메뉴 **편집 > 붙여넣기** 클릭.
- `cmd+v` 키 입력은 먹지 않는다.

### 3. 쓰기 전 다시 읽기
- 쓰기 전에는 항상 MCP로 현재 상태를 다시 읽는다. 팀원이 동시에 편집 중일 수 있다.

### 4. 디자인 (AI 티 나지 않게)
- 박스·카드를 나열하지 말고, **구체적인 장면 하나**(예: 달력)를 크게 보여준다.
- **핵심만** 덱 메인 컬러로 강조하고, 나머지는 연회색과 여백으로 둔다.
- 밋밋한 항목 나열은 덱 컬러에 맞춘 **소프트 3D 아이콘**으로 대신한다.
  - 겹친 종이, 흰색 → 연한 메인 컬러 그라데이션, 메인 컬러의 옅은 그림자, 원형 배지.
- **중간점(·) 나열 금지.**

### 덱 컬러
- 메인: 네이비 `#0B1F4F` (단계: `#071433` `#3B4E7E` `#8C98B8` `#D9DEEA`)
- 강조: 노랑 `#FFE300`
- 폰트: Pretendard

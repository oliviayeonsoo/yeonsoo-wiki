// 덱 목업을 PoC 최신 화면(UXUI 2026.11.9)에 맞춘다. 실행: ~/Downloads/hp_plugin/code.js 로 복사 후 Figma Slides 덱에서 플러그인 > 개발 > HP Add Slides
// 1) 숫자 맞추기: 12쪽 AS-IS 카드(9,320,000원, A 2,180,000원), 12쪽과 11쪽 이체 확인(S4), 11쪽 급여일 미리보기(S3)
// 2) 모국어 명세서(E2) 교체: 10쪽, 11쪽, 13쪽. 13쪽 공제 설명 확대 카드에 베트남어 설명 추가
// 3) 13쪽 문의 카드 → 사장님께 보낼 한국어 메시지와 모국어 뜻풀이(E3)
// 4) 4대보험: 11쪽 S4, S5, S6 화면을 PoC 것으로 바꿔 4대보험 카드와 납부 줄이 보이게
// 5) 보관함: 11쪽 S6에 직원별 명세서 보관함 카드, 14쪽 PDF 카드 → 직원별 명세서 보관함 카드
// 예전 화면과 카드는 지우지 않고 숨긴다. 새 화면은 "(PoC 최신)" 이름의 그룹. 다시 실행하면 이미 바뀐 곳은 건너뛴다.
// 화면 데이터: 배포된 PoC(?v=20261109i)를 402x874로 렌더링해 뽑은 값. 아래 고정 버튼은 실제 폰처럼 화면 아래에 붙였다.
const SCREENS = {"S3":{"name":"S3 급여일 미리보기 (잔액 부족)","h":793,"nodes":[{"t":"rect","x":0,"y":0,"w":402,"h":793,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"div"},{"t":"rect","x":0,"y":0,"w":402,"h":793,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"screen"},{"t":"svg","x":18,"y":16,"w":24,"h":24,"svg":"<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><path d=\"M15 5l-7 7 7 7\" fill=\"none\" stroke=\"rgb(25, 31, 40)\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","op":1},{"t":"text","x":171.6,"y":18,"w":58.9,"h":20,"lines":1,"text":"9월 급여","size":17,"weight":600,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":20,"y":64,"w":43.2,"h":23,"bg":"rgb(11, 31, 79)","border":null,"rad":[11.5,11.5,11.5,11.5],"op":1,"name":"dday"},{"t":"text","x":30,"y":68,"w":23.2,"h":15,"lines":1,"text":"D-3","size":13,"weight":700,"color":"rgb(255, 255, 255)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":20,"y":102.3,"w":227.6,"h":29,"lines":1,"text":"급여일까지 3일 남았어요","size":24,"weight":700,"color":"rgb(25, 31, 40)","lh":"32.4px","ls":"-0.48px","align":"left","op":1},{"t":"rect","x":20,"y":151.4,"w":362,"h":122,"bg":"rgb(242, 244, 246)","border":null,"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"text","x":36,"y":169.4,"w":145.5,"h":15,"lines":1,"text":"이번 달 급여 (사장이지 계산)","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":36,"y":194.4,"w":173.8,"h":36,"lines":1,"text":"9,320,000원","size":30,"weight":800,"color":"rgb(25, 31, 40)","lh":"normal","ls":"-0.6px","align":"left","op":1},{"t":"text","x":36,"y":240.4,"w":45,"h":15,"lines":1,"text":"직원 3명","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":20,"y":289.4,"w":362,"h":146,"bg":"rgb(255, 247, 194)","border":{"c":"rgb(255, 227, 0)","w":2},"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"rect","x":323.7,"y":280.4,"w":44.3,"h":19,"bg":"rgb(255, 227, 0)","border":null,"rad":[9.5,9.5,9.5,9.5],"op":1,"name":"badge-new"},{"t":"text","x":332.7,"y":283.4,"w":26.3,"h":13,"lines":1,"text":"NEW","size":11,"weight":800,"color":"rgb(11, 31, 79)","lh":"normal","ls":"0.22px","align":"left","op":1},{"t":"text","x":38,"y":309.4,"w":196.1,"h":19,"lines":1,"text":"잔액이 1,000,000원 부족해요","size":16,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":337.9,"w":263.1,"h":16,"lines":1,"text":"급여일 전에 사업자 운전자금으로 채울 수 있어요","size":14,"weight":400,"color":"rgb(51, 61, 75)","lh":"21px","ls":"normal","align":"left","op":1},{"t":"rect","x":38,"y":369.4,"w":326,"h":46,"bg":"rgb(255, 255, 255)","border":null,"rad":[14,14,14,14],"op":1,"name":"btn"},{"t":"text","x":160.3,"y":383.4,"w":81.4,"h":18,"lines":1,"text":"한도 확인하기","size":15,"weight":600,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":0,"y":709,"w":402,"h":118,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"cta"},{"t":"rect","x":20,"y":721,"w":362,"h":56,"bg":"rgb(11, 31, 79)","border":null,"rad":[14,14,14,14],"op":1,"name":"btn"},{"t":"text","x":162.2,"y":739,"w":77.5,"h":20,"lines":1,"text":"급여 보내기","size":17,"weight":600,"color":"rgb(255, 255, 255)","lh":"normal","ls":"normal","align":"left","op":1}]},"S4":{"name":"S4 이체 확인 (경고와 4대보험)","h":793,"nodes":[{"t":"rect","x":0,"y":0,"w":402,"h":923.4,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"div"},{"t":"rect","x":0,"y":0,"w":402,"h":923.4,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"screen"},{"t":"svg","x":18,"y":16,"w":24,"h":24,"svg":"<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><path d=\"M15 5l-7 7 7 7\" fill=\"none\" stroke=\"rgb(25, 31, 40)\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","op":1},{"t":"text","x":169.6,"y":18,"w":62.8,"h":20,"lines":1,"text":"이체 확인","size":17,"weight":600,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":20,"y":63.3,"w":323,"h":29,"lines":1,"text":"3명에게 9,320,000원을 보낼게요","size":24,"weight":700,"color":"rgb(25, 31, 40)","lh":"32.4px","ls":"-0.48px","align":"left","op":1},{"t":"rect","x":20,"y":112.4,"w":362,"h":135,"bg":"rgb(242, 244, 246)","border":null,"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"text","x":36,"y":130.4,"w":48.2,"h":15,"lines":1,"text":"받는 사람","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":36,"y":155.4,"w":69.1,"h":18,"lines":1,"text":"응우옌 반 A","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":285.1,"y":155.4,"w":80.9,"h":18,"lines":1,"text":"2,180,000원","size":15,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":36,"y":183.4,"w":42.8,"h":18,"lines":1,"text":"쩐 티 B","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":281.4,"y":183.4,"w":84.6,"h":18,"lines":1,"text":"2,420,000원","size":15,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":36,"y":211.4,"w":27.1,"h":18,"lines":1,"text":"람 C","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":282.6,"y":211.4,"w":83.4,"h":18,"lines":1,"text":"4,720,000원","size":15,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":20,"y":263.4,"w":362,"h":136,"bg":"rgb(255, 247, 194)","border":{"c":"rgb(255, 227, 0)","w":2},"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"rect","x":323.7,"y":254.4,"w":44.3,"h":19,"bg":"rgb(255, 227, 0)","border":null,"rad":[9.5,9.5,9.5,9.5],"op":1,"name":"badge-new"},{"t":"text","x":332.7,"y":257.4,"w":26.3,"h":13,"lines":1,"text":"NEW","size":11,"weight":800,"color":"rgb(11, 31, 79)","lh":"normal","ls":"0.22px","align":"left","op":1},{"t":"text","x":38,"y":283.4,"w":149.4,"h":19,"lines":1,"text":"이체 전에 확인해 주세요","size":16,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":311.9,"w":314.2,"h":37,"lines":2,"text":"응우옌 반 A의 숙식비 공제가 서면 동의 금액(300,000원)보다 많아요","size":14,"weight":400,"color":"rgb(51, 61, 75)","lh":"21px","ls":"normal","align":"start","op":1},{"t":"text","x":38,"y":364.4,"w":144.6,"h":15,"lines":1,"text":"판정이 아닌 참고 알림이에요","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":20,"y":415.4,"w":24,"h":24,"bg":"rgb(11, 31, 79)","border":null,"rad":[12,12,12,12],"op":1,"name":"check-dot"},{"t":"svg","x":24,"y":419.4,"w":16,"h":16,"svg":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 12.5l4 4 8-9\" fill=\"none\" stroke=\"rgb(255, 255, 255)\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","op":1},{"t":"text","x":54,"y":418.4,"w":111.3,"h":18,"lines":1,"text":"최저임금 확인 완료","size":15,"weight":400,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":22,"y":461.4,"w":111.3,"h":18,"lines":1,"text":"명세서 함께 보내기","size":15,"weight":400,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":330,"y":455.4,"w":50,"h":30,"bg":"rgb(11, 31, 79)","border":null,"rad":[15,15,15,15],"op":1,"name":"toggle"},{"t":"rect","x":353,"y":458.4,"w":24,"h":24,"bg":"rgb(255, 255, 255)","border":null,"rad":[12,12,12,12],"op":1,"name":"i"},{"t":"rect","x":20,"y":501.4,"w":362,"h":314,"bg":"rgb(255, 255, 255)","border":{"c":"rgb(255, 227, 0)","w":2},"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"rect","x":323.7,"y":492.4,"w":44.3,"h":19,"bg":"rgb(255, 227, 0)","border":null,"rad":[9.5,9.5,9.5,9.5],"op":1,"name":"badge-new"},{"t":"text","x":332.7,"y":495.4,"w":26.3,"h":13,"lines":1,"text":"NEW","size":11,"weight":800,"color":"rgb(11, 31, 79)","lh":"normal","ls":"0.22px","align":"left","op":1},{"t":"text","x":38,"y":521.4,"w":187.5,"h":19,"lines":1,"text":"이번 달 4대보험료도 챙길게요","size":16,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":550.4,"w":167.1,"h":15,"lines":1,"text":"국민건강보험공단 통합 고지 기준","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":575.4,"w":138.2,"h":18,"lines":1,"text":"직원 몫 (급여에서 공제)","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":292.1,"y":575.4,"w":71.9,"h":18,"lines":1,"text":"380,000원","size":15,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":603.4,"w":55.6,"h":18,"lines":1,"text":"사장님 몫","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":294.6,"y":603.4,"w":69.4,"h":18,"lines":1,"text":"418,000원","size":15,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":38,"y":643.4,"w":326,"h":1,"bg":"rgba(0, 0, 0, 0)","border":{"c":"rgb(229, 232, 235)","w":1},"rad":[0,0,0,0],"op":1,"name":"hr"},{"t":"text","x":38,"y":666.4,"w":85.3,"h":18,"lines":1,"text":"공단에 낼 금액","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":291.5,"y":666.4,"w":72.5,"h":18,"lines":1,"text":"798,000원","size":15,"weight":600,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":38,"y":698.4,"w":326,"h":42,"bg":"rgb(242, 244, 246)","border":null,"rad":[10,10,10,10],"op":1,"name":"seg"},{"t":"rect","x":41,"y":701.4,"w":160,"h":36,"bg":"rgb(255, 255, 255)","border":null,"rad":[8,8,8,8],"op":1,"name":"on"},{"t":"text","x":64.3,"y":711.4,"w":113.3,"h":16,"lines":1,"text":"10월 10일 자동 납부","size":14,"weight":600,"color":"rgb(11, 31, 79)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":241.2,"y":711.4,"w":79.6,"h":16,"lines":1,"text":"지금 함께 내기","size":14,"weight":400,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":750.4,"w":324.8,"h":45,"lines":3,"text":"직원 몫은 명세서의 보험료 공제와 같은 금액이에요. 외국인 직원은 국적에 따라 국민연금 적용이 달라서, 공단 고지액을 그대로 반영해요.","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"start","op":1},{"t":"rect","x":0,"y":709.0,"w":402,"h":118,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"cta"},{"t":"rect","x":20,"y":721.0,"w":136.1,"h":56,"bg":"rgb(242, 244, 246)","border":null,"rad":[14,14,14,14],"op":1,"name":"btn"},{"t":"text","x":58.7,"y":739.0,"w":58.8,"h":20,"lines":1,"text":"수정하기","size":17,"weight":600,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":164.1,"y":721.0,"w":217.9,"h":56,"bg":"rgb(11, 31, 79)","border":null,"rad":[14,14,14,14],"op":1,"name":"btn"},{"t":"text","x":227,"y":739.0,"w":92.2,"h":20,"lines":1,"text":"그대로 보내기","size":17,"weight":600,"color":"rgb(255, 255, 255)","lh":"normal","ls":"normal","align":"left","op":1}]},"S5":{"name":"S5 이체 완료","h":793,"nodes":[{"t":"rect","x":0,"y":0,"w":402,"h":793,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"div"},{"t":"rect","x":0,"y":0,"w":402,"h":793,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"screen"},{"t":"rect","x":165,"y":48,"w":72,"h":72,"bg":"rgb(11, 31, 79)","border":null,"rad":[36,36,36,36],"op":1,"name":"big-check"},{"t":"svg","x":180,"y":63,"w":42,"h":42,"svg":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 12.5l4 4 8-9\" fill=\"none\" stroke=\"rgb(255, 255, 255)\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","op":1},{"t":"text","x":111,"y":136,"w":180.1,"h":36,"lines":1,"text":"9,520,000원","size":30,"weight":800,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":145.7,"y":188,"w":110.7,"h":19,"lines":1,"text":"3명에게 보냈어요","size":16,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":20,"y":223,"w":362,"h":246,"bg":"rgb(255, 255, 255)","border":{"c":"rgb(255, 227, 0)","w":2},"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"rect","x":323.7,"y":214,"w":44.3,"h":19,"bg":"rgb(255, 227, 0)","border":null,"rad":[9.5,9.5,9.5,9.5],"op":1,"name":"badge-new"},{"t":"text","x":332.7,"y":217,"w":26.3,"h":13,"lines":1,"text":"NEW","size":11,"weight":800,"color":"rgb(11, 31, 79)","lh":"normal","ls":"0.22px","align":"left","op":1},{"t":"text","x":38,"y":243,"w":177,"h":19,"lines":1,"text":"지급 확인 명세서를 보냈어요","size":16,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":272,"w":69.1,"h":18,"lines":1,"text":"응우옌 반 A","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":282.5,"y":272,"w":81.5,"h":18,"lines":1,"text":"베트남어 카톡","size":15,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":300,"w":42.8,"h":18,"lines":1,"text":"쩐 티 B","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":282.5,"y":300,"w":81.5,"h":18,"lines":1,"text":"베트남어 카톡","size":15,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":328,"w":27.1,"h":18,"lines":1,"text":"람 C","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":295.5,"y":328,"w":68.5,"h":18,"lines":1,"text":"네팔어 카톡","size":15,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":38,"y":368,"w":326,"h":1,"bg":"rgba(0, 0, 0, 0)","border":{"c":"rgb(229, 232, 235)","w":1},"rad":[0,0,0,0],"op":1,"name":"hr"},{"t":"rect","x":38,"y":391,"w":24,"h":24,"bg":"rgb(11, 31, 79)","border":null,"rad":[12,12,12,12],"op":1,"name":"check-dot"},{"t":"svg","x":42,"y":395,"w":16,"h":16,"svg":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 12.5l4 4 8-9\" fill=\"none\" stroke=\"rgb(255, 255, 255)\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","op":1},{"t":"text","x":72,"y":395,"w":237,"h":16,"lines":1,"text":"은행이 9월 25일 14:02 지급을 확인했어요","size":14,"weight":400,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":38,"y":425,"w":24,"h":24,"bg":"rgb(11, 31, 79)","border":null,"rad":[12,12,12,12],"op":1,"name":"check-dot"},{"t":"svg","x":42,"y":429,"w":16,"h":16,"svg":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 12.5l4 4 8-9\" fill=\"none\" stroke=\"rgb(255, 255, 255)\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","op":1},{"t":"text","x":72,"y":429,"w":289.4,"h":16,"lines":1,"text":"4대보험료 798,000원은 10월 10일에 자동으로 내요","size":14,"weight":400,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":0,"y":709,"w":402,"h":118,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"cta"},{"t":"rect","x":20,"y":721,"w":362,"h":56,"bg":"rgb(11, 31, 79)","border":null,"rad":[14,14,14,14],"op":1,"name":"btn"},{"t":"text","x":186.3,"y":739,"w":29.4,"h":20,"lines":1,"text":"확인","size":17,"weight":600,"color":"rgb(255, 255, 255)","lh":"normal","ls":"normal","align":"left","op":1}]},"S6":{"name":"S6 급여 기록","h":793,"nodes":[{"t":"rect","x":0,"y":0,"w":402,"h":793,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"div"},{"t":"rect","x":0,"y":0,"w":402,"h":793,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"screen"},{"t":"svg","x":18,"y":16,"w":24,"h":24,"svg":"<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><path d=\"M15 5l-7 7 7 7\" fill=\"none\" stroke=\"rgb(25, 31, 40)\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","op":1},{"t":"text","x":169.6,"y":18,"w":62.8,"h":20,"lines":1,"text":"급여 기록","size":17,"weight":600,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":20,"y":63.3,"w":126.4,"h":29,"lines":1,"text":"9월 급여 기록","size":24,"weight":700,"color":"rgb(25, 31, 40)","lh":"32.4px","ls":"-0.48px","align":"left","op":1},{"t":"rect","x":20,"y":112.4,"w":362,"h":206,"bg":"rgb(255, 255, 255)","border":{"c":"rgb(255, 227, 0)","w":2},"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"rect","x":323.7,"y":103.4,"w":44.3,"h":19,"bg":"rgb(255, 227, 0)","border":null,"rad":[9.5,9.5,9.5,9.5],"op":1,"name":"badge-new"},{"t":"text","x":332.7,"y":106.4,"w":26.3,"h":13,"lines":1,"text":"NEW","size":11,"weight":800,"color":"rgb(11, 31, 79)","lh":"normal","ls":"0.22px","align":"left","op":1},{"t":"text","x":38,"y":132.4,"w":72.8,"h":19,"lines":1,"text":"열람과 대조","size":16,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":161.4,"w":69.1,"h":18,"lines":1,"text":"응우옌 반 A","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":258.4,"y":161.4,"w":105.6,"h":18,"lines":1,"text":"발송 완료, 열람 전","size":15,"weight":500,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":189.4,"w":42.8,"h":18,"lines":1,"text":"쩐 티 B","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":265.9,"y":189.4,"w":98.1,"h":18,"lines":1,"text":"열람과 대조 완료","size":15,"weight":500,"color":"rgb(11, 31, 79)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":217.4,"w":27.1,"h":18,"lines":1,"text":"람 C","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":314.7,"y":217.4,"w":49.3,"h":18,"lines":1,"text":"문의 1건","size":15,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":38,"y":257.4,"w":326,"h":1,"bg":"rgba(0, 0, 0, 0)","border":{"c":"rgb(229, 232, 235)","w":1},"rad":[0,0,0,0],"op":1,"name":"hr"},{"t":"text","x":38,"y":280.4,"w":61.2,"h":18,"lines":1,"text":"4대보험료","size":15,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":213.7,"y":280.4,"w":150.3,"h":18,"lines":1,"text":"10월 10일 자동 납부 예약","size":15,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":20,"y":334.4,"w":362,"h":162,"bg":"rgb(242, 244, 246)","border":null,"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"text","x":36,"y":352.4,"w":60.5,"h":15,"lines":1,"text":"람 C의 문의","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":36,"y":377.4,"w":132.4,"h":20,"lines":1,"text":"“숙식비가 뭐예요?”","size":17,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":36,"y":407.4,"w":141.4,"h":15,"lines":1,"text":"네팔어에서 한국어로 번역됨","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":36,"y":432.4,"w":330,"h":46,"bg":"rgb(255, 255, 255)","border":null,"rad":[14,14,14,14],"op":1,"name":"btn"},{"t":"text","x":175.1,"y":446.4,"w":51.9,"h":18,"lines":1,"text":"답장하기","size":15,"weight":600,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":20,"y":512.4,"w":362,"h":78,"bg":"rgb(255, 255, 255)","border":{"c":"rgb(255, 227, 0)","w":2},"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"rect","x":323.7,"y":503.4,"w":44.3,"h":19,"bg":"rgb(255, 227, 0)","border":null,"rad":[9.5,9.5,9.5,9.5],"op":1,"name":"badge-new"},{"t":"text","x":332.7,"y":506.4,"w":26.3,"h":13,"lines":1,"text":"NEW","size":11,"weight":800,"color":"rgb(11, 31, 79)","lh":"normal","ls":"0.22px","align":"left","op":1},{"t":"text","x":38,"y":532.4,"w":131.8,"h":19,"lines":1,"text":"직원별 명세서 보관함","size":16,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":555.4,"w":233.1,"h":15,"lines":1,"text":"보낸 명세서와 열람 기록을 직원마다 모아 봐요","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":331.3,"y":543.4,"w":32.7,"h":16,"lines":1,"text":"보기 ›","size":14,"weight":700,"color":"rgb(11, 31, 79)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":20,"y":606.4,"w":362,"h":78,"bg":"rgb(255, 255, 255)","border":{"c":"rgb(255, 227, 0)","w":2},"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"rect","x":323.7,"y":597.4,"w":44.3,"h":19,"bg":"rgb(255, 227, 0)","border":null,"rad":[9.5,9.5,9.5,9.5],"op":1,"name":"badge-new"},{"t":"text","x":332.7,"y":600.4,"w":26.3,"h":13,"lines":1,"text":"NEW","size":11,"weight":800,"color":"rgb(11, 31, 79)","lh":"normal","ls":"0.22px","align":"left","op":1},{"t":"text","x":38,"y":626.4,"w":121.5,"h":19,"lines":1,"text":"성실 지급 12개월째","size":16,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":649.4,"w":170.4,"h":15,"lines":1,"text":"사업자 대출 금리 우대 대상이에요","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":303.9,"y":637.4,"w":60.1,"h":16,"lines":1,"text":"혜택 보기 ›","size":14,"weight":700,"color":"rgb(11, 31, 79)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":0,"y":709,"w":402,"h":118,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"cta"},{"t":"rect","x":20,"y":721,"w":362,"h":56,"bg":"rgb(11, 31, 79)","border":null,"rad":[14,14,14,14],"op":1,"name":"btn"},{"t":"text","x":137,"y":739,"w":128.1,"h":20,"lines":1,"text":"기록 PDF 내려받기","size":17,"weight":600,"color":"rgb(255, 255, 255)","lh":"normal","ls":"normal","align":"left","op":1}]},"E2":{"name":"E2 모국어 명세서","h":793,"nodes":[{"t":"rect","x":0,"y":0,"w":402,"h":1016.8,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"div"},{"t":"rect","x":0,"y":0,"w":402,"h":1016.8,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"screen"},{"t":"svg","x":18,"y":16,"w":24,"h":24,"svg":"<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><path d=\"M15 5l-7 7 7 7\" fill=\"none\" stroke=\"rgb(25, 31, 40)\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","op":1},{"t":"text","x":56,"y":18,"w":154.4,"h":20,"lines":1,"text":"Bảng lương tháng 9","size":17,"weight":600,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":301.1,"y":14,"w":80.9,"h":28,"bg":"rgb(242, 244, 246)","border":null,"rad":[14,14,14,14],"op":1,"name":"pill"},{"t":"text","x":311.1,"y":21,"w":60.9,"h":15,"lines":1,"text":"Tiếng Việt","size":13,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":20,"y":64,"w":362,"h":115,"bg":"rgb(255, 255, 255)","border":{"c":"rgb(255, 227, 0)","w":2},"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"rect","x":323.7,"y":55,"w":44.3,"h":19,"bg":"rgb(255, 227, 0)","border":null,"rad":[9.5,9.5,9.5,9.5],"op":1,"name":"badge-new"},{"t":"text","x":332.7,"y":58,"w":26.3,"h":13,"lines":1,"text":"NEW","size":11,"weight":800,"color":"rgb(11, 31, 79)","lh":"normal","ls":"0.22px","align":"left","op":1},{"t":"rect","x":38,"y":84,"w":24,"h":24,"bg":"rgb(11, 31, 79)","border":null,"rad":[12,12,12,12],"op":1,"name":"check-dot"},{"t":"svg","x":42,"y":84,"w":16,"h":16,"svg":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 12.5l4 4 8-9\" fill=\"none\" stroke=\"rgb(255, 255, 255)\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","op":1},{"t":"text","x":74,"y":84,"w":190.9,"h":19,"lines":1,"text":"명세서 금액과 입금액이 같아요","size":16,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":74,"y":108,"w":185.9,"h":16,"lines":1,"text":"Số tiền khớp với tiền đã nhận","size":14,"weight":500,"color":"rgb(11, 31, 79)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":74,"y":129,"w":260.6,"h":30,"lines":2,"text":"Ngân hàng đã xác nhận thanh toán lúc 14:02 ngày 25/9","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"start","op":1},{"t":"rect","x":20,"y":195,"w":362,"h":301,"bg":"rgb(242, 244, 246)","border":null,"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"text","x":36,"y":214,"w":77.9,"h":15,"lines":1,"text":"Chi tiết lương","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":36,"y":242,"w":93.9,"h":18,"lines":1,"text":"Lương cơ bản","size":15,"weight":500,"color":"rgb(78, 89, 104)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":36,"y":262,"w":31.1,"h":14,"lines":1,"text":"기본급","size":12,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":289.8,"y":249,"w":76.2,"h":19,"lines":1,"text":"2,600,000","size":16,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":28,"y":288,"w":346,"h":51,"bg":"rgb(255, 247, 194)","border":null,"rad":[10,10,10,10],"op":1,"name":"slip-row"},{"t":"text","x":36,"y":297,"w":63.6,"h":18,"lines":1,"text":"Tiền ăn ở","size":15,"weight":500,"color":"rgb(78, 89, 104)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"svg","x":103.6,"y":297.5,"w":16,"h":16,"svg":"<svg viewBox=\"0 0 20 20\" width=\"16\" height=\"16\" aria-hidden=\"true\"><circle cx=\"10\" cy=\"10\" r=\"8\" fill=\"none\" stroke=\"rgb(107, 118, 132)\" stroke-width=\"1.4\"></circle><path d=\"M10 9v5M10 6.2v.1\" stroke=\"rgb(107, 118, 132)\" stroke-width=\"1.6\" stroke-linecap=\"round\"></path></svg>","op":1},{"t":"text","x":36,"y":317,"w":31.1,"h":14,"lines":1,"text":"숙식비","size":12,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":299.2,"y":304,"w":66.8,"h":19,"lines":1,"text":"-150,000","size":16,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":36,"y":352,"w":63.8,"h":18,"lines":1,"text":"Bảo hiểm","size":15,"weight":500,"color":"rgb(78, 89, 104)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"svg","x":103.8,"y":352.5,"w":16,"h":16,"svg":"<svg viewBox=\"0 0 20 20\" width=\"16\" height=\"16\" aria-hidden=\"true\"><circle cx=\"10\" cy=\"10\" r=\"8\" fill=\"none\" stroke=\"rgb(107, 118, 132)\" stroke-width=\"1.4\"></circle><path d=\"M10 9v5M10 6.2v.1\" stroke=\"rgb(107, 118, 132)\" stroke-width=\"1.6\" stroke-linecap=\"round\"></path></svg>","op":1},{"t":"text","x":36,"y":372,"w":31.1,"h":14,"lines":1,"text":"보험료","size":12,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":307.7,"y":359,"w":58.3,"h":19,"lines":1,"text":"-70,000","size":16,"weight":500,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":36,"y":410,"w":330,"h":1,"bg":"rgba(0, 0, 0, 0)","border":{"c":"rgb(229, 232, 235)","w":1},"rad":[0,0,0,0],"op":1,"name":"hr"},{"t":"text","x":36,"y":436,"w":76.1,"h":18,"lines":1,"text":"Thực nhận","size":15,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":36,"y":456,"w":31.1,"h":14,"lines":1,"text":"실수령","size":12,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":267.9,"y":441,"w":98.1,"h":23,"lines":1,"text":"2,380,000","size":19,"weight":800,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"rect","x":20,"y":512,"w":362,"h":173,"bg":"rgb(255, 247, 194)","border":{"c":"rgb(255, 227, 0)","w":2},"rad":[16,16,16,16],"op":1,"name":"card"},{"t":"rect","x":323.7,"y":503,"w":44.3,"h":19,"bg":"rgb(255, 227, 0)","border":null,"rad":[9.5,9.5,9.5,9.5],"op":1,"name":"badge-new"},{"t":"text","x":332.7,"y":506,"w":26.3,"h":13,"lines":1,"text":"NEW","size":11,"weight":800,"color":"rgb(11, 31, 79)","lh":"normal","ls":"0.22px","align":"left","op":1},{"t":"text","x":38,"y":533,"w":112.6,"h":19,"lines":1,"text":"Tiền ăn ở là gì?","size":16,"weight":700,"color":"rgb(25, 31, 40)","lh":"normal","ls":"normal","align":"left","op":1},{"t":"text","x":38,"y":561.5,"w":324.2,"h":58,"lines":3,"text":"Là chi phí chỗ ở và bữa ăn do chủ cửa hàng cung cấp. Chỉ được trừ tối đa số tiền bạn đã đồng ý bằng văn bản.","size":14,"weight":400,"color":"rgb(51, 61, 75)","lh":"21px","ls":"normal","align":"start","op":1},{"t":"text","x":38,"y":635,"w":318.3,"h":30,"lines":2,"text":"사장님이 제공한 숙소와 식사 비용이에요. 서면으로 동의한 금액까지만 빠져요.","size":13,"weight":400,"color":"rgb(107, 118, 132)","lh":"normal","ls":"normal","align":"start","op":1},{"t":"rect","x":20,"y":701,"w":176,"h":119.8,"bg":"rgb(242, 244, 246)","border":null,"rad":[16,16,16,16],"op":1,"name":"tile2"},{"t":"rect","x":36,"y":717,"w":40,"h":40,"bg":"rgb(255, 255, 255)","border":null,"rad":[12,12,12,12],"op":1,"name":"tile2-icon"},{"t":"svg","x":45,"y":726,"w":22,"h":22,"svg":"<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path d=\"M7 3h7l4 4v14H7z\" fill=\"none\" stroke=\"rgb(11, 31, 79)\" stroke-width=\"1.8\" stroke-linejoin=\"round\"></path><path d=\"M14 3v4h4M10 12h5M10 16h5\" fill=\"none\" stroke=\"rgb(11, 31, 79)\" stroke-width=\"1.8\" stroke-linecap=\"round\"></path></svg>","op":1},{"t":"text","x":36,"y":766.5,"w":141.8,"h":34.9,"lines":2,"text":"Bảng lương các tháng trước","size":14,"weight":600,"color":"rgb(25, 31, 40)","lh":"18.9px","ls":"normal","align":"left","op":1},{"t":"rect","x":206,"y":701,"w":176,"h":119.8,"bg":"rgb(242, 244, 246)","border":null,"rad":[16,16,16,16],"op":1,"name":"tile2"},{"t":"rect","x":222,"y":717,"w":40,"h":40,"bg":"rgb(255, 255, 255)","border":null,"rad":[12,12,12,12],"op":1,"name":"tile2-icon"},{"t":"svg","x":231,"y":726,"w":22,"h":22,"svg":"<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"rgb(11, 31, 79)\" stroke-width=\"1.8\"></circle><path d=\"M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18\" fill=\"none\" stroke=\"rgb(11, 31, 79)\" stroke-width=\"1.6\"></path></svg>","op":1},{"t":"text","x":222,"y":766.5,"w":106.3,"h":16,"lines":1,"text":"Gửi tiền về nước","size":14,"weight":600,"color":"rgb(25, 31, 40)","lh":"18.9px","ls":"normal","align":"left","op":1},{"t":"text","x":20,"y":836.8,"w":349.1,"h":32,"lines":2,"text":"Bảng lương ghi bản gốc tiếng Hàn kèm tiếng mẹ đẻ của bạn. Bản tiếng Hàn có giá trị pháp lý.","size":12,"weight":400,"color":"rgb(107, 118, 132)","lh":"18px","ls":"normal","align":"start","op":1},{"t":"text","x":20,"y":872.8,"w":354.7,"h":32,"lines":2,"text":"명세서는 한국어 원문에 직원 모국어를 함께 적어요. 법적 효력은 한국어 원문 기준이에요.","size":12,"weight":400,"color":"rgb(107, 118, 132)","lh":"18px","ls":"normal","align":"start","op":1},{"t":"rect","x":0,"y":708.8,"w":402,"h":118,"bg":"rgb(255, 255, 255)","border":null,"rad":[0,0,0,0],"op":1,"name":"cta"},{"t":"rect","x":20,"y":720.8,"w":362,"h":56,"bg":"rgb(11, 31, 79)","border":null,"rad":[14,14,14,14],"op":1,"name":"btn"},{"t":"text","x":132.1,"y":738.8,"w":137.7,"h":20,"lines":1,"text":"Hỏi chủ cửa hàng","size":17,"weight":600,"color":"rgb(255, 255, 255)","lh":"normal","ls":"normal","align":"left","op":1}]}};

(async () => {
  const log = [];
  try {
    const F = 'Pretendard';
    const PS = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
    const fc = {};
    async function font(w) {
      w = Math.round((w || 400) / 100) * 100;
      if (fc[w]) return fc[w];
      for (const f of [{ family: F, style: PS[w] || 'Regular' }, { family: F, style: w >= 600 ? 'Bold' : 'Regular' }]) {
        try { await figma.loadFontAsync(f); fc[w] = f; return f; } catch (e) { /* 다음 후보 */ }
      }
      throw new Error('Pretendard 글꼴을 불러오지 못함');
    }
    for (const w of [400, 500, 600, 700]) await font(w);
    const paint = (c) => {
      const m = String(c).match(/rgba?\(([^)]+)\)/);
      const p = m ? m[1].split(',').map((v) => parseFloat(v)) : [0, 0, 0, 1];
      return { type: 'SOLID', color: { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255 }, opacity: p.length > 3 ? p[3] : 1 };
    };
    const hex = (h, o) => ({ type: 'SOLID', color: { r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 }, opacity: o === undefined ? 1 : o });
    const px = (v) => { const n = parseFloat(v); return isNaN(n) ? null : n; };
    const get = async (id) => { const n = await figma.getNodeByIdAsync(id); if (!n) throw new Error('노드를 찾지 못함: ' + id); return n; };
    async function loadFontsOf(t) {
      const segs = t.getStyledTextSegments(['fontName']);
      for (const s of segs) await figma.loadFontAsync(s.fontName);
    }
    async function setText(id, from, to) {
      const t = await get(id);
      if (t.characters === to) return 'same';
      const norm = (v) => v.replace(/\s+/g, '');
      if (norm(t.characters) !== norm(from)) throw new Error(id + ' 글자가 예상과 달라요: ' + t.characters);
      await loadFontsOf(t);
      t.characters = to;
      return 'ok';
    }

    // 402px 폭 PoC 화면을 그린다 (상태 표시줄 영역 47, 아래 34)
    async function drawScreen(scr, parent) {
      const H = 47;
      const frame = figma.createFrame();
      parent.appendChild(frame);
      frame.name = scr.name;
      frame.resize(402, H + scr.h + 34);
      frame.clipsContent = true;
      const bg = scr.nodes.filter((n) => n.t === 'rect' && n.x < 1 && n.y < 1 && n.w > 400 && paint(n.bg).opacity === 1).pop();
      frame.fills = [bg ? paint(bg.bg) : hex('#FFFFFF')];
      for (const n of scr.nodes) {
        const ny = n.y + H;
        if (n.t === 'rect') {
          if (bg && n.x < 1 && n.y < 1 && n.w > 400 && n.h >= scr.h - 1 && n.bg === bg.bg) continue;
          const r = figma.createRectangle();
          frame.appendChild(r);
          r.name = n.name || 'box';
          r.resize(Math.max(n.w, 0.01), Math.max(n.h, 0.01));
          const f = paint(n.bg);
          r.fills = f.opacity > 0 ? [f] : [];
          if (n.border) { r.strokes = [paint(n.border.c)]; r.strokeWeight = n.border.w; r.strokeAlign = 'INSIDE'; }
          [r.topLeftRadius, r.topRightRadius, r.bottomRightRadius, r.bottomLeftRadius] = n.rad;
          if (n.op < 1) r.opacity = n.op;
          r.x = n.x; r.y = ny;
          if (n.name === 'backdrop') { r.resize(402, frame.height); r.y = 0; }
        } else if (n.t === 'svg') {
          let svg = n.svg;
          if (!/xmlns=/.test(svg)) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
          svg = svg.replace(/<svg([^>]*?)\swidth="[^"]*"/, '<svg$1').replace(/<svg([^>]*?)\sheight="[^"]*"/, '<svg$1');
          svg = svg.replace('<svg', '<svg width="' + n.w + '" height="' + n.h + '"');
          try {
            const v = figma.createNodeFromSvg(svg);
            frame.appendChild(v);
            v.name = 'icon';
            if (n.op < 1) v.opacity = n.op;
            v.x = n.x; v.y = ny;
          } catch (e) { /* 그리지 못한 아이콘은 건너뛴다 */ }
        } else if (n.t === 'text') {
          const t = figma.createText();
          frame.appendChild(t);
          t.fontName = await font(n.weight);
          t.characters = n.text;
          t.fontSize = n.size;
          t.fills = [paint(n.color)];
          const lh = px(n.lh); if (lh) t.lineHeight = { unit: 'PIXELS', value: lh };
          const ls = px(n.ls); if (ls) t.letterSpacing = { unit: 'PIXELS', value: ls };
          if (n.lines > 1) {
            t.textAutoResize = 'HEIGHT';
            t.resize(Math.max(n.w + 2, 10), t.height);
            t.textAlignHorizontal = n.align === 'center' ? 'CENTER' : (n.align === 'right' || n.align === 'end') ? 'RIGHT' : 'LEFT';
          } else {
            t.textAutoResize = 'WIDTH_AND_HEIGHT';
          }
          t.name = n.text.slice(0, 30);
          if (n.op < 1) t.opacity = n.op;
          t.x = n.x; t.y = ny;
          if (n.h === 0) {
            const box = scr.nodes.find((m) => m.t === 'rect' && Math.abs(m.y - n.y) < 1 && m.x <= n.x && m.x + m.w >= n.x + n.w);
            if (box) t.y = box.y + H + (box.h - t.height) / 2;
          }
        }
      }
      return frame;
    }

    // 폰 안의 예전 화면(old)을 PoC 화면으로 바꾼다: 같은 자리, 같은 배율에 새 화면을 넣고 예전 화면은 숨긴다
    async function swapScreen(oldId, key) {
      const old = await get(oldId);
      const parent = old.parent;
      const label = old.name + ' (PoC 최신)';
      if (parent.children.some((c) => c.name === label && c.visible)) return label + ' 이미 있음';
      const s = old.width / 402;
      const f = await drawScreen(SCREENS[key], parent);
      // 상태 표시줄(9:41, 배터리)은 예전 화면 것을 복제
      for (const c of old.children) {
        if (c.y + c.height > 40 * s) continue;
        if (!(c.type === 'TEXT' || c.type === 'RECTANGLE' || c.type === 'VECTOR' || c.type === 'FRAME' || c.type === 'GROUP')) continue;
        if (c.type === 'TEXT') await loadFontsOf(c);
        const k = c.clone();
        f.appendChild(k);
        if (k.type === 'TEXT') await loadFontsOf(k);
        k.rescale(1 / s);
        k.x = c.x / s; k.y = c.y / s;
      }
      if (typeof old.cornerRadius === 'number') f.cornerRadius = old.cornerRadius / s;
      else { f.topLeftRadius = old.topLeftRadius / s; f.topRightRadius = old.topRightRadius / s; f.bottomLeftRadius = old.bottomLeftRadius / s; f.bottomRightRadius = old.bottomRightRadius / s; }
      for (const t of f.findAll((n) => n.type === 'TEXT')) await loadFontsOf(t);
      f.rescale(s);
      f.x = old.x; f.y = old.y;
      const idx = parent.children.indexOf(old);
      parent.insertChild(idx + 1, f);
      if ('layoutMode' in parent && parent.layoutMode !== 'NONE') {
        f.layoutPositioning = 'ABSOLUTE'; f.x = old.x; f.y = old.y; f.name = label;
      } else {
        const g = figma.group([f], parent, idx + 1);
        g.name = label;
      }
      old.visible = false;
      return label + ' 교체';
    }

    function T(parent, text, size, w, color, x, y, width) {
      const t = figma.createText();
      parent.appendChild(t);
      t.fontName = fc[w] || fc[400];
      t.characters = text;
      t.fontSize = size;
      t.fills = [typeof color === 'string' && color[0] === '#' ? hex(color) : paint(color)];
      if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
      t.x = x; t.y = y;
      return t;
    }
    function R(parent, name, x, y, w, h, fill, rad) {
      const r = figma.createRectangle();
      parent.appendChild(r);
      r.name = name; r.resize(w, h); r.fills = [fill]; r.cornerRadius = rad || 0; r.x = x; r.y = y;
      return r;
    }
    // 예전 카드와 같은 모양의 빈 카드를 같은 자리에 만들고 예전 카드는 숨긴다
    function cardLike(old, name, h) {
      const c = figma.createFrame();
      old.parent.insertChild(old.parent.children.indexOf(old) + 1, c);
      c.name = name;
      c.resize(old.width, h);
      c.x = old.x; c.y = old.y;
      c.fills = JSON.parse(JSON.stringify(old.fills));
      c.strokes = JSON.parse(JSON.stringify(old.strokes));
      c.effects = JSON.parse(JSON.stringify(old.effects));
      if (typeof old.cornerRadius === 'number') c.cornerRadius = old.cornerRadius;
      c.clipsContent = false;
      old.visible = false;
      return c;
    }
    async function moveCallout(ids, dy) { for (const id of ids) { const n = await get(id); n.y += dy; } }

    const step = async (name, fn) => { try { log.push(name + ': ' + (await fn())); } catch (e) { log.push(name + ' 실패: ' + (e && e.message ? e.message : e)); } };

    // 1. 숫자 맞추기 (12쪽 AS-IS 카드)
    await step('12쪽 AS-IS 금액', async () => {
      const a = await setText('2196:2487', '3명에게 9,520,000원', '3명에게 9,320,000원');
      const b = await setText('2196:2493', '2,380,000원', '2,180,000원');
      return a + ', ' + b;
    });
    // 1. 12쪽 ① 폰 화면 S4
    await step('12쪽 S4 화면', () => swapScreen('2196:2616', 'S4'));
    // 1~2. 11쪽 솔루션 한눈에: S3, S4, S5(4대보험), E2, S6(4대보험, 보관함)
    await step('11쪽 S3', () => swapScreen('2238:1057', 'S3'));
    await step('11쪽 S4', () => swapScreen('2238:1081', 'S4'));
    await step('11쪽 S5', () => swapScreen('2238:1122', 'S5'));
    await step('11쪽 E2', () => swapScreen('2238:1157', 'E2'));
    await step('11쪽 S6', () => swapScreen('2238:1209', 'S6'));
    // 2. 10쪽 솔루션 첫 장 E2, 확대 카드 첫 줄
    await step('10쪽 E2', () => swapScreen('2219:2280', 'E2'));
    await step('10쪽 확대 카드', () => setText('2219:2374', 'Số tiền khớp', 'Số tiền khớp với tiền đã nhận'));
    // 2. 13쪽 ② E2와 공제 설명 확대 카드
    await step('13쪽 E2', () => swapScreen('2196:2882', 'E2'));
    await step('13쪽 공제 설명 카드', async () => {
      const body = await get('2196:2865');
      const box = await get('2196:2863');
      const card = await get('2196:2843');
      const vi = 'Là chi phí chỗ ở và bữa ăn do chủ cửa hàng cung cấp.';
      const ko = '사장님이 제공한 숙소와 식사 비용이에요 (서면 동의 기준)';
      if (body.characters.startsWith(vi)) return '이미 바뀜';
      await loadFontsOf(body);
      const h0 = body.height;
      body.characters = vi + '\n' + ko;
      body.textAutoResize = 'HEIGHT';
      body.setRangeFills(vi.length + 1, body.characters.length, [hex('#6B7684')]);
      body.setRangeFontSize(vi.length + 1, body.characters.length, Math.max(9, body.fontSize === figma.mixed ? 10 : body.fontSize - 1));
      const d = body.height - h0;
      if (box.layoutMode === 'NONE') box.resize(box.width, box.height + d);
      if (card.layoutMode === 'NONE') card.resize(card.width, card.height + d);
      return '모국어 설명 추가 (+' + Math.round(d) + 'px)';
    });
    // 3. 13쪽 문의 카드 → 사장님께 한국어로 묻는 장면 (E3)
    await step('13쪽 문의 카드', async () => {
      const old = await get('2196:2869');
      const NAME = '문의 연결 (PoC 최신)';
      if (old.parent.children.some((c) => c.name === NAME && c.visible)) return '이미 있음';
      const c = cardLike(old, NAME, 176);
      R(c, '뜻풀이 바탕', 16, 16, 343, 72, hex('#FFF7C2'), 12);
      T(c, 'Nghĩa bằng tiếng Việt', 11, 400, '#6B5A00', 28, 26);
      T(c, 'Trong bảng lương tháng 9 có trừ tiền ăn ở 150.000 won. Anh/chị giải thích giúp em được không ạ?', 12.5, 400, '#191F28', 28, 43, 319);
      R(c, '한국어 초안', 16, 98, 291, 62, hex('#F2F4F6'), 18);
      T(c, '사장님, 9월 명세서에서 숙식비 150,000원이 빠졌는데 어떤 비용인지 알려 주실 수 있나요?', 13, 400, '#191F28', 30, 109, 265);
      R(c, '보내기', 317, 114, 42, 42, hex('#FFE300'), 21);
      const arrow = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12 19V6M6 11l6-6 6 6" fill="none" stroke="#0B1F4F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      c.appendChild(arrow); arrow.name = 'icon'; arrow.x = 328; arrow.y = 125;
      await setText('2196:2876', '금액이 다르면\n바로 묻고 상담 연결', '궁금한 항목은\n사장님께 한국어로 문의');
      await moveCallout(['2196:2874', '2196:2875', '2196:2876'], (176 - old.height) / 2);
      return '교체';
    });
    // 보관함: 14쪽 ③ PDF 카드 → 직원별 명세서 보관함 카드
    await step('14쪽 보관함 카드', async () => {
      const old = await get('2196:3219');
      const NAME = '직원별 명세서 보관함 (PoC 최신)';
      if (old.parent.children.some((c) => c.name === NAME && c.visible)) return '이미 있음';
      const c = cardLike(old, NAME, 250);
      const W = old.width - 48;
      T(c, '직원별 명세서 보관함', 12.9, 400, '#6B7684', 24, 22);
      R(c, '직원 탭', 24, 46, W, 32, { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.05 }, 10);
      const tw = (W - 6) / 3;
      R(c, '선택된 탭', 27, 49, tw, 26, hex('#FFFFFF'), 8);
      ['응우옌 반 A', '쩐 티 B', '람 C'].forEach((name, i) => {
        const t = T(c, name, 12, i === 0 ? 600 : 400, '#191F28', 0, 54);
        t.x = 27 + tw * i + (tw - t.width) / 2;
      });
      const rows = [['9월', '2,380,000원', '발송 완료, 열람 전', '#6B7684', true], ['8월', '2,330,000원', '열람과 대조 완료', '#0B1F4F'], ['7월', '2,380,000원', '열람과 대조 완료', '#0B1F4F']];
      rows.forEach(([m, amt, st, col, hl], i) => {
        const y = 90 + i * 30;
        if (hl) R(c, '이번 달', 18, y - 3, W + 12, 28, hex('#FFF7C2'), 8);
        T(c, m, 14, 600, '#191F28', 24, y + 2);
        T(c, amt, 14, 400, '#6B7684', 64, y + 2);
        const s = T(c, st, 14, 600, col, 0, y + 2);
        s.x = 24 + W - s.width;
      });
      R(c, 'button', 24, 186, W, 44, hex('#0B1F4F'), 12);
      const b = T(c, '보관함 전체 내려받기 (6개월)', 14.9, 600, '#FFFFFF', 0, 198);
      b.x = 24 + (W - b.width) / 2;
      await setText('2196:3259', '필요한 기간만\nPDF로 제출', '직원마다 6개월 기록을\n모아 한 번에 제출');
      await moveCallout(['2196:3226', '2196:3227', '2196:3259'], (250 - old.height) / 2);
      return '교체';
    });

    const fails = log.filter((l) => l.includes('실패'));
    figma.closePlugin((fails.length ? 'HP 일부 실패 ' + fails.length + '건 | ' : 'HP 덱 목업 업데이트 완료 | ') + log.join(' / '));
  } catch (e) {
    figma.closePlugin('HP 오류: ' + (e && e.message ? e.message : String(e)) + ' | ' + log.join(' / '));
  }
})();

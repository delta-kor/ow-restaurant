# 게임 정보 데이터

`content/info/{ko,en,ja,zh-CN,zh-TW}`의 Markdown을 언어별로 표시합니다. 설명은 한국어 안내를 기준으로 번역했으며, 게임 명칭은 `terms.json`의 안정적인 아이템 ID·영웅 slug·모드 ID로 참조합니다. `{{i:17}}`, `{{c:sombra}}`, `{{m:2}}`, `{{d:1}}`, `{{t:0}}`은 렌더링 전에 해당 언어 명칭으로 치환됩니다.

- `generate-customers.py`: 원본 Deluxe의 손님 유형, 모드 태그, 점수 보정.
- `generate-items.py`: 아이템, 내구도·효율, 기본 제공 모드와 테마별 시작 장비. 서빙볼은 사용자가 지정한 `roll` 아이콘을 사용합니다.
- `generate-round-customers.py`: 모드별 라운드 손님과 무작위 보스 후보. 원본 KR/EN/JP와 Joseon의 공통 목록 일치를 검사합니다.
- `generate-locales.py`: KR/EN/JP 원본 OW의 아이템·손님·모드·난이도·테마 명칭을 추출합니다. 중국어 아이템은 기존 `store/translations/zh-CN.json`을 재사용하고, 정보용 신규 명칭은 보완합니다. 번체는 OpenCC로 변환합니다.
- `write-ui.py`: 게임 정보의 UI·태그·툴팁 번역을 생성합니다.

추출 스크립트는 상위 폴더의 OW 원본을 사용하며, 아이콘 매핑에는 `deprecated` 파일도 참조합니다. Python 의존성은 레시피 변환 환경과 같으며 OpenCC가 필요합니다. 생성한 설명을 자동으로 다시 번역하지는 않습니다.

검증:

```sh
node scripts/info/test-markdown.mjs
node scripts/info/test-locales.cjs
node scripts/test-theme.cjs
python3 scripts/info/generate-customers.py --check
python3 scripts/info/generate-items.py --check
python3 scripts/info/generate-round-customers.py --check
python3 scripts/info/generate-locales.py --check
```

게임 정보의 효과 수치와 사용자 안내는 OW 원본을 대조한 설명입니다. 실제 게임 내 실행 검증을 대신하지 않습니다.

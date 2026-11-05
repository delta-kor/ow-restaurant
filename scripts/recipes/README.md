# OW recipe data

Version: v261101

The authoritative inputs are the current OW files, not the old site JSON or the
archived migration snapshots. This converter reads OW and writes site JSON only.
It never generates or modifies OW.

From the site checkout, with Python 3.10 or later:

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r scripts/recipes/requirements.txt
npm run load-workshop-code
npm run check:recipes
npm run test:selection
npm run build
```

By default the converter reads the parent directory. Use
`python3 -B scripts/recipes/convert.py --sources /absolute/path/to/ow-sources`
for another source checkout. Five files are required: kr_deluxe.ow,
en_deluxe.ow, jp_deluxe.ow, Joseon_deluxe.ow, kc_kr.ow.

`store/datasets.json` contains complete datasets by theme and language.
`store/dataset-manifest.json` records input hashes and dataset counts. `--check`
fails if the generated data differs from the current source or translations.
Supply the same `--sources` when validating another checkout.

The basic edition has independent KR/EN/JP data. Simplified and Traditional
Chinese copy English actions, supplies and metadata exactly, replacing names
using `store/translations/zh-CN.json`; Traditional names use pinned OpenCC s2twp.
The dictionary preserves reusable former Chinese main/cafe translations and
adds missing names. Missing translations are fatal. Contextually ambiguous
identities must be reviewed, not joined solely by numeric IDs.

Joseon themes and Branch 3 have Korean datasets only. UI language is independent:
use that language's full dataset if present, otherwise en, ko, ja, zh-CN, zh-TW.
All names in a fallback dataset stay in its data language.

`catalog.ts` is the central edition/theme registry. Its `butcherShopEnabled`
flag is true for the basic Deluxe edition, false for Joseon and Branch 3.
The generated stage marker additionally limits this behavior to the classic
butcher category; the cafe/world category with index 11 is not a butcher shop.
Joseon water 21 is supplied by the sink and included in every category's available
ingredients. Do not copy the retired legacy water-19 override.

Canonical links are `/[language]/book/[theme-id]/[category-id]`. Historical
cafe, cafe-en, cafe-zh-CN, cook-intl, cook-intl-en, new-third and numeric default
links redirect to their corresponding canonical theme. The URL language decides
the dataset. Sandbox uses `?theme=...&stage=...` with the same registry and locale
selection. Its I key executes the selected dataset's freeze action.

Tests cover all reference IDs, every menu's ingredient reachability, independent
Japanese Naruto recipes, English cafe tea leaves, Branch 3 frying, Chinese
structural parity, fallback selection, aliases and edition-specific butcher
behavior. They are static site-data tests, not Workshop gameplay tests.

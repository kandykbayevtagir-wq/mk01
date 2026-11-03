# Podology MK — brand source

`podology-logo-original.png` is the owner's original logo and the single source of
truth (raster, 1254×1254, black + grey on white). Nothing in the site redraws it.

Run `python3 scripts/generate-brand.py` (Pillow + numpy) to rebuild every derived asset:

| Output | Use |
|---|---|
| `public/brand/logo-full.png`, `logo-full-light.png` | header (≥ 640 px), footer — dark ink / white ink |
| `public/brand/logo-compact.png`, `logo-compact-light.png` | header on phones (the PODOLOGY line only) |
| `public/brand/logo-symbol.png` | foot-in-circle mark |
| `public/brand/logo-square.png` | schema.org Organization logo |
| `src/app/favicon.ico`, `icon.png`, `apple-icon.png` | tab and iPhone home-screen icons |
| `public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | web app manifest |

The original is a raster, so the symbol is limited by its 140 px source. If a vector
file (SVG/PDF/AI) exists, replace the original and the sharpest possible assets can be rebuilt.

# CLAUDE.md — PDF ↔ Base64 Converter · Project Blueprint

> Reference for Claude Code (and future AI sessions) when making changes to this app.
> Keep this file updated whenever the structure, scripts, or credentials change.

---

## 1. Overview

A 100% client-side PDF ↔ Base64 converter by Daryl John Tadeo. Built with React 19, Vite, and Tailwind
CSS 3.4, hosted on Netlify at https://pdftobase64.netlify.app/. No backend, no PDF libraries — encoding
uses the native `FileReader` API, decoding uses `atob()` + `Blob`. The only network call in the app is
the optional contact form (Web3Forms).

## 2. Project Structure

`src/components/PdfConverter.jsx` is a thin orchestrator holding `mode` (`'encode' | 'decode'`) and
`showContact` state, calling `usePdfEncoder()`/`usePdfDecoder()`, and composing: `Header`,
`ModeSwitcher`, `EncodePanel` or `DecodePanel` (depending on mode), `HowItWorks`, `CollabCta`,
`BuyMeACoffee`, `ContactModal`, `Footer`, plus `ErrorBoundary` (top-level crash fallback, wired in
`main.jsx`).

- `src/hooks/usePdfEncoder.js` and `src/hooks/usePdfDecoder.js` — encode and decode get **separate**
  hooks (unlike `FreeJsonFormatterBeautifier`'s single combined hook) because their state doesn't
  interact — only `mode`/`showContact` are shared, and those live in the orchestrator.
- `src/lib/` — framework-agnostic functions, one concern per file: `pdfBase64.js` (`stripPrefix`,
  `isValidBase64`, `formatBytes`, `downloadPdfFromBase64`) and `contact.js` (`submitContactForm`, reads
  the Web3Forms key from env).
- `src/test/setup.js` — Vitest + Testing Library setup (jest-dom matchers, RTL `cleanup` after each test).
- Tests are colocated next to the file they cover (`pdfBase64.js` / `pdfBase64.test.js`, `ContactModal.jsx`
  / `ContactModal.test.jsx`), not in a separate `tests/` folder.
- No routes, no global state library — all state lives in the two hooks above.
- `src/main.jsx` mounts `<PdfConverter />` (wrapped in `ErrorBoundary`) into `#root`. There is no
  `App.jsx` — it was a trivial one-line wrapper and was removed, same cleanup applied to the portfolio repo.
- `index.html` contains all SEO meta tags, Open Graph tags, JSON-LD structured data, and the GA4 snippet.

## 3. Build, Dev, and Quality Gates

```
npm install         # install dependencies
npm run dev          # start Vite dev server at http://localhost:5173
npm run build         # production build → dist/
npm run preview       # preview production build locally
npm run lint           # ESLint (flat config), zero warnings expected
npm run check-types     # tsc --noEmit (allowJs, checkJs off — opt-in per file/as files are converted)
npm run format          # Prettier --write over src/**/*.{js,jsx,css}
npm run format:check     # Prettier --check, used in CI
npm test                  # Vitest run (jsdom environment)
```

CI (`.github/workflows/ci.yml`) runs lint → check-types → format:check → test → build on every push/PR to `main`.

Netlify deploys automatically from GitHub on push to main. Build command: `npm run build`, publish dir: `dist`.
`netlify.toml` at the root handles SPA redirects. `dist/`, `.env`, and `.DS_Store` are already gitignored.

**Node version note**: this environment runs Node 20.11.0. `eslint`/`@eslint/js` are pinned to `^9`
(their `10.x` majors require `util.styleText`, added in a newer Node) and `jsdom`/
`@testing-library/jest-dom` are pinned to versions whose `engines` range includes Node 20 (their newest
majors require Node 22+). If a fresh `npm install` pulls in a newer major of any of these and things
break, re-pin rather than trying to upgrade Node in this environment.

---

## 4. Credentials

The Web3Forms access key is **not** hardcoded in source — it's read from `VITE_WEB3FORMS_ACCESS_KEY` in
a local, gitignored `.env` (see `.env.example` for the variable name; get the actual value from the
Web3Forms dashboard or a teammate, not from git history).

| Service | Value |
|---|---|
| Web3Forms email | `daryltadss.workemail@gmail.com` |
| Google Analytics 4 ID | `G-RSL09XZXST` (this app's own ID — do not reuse another sub-app's) |
| Live URL | `https://pdftobase64.netlify.app/` |
| GitHub | `https://github.com/Tadxss/PdfToBase64` |

## 5. Design System

Same shared sub-app slate palette as the other apps, but with a **blue** accent (not purple) — genuinely
matches this app's actual Tailwind usage, no mismatch to flag:

- Background: `bg-slate-900`, Cards: `bg-slate-800`, Header/Footer: `bg-slate-950`
- Accent: blue — `text-blue-400`, `border-blue-500`, `bg-blue-600 hover:bg-blue-500`
- Text: white headings, `text-slate-300` body, `text-slate-400` muted
- Icons: Lucide React; base64 panes use `font-mono`
- Page layout: `flex flex-col min-h-screen` root + `flex-1` on `<main>` to pin the footer

## 6. Core Conversion Logic (in the two hooks / `lib/pdfBase64.js`)

- **Encode (`usePdfEncoder`)**: validates file type (`application/pdf`) and size (`MAX_FILE_MB = 50`),
  then reads it via `FileReader.readAsDataURL`. The result is a `data:application/pdf;base64,...` URL;
  `stripPrefix()` removes the prefix unless `includePrefix` is on. Toggling the prefix after encoding
  re-derives the string from the existing output rather than re-reading the file.
- **Decode (`usePdfDecoder`)**: strips any prefix, validates with `isValidBase64()`
  (`btoa(atob(clean)) === clean`), then `downloadPdfFromBase64()` decodes with `atob()`, builds a
  `Uint8Array`/`Blob`, and triggers a download via a temporary `<a>` click.
- **No PDF libraries** — everything relies on native browser APIs (`FileReader`, `atob`/`btoa`, `Blob`,
  `URL.createObjectURL`).

## 7. ContactModal

**Title is "Get in Touch"** — this is intentionally different from the "Contact the Developer" wording
used in the `DarylJohnTadeo` and `FreeJsonFormatterBeautifier` sibling apps. Do not "fix" this to match
them. Everything else follows the shared cross-sub-app pattern: blue accent (matching this app, not the
usual purple), form labels with inline Lucide icons, subject line
`PDF to Base64 — Message from ${formData.name}`, submission through `lib/contact.js` rather than an
inline `fetch` in the component.

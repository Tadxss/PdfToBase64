# Copilot Instructions — PDF ↔ Base64 Converter

A 100% client-side PDF ↔ Base64 converter built with React 19, Vite, and Tailwind CSS 3.4.
Live at: https://pdftobase64.netlify.app/
GitHub: https://github.com/Tadxss/PdfToBase64

## Project Structure

```
src/
  components/
    PdfConverter.jsx    ← main app component (all logic + UI)
    ContactModal.jsx    ← contact form modal (Web3Forms)
    BuyMeACoffee.jsx    ← support banner
  main.jsx
index.html              ← SEO meta, OG tags, GA4, JSON-LD
netlify.toml            ← SPA redirect rule + build config
public/
  sitemap.xml
  robots.txt
  og-image.png
```

## Build and Dev

```
npm install       # install dependencies
npm run dev       # start Vite dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

Deploys automatically from GitHub via Netlify on push to main.

## Design System

- Background: `bg-slate-900`, Cards: `bg-slate-800`, Header/Footer: `bg-slate-950`
- Accent: purple — `text-purple-400`, `border-purple-500`, `bg-purple-600 hover:bg-purple-700`
- Text: white headings, `text-slate-300` body, `text-slate-400` muted
- Icons: Lucide React
- Page layout: `flex flex-col min-h-screen` root + `flex-1` on `<main>` to pin footer

## ContactModal Conventions

- Title: "Get in Touch" (this app uses a different title — do NOT change to "Contact the Developer")
- Form labels use inline Lucide icons — `<User>`, `<Mail>`, `<MessageSquare>` (w-3.5 h-3.5 inline mr-1.5)
- Body wrapper must have `text-left` class: `<div className="px-6 py-5 text-left">`
- Web3Forms `access_key`: `9d2f6699-80d4-4345-bbe9-b78ece5a9513`
- Subject line: `PDF to Base64 — Message from ${formData.name}`

## Privacy Messaging

All file processing is done locally in the browser using the File API and FileReader.
Files are never uploaded to any server. Messaging must always emphasize this:
- "🔒 100% private · runs locally"
- "never uploaded, never stored"
- File size limit: 50MB — enforced with a guard before processing.

## Shared Identity

- Footer "Daryl John Tadeo" links to `https://daryltadeo.netlify.app/`
- Buy Me a Coffee copy: `"Found this useful? Support the work —"`
- GA4 ID: `G-P1898N6HT7`

For the full cross-project design system reference, see `COPILOT.md` in the DarylJohnTadeo portfolio repo.

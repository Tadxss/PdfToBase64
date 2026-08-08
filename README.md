# PDF ↔ Base64 Converter

A free, 100% client-side PDF-to-Base64 (and Base64-to-PDF) converter — drag & drop a PDF to get its
Base64, or paste Base64 to download it back as a PDF. No uploads, no server, no data leakage.

## ✨ Features
- 📤 Drag & drop or browse to encode a PDF to Base64
- 🔀 Optional `data:application/pdf;base64,` prefix toggle
- 📋 Copy to clipboard, one click
- 📥 Paste Base64 back in to decode and download a PDF
- 🔒 100% private — files never leave your browser
- 📏 50MB file size guard

## 🛠️ Tech Stack
| Category       | Technologies                 |
|----------------|------------------------------|
| Frontend       | React 19, JavaScript (ES6+)  |
| Build Tool     | Vite                         |
| Styling        | Tailwind CSS                 |
| Icons          | Lucide React                 |
| Testing        | Vitest, React Testing Library |
| Deployment     | Netlify                      |

## 🚀 Quick Start
### Prerequisites
- Node.js ≥20
- npm

### Installation
```bash
git clone https://github.com/Tadxss/PdfToBase64.git
cd PdfToBase64
npm install
cp .env.example .env   # fill in VITE_WEB3FORMS_ACCESS_KEY
npm run dev
```

### Scripts
```bash
npm run dev            # start the dev server
npm run build           # production build → dist/
npm run preview          # preview the production build locally
npm run lint               # ESLint
npm run check-types         # TypeScript check (tsc --noEmit)
npm run format                # Prettier --write
npm run format:check           # Prettier --check
npm test                        # run the Vitest suite
```

See `CLAUDE.md` for the full project structure and conventions.

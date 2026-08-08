import { FileText } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-7 h-7 text-blue-400" />
          <div className="text-left">
            <h1 className="text-xl font-bold text-white leading-tight">
              Free PDF ↔ Base64 Converter
            </h1>
            <p className="text-xs text-slate-400">
              Your files stay on your device — never uploaded, never stored
            </p>
          </div>
        </div>
        <span className="hidden sm:block text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
          🔒 100% private · runs locally
        </span>
      </div>
    </header>
  );
}

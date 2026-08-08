import { Download, Upload } from 'lucide-react';

export default function ModeSwitcher({ mode, onModeChange }) {
  return (
    <div className="bg-slate-800 rounded-xl p-1 flex gap-1 shadow-2xl">
      <button
        onClick={() => onModeChange('encode')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
          mode === 'encode'
            ? 'bg-blue-600 text-white shadow'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Upload className="w-4 h-4" />
        PDF → Base64
      </button>
      <button
        onClick={() => onModeChange('decode')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
          mode === 'decode'
            ? 'bg-blue-600 text-white shadow'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Download className="w-4 h-4" />
        Base64 → PDF
      </button>
    </div>
  );
}

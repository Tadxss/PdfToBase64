import { Download, Upload } from 'lucide-react';
import { motion as Motion } from 'motion/react';

export default function ModeSwitcher({ mode, onModeChange }) {
  return (
    <div className="relative bg-inklight border border-inkborder rounded-md p-1 flex gap-1">
      <Motion.div
        layout
        layoutId="mode-pill"
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="absolute inset-y-1 rounded-md bg-signal"
        style={{
          width: 'calc(50% - 4px)',
          left: mode === 'encode' ? '4px' : 'calc(50% + 0px)',
        }}
      />
      <button
        onClick={() => onModeChange('encode')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm transition-colors ${
          mode === 'encode' ? 'text-ink' : 'text-muted hover:text-bone'
        }`}
      >
        <Upload className="w-4 h-4" />
        PDF → Base64
      </button>
      <button
        onClick={() => onModeChange('decode')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm transition-colors ${
          mode === 'decode' ? 'text-ink' : 'text-muted hover:text-bone'
        }`}
      >
        <Download className="w-4 h-4" />
        Base64 → PDF
      </button>
    </div>
  );
}

import { AlertCircle, ArrowRightLeft, Check, Copy, Download, FileX, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'motion/react';

function CopyLabel({ copied }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {copied ? (
        <Motion.span
          key="copied"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.12 }}
          className="flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" /> Copied!
        </Motion.span>
      ) : (
        <Motion.span
          key="idle"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.12 }}
          className="flex items-center gap-1.5"
        >
          <Copy className="w-3.5 h-3.5" /> Copy
        </Motion.span>
      )}
    </AnimatePresence>
  );
}

export default function DecodePanel({
  base64Input,
  decodeError,
  decodeLoading,
  decodeCopied,
  onInputChange,
  onDecode,
  onCopy,
  onReset,
}) {
  return (
    <div className="bg-inklight border border-inkborder rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-inkborder flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-signal" />
          <span className="font-semibold text-bone">Paste Base64</span>
        </div>
        {base64Input && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-bone transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">
              Paste your Base64 string below
              {base64Input
                ? ` · ${base64Input.replace(/\s/g, '').length.toLocaleString()} chars`
                : ''}
            </span>
            {base64Input && (
              <Motion.button
                whileTap={{ scale: 0.94 }}
                onClick={onCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  decodeCopied
                    ? 'bg-signal text-ink'
                    : 'bg-inklight border border-inkborder hover:border-bone/40 text-bone/80'
                }`}
              >
                <CopyLabel copied={decodeCopied} />
              </Motion.button>
            )}
          </div>
          <textarea
            value={base64Input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Paste Base64 string here (with or without data:application/pdf;base64, prefix)…"
            rows={8}
            className="w-full bg-ink border border-inkborder rounded-lg p-3 font-body text-xs text-bone/80 resize-y focus:outline-none focus:border-signal/60 placeholder:text-muted/50 transition-colors"
          />
        </div>

        {decodeError && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {decodeError}
          </div>
        )}

        <Motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDecode}
          disabled={decodeLoading || !base64Input.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-signal hover:bg-signal/90 disabled:bg-inkborder disabled:text-muted text-ink font-bold text-sm transition-colors shadow-glow"
        >
          {decodeLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Converting…
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download PDF
            </>
          )}
        </Motion.button>

        <div className="flex items-start gap-2 text-xs text-muted">
          <FileX className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>
            Accepts raw Base64 or strings with the{' '}
            <code className="font-body">data:application/pdf;base64,</code> prefix.{' '}
            <span className="text-muted">
              Decoding runs 100% in your browser — your data is never sent anywhere.
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

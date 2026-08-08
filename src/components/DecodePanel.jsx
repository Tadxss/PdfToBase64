import { AlertCircle, ArrowRightLeft, Check, Copy, Download, FileX, RefreshCw } from 'lucide-react';

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
    <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-200">Paste Base64</span>
        </div>
        {base64Input && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Paste your Base64 string below
              {base64Input
                ? ` · ${base64Input.replace(/\s/g, '').length.toLocaleString()} chars`
                : ''}
            </span>
            {base64Input && (
              <button
                onClick={onCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  decodeCopied
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {decodeCopied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {decodeCopied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={base64Input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Paste Base64 string here (with or without data:application/pdf;base64, prefix)…"
            rows={8}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-xs text-slate-300 resize-y focus:outline-none focus:border-blue-500 placeholder:text-slate-600 transition-colors"
          />
        </div>

        {decodeError && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {decodeError}
          </div>
        )}

        <button
          onClick={onDecode}
          disabled={decodeLoading || !base64Input.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-900/30"
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
        </button>

        <div className="flex items-start gap-2 text-xs text-slate-500">
          <FileX className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>
            Accepts raw Base64 or strings with the{' '}
            <code className="font-mono">data:application/pdf;base64,</code> prefix.{' '}
            <span className="text-slate-400">
              Decoding runs 100% in your browser — your data is never sent anywhere.
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

import { Check, Copy, FileText, RefreshCw, Upload } from 'lucide-react';
import { formatBytes } from '../lib/pdfBase64';

export default function EncodePanel({
  pdfFile,
  base64Output,
  includePrefix,
  isDragging,
  encodeLoading,
  encodeCopied,
  fileInputRef,
  onFileChange,
  onDrop,
  onDragOver,
  onDragLeave,
  onPrefixToggle,
  onCopy,
  onReset,
}) {
  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-200">Upload PDF</span>
        </div>
        {pdfFile && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-400 bg-blue-500/10'
              : pdfFile
                ? 'border-blue-500/50 bg-blue-500/5'
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onFileChange}
          />
          {pdfFile ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-10 h-10 text-blue-400" />
              <p className="font-semibold text-slate-200">{pdfFile.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(pdfFile.size)}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Upload className="w-10 h-10 mb-1" />
              <p className="font-semibold text-slate-300">Drop a PDF here or click to browse</p>
              <p className="text-xs">Only PDF files are accepted</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-300">
            <div
              onClick={onPrefixToggle}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                includePrefix ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  includePrefix ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
            Include{' '}
            <code className="text-xs bg-slate-700 px-1.5 py-0.5 rounded font-mono">
              data:application/pdf;base64,
            </code>{' '}
            prefix
          </label>
        </div>

        {encodeLoading && (
          <div className="flex items-center justify-center py-8 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Processing…
          </div>
        )}

        {base64Output && !encodeLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Base64 output ·{' '}
                <span className="text-blue-400 font-mono">
                  {base64Output.length.toLocaleString()} chars
                </span>
              </span>
              <button
                onClick={onCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  encodeCopied
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {encodeCopied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {encodeCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={base64Output}
              rows={6}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-xs text-slate-300 resize-y focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

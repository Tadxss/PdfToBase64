import { Check, Copy, FileText, RefreshCw, Upload } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { formatBytes } from '../lib/pdfBase64';

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
    <div className="bg-inklight border border-inkborder rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-inkborder flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-signal" />
          <span className="font-semibold text-bone">Upload PDF</span>
        </div>
        {pdfFile && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-bone transition-colors"
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
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-signal bg-signal/10'
              : pdfFile
                ? 'border-signal/50 bg-signal/5'
                : 'border-inkborder hover:border-bone/40 hover:bg-inklight'
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
              <FileText className="w-10 h-10 text-signal" />
              <p className="font-semibold text-bone">{pdfFile.name}</p>
              <p className="text-xs text-muted">{formatBytes(pdfFile.size)}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted">
              <Upload className="w-10 h-10 mb-1" />
              <p className="font-semibold text-bone/80">Drop a PDF here or click to browse</p>
              <p className="text-xs">Only PDF files are accepted</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-bone/80">
            <div
              onClick={onPrefixToggle}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                includePrefix ? 'bg-signal' : 'bg-inkborder'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-bone transition-transform ${
                  includePrefix ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
            Include{' '}
            <code className="text-xs bg-ink border border-inkborder px-1.5 py-0.5 rounded font-body">
              data:application/pdf;base64,
            </code>{' '}
            prefix
          </label>
        </div>

        {encodeLoading && (
          <div className="flex items-center justify-center py-8 text-muted">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Processing…
          </div>
        )}

        {base64Output && !encodeLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">
                Base64 output ·{' '}
                <span className="text-signal font-body">
                  {base64Output.length.toLocaleString()} chars
                </span>
              </span>
              <Motion.button
                whileTap={{ scale: 0.94 }}
                onClick={onCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  encodeCopied
                    ? 'bg-signal text-ink'
                    : 'bg-inklight border border-inkborder hover:border-bone/40 text-bone/80'
                }`}
              >
                <CopyLabel copied={encodeCopied} />
              </Motion.button>
            </div>
            <textarea
              readOnly
              value={base64Output}
              rows={6}
              className="w-full bg-ink border border-inkborder rounded-lg p-3 font-body text-xs text-bone/80 resize-y focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

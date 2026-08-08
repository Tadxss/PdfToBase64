import { useState, useRef, useCallback, useEffect } from 'react';
import {
  FileText, Upload, Download, Copy, Check, RefreshCw,
  ArrowRightLeft, Code, Zap, Heart, Mail, AlertCircle, FileX,
} from 'lucide-react';
import BuyMeACoffee from './BuyMeACoffee';
import ContactModal from './ContactModal';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Strip the data-URL prefix if present, return raw base64 */
function stripPrefix(str) {
  const comma = str.indexOf(',');
  return comma !== -1 ? str.slice(comma + 1) : str.trim();
}

/** Validate a base64 string (ignoring whitespace) */
function isValidBase64(str) {
  const clean = str.replace(/\s/g, '');
  if (!clean) return false;
  try {
    return btoa(atob(clean)) === clean;
  } catch {
    return false;
  }
}

/** Format bytes → human readable */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

const MAX_FILE_MB = 50;

// ─── component ───────────────────────────────────────────────────────────────

export default function PdfConverter() {
  const [mode, setMode] = useState('encode'); // 'encode' | 'decode'
  const [showContact, setShowContact] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'Free PDF ↔ Base64 Converter — No Upload, No Storage';
  }, []);

  // ── encode state ──────────────────────────────────────────────
  const [pdfFile, setPdfFile] = useState(null);           // File object
  const [base64Output, setBase64Output] = useState('');   // result
  const [includePrefix, setIncludePrefix] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [encodeLoading, setEncodeLoading] = useState(false);
  const [encodeCopied, setEncodeCopied] = useState(false);
  const fileInputRef = useRef(null);

  // ── decode state ──────────────────────────────────────────────
  const [base64Input, setBase64Input] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [decodeLoading, setDecodeLoading] = useState(false);
  const [decodeCopied, setDecodeCopied] = useState(false);

  // ─── encode logic ────────────────────────────────────────────────────────

  const processFile = useCallback((file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      alert(`File too large. Please upload a PDF under ${MAX_FILE_MB} MB.`);
      return;
    }
    setPdfFile(file);
    setBase64Output('');
    setEncodeCopied(false);
    setEncodeLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result; // data:application/pdf;base64,<data>
      const raw = stripPrefix(dataUrl);
      setBase64Output(includePrefix ? dataUrl : raw);
      setEncodeLoading(false);
    };
    reader.onerror = () => {
      alert('Failed to read file.');
      setEncodeLoading(false);
    };
    reader.readAsDataURL(file);
  }, [includePrefix]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handlePrefixToggle = () => {
    if (!base64Output) { setIncludePrefix(p => !p); return; }
    setIncludePrefix(p => {
      const next = !p;
      // re-derive output based on current file — just toggle the prefix on the existing output
      const raw = stripPrefix(base64Output);
      setBase64Output(next ? `data:application/pdf;base64,${raw}` : raw);
      return next;
    });
  };

  const copyEncoded = () => {
    if (!base64Output) return;
    navigator.clipboard.writeText(base64Output).then(() => {
      setEncodeCopied(true);
      setTimeout(() => setEncodeCopied(false), 2000);
    });
  };

  const resetEncode = () => {
    setPdfFile(null);
    setBase64Output('');
    setEncodeCopied(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── decode logic ────────────────────────────────────────────────────────

  const handleDecode = () => {
    setDecodeError('');
    if (!base64Input.trim()) { setDecodeError('Please paste a Base64 string.'); return; }

    const raw = stripPrefix(base64Input);
    if (!isValidBase64(raw)) { setDecodeError('Invalid Base64 string. Please check your input.'); return; }

    setDecodeLoading(true);
    try {
      const binary = atob(raw);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setDecodeError('Failed to convert. Make sure the Base64 represents a valid PDF.');
    } finally {
      setDecodeLoading(false);
    }
  };

  const copyDecodeInput = () => {
    if (!base64Input.trim()) return;
    navigator.clipboard.writeText(base64Input).then(() => {
      setDecodeCopied(true);
      setTimeout(() => setDecodeCopied(false), 2000);
    });
  };

  const resetDecode = () => {
    setBase64Input('');
    setDecodeError('');
    setDecodeCopied(false);
  };

  // ─── render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">

      {/* ── Sticky Header ───────────────────────────────────────────────── */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7 text-blue-400" />
            <div className="text-left">
              <h1 className="text-xl font-bold text-white leading-tight">Free PDF ↔ Base64 Converter</h1>
              <p className="text-xs text-slate-400">Your files stay on your device — never uploaded, never stored</p>
            </div>
          </div>
          <span className="hidden sm:block text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            🔒 100% private · runs locally
          </span>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-5 space-y-4">

        {/* Mode switcher */}
        <div className="bg-slate-800 rounded-xl p-1 flex gap-1 shadow-2xl">
          <button
            onClick={() => setMode('encode')}
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
            onClick={() => setMode('decode')}
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

        {/* ── Encode panel ────────────────────────────────────────────── */}
        {mode === 'encode' && (
          <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-slate-200">Upload PDF</span>
              </div>
              {pdfFile && (
                <button
                  onClick={resetEncode}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>

            <div className="p-5 space-y-4">
              {/* Drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
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
                  onChange={handleFileChange}
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

              {/* Options row */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-300">
                  <div
                    onClick={handlePrefixToggle}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      includePrefix ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      includePrefix ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                  Include <code className="text-xs bg-slate-700 px-1.5 py-0.5 rounded font-mono">data:application/pdf;base64,</code> prefix
                </label>
              </div>

              {/* Output */}
              {encodeLoading && (
                <div className="flex items-center justify-center py-8 text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Processing…
                </div>
              )}

              {base64Output && !encodeLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Base64 output · <span className="text-blue-400 font-mono">{base64Output.length.toLocaleString()} chars</span>
                    </span>
                    <button
                      onClick={copyEncoded}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        encodeCopied
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                      }`}
                    >
                      {encodeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
        )}

        {/* ── Decode panel ────────────────────────────────────────────── */}
        {mode === 'decode' && (
          <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-slate-200">Paste Base64</span>
              </div>
              {base64Input && (
                <button
                  onClick={resetDecode}
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
                    Paste your Base64 string below{base64Input ? ` · ${base64Input.replace(/\s/g,'').length.toLocaleString()} chars` : ''}
                  </span>
                  {base64Input && (
                    <button
                      onClick={copyDecodeInput}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        decodeCopied
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                      }`}
                    >
                      {decodeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {decodeCopied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <textarea
                  value={base64Input}
                  onChange={(e) => { setBase64Input(e.target.value); setDecodeError(''); }}
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
                onClick={handleDecode}
                disabled={decodeLoading || !base64Input.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-900/30"
              >
                {decodeLoading
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Converting…</>
                  : <><Download className="w-4 h-4" /> Download PDF</>
                }
              </button>

              <div className="flex items-start gap-2 text-xs text-slate-500">
                <FileX className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>Accepts raw Base64 or strings with the <code className="font-mono">data:application/pdf;base64,</code> prefix. <span className="text-slate-400">Decoding runs 100% in your browser — your data is never sent anywhere.</span></span>
              </div>
            </div>
          </div>
        )}

        {/* ── How it works ────────────────────────────────────────────── */}
        <div className="bg-slate-800 rounded-xl p-5 shadow-2xl">
          <h3 className="text-base font-semibold text-blue-400 mb-3">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <h4 className="font-semibold text-slate-200 mb-1.5">PDF → Base64</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• Upload or drag & drop any PDF file</li>
                <li>• The file is read entirely in your browser</li>
                <li>• Outputs raw Base64 (or with data-URL prefix)</li>
                <li>• Copy and use in APIs, emails, or code</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-1.5">Base64 → PDF</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• Paste a Base64 string (raw or with prefix)</li>
                <li>• Decoded entirely client-side — no server</li>
                <li>• Downloads as <code className="font-mono text-xs">converted.pdf</code></li>
                <li>• Works with any valid PDF Base64 string</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Collab CTA ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/20 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-base">👋 Got an idea or need a developer?</p>
            <p className="text-slate-400 text-sm mt-0.5">I'm open to freelance work, collaborations, and full-time opportunities.</p>
          </div>
          <button
            onClick={() => setShowContact(true)}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition-all"
          >
            <Mail className="w-4 h-4" />
            Get in Touch
          </button>
        </div>

        <BuyMeACoffee />
      </main>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-slate-800 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Developer */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Code className="w-5 h-5 text-blue-400" />
                <span className="text-lg font-semibold text-slate-200">Developed by</span>
              </div>
              <a
                href="https://daryljohntadeo.space"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-blue-400 mb-2 hover:text-blue-300 transition-colors inline-block"
              >
                Daryl John Tadeo
              </a>
              <p className="text-slate-400 text-sm">Full Stack Developer & UI/UX Enthusiast</p>
            </div>

            {/* Built with */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-pink-400" />
                <span className="text-lg font-semibold text-slate-200">Built with</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">React</span>
                <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-medium">Tailwind CSS</span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">Lucide Icons</span>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">Vite</span>
                <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">Netlify</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-lg font-semibold text-slate-200">Made with Care</span>
              </div>
              <p className="text-slate-400 text-sm mb-2">© {new Date().getFullYear()} Daryl John Tadeo</p>
              <p className="text-slate-500 text-xs">🔒 Your files never leave your device, ever</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-slate-400 text-sm">
                Free PDF ↔ Base64 converter — zero uploads, zero tracking, zero data leakage
              </div>
              <div className="text-slate-500 text-xs">
                Version 1.0 · Open Source
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

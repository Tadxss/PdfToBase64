export default function HowItWorks() {
  return (
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
            <li>
              • Downloads as <code className="font-mono text-xs">converted.pdf</code>
            </li>
            <li>• Works with any valid PDF Base64 string</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

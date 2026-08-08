import { useEffect, useState } from 'react';
import BuyMeACoffee from './BuyMeACoffee';
import CollabCta from './CollabCta';
import ContactModal from './ContactModal';
import DecodePanel from './DecodePanel';
import EncodePanel from './EncodePanel';
import Footer from './Footer';
import Header from './Header';
import HowItWorks from './HowItWorks';
import ModeSwitcher from './ModeSwitcher';
import { usePdfDecoder } from '../hooks/usePdfDecoder';
import { usePdfEncoder } from '../hooks/usePdfEncoder';

export default function PdfConverter() {
  const [mode, setMode] = useState('encode'); // 'encode' | 'decode'
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    document.title = 'Free PDF ↔ Base64 Converter — No Upload, No Storage';
  }, []);

  const encoder = usePdfEncoder();
  const decoder = usePdfDecoder();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-5 space-y-4">
        <ModeSwitcher mode={mode} onModeChange={setMode} />

        {mode === 'encode' && (
          <EncodePanel
            pdfFile={encoder.pdfFile}
            base64Output={encoder.base64Output}
            includePrefix={encoder.includePrefix}
            isDragging={encoder.isDragging}
            encodeLoading={encoder.encodeLoading}
            encodeCopied={encoder.encodeCopied}
            fileInputRef={encoder.fileInputRef}
            onFileChange={encoder.handleFileChange}
            onDrop={encoder.handleDrop}
            onDragOver={encoder.handleDragOver}
            onDragLeave={encoder.handleDragLeave}
            onPrefixToggle={encoder.handlePrefixToggle}
            onCopy={encoder.copyEncoded}
            onReset={encoder.resetEncode}
          />
        )}

        {mode === 'decode' && (
          <DecodePanel
            base64Input={decoder.base64Input}
            decodeError={decoder.decodeError}
            decodeLoading={decoder.decodeLoading}
            decodeCopied={decoder.decodeCopied}
            onInputChange={decoder.setBase64Input}
            onDecode={decoder.handleDecode}
            onCopy={decoder.copyDecodeInput}
            onReset={decoder.resetDecode}
          />
        )}

        <HowItWorks />
        <CollabCta onContactClick={() => setShowContact(true)} />
        <BuyMeACoffee />
      </main>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />

      <Footer />
    </div>
  );
}

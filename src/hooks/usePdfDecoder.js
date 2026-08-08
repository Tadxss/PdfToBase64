import { useState } from 'react';
import { downloadPdfFromBase64, isValidBase64, stripPrefix } from '../lib/pdfBase64';

export function usePdfDecoder() {
  const [base64Input, setBase64InputRaw] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [decodeLoading, setDecodeLoading] = useState(false);
  const [decodeCopied, setDecodeCopied] = useState(false);

  const setBase64Input = (value) => {
    setBase64InputRaw(value);
    setDecodeError('');
  };

  const handleDecode = () => {
    setDecodeError('');
    if (!base64Input.trim()) {
      setDecodeError('Please paste a Base64 string.');
      return;
    }

    const raw = stripPrefix(base64Input);
    if (!isValidBase64(raw)) {
      setDecodeError('Invalid Base64 string. Please check your input.');
      return;
    }

    setDecodeLoading(true);
    try {
      downloadPdfFromBase64(raw, 'converted.pdf');
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
    setBase64InputRaw('');
    setDecodeError('');
    setDecodeCopied(false);
  };

  return {
    base64Input,
    decodeError,
    decodeLoading,
    decodeCopied,
    setBase64Input,
    handleDecode,
    copyDecodeInput,
    resetDecode,
  };
}

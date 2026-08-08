import { useCallback, useRef, useState } from 'react';
import { MAX_FILE_MB, stripPrefix } from '../lib/pdfBase64';

export function usePdfEncoder() {
  const [pdfFile, setPdfFile] = useState(null);
  const [base64Output, setBase64Output] = useState('');
  const [includePrefix, setIncludePrefix] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [encodeLoading, setEncodeLoading] = useState(false);
  const [encodeCopied, setEncodeCopied] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = useCallback(
    (file) => {
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
    },
    [includePrefix]
  );

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handlePrefixToggle = () => {
    if (!base64Output) {
      setIncludePrefix((p) => !p);
      return;
    }
    setIncludePrefix((p) => {
      const next = !p;
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

  return {
    pdfFile,
    base64Output,
    includePrefix,
    isDragging,
    encodeLoading,
    encodeCopied,
    fileInputRef,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handlePrefixToggle,
    copyEncoded,
    resetEncode,
  };
}

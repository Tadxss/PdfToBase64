import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePdfEncoder } from './usePdfEncoder';

function pdfFile(content = '%PDF-1.4 test content', name = 'test.pdf') {
  return new File([content], name, { type: 'application/pdf' });
}

function selectFile(result, file) {
  act(() => {
    result.current.handleFileChange({ target: { files: [file] } });
  });
}

describe('usePdfEncoder', () => {
  beforeEach(() => {
    vi.stubGlobal('alert', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('encodes a PDF file to base64 without the prefix by default', async () => {
    const { result } = renderHook(() => usePdfEncoder());
    const file = pdfFile();
    selectFile(result, file);

    await waitFor(() => expect(result.current.encodeLoading).toBe(false));
    expect(result.current.pdfFile).toBe(file);
    expect(result.current.base64Output).toBe(btoa('%PDF-1.4 test content'));
  });

  it('rejects non-PDF files without setting pdfFile', () => {
    const { result } = renderHook(() => usePdfEncoder());
    const notPdf = new File(['hi'], 'note.txt', { type: 'text/plain' });
    selectFile(result, notPdf);

    expect(alert).toHaveBeenCalledWith('Please upload a PDF file.');
    expect(result.current.pdfFile).toBeNull();
  });

  it('rejects files over the size limit', () => {
    const { result } = renderHook(() => usePdfEncoder());
    const big = new File(['x'], 'big.pdf', { type: 'application/pdf' });
    Object.defineProperty(big, 'size', { value: 51 * 1024 * 1024 });
    selectFile(result, big);

    expect(alert).toHaveBeenCalledWith('File too large. Please upload a PDF under 50 MB.');
    expect(result.current.pdfFile).toBeNull();
  });

  it('toggles the data-URL prefix on the existing output without re-reading the file', async () => {
    const { result } = renderHook(() => usePdfEncoder());
    selectFile(result, pdfFile());
    await waitFor(() => expect(result.current.encodeLoading).toBe(false));

    const raw = result.current.base64Output;
    act(() => result.current.handlePrefixToggle());
    expect(result.current.base64Output).toBe(`data:application/pdf;base64,${raw}`);

    act(() => result.current.handlePrefixToggle());
    expect(result.current.base64Output).toBe(raw);
  });

  it('resets all encode state', async () => {
    const { result } = renderHook(() => usePdfEncoder());
    selectFile(result, pdfFile());
    await waitFor(() => expect(result.current.encodeLoading).toBe(false));

    act(() => result.current.resetEncode());
    expect(result.current.pdfFile).toBeNull();
    expect(result.current.base64Output).toBe('');
  });
});

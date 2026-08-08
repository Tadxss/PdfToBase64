import { describe, expect, it, vi } from 'vitest';
import { downloadPdfFromBase64, formatBytes, isValidBase64, stripPrefix } from './pdfBase64';

describe('stripPrefix', () => {
  it('strips a data-URL prefix when present', () => {
    expect(stripPrefix('data:application/pdf;base64,QUJD')).toBe('QUJD');
  });

  it('returns the trimmed string unchanged when there is no comma', () => {
    expect(stripPrefix('  QUJD  ')).toBe('QUJD');
  });
});

describe('isValidBase64', () => {
  it('accepts a valid base64 string', () => {
    expect(isValidBase64('QUJD')).toBe(true);
  });

  it('ignores internal whitespace', () => {
    expect(isValidBase64('QU JD\n')).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(isValidBase64('   ')).toBe(false);
  });

  it('rejects invalid base64', () => {
    expect(isValidBase64('not-valid-base64!!!')).toBe(false);
  });
});

describe('formatBytes', () => {
  it('formats 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats sub-kilobyte sizes as bytes', () => {
    expect(formatBytes(512)).toBe('512 B');
  });

  it('formats kilobyte sizes', () => {
    expect(formatBytes(2048)).toBe('2 KB');
  });

  it('formats megabyte sizes', () => {
    expect(formatBytes(5 * 1024 * 1024)).toBe('5 MB');
  });
});

describe('downloadPdfFromBase64', () => {
  it('creates an object URL, triggers a click, and revokes the URL', () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = createObjectURL;
    globalThis.URL.revokeObjectURL = revokeObjectURL;

    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = (tag) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') el.click = clickSpy;
      return el;
    };

    downloadPdfFromBase64(btoa('hello pdf'), 'converted.pdf');

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');

    document.createElement = originalCreateElement;
  });
});

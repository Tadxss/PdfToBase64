import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePdfDecoder } from './usePdfDecoder';

function stubDownload() {
  vi.stubGlobal('URL', {
    ...URL,
    createObjectURL: vi.fn(() => 'blob:mock'),
    revokeObjectURL: vi.fn(),
  });
  const clickSpy = vi.fn();
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = (tag) => {
    const el = originalCreateElement(tag);
    if (tag === 'a') el.click = clickSpy;
    return el;
  };
  return { clickSpy, restore: () => (document.createElement = originalCreateElement) };
}

describe('usePdfDecoder', () => {
  it('sets an error when decoding with empty input', () => {
    const { result } = renderHook(() => usePdfDecoder());
    act(() => result.current.handleDecode());
    expect(result.current.decodeError).toBe('Please paste a Base64 string.');
  });

  it('sets an error for invalid base64', () => {
    const { result } = renderHook(() => usePdfDecoder());
    act(() => result.current.setBase64Input('not-valid-base64!!!'));
    act(() => result.current.handleDecode());
    expect(result.current.decodeError).toBe('Invalid Base64 string. Please check your input.');
  });

  it('triggers a download for valid base64 and clears the error', () => {
    const { clickSpy, restore } = stubDownload();
    const { result } = renderHook(() => usePdfDecoder());

    act(() => result.current.setBase64Input(btoa('%PDF-1.4 content')));
    act(() => result.current.handleDecode());

    expect(result.current.decodeError).toBe('');
    expect(clickSpy).toHaveBeenCalled();
    restore();
  });

  it('accepts input with a data-URL prefix', () => {
    const { clickSpy, restore } = stubDownload();
    const { result } = renderHook(() => usePdfDecoder());

    act(() => result.current.setBase64Input(`data:application/pdf;base64,${btoa('content')}`));
    act(() => result.current.handleDecode());

    expect(result.current.decodeError).toBe('');
    expect(clickSpy).toHaveBeenCalled();
    restore();
  });

  it('clears the error as soon as the input changes', () => {
    const { result } = renderHook(() => usePdfDecoder());
    act(() => result.current.handleDecode());
    expect(result.current.decodeError).not.toBe('');

    act(() => result.current.setBase64Input('abc'));
    expect(result.current.decodeError).toBe('');
  });

  it('resets all decode state', () => {
    const { result } = renderHook(() => usePdfDecoder());
    act(() => result.current.setBase64Input('abc'));
    act(() => result.current.resetDecode());
    expect(result.current.base64Input).toBe('');
    expect(result.current.decodeError).toBe('');
  });
});

import { describe, it, expect } from 'vitest';
import {
  buildCloverSuccessBrowserPath,
  isBadCloverSessionQueryValue,
  resolveSessionIdFromParams
} from './cloverSuccessSession.js';

describe('isBadCloverSessionQueryValue', () => {
  it('treats empty as bad', () => {
    expect(isBadCloverSessionQueryValue('')).toBe(true);
    expect(isBadCloverSessionQueryValue('  ')).toBe(true);
  });
  it('treats Clover placeholder as bad', () => {
    expect(isBadCloverSessionQueryValue('{CHECKOUT_SESSION_ID}')).toBe(true);
    expect(isBadCloverSessionQueryValue('xx{CHECKOUT_SESSION_ID}')).toBe(true);
  });
  it('allows real session fragments', () => {
    expect(isBadCloverSessionQueryValue('abc123')).toBe(false);
  });
});

describe('resolveSessionIdFromParams', () => {
  it('reads session_id first', () => {
    const get = (k) =>
      ({ session_id: ' sid-1 ', checkout_session_id: 'other' })[k] ?? null;
    expect(resolveSessionIdFromParams(get)).toBe('sid-1');
  });
  it('ignores literal placeholder in session_id', () => {
    const map = { session_id: '{CHECKOUT_SESSION_ID}' };
    const get = (k) => map[k] ?? null;
    expect(resolveSessionIdFromParams(get)).toBe('');
  });
  it('falls through param names', () => {
    const map = { checkoutSessionId: 'z9' };
    const get = (k) => map[k] ?? null;
    expect(resolveSessionIdFromParams(get)).toBe('z9');
  });
});

describe('buildCloverSuccessBrowserPath', () => {
  it('returns null when session_id already valid', () => {
    const href = 'https://app.example/checkout/clover-success?session_id=real-one';
    expect(buildCloverSuccessBrowserPath(href, 'another')).toBeNull();
  });
  it('fixes literal placeholder in query', () => {
    const href =
      'https://app.example/checkout/clover-success?session_id=%7BCHECKOUT_SESSION_ID%7D&x=1';
    const next = buildCloverSuccessBrowserPath(href, 'sess-99');
    expect(next).toBeTruthy();
    const u = new URL(`https://local.test${next}`);
    expect(u.pathname).toBe('/checkout/clover-success');
    expect(u.searchParams.get('session_id')).toBe('sess-99');
    expect(u.searchParams.get('x')).toBe('1');
  });
  it('adds session_id when missing', () => {
    const href = 'https://app.example/checkout/clover-success';
    expect(buildCloverSuccessBrowserPath(href, 'abc')).toBe(
      '/checkout/clover-success?session_id=abc'
    );
  });
  it('returns null when real id missing', () => {
    expect(buildCloverSuccessBrowserPath('https://a/b', '')).toBeNull();
  });
});

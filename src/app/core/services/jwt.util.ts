import { AccessTokenPayload } from '../models/auth.model';

export function decodeAccessToken(token: string): AccessTokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function isExpired(payload: AccessTokenPayload | null): boolean {
  if (!payload) {
    return true;
  }
  return payload.exp * 1000 <= Date.now();
}

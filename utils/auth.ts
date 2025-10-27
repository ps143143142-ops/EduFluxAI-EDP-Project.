import { User } from '../types';

const TOKEN_KEY = 'eduflux_jwt_token';

/**
 * Decodes the user payload from a token string without verifying the signature.
 * In a real app, you'd verify on the server and only decode here if necessary.
 * @param token The token string.
 * @returns An object with the user, or null if decoding fails.
 */
export const decodeTokenPayload = (token: string): { user: User; exp: number } | null => {
  try {
    const payload = JSON.parse(atob(token));
    return payload;
  } catch (error) {
    console.error("Failed to decode token payload", error);
    return null;
  }
};

/**
 * Checks if a token's expiration timestamp is in the past.
 * @param exp The expiration timestamp.
 * @returns True if the token is expired, false otherwise.
 */
export const isTokenExpired = (exp: number): boolean => {
  return Date.now() >= exp;
};


/**
 * Retrieves the token from localStorage.
 * @returns The token string or null if not found.
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Stores the token in localStorage.
 * @param token The token string to store.
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Removes the token from localStorage.
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};
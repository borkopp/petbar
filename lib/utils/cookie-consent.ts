/**
 * Checks if the user has given consent for cookies
 * @returns boolean indicating if consent was given
 */
export function hasCookieConsent(): boolean {
  // Only run on client-side
  if (typeof window === 'undefined') return false;
  
  const consent = localStorage.getItem('cookieConsent');
  return consent === 'true';
}

/**
 * Sets the cookie consent status
 * @param value boolean indicating consent status
 */
export function setCookieConsent(value: boolean): void {
  // Only run on client-side
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('cookieConsent', value ? 'true' : 'false');
} 
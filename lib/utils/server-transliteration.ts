/**
 * Server-side transliteration utility for Macedonian language
 * Allows conversion between Latin and Cyrillic alphabets
 */

// Mapping from Latin to Cyrillic
const latinToCyrillic: Record<string, string> = {
  // Single character mappings
  'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'z': 'з',
  'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о',
  'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 'f': 'ф', 'h': 'х',
  'c': 'ц', 'č': 'ч', 'ć': 'ќ', 'š': 'ш', 'ž': 'ж',
  
  // Capital letters
  'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'D': 'Д', 'E': 'Е', 'Z': 'З',
  'I': 'И', 'J': 'Ј', 'K': 'К', 'L': 'Л', 'M': 'М', 'N': 'Н', 'O': 'О',
  'P': 'П', 'R': 'Р', 'S': 'С', 'T': 'Т', 'U': 'У', 'F': 'Ф', 'H': 'Х',
  'C': 'Ц', 'Č': 'Ч', 'Ć': 'Ќ', 'Š': 'Ш', 'Ž': 'Ж',
  
  // Multi-character mappings (digraphs)
  'zh': 'ж', 'ch': 'ч', 'sh': 'ш', 'kj': 'ќ', 'gj': 'ѓ', 'dz': 'ѕ', 'lj': 'љ', 'nj': 'њ',
  'Zh': 'Ж', 'Ch': 'Ч', 'Sh': 'Ш', 'Kj': 'Ќ', 'Gj': 'Ѓ', 'Dz': 'Ѕ', 'Lj': 'Љ', 'Nj': 'Њ',
  'ZH': 'Ж', 'CH': 'Ч', 'SH': 'Ш', 'KJ': 'Ќ', 'GJ': 'Ѓ', 'DZ': 'Ѕ', 'LJ': 'Љ', 'NJ': 'Њ',
};

// Mapping from Cyrillic to Latin
const cyrillicToLatin: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
  'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
  'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
  'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'ќ': 'kj', 'ѓ': 'gj', 'ѕ': 'dz',
  'љ': 'lj', 'њ': 'nj',
  
  // Capital letters
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh',
  'З': 'Z', 'И': 'I', 'Ј': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
  'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F',
  'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Ќ': 'Kj', 'Ѓ': 'Gj', 'Ѕ': 'Dz',
  'Љ': 'Lj', 'Њ': 'Nj',
};

/**
 * Converts Latin text to Cyrillic
 * @param text - The Latin text to convert
 * @returns The Cyrillic equivalent
 */
export function latinToCyrillicText(text: string): string {
  if (!text) return '';
  
  // Sort keys by length in descending order to handle multi-character mappings first
  const sortedKeys = Object.keys(latinToCyrillic).sort((a, b) => b.length - a.length);
  
  let result = text;
  for (const latin of sortedKeys) {
    const cyrillic = latinToCyrillic[latin];
    // Use global regex to replace all occurrences
    const regex = new RegExp(latin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, cyrillic);
  }
  
  return result;
}

/**
 * Converts Cyrillic text to Latin
 * @param text - The Cyrillic text to convert
 * @returns The Latin equivalent
 */
export function cyrillicToLatinText(text: string): string {
  if (!text) return '';
  
  let result = text;
  for (const [cyrillic, latin] of Object.entries(cyrillicToLatin)) {
    // Use global regex to replace all occurrences
    const regex = new RegExp(cyrillic, 'g');
    result = result.replace(regex, latin);
  }
  
  return result;
}

/**
 * Creates a Supabase filter condition for text search that works with both Latin and Cyrillic
 * @param column - The database column to search in
 * @param searchText - The search text (can be Latin or Cyrillic)
 * @returns An array of filter conditions that can be used with Supabase's .or() method
 */
export function createBilingualSearchFilter(column: string, searchText: string): string[] {
  if (!searchText) return [];
  
  const lowerText = searchText.toLowerCase();
  const cyrillicVersion = latinToCyrillicText(lowerText);
  const latinVersion = cyrillicToLatinText(lowerText);
  
  // Create ILIKE conditions for each version
  return [
    `${column}.ilike.%${lowerText}%`,
    `${column}.ilike.%${cyrillicVersion}%`,
    `${column}.ilike.%${latinVersion}%`
  ];
} 
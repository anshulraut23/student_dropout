const cache = new Map();

function makeCacheKey(text, target, source) {
  return `${target}|${source}|${text}`;
}

export async function translateText(text, targetLang, sourceLang = 'en') {
  if (!text || !targetLang || targetLang === sourceLang) return text;
  const key = makeCacheKey(text, targetLang, sourceLang);
  if (cache.has(key)) return cache.get(key);

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
    sourceLang
  )}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // data structure: [ [ [ translatedText, originalText, ... ], ... ], ... ]
    const translated = Array.isArray(data) && Array.isArray(data[0])
      ? data[0].map((seg) => (Array.isArray(seg) ? seg[0] : '')).join('')
      : '';
    const finalText = translated || text;
    cache.set(key, finalText);
    return finalText;
  } catch (e) {
    // On any failure (network/CORS), just return original
    return text;
  }
}

export function clearTranslateCache() {
  cache.clear();
}

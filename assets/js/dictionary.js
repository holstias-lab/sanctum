/* ===== Sanctum dictionary search =====
   Looks up English words on Wiktionary's Translations tables and cross-
   references Wikimedia Commons for a real pronunciation recording, so
   vocabulary can be added as verified dictionary entries (with real audio
   when available) instead of arbitrary free-text — both are free, public,
   CORS-enabled Wikimedia APIs, no key or backend required. */

const DICTIONARY_LANG_CODE = {
  'Arabic': 'ar', 'Spanish': 'es', 'French': 'fr', 'German': 'de', 'Italian': 'it',
  'Portuguese': 'pt', 'Russian': 'ru', 'Mandarin': 'cmn', 'Japanese': 'ja', 'Korean': 'ko',
  'Hindi': 'hi', 'Turkish': 'tr', 'Vietnamese': 'vi', 'Thai': 'th', 'Indonesian': 'id',
  'Dutch': 'nl', 'Swedish': 'sv', 'Polish': 'pl', 'Greek': 'el', 'Swahili': 'sw',
  'Twi': 'tw', 'Urdu': 'ur', 'Persian': 'fa', 'Bengali': 'bn',
  // Quranic Arabic has no meaningful Wiktionary translation-table code —
  // dictionary search is unavailable for it, manual entry only.
};

async function wiktionaryWikitext(page) {
  const url = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wiktionary lookup failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.info || 'Wiktionary lookup failed');
  return data.parse.wikitext['*'];
}

// Parses {{trans-top|gloss}}...{{trans-bottom}} blocks for {{t|code|word|tr=...}} entries.
function parseTranslations(wikitext, wikiCode) {
  const results = [];
  const blockRe = /\{\{trans-top\|([^}]*)\}\}([\s\S]*?)\{\{trans-bottom\}\}/g;
  let blockMatch;
  while ((blockMatch = blockRe.exec(wikitext))) {
    const gloss = blockMatch[1].replace(/^id=\S+\|/, '').trim();
    const block = blockMatch[2];
    // Wiktionary uses several template name variants for translation entries
    // (t, t+, tt, tt+, t-check, t+check, ...) — match any of them.
    const entryRe = new RegExp(`\\{\\{t{1,2}[+-]?(?:check)?\\|${wikiCode}\\|([^|}]+)((?:\\|[^|}]*)*)\\}\\}`, 'g');
    let entryMatch;
    while ((entryMatch = entryRe.exec(block))) {
      const word = entryMatch[1].trim();
      const rest = entryMatch[2] || '';
      const trMatch = rest.match(/\|tr=([^|}]+)/);
      results.push({ word, translit: trMatch ? trMatch[1].trim() : '', gloss });
    }
  }
  // De-dupe identical words (same word can appear under multiple senses).
  const seen = new Set();
  return results.filter(r => {
    const key = r.word + '|' + r.translit;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const AUDIO_EXT = ['.ogg', '.oga', '.wav', '.opus', '.mp3', '.flac'];
const ACCEPTABLE_LICENSE = /cc|public domain|\bpd\b|gfdl/i;

async function findCommonsAudio(word) {
  const q = encodeURIComponent(`intitle:"${word}"`);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`;
  let data;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    data = await res.json();
  } catch (e) {
    return null;
  }
  const pages = (data.query && data.query.pages) || {};
  for (const page of Object.values(pages)) {
    const title = page.title || '';
    if (!AUDIO_EXT.some(ext => title.toLowerCase().endsWith(ext))) continue;
    if (title.toLowerCase().indexOf(word.toLowerCase()) === -1) continue;
    const info = (page.imageinfo || [])[0];
    if (!info) continue;
    const meta = info.extmetadata || {};
    const license = (meta.LicenseShortName && meta.LicenseShortName.value) || '';
    if (!ACCEPTABLE_LICENSE.test(license)) continue;
    return info.url;
  }
  return null;
}

// Main entry point: search an English word for translations in langName,
// each candidate cross-referenced with Commons for real audio.
async function searchDictionary(englishQuery, langName) {
  const wikiCode = DICTIONARY_LANG_CODE[langName];
  if (!wikiCode) return { unsupported: true, results: [] };

  const page = englishQuery.trim();

  // Heavily-translated common words (water, tree, ...) move their full
  // translation table onto a "<word>/translations" subpage — when that
  // exists it's the authoritative, complete table, so prefer it over
  // whatever (often only minor-sense) blocks remain on the main entry.
  let wikitext;
  try {
    wikitext = await wiktionaryWikitext(page + '/translations');
  } catch (e) {
    try {
      wikitext = await wiktionaryWikitext(page);
    } catch (e2) {
      return { error: e2.message, results: [] };
    }
  }

  const translations = parseTranslations(wikitext, wikiCode);
  if (!translations.length) return { results: [] };

  const results = await Promise.all(translations.slice(0, 6).map(async (t) => {
    const audio = await findCommonsAudio(t.word).catch(() => null);
    return { ...t, audio };
  }));

  return { results };
}

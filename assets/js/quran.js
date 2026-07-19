/* ===== Quran data via api.alquran.cloud (free, no key required) ===== */
const QURAN_API = 'https://api.alquran.cloud/v1';

async function getSurahList() {
  const cached = sessionStorage.getItem('quran_surah_list');
  if (cached) return JSON.parse(cached);
  const res = await fetch(`${QURAN_API}/surah`);
  const json = await res.json();
  const list = json.data;
  sessionStorage.setItem('quran_surah_list', JSON.stringify(list));
  return list;
}

async function getSurah(number) {
  const cacheKey = `quran_surah_${number}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);
  const res = await fetch(`${QURAN_API}/surah/${number}/editions/quran-uthmani,en.sahih`);
  const json = await res.json();
  const [arabic, translation] = json.data;
  const ayahs = arabic.ayahs.map((a, i) => ({
    number: a.numberInSurah,
    globalNumber: a.number,
    arabic: a.text,
    translation: translation.ayahs[i] ? translation.ayahs[i].text : '',
  }));
  const result = { number: arabic.number, name: arabic.name, englishName: arabic.englishName, englishNameTranslation: arabic.englishNameTranslation, revelationType: arabic.revelationType, ayahs };
  sessionStorage.setItem(cacheKey, JSON.stringify(result));
  return result;
}

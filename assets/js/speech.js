/* ===== Sanctum pronunciation audio via the browser's built-in Web Speech API =====
   Free and offline-capable, but quality depends entirely on which voices
   the visitor's OS/browser has installed — there is no bundled voice data.
   We explicitly pick a matching installed voice instead of just hoping the
   browser's default voice happens to speak the right language. */
const SPEECH_LANG_MAP = {
  'Arabic': 'ar-SA', 'Quranic Arabic': 'ar-SA', 'Spanish': 'es-ES', 'French': 'fr-FR',
  'German': 'de-DE', 'Italian': 'it-IT', 'Portuguese': 'pt-PT', 'Russian': 'ru-RU',
  'Mandarin': 'zh-CN', 'Japanese': 'ja-JP', 'Korean': 'ko-KR', 'Hindi': 'hi-IN',
  'Turkish': 'tr-TR', 'Vietnamese': 'vi-VN', 'Thai': 'th-TH', 'Indonesian': 'id-ID',
  'Dutch': 'nl-NL', 'Swedish': 'sv-SE', 'Polish': 'pl-PL', 'Greek': 'el-GR',
  'Swahili': 'sw-KE', 'Twi': 'ak-GH', 'Urdu': 'ur-PK',
  'Persian': 'fa-IR', 'Bengali': 'bn-BD',
};

let voicesPromise = null;
function loadVoices() {
  if (voicesPromise) return voicesPromise;
  voicesPromise = new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) { resolve(existing); return; }
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) {
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve(v);
      }
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1500);
  });
  return voicesPromise;
}

function pickVoice(voices, langCode) {
  const exact = voices.find(v => v.lang.toLowerCase() === langCode.toLowerCase());
  if (exact) return exact;
  const prefix = langCode.split('-')[0].toLowerCase();
  return voices.find(v => v.lang.toLowerCase().startsWith(prefix)) || null;
}

async function speakText(text, langName) {
  if (!text || !('speechSynthesis' in window)) { if (window.Sanctum) Sanctum.toast('Audio not supported in this browser'); return; }
  window.speechSynthesis.cancel();
  const langCode = SPEECH_LANG_MAP[langName] || 'en-US';
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langCode;
  utter.rate = 0.9;
  const voices = await loadVoices();
  const voice = pickVoice(voices, langCode);
  if (voice) {
    utter.voice = voice;
  } else if (window.Sanctum) {
    Sanctum.toast(`No ${langName} voice installed on this device — playing with default voice`);
  }
  window.speechSynthesis.speak(utter);
}

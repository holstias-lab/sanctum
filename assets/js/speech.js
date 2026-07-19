/* ===== Sanctum pronunciation audio via the browser's built-in Web Speech API ===== */
const SPEECH_LANG_MAP = {
  'Arabic': 'ar-SA', 'Quranic Arabic': 'ar-SA', 'Spanish': 'es-ES', 'French': 'fr-FR',
  'German': 'de-DE', 'Italian': 'it-IT', 'Portuguese': 'pt-PT', 'Russian': 'ru-RU',
  'Mandarin': 'zh-CN', 'Japanese': 'ja-JP', 'Korean': 'ko-KR', 'Hindi': 'hi-IN',
  'Turkish': 'tr-TR', 'Vietnamese': 'vi-VN', 'Thai': 'th-TH', 'Indonesian': 'id-ID',
  'Dutch': 'nl-NL', 'Swedish': 'sv-SE', 'Polish': 'pl-PL', 'Greek': 'el-GR',
  'Hebrew': 'he-IL', 'Swahili': 'sw-KE', 'Twi': 'ak-GH', 'Urdu': 'ur-PK',
  'Persian': 'fa-IR', 'Bengali': 'bn-BD',
};

function speakText(text, langName) {
  if (!text || !('speechSynthesis' in window)) { if (window.Sanctum) Sanctum.toast('Audio not supported in this browser'); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = SPEECH_LANG_MAP[langName] || 'en-US';
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

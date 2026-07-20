/* ===== Sanctum pronunciation audio =====
   Primary engine: eSpeak-ng compiled to WASM (self-hosted under
   assets/vendor/espeakng/), a free, open-source, offline speech synthesizer
   with broad language coverage — no API key, no signup, no per-request cost,
   and no dependency on which voices happen to be installed on the visitor's
   OS. It sounds synthetic/robotic rather than fluent, but it's consistent
   and reliable everywhere, including for Arabic, which the OS-voice-based
   Web Speech API often can't manage at all.
   Falls back to the browser's built-in Web Speech API for the couple of
   languages eSpeak-ng doesn't cover in our catalog (Thai, Twi) or any
   custom-added language it doesn't recognize. */

const ESPEAK_VOICE_MAP = {
  'Arabic': 'sem/ar', 'Quranic Arabic': 'sem/ar',
  'Spanish': 'roa/es', 'French': 'roa/fr', 'German': 'gmw/de', 'Italian': 'roa/it',
  'Portuguese': 'roa/pt-PT', 'Russian': 'zls/ru', 'Mandarin': 'sit/cmn', 'Japanese': 'jpx/jp',
  'Korean': 'ko', 'Hindi': 'inc/hi', 'Turkish': 'trk/tr', 'Vietnamese': 'aav/vi',
  'Indonesian': 'poz/id', 'Dutch': 'gmw/nl', 'Swedish': 'gmq/sv', 'Polish': 'zls/pl',
  'Greek': 'grk/el', 'Swahili': 'bnt/sw', 'Urdu': 'inc/ur', 'Persian': 'ira/fa',
  'Bengali': 'inc/bn',
};

// Web Speech API fallback map (for languages eSpeak-ng doesn't cover: Thai, Twi).
const SPEECH_LANG_MAP = {
  'Thai': 'th-TH', 'Twi': 'ak-GH',
};

let espeakReadyPromise = null;
let audioCtx = null;

function loadEspeak() {
  if (espeakReadyPromise) return espeakReadyPromise;
  espeakReadyPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'assets/vendor/espeakng/espeakng.min.js';
    script.onload = () => {
      try {
        const tts = new eSpeakNG('assets/vendor/espeakng/espeakng.worker.js', () => resolve(tts));
      } catch (e) { reject(e); }
    };
    script.onerror = () => reject(new Error('espeakng failed to load'));
    document.head.appendChild(script);
  });
  return espeakReadyPromise;
}

function playPcmChunks(chunks, sampleRate) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  let total = 0;
  chunks.forEach(c => total += c.length);
  if (!total) throw new Error('eSpeak produced no audio samples');
  const merged = new Float32Array(total);
  let offset = 0;
  chunks.forEach(c => {
    merged.set(c, offset);
    offset += c.length;
  });
  const buffer = audioCtx.createBuffer(1, total, sampleRate);
  buffer.copyToChannel(merged, 0);
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  src.connect(audioCtx.destination);
  src.start();
}

async function speakWithEspeak(text, voiceId) {
  const tts = await loadEspeak();
  await new Promise(resolve => tts.set_voice(voiceId, resolve));
  const chunks = [];
  await new Promise(resolve => {
    tts.synthesize(text, (wav) => {
      if (wav && wav.byteLength) {
        chunks.push(new Float32Array(wav));
      } else {
        resolve();
      }
    });
  });
  playPcmChunks(chunks, 22050);
}

function speakWithWebSpeech(text, langCode) {
  if (!('speechSynthesis' in window)) {
    console.error('Sanctum speech: no TTS available (Web Speech API unsupported)');
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langCode;
  utter.rate = 0.9;
  utter.onerror = (e) => console.error('Sanctum speech: Web Speech API failed', e.error);
  window.speechSynthesis.speak(utter);
}

async function speakText(text, langName) {
  if (!text) return;
  const espeakVoice = ESPEAK_VOICE_MAP[langName];
  if (espeakVoice) {
    try {
      await speakWithEspeak(text, espeakVoice);
      return;
    } catch (e) {
      // fall through to Web Speech API if eSpeak fails for any reason
      console.error('Sanctum speech: eSpeak-ng failed, falling back to Web Speech API', e);
    }
  }
  const webSpeechLang = SPEECH_LANG_MAP[langName] || 'en-US';
  speakWithWebSpeech(text, webSpeechLang);
}

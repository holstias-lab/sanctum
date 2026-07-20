/* ===== Sanctum pronunciation audio =====
   Primary engine: eSpeak-ng compiled to WASM (self-hosted under
   assets/vendor/espeakng/), a free, open-source, offline speech synthesizer
   with broad language coverage — no API key, no signup, no per-request cost,
   and no dependency on which voices happen to be installed on the visitor's
   OS. It sounds synthetic/robotic rather than fluent, but it's consistent
   and reliable everywhere.
   For languages where eSpeak-ng's formant synthesis is especially harsh
   (Arabic, Mandarin), Piper — a neural TTS engine, also self-hosted, also
   free/offline (assets/vendor/piper/) — is used instead for a much more
   natural voice, at the cost of a large one-time per-language model
   download (~60MB) that's cached by the browser after first use.
   Falls back to the browser's built-in Web Speech API for the couple of
   languages eSpeak-ng doesn't cover in our catalog (Thai, Twi) or any
   custom-added language it doesn't recognize. */

const PIPER_VOICE_MAP = {
  'Arabic': 'ar_JO-kareem-medium', 'Quranic Arabic': 'ar_JO-kareem-medium',
  'Mandarin': 'zh_CN-huayan-medium',
};

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

// Bump this whenever a vendored engine file (Piper/eSpeak-ng loader
// scripts) changes, so browsers that already cached the old, broken
// version fetch the fix instead of silently keeping the stale one.
const ENGINE_ASSET_VERSION = '2026-07-20-1';

let espeakReadyPromise = null;
let audioCtx = null;

// Tracks whatever is currently making sound (an HTMLAudioElement for real
// recordings/Piper, or an AudioBufferSourceNode for eSpeak) so a new play
// request can stop it first. Without this, clicking the speaker icon
// repeatedly stacks up overlapping copies of the same clip, which beats
// against itself and comes out as a warped/"mooing" mess instead of
// cutting the old one off.
let currentPlayback = null;

function stopCurrentPlayback() {
  if (!currentPlayback) return;
  try {
    if (typeof currentPlayback.pause === 'function') {
      currentPlayback.pause();
      currentPlayback.currentTime = 0;
    } else if (typeof currentPlayback.stop === 'function') {
      currentPlayback.stop();
    }
  } catch (e) { /* already stopped/ended — fine */ }
  currentPlayback = null;
}

function loadEspeak() {
  if (espeakReadyPromise) return espeakReadyPromise;
  espeakReadyPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'assets/vendor/espeakng/espeakng.min.js?v=' + ENGINE_ASSET_VERSION;
    script.onload = () => {
      try {
        const tts = new eSpeakNG('assets/vendor/espeakng/espeakng.worker.js?v=' + ENGINE_ASSET_VERSION, () => resolve(tts));
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
  stopCurrentPlayback();
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  src.connect(audioCtx.destination);
  src.onended = () => { if (currentPlayback === src) currentPlayback = null; };
  currentPlayback = src;
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

let piperReadyPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(src + ' failed to load'));
    document.head.appendChild(script);
  });
}

function loadPiper() {
  if (piperReadyPromise) return piperReadyPromise;
  piperReadyPromise = (async () => {
    await loadScript('assets/vendor/piper/ort.min.js?v=' + ENGINE_ASSET_VERSION);
    await loadScript('assets/vendor/piper/piper-tts-proper.js?v=' + ENGINE_ASSET_VERSION);
  })();
  return piperReadyPromise;
}

// A ProperPiperTTS instance's ONNX session reliably corrupts itself on a
// second synthesis call (confirmed: recreating just the session doesn't
// fix it, only a wholly fresh instance does — the fault is somewhere
// else in the instance's WASM-backed state, not just the session object).
// So build a brand-new instance per call instead of caching one per voice.
// The ~800ms cost is model-session setup only; the ~60MB model bytes
// themselves are served from the browser's HTTP cache after the first
// real fetch, so this isn't a repeated download.
async function speakWithPiper(text, voiceId) {
  await loadPiper();
  const instance = new ProperPiperTTS(voiceId);
  await instance.speak(text, 1.0);
}

function speakWithWebSpeech(text, langCode) {
  if (!('speechSynthesis' in window)) {
    console.error('Sanctum speech: no TTS available (Web Speech API unsupported)');
    return;
  }
  stopCurrentPlayback();
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langCode;
  utter.rate = 0.9;
  utter.onerror = (e) => console.error('Sanctum speech: Web Speech API failed', e.error);
  window.speechSynthesis.speak(utter);
}

async function speakText(text, langName) {
  if (!text) return;
  const piperVoice = PIPER_VOICE_MAP[langName];
  if (piperVoice) {
    try {
      await speakWithPiper(text, piperVoice);
      return;
    } catch (e) {
      // fall through to eSpeak-ng if Piper fails to load/run for any reason
      console.error('Sanctum speech: Piper failed, falling back to eSpeak-ng', e);
    }
  }
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

// Prefer a real human-voice recording (word.audio, a Wikimedia Commons
// pronunciation clip) when one is attached; otherwise fall back to TTS.
function speakWord(word) {
  if (!word) return;
  if (word.audio) {
    stopCurrentPlayback();
    const player = new Audio(word.audio);
    player.onended = () => { if (currentPlayback === player) currentPlayback = null; };
    currentPlayback = player;
    player.play().catch((e) => {
      console.error('Sanctum speech: real audio playback failed, falling back to TTS', e);
      if (currentPlayback === player) currentPlayback = null;
      speakText(word.arabic, word.lang);
    });
    return;
  }
  speakText(word.arabic, word.lang);
}

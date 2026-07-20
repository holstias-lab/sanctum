/* ===== Sanctum shared state (localStorage-backed) ===== */
const SANCTUM_KEY = 'sanctum_state_v1';

const RANKS = [
  { name: 'Novitiate Rank', xp: 0 },
  { name: 'Apprentice Linguist', xp: 0 },
  { name: 'Wandering Scholar', xp: 500 },
  { name: 'Keeper of Tongues', xp: 1500 },
  { name: 'Arcane Wordsmith', xp: 3500 },
];

function defaultState() {
  return {
    profile: {
      name: 'Scholar',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbrusMQaS4Bx-xLXoHPt8gAa-X4f_hiMIBJ9R29N8eCsDarU1xEE6fE50OL_5VpSWCeMSsFVFIxFV0oCwNF4w8zEod9dCDYtsMlEH-j3jhVXr6WwwQKSUC9bnxx1h9PxdeLAVzkn3_d50GTLI6PaXgpGVIjs5Y3Y5HVKbtCNmV3O2EEhHLtjvab3iG4--q_5Xv143sXwMXDLpG1LEMY1OMIaMjRj73UgBtQ2omK1jNp0VCAx1Sy_WjJA',
      totalXp: 0,
      streak: 0,
      lastActiveDate: null,
      theme: 'sage',
      onboarded: false,
    },
    languages: [
      { code: 'qar', name: 'Quranic Arabic', icon: 'auto_stories', flag: '📖', unlocked: true, core: true, xpRequired: 0, progress: 0 },
      { code: 'ar', name: 'Arabic', flag: '🇸🇦', unlocked: false, xpRequired: 0, progress: 0 },
      { code: 'es', name: 'Spanish', flag: '🇪🇸', unlocked: false, xpRequired: 300, progress: 0 },
      { code: 'fr', name: 'French', flag: '🇫🇷', unlocked: false, xpRequired: 600, progress: 0 },
      { code: 'de', name: 'German', flag: '🇩🇪', unlocked: false, xpRequired: 900, progress: 0 },
      { code: 'it', name: 'Italian', flag: '🇮🇹', unlocked: false, xpRequired: 1200, progress: 0 },
      { code: 'pt', name: 'Portuguese', flag: '🇵🇹', unlocked: false, xpRequired: 1500, progress: 0 },
      { code: 'ru', name: 'Russian', flag: '🇷🇺', unlocked: false, xpRequired: 1800, progress: 0 },
      { code: 'zh', name: 'Mandarin', flag: '🇨🇳', unlocked: false, xpRequired: 2100, progress: 0 },
      { code: 'ja', name: 'Japanese', flag: '🇯🇵', unlocked: false, xpRequired: 2400, progress: 0 },
      { code: 'ko', name: 'Korean', flag: '🇰🇷', unlocked: false, xpRequired: 2700, progress: 0 },
      { code: 'hi', name: 'Hindi', flag: '🇮🇳', unlocked: false, xpRequired: 3000, progress: 0 },
      { code: 'tr', name: 'Turkish', flag: '🇹🇷', unlocked: false, xpRequired: 3300, progress: 0 },
      { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', unlocked: false, xpRequired: 3600, progress: 0 },
      { code: 'th', name: 'Thai', flag: '🇹🇭', unlocked: false, xpRequired: 3900, progress: 0 },
      { code: 'id', name: 'Indonesian', flag: '🇮🇩', unlocked: false, xpRequired: 4200, progress: 0 },
      { code: 'nl', name: 'Dutch', flag: '🇳🇱', unlocked: false, xpRequired: 4500, progress: 0 },
      { code: 'sv', name: 'Swedish', flag: '🇸🇪', unlocked: false, xpRequired: 4800, progress: 0 },
      { code: 'pl', name: 'Polish', flag: '🇵🇱', unlocked: false, xpRequired: 5100, progress: 0 },
      { code: 'el', name: 'Greek', flag: '🇬🇷', unlocked: false, xpRequired: 5400, progress: 0 },
      { code: 'sw', name: 'Swahili', flag: '🇰🇪', unlocked: false, xpRequired: 6000, progress: 0 },
      { code: 'tw', name: 'Twi', flag: '🇬🇭', unlocked: false, xpRequired: 6300, progress: 0 },
      { code: 'ur', name: 'Urdu', flag: '🇵🇰', unlocked: false, xpRequired: 6600, progress: 0 },
      { code: 'fa', name: 'Persian', flag: '🇮🇷', unlocked: false, xpRequired: 6900, progress: 0 },
      { code: 'bn', name: 'Bengali', flag: '🇧🇩', unlocked: false, xpRequired: 7200, progress: 0 },
    ],
    vocab: [],
    sessions: [],
    quests: [
      { id: 'q1', title: 'Review 10 words', current: 0, target: 10, xp: 25 },
      { id: 'q2', title: 'Complete a Pomodoro focus session', current: 0, target: 1, xp: 25 },
      { id: 'q3', title: 'Read one page of Quran', current: 0, target: 1, xp: 30 },
      { id: 'q4', title: 'Add a new vocabulary word', current: 0, target: 1, xp: 10 },
    ],
    ritual: [
      { id: 'r1', label: "Log today's session", done: false },
      { id: 'r2', label: 'Review 10 words', done: false },
      { id: 'r3', label: 'Practise one surah', done: false },
      { id: 'r4', label: 'Add XP for today', done: false },
    ],
    ritualDate: null,
    wordsReviewedToday: 0,
    quranProgress: { surahsCompleted: [], versesRead: 0, lastSurah: 18, lastAyah: 1 },
    savedVerses: [],
    resources: [],
  };
}

function migrateState(s) {
  s.languages = s.languages || [];
  s.resources = (s.resources || []).map(r => r.lang ? r : { ...r, lang: 'General' });
  if (typeof s.wordsReviewedToday !== 'number') s.wordsReviewedToday = 0;
  if (!s.profile.theme) s.profile.theme = 'sage';
  // Existing accounts predate the onboarding flow — don't force them through it.
  if (typeof s.profile.onboarded !== 'boolean') s.profile.onboarded = true;
  // Merge any newly-added catalog languages in without touching what the account already has.
  const existingCodes = new Set(s.languages.map(l => l.code));
  defaultState().languages.forEach(cl => {
    if (!existingCodes.has(cl.code)) s.languages.push(cl);
  });
  s.languages = s.languages.filter(l => l.code !== 'he');
  // De-dupe by code (defensive: an old migration rule used to be able to introduce
  // duplicates here — keep the first occurrence of each code if any slipped through).
  const seen = new Set();
  s.languages = s.languages.filter(l => (seen.has(l.code) ? false : (seen.add(l.code), true)));
  // Quranic Arabic is core Quran-study access — always unlocked regardless of history.
  const qar = s.languages.find(l => l.code === 'qar');
  if (qar) qar.unlocked = true;
  return s;
}

function loadState() {
  try {
    const raw = localStorage.getItem(SANCTUM_KEY);
    if (!raw) {
      const s = defaultState();
      saveState(s);
      return s;
    }
    const parsed = JSON.parse(raw);
    const merged = migrateState(Object.assign(defaultState(), parsed));
    return merged;
  } catch (e) {
    return defaultState();
  }
}

function saveState(state) {
  localStorage.setItem(SANCTUM_KEY, JSON.stringify(state));
}

const Sanctum = (function () {
  let state = loadState();

  function persist() { saveState(state); cloudPushDebounced(); }

  let pushTimer = null;
  async function doCloudPush() {
    if (typeof sbClient === 'undefined') return;
    try {
      const { data: { session } } = await sbClient.auth.getSession();
      if (!session) return;
      await sbClient.from('sanctum_data').upsert({
        user_id: session.user.id, data: state, updated_at: new Date().toISOString(),
      });
    } catch (e) { /* offline or transient error — local copy is still safe */ }
  }
  function cloudPushDebounced() {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(doCloudPush, 900);
  }
  // Immediate, awaited push — use before anything that navigates away or clears
  // local state (e.g. sign-out), since the debounced version can otherwise lose
  // the last change if the page unloads before the timer fires.
  async function cloudPushNow() {
    clearTimeout(pushTimer);
    await doCloudPush();
  }

  async function cloudPull() {
    if (typeof sbClient === 'undefined') return;
    try {
      const { data: { session } } = await sbClient.auth.getSession();
      if (!session) return;
      const { data, error } = await sbClient.from('sanctum_data').select('data').eq('user_id', session.user.id).maybeSingle();
      if (error) return;
      if (!data) {
        // Brand-new account: seed the cloud with a guaranteed-clean state,
        // never with whatever happens to be cached locally (that could be
        // leftover from a different account that used this same browser).
        state = defaultState();
        saveState(state);
        await sbClient.from('sanctum_data').upsert({ user_id: session.user.id, data: state, updated_at: new Date().toISOString() });
        return;
      }
      state = migrateState(Object.assign(defaultState(), data.data));
      saveState(state);
    } catch (e) { /* offline — keep using local cache */ }
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function bumpStreak() {
    const today = todayStr();
    const last = state.profile.lastActiveDate;
    if (last === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (last === yesterday) {
      state.profile.streak += 1;
    } else if (last !== null) {
      state.profile.streak = 1;
    } else {
      state.profile.streak = 1;
    }
    state.profile.lastActiveDate = today;
    persist();
  }

  function resetRitualIfNewDay() {
    const today = todayStr();
    if (state.ritualDate !== today) {
      state.ritual.forEach(r => r.done = false);
      state.quests.forEach(q => { q.current = 0; q.claimedDate = null; });
      state.wordsReviewedToday = 0;
      state.ritualDate = today;
      persist();
    }
  }

  function currentRank() {
    let rank = RANKS[0];
    for (const r of RANKS) {
      if (state.profile.totalXp >= r.xp) rank = r;
    }
    return rank;
  }

  function nextRank() {
    const cur = currentRank();
    const idx = RANKS.findIndex(r => r.name === cur.name);
    return RANKS[idx + 1] || null;
  }

  function level() {
    return Math.max(1, Math.floor(state.profile.totalXp / 1000) + 1);
  }

  function addXP(amount, opts) {
    state.profile.totalXp += amount;
    bumpStreak();
    persist();
    if (!opts || !opts.silent) toast(`+${amount} XP`);
    return state.profile.totalXp;
  }

  function addWord(word) {
    word.id = 'w' + Date.now();
    word.mastery = word.mastery || 0;
    word.createdAt = Date.now();
    state.vocab.unshift(word);
    persist();
    return word;
  }

  function deleteWord(id) {
    state.vocab = state.vocab.filter(w => w.id !== id);
    persist();
  }

  function setMastery(id, val) {
    const w = state.vocab.find(w => w.id === id);
    if (w) { w.mastery = Math.max(0, Math.min(100, val)); persist(); }
  }

  function logSession(session) {
    session.id = 's' + Date.now();
    session.createdAt = Date.now();
    state.sessions.unshift(session);
    persist();
  }

  function reviewWord(id, masteryDelta) {
    resetRitualIfNewDay();
    const w = state.vocab.find(w => w.id === id);
    if (!w) return null;
    const newMastery = Math.max(0, Math.min(100, Math.round((w.mastery || 0) * 0.6 + masteryDelta * 0.4)));
    w.mastery = newMastery;
    state.wordsReviewedToday = (state.wordsReviewedToday || 0) + 1;
    const q1 = state.quests.find(q => q.id === 'q1');
    if (q1 && q1.current < q1.target) q1.current = Math.min(q1.target, state.wordsReviewedToday);
    if (state.wordsReviewedToday >= 10) {
      const r = state.ritual.find(r => r.id === 'r2');
      if (r && !r.done) r.done = true;
    }
    persist();
    return newMastery;
  }

  function logFlashcardLap(cardCount) {
    const xp = cardCount * 2;
    logSession({ title: 'Flashcard Review', language: 'Mixed', durationMin: Math.max(1, Math.round(cardCount / 2)), type: 'flashcards', xp });
    addXP(xp);
  }

  function addLanguage(name) {
    const clean = (name || '').trim();
    if (!clean) return null;
    const exists = state.languages.some(l => l.name.toLowerCase() === clean.toLowerCase());
    if (exists) { toast(clean + ' is already in your languages'); return null; }
    const lang = {
      code: clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 12) || 'lang' + Date.now(),
      name: clean, icon: 'translate', unlocked: true, xpRequired: 0, progress: 0, custom: true,
    };
    state.languages.push(lang);
    persist();
    return lang;
  }

  function chooseStarterLanguage(code) {
    const lang = state.languages.find(l => l.code === code);
    if (lang) { lang.unlocked = true; lang.xpRequired = 0; }
    state.profile.onboarded = true;
    persist();
    return lang;
  }

  function removeLanguage(code) {
    state.languages = state.languages.filter(l => l.code !== code || !l.custom);
    persist();
  }

  function setTheme(theme) {
    state.profile.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    saveState(state);
    cloudPushNow();
  }

  function claimQuest(id) {
    const q = state.quests.find(q => q.id === id);
    if (!q) return;
    q.claimedDate = todayStr();
    q.current = 0;
    if (id === 'q1') state.wordsReviewedToday = 0;
    persist();
    addXP(q.xp);
  }

  function toggleRitual(id) {
    const r = state.ritual.find(r => r.id === id);
    if (r) { r.done = !r.done; persist(); }
  }

  function ritualProgress() {
    const total = state.ritual.length;
    const done = state.ritual.filter(r => r.done).length;
    return total ? done / total : 0;
  }

  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  resetRitualIfNewDay();

  return {
    get state() { return state; },
    persist, addXP, addWord, deleteWord, setMastery, logSession,
    toggleRitual, ritualProgress, currentRank, nextRank, level,
    bumpStreak, toast, todayStr, RANKS,
    reviewWord, logFlashcardLap, claimQuest, setTheme,
    addLanguage, removeLanguage, chooseStarterLanguage,
    cloudPull, cloudPushDebounced, cloudPushNow,
  };
})();

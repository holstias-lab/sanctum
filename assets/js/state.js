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
    },
    languages: [
      { code: 'ar', name: 'Arabic', icon: 'language', unlocked: true, xpRequired: 0, progress: 0.15 },
      { code: 'qar', name: 'Quranic Arabic', icon: 'auto_stories', unlocked: true, xpRequired: 0, progress: 0.1 },
      { code: 'ru', name: 'Russian', icon: 'translate', unlocked: false, xpRequired: 500, progress: 0 },
      { code: 'tw', name: 'Twi', icon: 'translate', unlocked: false, xpRequired: 1000, progress: 0 },
      { code: 'zh', name: 'Mandarin', icon: 'translate', unlocked: false, xpRequired: 1500, progress: 0 },
      { code: 'ja', name: 'Japanese', icon: 'translate', unlocked: false, xpRequired: 2000, progress: 0 },
      { code: 'fr', name: 'French', icon: 'translate', unlocked: false, xpRequired: 2500, progress: 0 },
    ],
    vocab: [
      { id: 'w1', arabic: 'بِسْمِ', translit: 'Bismi', meaning: 'In the name of', example: '"بسم الله — In the name of Allah"', lang: 'Quranic Arabic', mastery: 20, createdAt: Date.now() },
      { id: 'w2', arabic: 'الله', translit: 'Allahi', meaning: 'Allah / God', example: '"In the name of Allah"', lang: 'Quranic Arabic', mastery: 40, createdAt: Date.now() },
      { id: 'w3', arabic: 'الرَّحْمَنِ', translit: 'Ar-Rahman', meaning: 'The Most Gracious', example: '"First verse of Al-Fatiha"', lang: 'Quranic Arabic', mastery: 30, createdAt: Date.now() },
      { id: 'w4', arabic: 'الْقَلْبُ', translit: 'Al-Qalb', meaning: 'The Heart / The Center', example: '"Verily, in the remembrance of Allah do hearts find rest." — Ar-Ra\'d 13:28', lang: 'Quranic Arabic', mastery: 15, createdAt: Date.now() },
      { id: 'w5', arabic: 'نُور', translit: 'Nur', meaning: 'Light', example: '"Allah is the Light of the heavens and the earth"', lang: 'Quranic Arabic', mastery: 25, createdAt: Date.now() },
      { id: 'w6', arabic: 'سَلَام', translit: 'Salam', meaning: 'Peace', example: '"Greeting of peace"', lang: 'Arabic', mastery: 60, createdAt: Date.now() },
      { id: 'w7', arabic: 'رُوح', translit: 'Ruh', meaning: 'Spirit / Soul', example: '"The soul or spirit"', lang: 'Quranic Arabic', mastery: 10, createdAt: Date.now() },
    ],
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
    savedVerses: [
      { surah: 18, ayah: 10, label: 'Ashabul Kahf' },
      { surah: 18, ayah: 23, label: 'The Will of Allah' },
    ],
    resources: [
      { id: 'res1', title: 'Quran.com', url: 'https://quran.com', note: 'Full mushaf with tafsir and audio recitations', lang: 'General' },
      { id: 'res2', title: 'Corpus Quran', url: 'https://corpus.quran.com', note: 'Word-by-word grammar and morphology', lang: 'Quranic Arabic' },
      { id: 'res3', title: 'Al-Dirassa', url: '', note: 'Quranic Arabic course structure reference', lang: 'Quranic Arabic' },
    ],
  };
}

function migrateState(s) {
  s.languages = (s.languages || []).map(l => {
    if (l.code === 'sv' || l.name === 'Swedish') {
      return { ...l, code: 'ru', name: 'Russian' };
    }
    return l;
  });
  s.vocab = (s.vocab || []).map(w => w.lang === 'Swedish' ? { ...w, lang: 'Russian' } : w);
  s.resources = (s.resources || []).map(r => r.lang ? r : { ...r, lang: 'General' });
  if (typeof s.wordsReviewedToday !== 'number') s.wordsReviewedToday = 0;
  if (!s.profile.theme) s.profile.theme = 'sage';
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
  function cloudPushDebounced() {
    if (typeof sbClient === 'undefined') return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      try {
        const { data: { session } } = await sbClient.auth.getSession();
        if (!session) return;
        await sbClient.from('sanctum_data').upsert({
          user_id: session.user.id, data: state, updated_at: new Date().toISOString(),
        });
      } catch (e) { /* offline or transient error — local copy is still safe */ }
    }, 900);
  }

  async function cloudPull() {
    if (typeof sbClient === 'undefined') return;
    try {
      const { data: { session } } = await sbClient.auth.getSession();
      if (!session) return;
      const { data, error } = await sbClient.from('sanctum_data').select('data').eq('user_id', session.user.id).maybeSingle();
      if (error) return;
      if (!data) {
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

  function removeLanguage(code) {
    state.languages = state.languages.filter(l => l.code !== code || !l.custom);
    persist();
  }

  function setTheme(theme) {
    state.profile.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    persist();
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
    addLanguage, removeLanguage,
    cloudPull, cloudPushDebounced,
  };
})();

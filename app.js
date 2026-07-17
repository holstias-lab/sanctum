// ── CONFIG ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ruwuvwqsrenluygvigox.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XFMGI1GqaBvuv_TsVNEXJQ_dYrRoqQ6';
const PASSWORD     = 'sanctum2026'; // Change this to whatever you want!

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── STATIC DATA ──────────────────────────────────────────────────────────────
const RANKS = [
  { n:'I',   label:'Apprentice Linguist',    xp:0     },
  { n:'II',  label:'Wandering Scholar',      xp:500   },
  { n:'III', label:'Keeper of Tongues',      xp:1500  },
  { n:'IV',  label:'Arcane Wordsmith',       xp:3500  },
  { n:'V',   label:'Grand Polyglot',         xp:7000  },
  { n:'VI',  label:'Sovereign of Languages', xp:15000 },
];

const LANGS = [
  { f:'🇸🇦', n:'Arabic',    active:true,  locked:false },
  { f:'📖',  n:'Quranic',   active:true,  locked:false },
  { f:'🇨🇳', n:'Mandarin',  active:false, locked:true  },
  { f:'🇩🇪', n:'German',    active:false, locked:true  },
  { f:'🇪🇸', n:'Spanish',   active:false, locked:true  },
  { f:'🇫🇷', n:'French',    active:false, locked:true  },
  { f:'🇮🇹', n:'Italian',   active:false, locked:true  },
  { f:'🇯🇵', n:'Japanese',  active:false, locked:true  },
  { f:'🇰🇷', n:'Korean',    active:false, locked:true  },
  { f:'🇬🇭', n:'Twi',       active:false, locked:true  },
];

const QUESTS = [
  { ico:'⚔️', name:'The Opening',      desc:"Read Surah Al-Fatiha fluently without hesitation",   xp:50,  type:'Main Quest',  status:'active' },
  { ico:'⚔️', name:'First Steps',      desc:'Complete 7 study sessions',                          xp:75,  type:'Main Quest',  status:'active' },
  { ico:'📜', name:'Word Hoarder I',   desc:'Learn your first 50 Arabic words',                   xp:60,  type:'Side Quest',  status:'active' },
  { ico:'⚡', name:'Daily Devotion',   desc:'Study for at least 15 minutes today',                xp:10,  type:'Daily',       status:'active' },
  { ico:'🏆', name:'Streak Keeper I',  desc:'Study 7 days in a row',                              xp:50,  type:'Challenge',   status:'active' },
  { ico:'⚔️', name:'The Reciter',      desc:"Complete Juz' Amma — read all 37 surahs fluently",   xp:300, type:'Main Quest',  status:'locked' },
  { ico:'🏆', name:'The Scholar',      desc:'Master all 7 tajweed rules in your scrolls',         xp:100, type:'Challenge',   status:'locked' },
  { ico:'📜', name:'Word Hoarder II',  desc:'Reach 200 words in your Vocabulary Bank',            xp:150, type:'Side Quest',  status:'locked' },
  { ico:'🌟', name:'Unlock Mandarin',  desc:'Earn 500 XP to unlock your next language',           xp:50,  type:'Milestone',   status:'locked' },
  { ico:'🌟', name:'Streak Keeper II', desc:'Study 30 days in a row',                             xp:200, type:'Challenge',   status:'locked' },
];

const RITUAL = [
  'Log today\'s session',
  'Review 10 words in Vocabulary Bank',
  'Practise one surah',
  'Add XP for today',
  'Check active quests',
];

const SURAHS = [
  { num:1,   name:'Al-Fatiha',   arabic:'الفاتحة',  juz:1,  verses:7   },
  { num:114, name:'An-Nas',      arabic:'الناس',    juz:30, verses:6   },
  { num:113, name:'Al-Falaq',    arabic:'الفلق',    juz:30, verses:5   },
  { num:112, name:'Al-Ikhlas',   arabic:'الإخلاص',  juz:30, verses:4   },
  { num:111, name:'Al-Masad',    arabic:'المسد',    juz:30, verses:5   },
  { num:110, name:'An-Nasr',     arabic:'النصر',    juz:30, verses:3   },
  { num:109, name:'Al-Kafirun',  arabic:'الكافرون', juz:30, verses:6   },
  { num:108, name:'Al-Kawthar',  arabic:'الكوثر',   juz:30, verses:3   },
  { num:107, name:"Al-Ma'un",    arabic:'الماعون',  juz:30, verses:7   },
  { num:106, name:'Quraysh',     arabic:'قريش',     juz:30, verses:4   },
  { num:105, name:'Al-Fil',      arabic:'الفيل',    juz:30, verses:5   },
  { num:104, name:'Al-Humazah',  arabic:'الهمزة',   juz:30, verses:9   },
  { num:103, name:'Al-Asr',      arabic:'العصر',    juz:30, verses:3   },
  { num:102, name:'At-Takathur', arabic:'التكاثر',  juz:30, verses:8   },
  { num:101, name:"Al-Qari'ah",  arabic:'القارعة',  juz:30, verses:11  },
  { num:100, name:'Al-Adiyat',   arabic:'العاديات', juz:30, verses:11  },
  { num:99,  name:'Az-Zalzalah', arabic:'الزلزلة',  juz:30, verses:8   },
  { num:98,  name:'Al-Bayyinah', arabic:'البينة',   juz:30, verses:8   },
  { num:97,  name:'Al-Qadr',     arabic:'القدر',    juz:30, verses:5   },
  { num:96,  name:'Al-Alaq',     arabic:'العلق',    juz:30, verses:19  },
];

const TAJWEED_RULES = [
  { name:'Izhar', arabic:'إظهار', category:'Noon & Meem', desc:'When noon sakinah or tanween is followed by one of 6 throat letters (أ ه ع ح غ خ), the noon is pronounced clearly with no nasalisation.', example:'مِنْ عِلْمٍ — "min ilm"', mastered:false },
  { name:'Idghaam', arabic:'إدغام', category:'Noon & Meem', desc:'When noon sakinah or tanween is followed by one of 6 letters (ي ر م ل و ن), the noon merges into the following letter. May be with or without ghunna.', example:'مَن يَعمل — the noon merges into the ya', mastered:false },
  { name:'Ikhfa', arabic:'إخفاء', category:'Noon & Meem', desc:'When noon sakinah or tanween is followed by one of 15 letters, the noon is pronounced between clear and merged — nasalised and slightly hidden.', example:'مِن تَحت — pronounced with nasal concealment', mastered:false },
  { name:'Iqlab', arabic:'إقلاب', category:'Noon & Meem', desc:'When noon sakinah or tanween is followed by ب (ba), the noon converts to a meem sound with ghunna (nasalisation).', example:'مِنْ بَعد — noon becomes meem', mastered:false },
  { name:'Ghunna', arabic:'غنة', category:'General', desc:'A nasal resonance produced from the nasal passage. Applied to shadda on noon or meem, and held for 2 counts (harakaat).', example:'إِنَّ — the shadda on noon requires ghunna', mastered:false },
  { name:'Qalqalah', arabic:'قلقلة', category:'Letters', desc:"A slight echoing bounce applied to 5 letters (ق ط ب ج د) when they carry sukoon. The bounce is stronger at the end of a verse. Remember them with 'QaTaBaJaDa'.", example:'يَقطَع — the ق and ط both have qalqalah', mastered:false },
  { name:'Madd Tabee\'i', arabic:'مد طبيعي', category:'Madd', desc:'The natural 2-count elongation that occurs when: alif follows fatha, waw follows damma, or ya follows kasra. This is the baseline madd.', example:'كِتَاب — the alif after fatha = 2 counts', mastered:false },
];

// ── STATE ────────────────────────────────────────────────────────────────────
let S = {
  xp: 0, streak: 0, lastLog: null,
  ritual: [], ritualDate: null,
  completedQuests: [],
  words: [], sessions: [], resources: [],
  quranProgress: {}, tajweedMastered: [],
};

// ── AUTH ─────────────────────────────────────────────────────────────────────
function login() {
  const val = document.getElementById('passInput').value;
  if (val === PASSWORD) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    init();
  } else {
    document.getElementById('loginErr').textContent = '✦ Incorrect passphrase';
  }
}

function logout() {
  document.getElementById('app').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('passInput').value = '';
}

// ── INIT ─────────────────────────────────────────────────────────────────────
async function init() {
  document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  await loadState();
  renderAll();
}

async function loadState() {
  try {
    const { data } = await sb.from('sanctum_state').select('*').eq('key', 'main').single();
    if (data) S = { ...S, ...JSON.parse(data.value) };
  } catch (e) {
    // First time — no data yet, use defaults
  }
  try {
    const { data } = await sb.from('sanctum_words').select('*').order('created_at', { ascending: false });
    if (data) S.words = data;
  } catch(e) {}
  try {
    const { data } = await sb.from('sanctum_sessions').select('*').order('created_at', { ascending: false });
    if (data) S.sessions = data;
  } catch(e) {}
  try {
    const { data } = await sb.from('sanctum_resources').select('*').order('created_at', { ascending: false });
    if (data) S.resources = data;
  } catch(e) {}
}

async function saveState() {
  const payload = {
    xp: S.xp, streak: S.streak, lastLog: S.lastLog,
    ritual: S.ritual, ritualDate: S.ritualDate,
    completedQuests: S.completedQuests,
    quranProgress: S.quranProgress,
    tajweedMastered: S.tajweedMastered,
  };
  await sb.from('sanctum_state').upsert({ key:'main', value: JSON.stringify(payload) }, { onConflict:'key' });
}

// ── RENDER ALL ───────────────────────────────────────────────────────────────
function renderAll() {
  renderProfile();
  renderStreak();
  renderLangGrid();
  renderQuestsPreview();
  renderRitual();
  renderRankLadder();
  renderQuests();
  renderVocab();
  renderQuran();
  renderTajweed();
  renderSessions();
  renderResources();
}

// ── TODAY LABEL ──────────────────────────────────────────────────────────────
let todayXPEarned = 0;

// ── PROFILE ──────────────────────────────────────────────────────────────────
function getRank(xp) { let r = RANKS[0]; for (let x of RANKS) { if (xp >= x.xp) r = x; } return r; }
function getNext(xp) { for (let x of RANKS) { if (xp < x.xp) return x; } return null; }

function renderProfile() {
  const rank = getRank(S.xp);
  const next = getNext(S.xp);
  document.getElementById('rankName').textContent = rank.label;
  document.getElementById('rankNum').textContent = `Rank ${rank.n}`;
  document.getElementById('xpCurrent').textContent = `${S.xp.toLocaleString()} XP`;
  document.getElementById('xpTarget').textContent = next ? `${next.xp.toLocaleString()} XP` : 'MAX';
  document.getElementById('nextRankName').textContent = next ? next.label : 'Maximum Rank Achieved';
  const pct = next ? Math.min(100, ((S.xp - rank.xp) / (next.xp - rank.xp)) * 100) : 100;
  document.getElementById('xpBarFill').style.width = pct + '%';
  document.getElementById('totalXPDisp').textContent = S.xp.toLocaleString();
  document.getElementById('streakDisp').textContent = S.streak;
  const mastered = S.words.filter(w => w.mastery === 'Mastered').length;
  document.getElementById('wordsDisp').textContent = mastered;
  const today = new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  const todayEl = document.getElementById('todayLabel');
  if (todayEl) todayEl.textContent = today;
  const cri = document.getElementById('currentRankInline');
  if (cri) cri.textContent = rank.label;
  const mc = document.getElementById('masteredCount');
  if (mc) mc.textContent = mastered;
  const sc = document.getElementById('surahCount');
  if (sc) sc.textContent = SURAHS.filter(s => S.quranProgress[s.num]?.canRead).length;
  const tXP = document.getElementById('todayXP');
  if (tXP) tXP.textContent = todayXPEarned + ' XP';
}

// ── STREAK ───────────────────────────────────────────────────────────────────
function renderStreak() {
  document.getElementById('streakNum') && (document.getElementById('streakNum').textContent = S.streak);
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const today = new Date().getDay();
  const lit = S.streak % 7 || (S.streak > 0 && S.streak % 7 === 0 ? 7 : 0);
  document.getElementById('streakDots').innerHTML = days.map((d, i) =>
    `<div class="sdot ${i < lit ? 'lit' : ''}">${d}</div>`
  ).join('');
}

async function logToday() {
  const today = new Date().toDateString();
  const yest = new Date(Date.now() - 86400000).toDateString();
  if (S.lastLog === today) { toast('Already logged today!'); return; }
  S.streak = S.lastLog === yest ? S.streak + 1 : 1;
  S.lastLog = today;
  let bonus = 0;
  if (S.streak === 7) { bonus = 50; toast('🔥 7-day streak! +50 XP bonus!'); }
  else if (S.streak === 30) { bonus = 200; toast('🔥 30-day streak! +200 XP bonus!'); }
  else toast(`🔥 Day ${S.streak} streak logged!`);
  S.xp += bonus;
  await saveState();
  renderAll();
}

// ── LANG GRID ────────────────────────────────────────────────────────────────
function renderLangGrid() {
  const unlocked = S.xp >= 500;
  document.getElementById('langGrid').innerHTML = LANGS.map(l => {
    const lk = l.locked && !unlocked;
    const pct = l.active ? Math.min(100, (S.xp / 500) * 100) : 0;
    return `<div class="lang-item ${l.active ? 'active' : ''} ${lk ? 'locked' : ''}">
      <div class="lang-flag">${l.f}</div>
      <div class="lang-name-sm">${l.n}</div>
      <div class="lang-status-sm">${lk ? '🔒' : l.active ? '🟢' : '✦'}</div>
      ${!lk ? `<div class="lang-mini-bar"><div class="lang-mini-fill" style="width:${pct}%"></div></div>` : ''}
    </div>`;
  }).join('');
}

// ── QUESTS PREVIEW ───────────────────────────────────────────────────────────
function renderQuestsPreview() {
  const active = QUESTS.filter((q,i) => q.status==='active' && !S.completedQuests.includes(i)).slice(0,4);
  document.getElementById('activeQuestsPreview').innerHTML = active.map((q,i) =>
    `<div class="quest-preview-item">
      <span>${q.ico}</span>
      <span class="qpi-name">${q.name}</span>
      <span class="qpi-xp">+${q.xp} XP</span>
    </div>`
  ).join('') || '<p style="color:var(--muted);font-size:0.85em;font-style:italic">No active quests — you\'re crushing it!</p>';
}

// ── RITUAL ───────────────────────────────────────────────────────────────────
function renderRitual() {
  const today = new Date().toDateString();
  if (S.ritualDate !== today) { S.ritual = []; S.ritualDate = today; }
  document.getElementById('ritualList').innerHTML = RITUAL.map((r,i) => {
    const on = S.ritual.includes(i);
    return `<div class="ritual-item ${on?'done':''}" onclick="toggleRitual(${i})">
      <div class="rchk ${on?'on':''}"></div>
      <span>${r}</span>
    </div>`;
  }).join('');
}

async function toggleRitual(i) {
  if (S.ritual.includes(i)) S.ritual = S.ritual.filter(x=>x!==i);
  else { S.ritual.push(i); if (S.ritual.length===RITUAL.length) toast('✦ Daily ritual complete!'); }
  await saveState();
  renderRitual();
}

// ── RANK LADDER ──────────────────────────────────────────────────────────────
function renderRankLadder() {
  const rank = getRank(S.xp);
  document.getElementById('rankLadder').innerHTML = RANKS.map(r => {
    const done = S.xp >= r.xp && r.label !== rank.label;
    const now = r.label === rank.label;
    const cls = now ? 'now' : done ? 'done' : 'future';
    const dotCls = now ? 'now' : done ? 'done' : '';
    return `<div class="rank-row ${cls}">
      <div class="rank-dot ${dotCls}"></div>
      <div class="rank-row-num">${r.n}</div>
      <div class="rank-row-name">${r.label}</div>
      <div class="rank-row-xp">${r.xp.toLocaleString()} XP</div>
    </div>`;
  }).join('');
}

// ── QUESTS ───────────────────────────────────────────────────────────────────
function renderQuests() {
  const active = QUESTS.filter((q,i) => q.status==='active' && !S.completedQuests.includes(i));
  const done   = QUESTS.filter((q,i) => S.completedQuests.includes(i));
  const locked = QUESTS.filter((q,i) => q.status==='locked' && !S.completedQuests.includes(i));

  let html = '';
  if (active.length) {
    html += `<div class="quest-section-title">Active</div>`;
    html += active.map((q,i) => questCard(q, QUESTS.indexOf(q), false, false)).join('');
  }
  if (locked.length) {
    html += `<div class="quest-section-title">Locked</div>`;
    html += locked.map(q => questCard(q, QUESTS.indexOf(q), true, false)).join('');
  }
  if (done.length) {
    html += `<div class="quest-section-title">Completed</div>`;
    html += done.map(q => questCard(q, QUESTS.indexOf(q), false, true)).join('');
  }
  document.getElementById('questsContainer').innerHTML = html;
}

function questCard(q, i, locked, done) {
  return `<div class="quest-card ${locked?'locked':''} ${done?'done':''}" onclick="${done||locked?'':(`completeQuest(${i})`)}">
    <div class="quest-ico">${done?'✅':locked?'🔒':q.ico}</div>
    <div class="quest-info">
      <div class="quest-name">${q.name}</div>
      <div class="quest-desc">${q.desc}</div>
      <span class="quest-badge">${q.type}</span>
    </div>
    <div class="quest-xp">+${q.xp} XP</div>
  </div>`;
}

async function completeQuest(i) {
  if (S.completedQuests.includes(i)) return;
  S.completedQuests.push(i);
  S.xp += QUESTS[i].xp;
  toast(`⚔️ Quest complete! +${QUESTS[i].xp} XP`);
  await saveState();
  renderAll();
}

// ── ADD XP ───────────────────────────────────────────────────────────────────
async function doAddXP() {
  const val = parseInt(document.getElementById('xpAction').value);
  S.xp += val;
  todayXPEarned += val;
  toast(`+${val} XP earned!`);
  await saveState();
  renderAll();
  closeModal();
}

// ── VOCABULARY ───────────────────────────────────────────────────────────────
function renderVocab() {
  const lang = document.getElementById('vocabLangFilter')?.value || '';
  const mastery = document.getElementById('vocabMasteryFilter')?.value || '';
  const search = document.getElementById('vocabSearch')?.value.toLowerCase() || '';
  let words = S.words.filter(w =>
    (!lang || w.language === lang) &&
    (!mastery || w.mastery === mastery) &&
    (!search || w.word.toLowerCase().includes(search) || w.meaning.toLowerCase().includes(search))
  );
  if (!words.length) {
    document.getElementById('vocabGrid').innerHTML = `<div class="empty-state"><div class="big">📖</div>No words yet — add your first one!</div>`;
    return;
  }
  document.getElementById('vocabGrid').innerHTML = `<div class="vocab-grid">${words.map(w =>
    `<div class="word-card">
      <button class="word-delete" onclick="deleteWord('${w.id}')">✕</button>
      <div class="word-arabic">${w.word}</div>
      <div class="word-meaning">${w.meaning}</div>
      ${w.pronunciation ? `<div class="word-pronun">${w.pronunciation}</div>` : ''}
      ${w.example ? `<div class="word-pronun">"${w.example}"</div>` : ''}
      <div style="margin-top:8px">
        <span class="word-lang-badge">${w.language}</span>
        <span class="mastery-badge mastery-${w.mastery}">${w.mastery}</span>
      </div>
    </div>`
  ).join('')}</div>`;
}

async function doAddWord() {
  const word = {
    word: document.getElementById('newWord').value.trim(),
    meaning: document.getElementById('newMeaning').value.trim(),
    pronunciation: document.getElementById('newPronunciation').value.trim(),
    language: document.getElementById('newWordLang').value,
    example: document.getElementById('newExample').value.trim(),
    mastery: 'New',
  };
  if (!word.word || !word.meaning) { toast('Word and meaning required!'); return; }
  const { data, error } = await sb.from('sanctum_words').insert([word]).select();
  if (error) { toast('Error saving word'); return; }
  S.words.unshift(data[0]);
  S.xp += 2;
  toast(`📖 Word saved! +2 XP`);
  await saveState();
  closeModal();
  renderAll();
}

async function deleteWord(id) {
  await sb.from('sanctum_words').delete().eq('id', id);
  S.words = S.words.filter(w => w.id !== id);
  renderVocab();
  toast('Word removed');
}

// ── FLASHCARDS ───────────────────────────────────────────────────────────────
let fcDeck = [], fcIndex = 0, fcFlipped = false;

function startFlashcards() {
  const lang = document.getElementById('fcLang').value;
  const mastery = document.getElementById('fcMastery').value;
  fcDeck = S.words.filter(w =>
    (!lang || w.language === lang) &&
    (!mastery || w.mastery === mastery)
  ).sort(() => Math.random() - 0.5);
  fcIndex = 0;
  if (!fcDeck.length) { document.getElementById('fcArea').innerHTML = `<div class="fc-empty">No words match your filters. Add some words first!</div>`; return; }
  renderFlashcard();
}

function renderFlashcard() {
  if (fcIndex >= fcDeck.length) {
    document.getElementById('fcArea').innerHTML = `<div class="fc-done">
      <span class="big">✦</span>
      <p>Session complete! You reviewed ${fcDeck.length} cards.</p>
      <button class="btn-gold" style="margin-top:20px" onclick="startFlashcards()">Go again</button>
    </div>`;
    return;
  }
  const w = fcDeck[fcIndex];
  fcFlipped = false;
  document.getElementById('fcArea').innerHTML = `
    <div class="fc-card-wrap">
      <div class="fc-progress">${fcIndex + 1} / ${fcDeck.length}</div>
      <div class="fc-card" id="fcCard" onclick="flipCard()">
        <div class="fc-hint">Tap to reveal meaning</div>
        <div class="fc-word">${w.word}</div>
        <div class="fc-meaning">${w.meaning}</div>
        ${w.pronunciation ? `<div class="fc-pronun">${w.pronunciation}</div>` : ''}
      </div>
      <div class="fc-btns" id="fcBtns" style="display:none">
        <button class="fc-btn wrong" onclick="fcAnswer(false)">✕ Didn't know</button>
        <button class="fc-btn right" onclick="fcAnswer(true)">✓ Got it</button>
      </div>
    </div>`;
}

function flipCard() {
  const card = document.getElementById('fcCard');
  card.classList.add('flipped');
  document.getElementById('fcBtns').style.display = 'flex';
  fcFlipped = true;
}

async function fcAnswer(correct) {
  const w = fcDeck[fcIndex];
  const masteryLevels = ['New','Learning','Reviewing','Mastered'];
  let idx = masteryLevels.indexOf(w.mastery);
  if (correct && idx < 3) idx++;
  else if (!correct && idx > 0) idx--;
  const newMastery = masteryLevels[idx];
  await sb.from('sanctum_words').update({ mastery: newMastery }).eq('id', w.id);
  const sw = S.words.find(x => x.id === w.id);
  if (sw) sw.mastery = newMastery;
  if (correct && newMastery === 'Mastered') { S.xp += 5; toast('+5 XP — word mastered!'); await saveState(); }
  fcIndex++;
  renderFlashcard();
}

// ── QURAN ────────────────────────────────────────────────────────────────────
function renderQuran() {
  const progress = S.quranProgress || {};
  const canRead = SURAHS.filter(s => progress[s.num]?.canRead).length;
  const canRecite = SURAHS.filter(s => progress[s.num]?.canRecite).length;
  const understand = SURAHS.filter(s => progress[s.num]?.understand).length;
  document.getElementById('quranStats').innerHTML = `
    <div class="qstat"><span class="qstat-val">${canRead}</span><span class="qstat-lbl">Can Read</span></div>
    <div class="qstat"><span class="qstat-val">${canRecite}</span><span class="qstat-lbl">Memorised</span></div>
    <div class="qstat"><span class="qstat-val">${understand}</span><span class="qstat-lbl">Understand</span></div>
    <div class="qstat"><span class="qstat-val">${SURAHS.length}</span><span class="qstat-lbl">Total</span></div>`;

  document.getElementById('quranList').innerHTML = SURAHS.map(s => {
    const p = progress[s.num] || {};
    return `<div class="surah-card">
      <div class="surah-num">${s.num}</div>
      <div class="surah-info">
        <div class="surah-name">${s.name}</div>
        <div class="surah-arabic">${s.arabic}</div>
        <div class="surah-meta">${s.verses} verses · Juz ${s.juz}</div>
      </div>
      <div class="surah-checks">
        <div class="schk" onclick="toggleSurah(${s.num},'canRead')">
          <div class="schk-box ${p.canRead?'on':''}">✓</div>
          <div class="schk-lbl">Read</div>
        </div>
        <div class="schk" onclick="toggleSurah(${s.num},'canRecite')">
          <div class="schk-box ${p.canRecite?'on':''}">✓</div>
          <div class="schk-lbl">Memory</div>
        </div>
        <div class="schk" onclick="toggleSurah(${s.num},'understand')">
          <div class="schk-box ${p.understand?'on':''}">✓</div>
          <div class="schk-lbl">Meaning</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

async function toggleSurah(num, field) {
  if (!S.quranProgress[num]) S.quranProgress[num] = {};
  const wasOn = S.quranProgress[num][field];
  S.quranProgress[num][field] = !wasOn;
  if (!wasOn) {
    const xpMap = { canRead:20, canRecite:25, understand:30 };
    S.xp += xpMap[field];
    toast(`+${xpMap[field]} XP — Quran progress updated!`);
  }
  await saveState();
  renderQuran();
  renderProfile();
}

// ── TAJWEED ──────────────────────────────────────────────────────────────────
function renderTajweed() {
  document.getElementById('tajweedGrid').innerHTML = `<div class="tajweed-grid">${TAJWEED_RULES.map((r,i) => {
    const mastered = S.tajweedMastered.includes(i);
    return `<div class="taj-card">
      <div class="taj-header">
        <div>
          <div class="taj-name">${r.name}</div>
          <div class="taj-arabic">${r.arabic}</div>
        </div>
        <span class="taj-category">${r.category}</span>
      </div>
      <div class="taj-desc">${r.desc}</div>
      <div class="taj-example">${r.example}</div>
      <div class="taj-mastered" onclick="toggleTajweed(${i})">
        <div class="taj-chk ${mastered?'on':''}">${mastered?'✓':''}</div>
        <span>${mastered ? '✦ Mastered' : 'Mark as mastered (+10 XP)'}</span>
      </div>
    </div>`;
  }).join('')}</div>`;
}

async function toggleTajweed(i) {
  if (S.tajweedMastered.includes(i)) {
    S.tajweedMastered = S.tajweedMastered.filter(x=>x!==i);
  } else {
    S.tajweedMastered.push(i);
    S.xp += 10;
    toast('+10 XP — Tajweed rule mastered!');
  }
  await saveState();
  renderTajweed();
  renderProfile();
}

// ── SESSIONS ─────────────────────────────────────────────────────────────────
function renderSessions() {
  if (!S.sessions.length) {
    document.getElementById('sessionsList').innerHTML = `<div class="empty-state"><div class="big">📝</div>No sessions yet — log your first one!</div>`;
    return;
  }
  document.getElementById('sessionsList').innerHTML = S.sessions.map(s => {
    const d = new Date(s.created_at);
    return `<div class="session-card">
      <div class="sess-date">
        <span class="day">${d.getDate()}</span>
        ${d.toLocaleDateString('en-GB',{month:'short'})}
      </div>
      <div class="sess-info">
        <div class="sess-title">${s.title}</div>
        <div class="sess-meta">${s.language} · ${s.type} · ${s.duration_label}</div>
        ${s.notes ? `<div class="sess-meta" style="margin-top:3px;font-style:italic">${s.notes}</div>` : ''}
      </div>
      <div class="sess-xp">+${s.xp_earned} XP</div>
    </div>`;
  }).join('');
}

async function doAddSession() {
  const xp = parseInt(document.getElementById('sessDuration').value);
  const durationLabel = document.getElementById('sessDuration').options[document.getElementById('sessDuration').selectedIndex].text;
  const session = {
    title: document.getElementById('sessTitle').value.trim() || 'Study Session',
    language: document.getElementById('sessLang').value,
    duration_label: durationLabel.split(' (')[0],
    type: document.getElementById('sessType').value,
    notes: document.getElementById('sessNotes').value.trim(),
    xp_earned: xp,
  };
  const { data, error } = await sb.from('sanctum_sessions').insert([session]).select();
  if (error) { toast('Error saving session'); return; }
  S.sessions.unshift(data[0]);
  S.xp += xp;
  toast(`📝 Session logged! +${xp} XP`);
  await saveState();
  closeModal();
  renderAll();
}

// ── RESOURCES ────────────────────────────────────────────────────────────────
function renderResources() {
  if (!S.resources.length) {
    document.getElementById('resourcesGrid').innerHTML = `<div class="empty-state"><div class="big">📦</div>No resources yet — add your favourites!</div>`;
    return;
  }
  const typeIcons = {'📱 App':'📱','🌐 Website':'🌐','📚 Book':'📚','🎥 YouTube':'🎥','🎧 Podcast':'🎧'};
  document.getElementById('resourcesGrid').innerHTML = `<div class="resources-grid">${S.resources.map(r => `
    <div class="res-card">
      <div class="res-header">
        <div class="res-type">${typeIcons[r.type]||'📦'}</div>
        <div class="res-name">${r.name}</div>
      </div>
      <div class="res-badges">
        <span class="res-badge">${r.language}</span>
        <span class="res-badge">${r.type}</span>
      </div>
      ${r.notes ? `<div class="res-notes">${r.notes}</div>` : ''}
      ${r.link ? `<a href="${r.link}" target="_blank" class="res-link">Open ↗</a>` : ''}
    </div>`
  ).join('')}</div>`;
}

async function doAddResource() {
  const res = {
    name: document.getElementById('resName').value.trim(),
    language: document.getElementById('resLang').value,
    type: document.getElementById('resType').value,
    link: document.getElementById('resLink').value.trim(),
    notes: document.getElementById('resNotes').value.trim(),
  };
  if (!res.name) { toast('Name required!'); return; }
  const { data, error } = await sb.from('sanctum_resources').insert([res]).select();
  if (error) { toast('Error saving resource'); return; }
  S.resources.unshift(data[0]);
  toast('📦 Resource saved!');
  closeModal();
  renderResources();
}

// ── NAVIGATION ───────────────────────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  document.querySelector(`[data-page="${name}"]`).classList.add('active');
}

// ── MODALS ───────────────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  document.getElementById(`modal-${id}`).classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

// ── TOAST ────────────────────────────────────────────────────────────────────
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

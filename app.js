// ── CONFIG ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ruwuvwqsrenluygvigox.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XFMGI1GqaBvuv_TsVNEXJQ_dYrRoqQ6';
const PASSWORD = 'sanctum2026';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── AUDIO ────────────────────────────────────────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function getAudio() { if (!audioCtx) audioCtx = new AudioCtx(); return audioCtx; }

function playSound(type) {
  try {
    const ctx = getAudio();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    if (type === 'xp') {
      o.frequency.setValueAtTime(523, ctx.currentTime);
      o.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      o.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      o.start(); o.stop(ctx.currentTime + 0.5);
    } else if (type === 'quest') {
      [523,659,784,1047].forEach((f,i) => {
        const oo = ctx.createOscillator(), gg = ctx.createGain();
        oo.connect(gg); gg.connect(ctx.destination);
        oo.frequency.value = f;
        gg.gain.setValueAtTime(0.12, ctx.currentTime + i*0.12);
        gg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i*0.12 + 0.3);
        oo.start(ctx.currentTime + i*0.12);
        oo.stop(ctx.currentTime + i*0.12 + 0.3);
      });
    } else if (type === 'flip') {
      o.frequency.setValueAtTime(440, ctx.currentTime);
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      o.start(); o.stop(ctx.currentTime + 0.15);
    } else if (type === 'timer') {
      [800,600,800].forEach((f,i) => {
        const oo = ctx.createOscillator(), gg = ctx.createGain();
        oo.connect(gg); gg.connect(ctx.destination);
        oo.frequency.value = f;
        gg.gain.setValueAtTime(0.15, ctx.currentTime + i*0.2);
        gg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i*0.2 + 0.2);
        oo.start(ctx.currentTime + i*0.2);
        oo.stop(ctx.currentTime + i*0.2 + 0.2);
      });
    } else if (type === 'click') {
      o.frequency.setValueAtTime(300, ctx.currentTime);
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      o.start(); o.stop(ctx.currentTime + 0.08);
    }
  } catch(e) {}
}

// ── STATIC DATA ───────────────────────────────────────────────────────────────
const RANKS = [
  {n:'I',   label:'Apprentice Linguist',    xp:0},
  {n:'II',  label:'Wandering Scholar',      xp:500},
  {n:'III', label:'Keeper of Tongues',      xp:1500},
  {n:'IV',  label:'Arcane Wordsmith',       xp:3500},
  {n:'V',   label:'Grand Polyglot',         xp:7000},
  {n:'VI',  label:'Sovereign of Languages', xp:15000},
];
const LANGS = [
  {f:'🇸🇦',n:'Arabic',  active:true, locked:false},
  {f:'📖', n:'Quranic', active:true, locked:false},
  {f:'🇨🇳',n:'Mandarin',active:false,locked:true},
  {f:'🇩🇪',n:'German',  active:false,locked:true},
  {f:'🇪🇸',n:'Spanish', active:false,locked:true},
  {f:'🇫🇷',n:'French',  active:false,locked:true},
  {f:'🇮🇹',n:'Italian', active:false,locked:true},
  {f:'🇯🇵',n:'Japanese',active:false,locked:true},
  {f:'🇰🇷',n:'Korean',  active:false,locked:true},
  {f:'🇬🇭',n:'Twi',     active:false,locked:true},
];
const SURAHS = [
  {num:1,  name:'Al-Fatiha',  arabic:'الفاتحة', juz:1, verses:7},
  {num:114,name:'An-Nas',     arabic:'الناس',   juz:30,verses:6},
  {num:113,name:'Al-Falaq',   arabic:'الفلق',   juz:30,verses:5},
  {num:112,name:'Al-Ikhlas',  arabic:'الإخلاص', juz:30,verses:4},
  {num:111,name:'Al-Masad',   arabic:'المسد',   juz:30,verses:5},
  {num:110,name:'An-Nasr',    arabic:'النصر',   juz:30,verses:3},
  {num:109,name:'Al-Kafirun', arabic:'الكافرون',juz:30,verses:6},
  {num:108,name:'Al-Kawthar', arabic:'الكوثر',  juz:30,verses:3},
  {num:107,name:"Al-Ma'un",   arabic:'الماعون', juz:30,verses:7},
  {num:106,name:'Quraysh',    arabic:'قريش',    juz:30,verses:4},
  {num:105,name:'Al-Fil',     arabic:'الفيل',   juz:30,verses:5},
  {num:104,name:'Al-Humazah', arabic:'الهمزة',  juz:30,verses:9},
  {num:103,name:'Al-Asr',     arabic:'العصر',   juz:30,verses:3},
  {num:102,name:'At-Takathur',arabic:'التكاثر', juz:30,verses:8},
  {num:101,name:"Al-Qari'ah", arabic:'القارعة', juz:30,verses:11},
  {num:100,name:'Al-Adiyat',  arabic:'العاديات',juz:30,verses:11},
  {num:99, name:'Az-Zalzalah',arabic:'الزلزلة', juz:30,verses:8},
  {num:98, name:'Al-Bayyinah',arabic:'البينة',  juz:30,verses:8},
  {num:97, name:'Al-Qadr',    arabic:'القدر',   juz:30,verses:5},
  {num:96, name:'Al-Alaq',    arabic:'العلق',   juz:30,verses:19},
];
const TAJWEED = [
  {name:'Izhar',arabic:'إظهار',cat:'Noon & Meem',desc:'When noon sakinah or tanween is followed by one of 6 throat letters (أ ه ع ح غ خ), the noon is pronounced clearly with no nasalisation.',ex:'مِنْ عِلْمٍ — "min ilm"'},
  {name:'Idghaam',arabic:'إدغام',cat:'Noon & Meem',desc:'When noon sakinah or tanween is followed by (ي ر م ل و ن), the noon merges into the following letter.',ex:'مَن يَعمل — noon merges into ya'},
  {name:'Ikhfa',arabic:'إخفاء',cat:'Noon & Meem',desc:'When noon sakinah or tanween is followed by 15 letters, the noon is nasalised and slightly hidden.',ex:'مِن تَحت — nasal concealment'},
  {name:'Iqlab',arabic:'إقلاب',cat:'Noon & Meem',desc:'When noon sakinah or tanween is followed by ب, the noon converts to a meem sound with ghunna.',ex:'مِنْ بَعد — noon becomes meem'},
  {name:'Ghunna',arabic:'غنة',cat:'General',desc:'A nasal resonance from the nasal passage. Applied to shadda on noon or meem, held for 2 counts.',ex:'إِنَّ — shadda on noon requires ghunna'},
  {name:'Qalqalah',arabic:'قلقلة',cat:'Letters',desc:"Echoing bounce on 5 letters (ق ط ب ج د) when they carry sukoon. Stronger at end of verse.",ex:'يَقطَع — both ق and ط have qalqalah'},
  {name:"Madd Tabee'i",arabic:'مد طبيعي',cat:'Madd',desc:'Natural 2-count elongation: alif after fatha, waw after damma, ya after kasra.',ex:'كِتَاب — alif after fatha = 2 counts'},
];

// ── DEFAULT STATE ─────────────────────────────────────────────────────────────
const DEFAULT_CUSTOM = {
  adventurerName: 'Scholar',
  portraitUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
  dashboardCover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1400&q=80',
  questsCover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
  vocabCover: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=1200&q=80',
  quranCover: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1200&q=80',
  loginBg: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
  siteTitle: 'The Polyglot Sanctum',
  siteSubtitle: 'A private realm of language & learning',
  quests: [
    {ico:'⚔️',name:'The Opening',      desc:'Read Surah Al-Fatiha fluently without hesitation',xp:50, type:'Main Quest',status:'active'},
    {ico:'⚔️',name:'First Steps',       desc:'Complete 7 study sessions',                       xp:75, type:'Main Quest',status:'active'},
    {ico:'📜',name:'Word Hoarder I',    desc:'Learn your first 50 Arabic words',                xp:60, type:'Side Quest',status:'active'},
    {ico:'⚡',name:'Daily Devotion',    desc:'Study for at least 15 minutes today',             xp:10, type:'Daily',     status:'active'},
    {ico:'🏆',name:'Streak Keeper I',   desc:'Study 7 days in a row',                          xp:50, type:'Challenge', status:'active'},
    {ico:'⚔️',name:'The Reciter',       desc:"Complete Juz' Amma — all 37 surahs fluently",    xp:300,type:'Main Quest',status:'locked'},
    {ico:'🏆',name:'The Scholar',       desc:'Master all 7 tajweed rules',                     xp:100,type:'Challenge', status:'locked'},
    {ico:'📜',name:'Word Hoarder II',   desc:'Reach 200 words in your Vocabulary Bank',        xp:150,type:'Side Quest',status:'locked'},
    {ico:'🌟',name:'Unlock Mandarin',   desc:'Earn 500 XP to unlock your next language',       xp:50, type:'Milestone', status:'locked'},
    {ico:'🌟',name:'Streak Keeper II',  desc:'Study 30 days in a row',                         xp:200,type:'Challenge', status:'locked'},
  ],
  ritualItems: [
    "Log today's session",
    'Review 10 words in Vocabulary Bank',
    'Practise one surah',
    'Add XP for today',
    'Check active quests',
  ],
};

const DEFAULT_WORDS = [
  {word:'بِسْمِ',meaning:'In the name of',pronunciation:'Bismi',language:'Quranic Arabic',example:'بِسْمِ اللهِ — In the name of Allah',mastery:'New'},
  {word:'اللهِ',meaning:'Allah / God',pronunciation:'Allahi',language:'Quranic Arabic',example:'بِسْمِ اللهِ — In the name of Allah',mastery:'New'},
  {word:'الرَّحْمَٰنِ',meaning:'The Most Gracious',pronunciation:"Ar-Rahman",language:'Quranic Arabic',example:'First verse of Al-Fatiha',mastery:'New'},
  {word:'الرَّحِيمِ',meaning:'The Most Merciful',pronunciation:"Ar-Raheem",language:'Quranic Arabic',example:'First verse of Al-Fatiha',mastery:'New'},
  {word:'الْحَمْدُ',meaning:'All praise / Thanks',pronunciation:'Al-hamdu',language:'Quranic Arabic',example:'الْحَمْدُ لِلَّهِ — All praise be to Allah',mastery:'New'},
  {word:'رَبِّ',meaning:'Lord / Sustainer',pronunciation:'Rabbi',language:'Quranic Arabic',example:'رَبِّ الْعَالَمِينَ — Lord of the worlds',mastery:'New'},
  {word:'الْعَالَمِينَ',meaning:'The worlds / All creation',pronunciation:"Al-'alameen",language:'Quranic Arabic',example:'رَبِّ الْعَالَمِينَ',mastery:'New'},
  {word:'مَالِكِ',meaning:'Master / Owner / King',pronunciation:'Maliki',language:'Quranic Arabic',example:'مَالِكِ يَوْمِ الدِّينِ — Master of the Day of Judgement',mastery:'New'},
  {word:'يَوْمِ',meaning:'Day',pronunciation:'Yawmi',language:'Quranic Arabic',example:'يَوْمِ الدِّينِ — The Day of Judgement',mastery:'New'},
  {word:'الدِّينِ',meaning:'The religion / Judgement',pronunciation:"Ad-deen",language:'Quranic Arabic',example:'يَوْمِ الدِّينِ — Day of Judgement',mastery:'New'},
  {word:'كِتَاب',meaning:'Book',pronunciation:'Kitaab',language:'Arabic',example:'هَذَا كِتَابٌ — This is a book',mastery:'New'},
  {word:'مَاء',meaning:'Water',pronunciation:'Maa',language:'Arabic',example:'أُرِيدُ مَاءً — I want water',mastery:'New'},
  {word:'بَيْت',meaning:'House / Home',pronunciation:'Bayt',language:'Arabic',example:'هَذَا بَيْتِي — This is my house',mastery:'New'},
  {word:'أَهْلاً',meaning:'Welcome / Hello',pronunciation:'Ahlan',language:'Arabic',example:'أَهْلاً وَسَهْلاً — Welcome!',mastery:'New'},
  {word:'شُكْراً',meaning:'Thank you',pronunciation:'Shukran',language:'Arabic',example:'شُكْراً جَزِيلاً — Thank you very much',mastery:'New'},
];

// ── STATE ─────────────────────────────────────────────────────────────────────
let S = {
  xp:0, streak:0, lastLog:null,
  ritual:[], ritualDate:null,
  completedQuests:[],
  quranProgress:{}, tajweedMastered:[],
  words:[], sessions:[], resources:[],
  custom: {...DEFAULT_CUSTOM, quests:[...DEFAULT_CUSTOM.quests], ritualItems:[...DEFAULT_CUSTOM.ritualItems]},
};
let editMode = false;
let todayXPEarned = 0;

// ── POMODORO ──────────────────────────────────────────────────────────────────
let pomTimer = null, pomSeconds = 0, pomRunning = false, pomMode = 'work', pomCycles = 0;
const POM_WORK = 25 * 60, POM_SHORT = 5 * 60, POM_LONG = 15 * 60;

function pomStart() {
  if (pomRunning) return;
  if (pomSeconds === 0) pomSeconds = POM_WORK;
  pomRunning = true;
  playSound('click');
  document.getElementById('pomStartBtn').textContent = '⏸ Pause';
  document.getElementById('pomStartBtn').onclick = pomPause;
  pomTimer = setInterval(pomTick, 1000);
}
function pomPause() {
  clearInterval(pomTimer); pomRunning = false;
  document.getElementById('pomStartBtn').textContent = '▶ Resume';
  document.getElementById('pomStartBtn').onclick = pomStart;
}
function pomReset() {
  clearInterval(pomTimer); pomRunning = false; pomSeconds = 0;
  pomMode = 'work'; pomCycles = 0;
  renderPom();
  document.getElementById('pomStartBtn').textContent = '▶ Start';
  document.getElementById('pomStartBtn').onclick = pomStart;
}
function pomSetMode(mode) {
  clearInterval(pomTimer); pomRunning = false;
  pomMode = mode;
  if (mode==='work') pomSeconds = POM_WORK;
  else if (mode==='short') pomSeconds = POM_SHORT;
  else pomSeconds = POM_LONG;
  renderPom();
  document.getElementById('pomStartBtn').textContent = '▶ Start';
  document.getElementById('pomStartBtn').onclick = pomStart;
  document.querySelectorAll('.pom-mode-btn').forEach(b=>b.classList.remove('active'));
  event.target.classList.add('active');
}
async function pomTick() {
  pomSeconds--;
  renderPom();
  if (pomSeconds <= 0) {
    clearInterval(pomTimer); pomRunning = false;
    playSound('timer');
    if (pomMode === 'work') {
      pomCycles++;
      const xpEarned = 25;
      S.xp += xpEarned; todayXPEarned += xpEarned;
      await saveState();
      renderProfile();
      showXPPop(`+${xpEarned} XP`, document.getElementById('pomDisplay'));
      toast(`🍅 Session complete! +${xpEarned} XP earned!`);
      // Auto log session
      const session = {title:`Pomodoro Session #${pomCycles}`,language:document.getElementById('pomLang')?.value||'Arabic',duration_label:'25 minutes',type:document.getElementById('pomType')?.value||'Study',notes:'Auto-logged via Pomodoro timer',xp_earned:xpEarned};
      const {data} = await sb.from('sanctum_sessions').insert([session]).select();
      if (data) S.sessions.unshift(data[0]);
      pomMode = pomCycles % 4 === 0 ? 'long' : 'short';
      pomSeconds = pomCycles % 4 === 0 ? POM_LONG : POM_SHORT;
      document.getElementById('pomModeLabel').textContent = pomCycles % 4 === 0 ? '☕ Long Break' : '☕ Short Break';
    } else {
      pomMode = 'work'; pomSeconds = POM_WORK;
      document.getElementById('pomModeLabel').textContent = '🍅 Focus Time';
      toast('Break over — time to focus!');
    }
    renderPom();
    document.getElementById('pomStartBtn').textContent = '▶ Start';
    document.getElementById('pomStartBtn').onclick = pomStart;
  }
}
function renderPom() {
  const m = Math.floor(pomSeconds/60), s = pomSeconds%60;
  const disp = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const el = document.getElementById('pomDisplay');
  if (el) el.textContent = disp;
  // Ring progress
  const total = pomMode==='work' ? POM_WORK : pomMode==='short' ? POM_SHORT : POM_LONG;
  const pct = pomSeconds / total;
  const cd = document.getElementById('pomCyclesDisp'); if(cd) cd.textContent = pomCycles;
  const ring = document.getElementById('pomRing');
  if (ring) {
    const r = 54, circ = 2*Math.PI*r;
    ring.style.strokeDashoffset = circ * pct;
  }
}

// ── XP POP ───────────────────────────────────────────────────────────────────
function showXPPop(text, anchor) {
  const pop = document.createElement('div');
  pop.className = 'xp-pop';
  pop.textContent = text;
  const rect = (anchor||document.body).getBoundingClientRect();
  pop.style.left = (rect.left + rect.width/2) + 'px';
  pop.style.top = rect.top + 'px';
  document.body.appendChild(pop);
  setTimeout(()=>pop.remove(), 1200);
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function login() {
  const val = document.getElementById('passInput').value;
  if (val === PASSWORD) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    init();
  } else {
    document.getElementById('loginErr').textContent = '✦ Incorrect passphrase';
    document.getElementById('loginErr').classList.add('shake');
    setTimeout(()=>document.getElementById('loginErr').classList.remove('shake'),500);
  }
}
function logout() {
  document.getElementById('app').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('passInput').value='';
}

// ── INIT ──────────────────────────────────────────────────────────────────────
async function init() {
  document.getElementById('dateDisplay').textContent =
    new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  await loadState();
  applyCustom();
  renderAll();
  renderPom();
}

async function loadState() {
  try {
    const {data, error} = await sb.from('sanctum_state').select('*').eq('key','main').single();
    if (data && !error) {
      const saved = JSON.parse(data.value);
      S = {...S, ...saved};
      if (saved.custom) S.custom = {...DEFAULT_CUSTOM, ...saved.custom};
      if (saved.custom?.quests) S.custom.quests = saved.custom.quests;
      if (saved.custom?.ritualItems) S.custom.ritualItems = saved.custom.ritualItems;
    }
  } catch(e) { console.log('State load error:', e); }

  try {
    const {data, error} = await sb.from('sanctum_words').select('*').order('created_at',{ascending:false});
    if (!error && data && data.length > 0) {
      S.words = data;
    } else if (!error && data && data.length === 0) {
      // First time — seed starter words
      try {
        const {data:seeded} = await sb.from('sanctum_words').insert(DEFAULT_WORDS).select();
        if (seeded) S.words = seeded;
      } catch(e2) { S.words = DEFAULT_WORDS.map((w,i)=>({...w,id:'local-'+i,created_at:new Date().toISOString()})); }
    } else {
      // DB error — use defaults locally so page still renders
      S.words = DEFAULT_WORDS.map((w,i)=>({...w,id:'local-'+i,created_at:new Date().toISOString()}));
    }
  } catch(e) {
    console.log('Words load error:', e);
    S.words = DEFAULT_WORDS.map((w,i)=>({...w,id:'local-'+i,created_at:new Date().toISOString()}));
  }

  try {
    const {data, error} = await sb.from('sanctum_sessions').select('*').order('created_at',{ascending:false});
    if (!error && data) S.sessions = data;
  } catch(e) { console.log('Sessions load error:', e); }

  try {
    const {data, error} = await sb.from('sanctum_resources').select('*').order('created_at',{ascending:false});
    if (!error && data) S.resources = data;
  } catch(e) { console.log('Resources load error:', e); }
}

async function saveState() {
  const payload = {
    xp:S.xp, streak:S.streak, lastLog:S.lastLog,
    ritual:S.ritual, ritualDate:S.ritualDate,
    completedQuests:S.completedQuests,
    quranProgress:S.quranProgress,
    tajweedMastered:S.tajweedMastered,
    custom:S.custom,
  };
  await sb.from('sanctum_state').upsert({key:'main',value:JSON.stringify(payload)},{onConflict:'key'});
}

// ── APPLY CUSTOM ──────────────────────────────────────────────────────────────
function applyCustom() {
  const c = S.custom;
  document.querySelector('.login-wrap').style.backgroundImage =
    `linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.88)),url('${c.loginBg}')`;
  const lp = document.getElementById('loginPortrait'); if(lp) lp.src = c.portraitUrl;
  const lt = document.getElementById('loginTitle'); if(lt) lt.textContent = c.siteTitle;
  const ls = document.getElementById('loginSubtitle'); if(ls) ls.textContent = c.siteSubtitle;
  const st = document.getElementById('siteTitle'); if(st) st.textContent = '🌙 '+c.siteTitle;
  const mp = document.getElementById('mainPortrait'); if(mp) mp.src = c.portraitUrl;
  const an = document.getElementById('adventurerName'); if(an) an.textContent = c.adventurerName;
  const dc = document.getElementById('dashCover');
  if(dc) dc.style.backgroundImage=`linear-gradient(rgba(0,0,0,0.1),rgba(17,16,16,1)),url('${c.dashboardCover}')`;
  const qc = document.getElementById('questsCover');
  if(qc) qc.style.backgroundImage=`linear-gradient(rgba(0,0,0,0.2),rgba(17,16,16,1)),url('${c.questsCover}')`;
  const vc = document.getElementById('vocabCover');
  if(vc) vc.style.backgroundImage=`linear-gradient(rgba(0,0,0,0.2),rgba(17,16,16,1)),url('${c.vocabCover}')`;
  const qrc = document.getElementById('quranCover');
  if(qrc) qrc.style.backgroundImage=`linear-gradient(rgba(0,0,0,0.3),rgba(17,16,16,1)),url('${c.quranCover}')`;
  document.querySelector('.sidebar-hero').style.backgroundImage =
    `linear-gradient(rgba(10,8,6,0.3),rgba(10,8,6,0.7)),url('${c.portraitUrl}')`;
}

// ── EDIT MODE ─────────────────────────────────────────────────────────────────
function toggleEditMode() {
  editMode = !editMode;
  document.body.classList.toggle('edit-mode', editMode);
  const btn = document.getElementById('editToggle');
  btn.textContent = editMode ? '✓ Done Editing' : '✏️ Edit';
  btn.classList.toggle('editing', editMode);
  if (editMode) { toast('✏️ Click anything to edit it'); attachEditListeners(); }
  else toast('✓ All changes saved');
}

function attachEditListeners() {
  document.querySelectorAll('[data-editable]').forEach(el => {
    el.style.cursor='pointer';
    el.onclick = (e) => {
      if (!editMode) return;
      e.stopPropagation();
      const key = el.dataset.editable;
      const cur = S.custom[key] || el.textContent.trim();
      openEditPopup(e.clientX, e.clientY, cur, 'Edit text', async(val)=>{
        S.custom[key]=val; await saveState(); applyCustom(); renderAll();
      });
    };
  });
  document.querySelectorAll('[data-edit-img],[data-edit-cover]').forEach(el => {
    el.style.cursor='pointer';
    el.onclick = (e) => {
      if(!editMode) return;
      e.stopPropagation();
      const key = el.dataset.editImg || el.dataset.editCover;
      openImagePicker(key);
    };
  });
}

function openImagePicker(key) {
  openModal('imgPicker');
  document.getElementById('imgPickerUrl').value = S.custom[key]||'';
  imgPickerPreview();
  window._imgPickerKey = key;
}
function imgPickerPreview() {
  const url = document.getElementById('imgPickerUrl').value.trim();
  const prev = document.getElementById('imgPickerPreview');
  if(url){prev.src=url;prev.style.display='block';}else{prev.style.display='none';}
}
async function imgPickerSave() {
  const url = document.getElementById('imgPickerUrl').value.trim();
  if(!url){toast('Please enter a URL');return;}
  S.custom[window._imgPickerKey]=url;
  await saveState(); applyCustom(); closeModal(); toast('✦ Image updated!');
}

function openEditPopup(x, y, cur, label, onSave) {
  document.getElementById('editPopup')?.remove();
  const pop = document.createElement('div');
  pop.id='editPopup'; pop.className='edit-popup';
  const left=Math.min(x,window.innerWidth-340), top=Math.min(y,window.innerHeight-140);
  pop.style.cssText=`left:${left}px;top:${top}px`;
  pop.innerHTML=`<div class="edit-pop-label">${label}</div>
    <input id="editInput" class="edit-input" value="${(cur||'').replace(/"/g,'&quot;').replace(/</g,'&lt;')}" placeholder="Type here…">
    <div class="edit-popup-btns">
      <button class="edit-cancel" onclick="document.getElementById('editPopup').remove()">Cancel</button>
      <button class="edit-save" onclick="commitEdit()">Save ✓</button>
    </div>`;
  document.body.appendChild(pop);
  document.getElementById('editInput').focus();
  document.getElementById('editInput').select();
  window._editSave = onSave;
  document.getElementById('editInput').onkeydown=(e)=>{
    if(e.key==='Enter')commitEdit();
    if(e.key==='Escape')pop.remove();
  };
}
function commitEdit() {
  const val=document.getElementById('editInput')?.value?.trim();
  document.getElementById('editPopup')?.remove();
  if(val!==undefined&&window._editSave)window._editSave(val);
}

// Quest editor
function openQuestEditor(i) {
  if(!editMode)return;
  const q=S.custom.quests[i];
  openModal('editQuest');
  document.getElementById('eqIco').value=q.ico;
  document.getElementById('eqName').value=q.name;
  document.getElementById('eqDesc').value=q.desc;
  document.getElementById('eqXP').value=q.xp;
  document.getElementById('eqType').value=q.type;
  document.getElementById('eqStatus').value=q.status;
  window._editQuestIdx=i;
}
async function saveQuestEdit() {
  const i=window._editQuestIdx;
  S.custom.quests[i]={...S.custom.quests[i],ico:document.getElementById('eqIco').value,name:document.getElementById('eqName').value,desc:document.getElementById('eqDesc').value,xp:parseInt(document.getElementById('eqXP').value)||0,type:document.getElementById('eqType').value,status:document.getElementById('eqStatus').value};
  await saveState(); closeModal(); renderQuests(); renderQuestsPreview(); toast('Quest updated!');
}
async function addNewQuest() {
  S.custom.quests.push({ico:'⚔️',name:'New Quest',desc:'Describe this quest',xp:50,type:'Side Quest',status:'active'});
  await saveState(); renderQuests(); toast('New quest added!');
}
async function deleteQuest(i) {
  S.custom.quests.splice(i,1);
  S.completedQuests=S.completedQuests.filter(x=>x!==i).map(x=>x>i?x-1:x);
  await saveState(); renderQuests(); toast('Quest deleted');
}
async function editRitualItem(i) {
  const cur=S.custom.ritualItems[i];
  const el=document.querySelectorAll('.ritual-item')[i];
  const rect=el.getBoundingClientRect();
  openEditPopup(rect.left,rect.top,cur,'Edit ritual item',async(val)=>{
    S.custom.ritualItems[i]=val; await saveState(); renderRitual();
  });
}
async function addRitualItem() {
  S.custom.ritualItems.push('New ritual item');
  await saveState(); renderRitual();
}
async function deleteRitualItem(i) {
  S.custom.ritualItems.splice(i,1);
  S.ritual=S.ritual.filter(x=>x!==i).map(x=>x>i?x-1:x);
  await saveState(); renderRitual();
}

// ── RENDER ALL ────────────────────────────────────────────────────────────────
function renderAll() {
  const fns = [renderProfile, renderStreak, renderLangGrid,
    renderQuestsPreview, renderRitual, renderRankLadder,
    renderQuests, renderVocab, renderQuran,
    renderTajweed, renderSessions, renderResources];
  fns.forEach(fn => { try { fn(); } catch(e) { console.log(fn.name, 'error:', e); } });
  if(editMode) try { attachEditListeners(); } catch(e) {}
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
function getRank(xp){let r=RANKS[0];for(let x of RANKS){if(xp>=x.xp)r=x;}return r;}
function getNext(xp){for(let x of RANKS){if(xp<x.xp)return x;}return null;}

function renderProfile() {
  const rank=getRank(S.xp), next=getNext(S.xp);
  const els={rankName:rank.label,rankNum:`Rank ${rank.n}`,xpCurrent:`${S.xp.toLocaleString()} XP`,xpTarget:next?`${next.xp.toLocaleString()} XP`:'MAX',nextRankName:next?next.label:'Maximum Rank',totalXPDisp:S.xp.toLocaleString(),streakDisp:S.streak,adventurerName:S.custom.adventurerName};
  Object.entries(els).forEach(([id,val])=>{const el=document.getElementById(id);if(el)el.textContent=val;});
  const mastered=S.words.filter(w=>w.mastery==='Mastered').length;
  const wd=document.getElementById('wordsDisp');if(wd)wd.textContent=mastered;
  const pct=next?Math.min(100,((S.xp-rank.xp)/(next.xp-rank.xp))*100):100;
  const bar=document.getElementById('xpBarFill');if(bar)bar.style.width=pct+'%';
  const today=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  ['todayLabel','currentRankInline','masteredCount','surahCount','todayXP'].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    if(id==='todayLabel')el.textContent=today;
    else if(id==='currentRankInline')el.textContent=rank.label;
    else if(id==='masteredCount')el.textContent=mastered;
    else if(id==='surahCount')el.textContent=SURAHS.filter(s=>S.quranProgress[s.num]?.canRead).length;
    else if(id==='todayXP')el.textContent=todayXPEarned+' XP';
  });
}

// ── STREAK ────────────────────────────────────────────────────────────────────
function renderStreak() {
  const sn=document.getElementById('streakNum');if(sn)sn.textContent=S.streak;
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const lit=S.streak%7||(S.streak>0&&S.streak%7===0?7:0);
  const sd=document.getElementById('streakDots');
  if(sd)sd.innerHTML=days.map((d,i)=>`<div class="sdot ${i<lit?'lit':''}">${d}</div>`).join('');
}
async function logToday() {
  const today=new Date().toDateString(),yest=new Date(Date.now()-86400000).toDateString();
  if(S.lastLog===today){toast('Already logged today!');return;}
  S.streak=S.lastLog===yest?S.streak+1:1; S.lastLog=today;
  let bonus=0;
  if(S.streak===7){bonus=50;toast('🔥 7-day streak! +50 XP bonus!');}
  else if(S.streak===30){bonus=200;toast('🔥 30-day streak! +200 XP bonus!');}
  else toast(`🔥 Day ${S.streak} streak!`);
  if(bonus){S.xp+=bonus;todayXPEarned+=bonus;showXPPop(`+${bonus} XP`,document.getElementById('streakDots'));}
  playSound('xp'); await saveState(); renderAll();
}

// ── LANG GRID ─────────────────────────────────────────────────────────────────
function renderLangGrid() {
  const unlocked=S.xp>=500;
  const lg=document.getElementById('langGrid');
  if(!lg)return;
  lg.innerHTML=LANGS.map(l=>{
    const lk=l.locked&&!unlocked, pct=l.active?Math.min(100,(S.xp/500)*100):0;
    return `<div class="lang-item ${l.active?'active':''} ${lk?'locked':''}">
      <div class="lang-flag">${l.f}</div><div class="lang-nm">${l.n}</div>
      <div class="lang-st">${lk?'🔒':l.active?'🟢':'✦'}</div>
      ${!lk?`<div class="lang-mini-bar"><div class="lang-mini-fill" style="width:${pct}%"></div></div>`:''}
    </div>`;
  }).join('');
}

// ── QUESTS PREVIEW ────────────────────────────────────────────────────────────
function renderQuestsPreview() {
  const active=S.custom.quests.filter((q,i)=>q.status==='active'&&!S.completedQuests.includes(i)).slice(0,4);
  const el=document.getElementById('activeQuestsPreview');
  if(!el)return;
  el.innerHTML=active.length
    ?active.map(q=>`<div class="qpi"><span>${q.ico}</span><span class="qpi-name">${q.name}</span><span class="qpi-xp">+${q.xp} XP</span></div>`).join('')
    :'<p style="color:var(--muted);font-size:0.85em;font-style:italic">All quests complete! 🎉</p>';
}

// ── RITUAL ────────────────────────────────────────────────────────────────────
function renderRitual() {
  const today=new Date().toDateString();
  if(S.ritualDate!==today){S.ritual=[];S.ritualDate=today;}
  const el=document.getElementById('ritualList');if(!el)return;
  el.innerHTML=S.custom.ritualItems.map((r,i)=>{
    const on=S.ritual.includes(i);
    return `<div class="ritual-item ${on?'done':''}" onclick="${editMode?`editRitualItem(${i})`:`toggleRitual(${i})`}">
      <div class="rchk ${on?'on':''}"></div><span class="ritual-txt">${r}</span>
      ${editMode?`<button class="edit-del-btn" onclick="event.stopPropagation();deleteRitualItem(${i})">✕</button>`:''}
    </div>`;
  }).join('')+(editMode?`<div style="margin-top:8px"><button class="btn-ghost" style="width:100%;font-size:0.6em" onclick="addRitualItem()">+ Add Item</button></div>`:'');
}
async function toggleRitual(i) {
  if(S.ritual.includes(i))S.ritual=S.ritual.filter(x=>x!==i);
  else{S.ritual.push(i);playSound('click');if(S.ritual.length===S.custom.ritualItems.length){toast('✦ Daily ritual complete!');playSound('quest');}}
  await saveState(); renderRitual();
}

// ── RANK LADDER ───────────────────────────────────────────────────────────────
function renderRankLadder() {
  const rank=getRank(S.xp);
  const el=document.getElementById('rankLadder');if(!el)return;
  el.innerHTML=RANKS.map(r=>{
    const done=S.xp>=r.xp&&r.label!==rank.label,now=r.label===rank.label;
    const cls=now?'now':done?'done':'future',dc=now?'now':done?'done':'';
    return `<div class="rank-row ${cls}"><div class="rank-dot ${dc}"></div><div class="rr-num">${r.n}</div><div class="rrn">${r.label}</div><div class="rr-xp">${r.xp.toLocaleString()}</div></div>`;
  }).join('');
}

// ── QUESTS ────────────────────────────────────────────────────────────────────
function renderQuests() {
  const qs=S.custom.quests;
  const active=qs.filter((q,i)=>q.status==='active'&&!S.completedQuests.includes(i));
  const done=qs.filter((q,i)=>S.completedQuests.includes(i));
  const locked=qs.filter((q,i)=>q.status==='locked'&&!S.completedQuests.includes(i));
  let html='';
  if(active.length)html+=`<div class="quest-section-title">Active</div>`+active.map(q=>questCard(q,qs.indexOf(q),false,false)).join('');
  if(locked.length)html+=`<div class="quest-section-title">Locked</div>`+locked.map(q=>questCard(q,qs.indexOf(q),true,false)).join('');
  if(done.length)html+=`<div class="quest-section-title">Completed</div>`+done.map(q=>questCard(q,qs.indexOf(q),false,true)).join('');
  if(editMode)html+=`<div style="margin-top:14px;display:flex;gap:10px"><button class="btn-gold small" onclick="addNewQuest()">+ Add Quest</button></div>`;
  const el=document.getElementById('questsContainer');if(el)el.innerHTML=html;
}
function questCard(q,i,locked,done){
  return `<div class="quest-card ${locked?'locked':''} ${done?'done':''} ${!locked&&!done?'quest-anim':''}" onclick="${editMode?`openQuestEditor(${i})`:done||locked?'':(`completeQuest(${i})`)}">
    <div class="quest-ico">${done?'✅':locked?'🔒':q.ico}</div>
    <div class="quest-info">
      <div class="quest-name">${q.name}${editMode?' <span style="color:var(--gold2);font-size:0.7em">✏️</span>':''}</div>
      <div class="quest-desc">${q.desc}</div>
      <span class="quest-badge">${q.type}</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
      <div class="quest-xp">+${q.xp} XP</div>
      ${editMode?`<button class="edit-del-btn" onclick="event.stopPropagation();deleteQuest(${i})">✕</button>`:''}
    </div>
  </div>`;
}
async function completeQuest(i) {
  if(S.completedQuests.includes(i))return;
  S.completedQuests.push(i);
  const xp=S.custom.quests[i].xp;
  S.xp+=xp; todayXPEarned+=xp;
  playSound('quest');
  showXPPop(`+${xp} XP`,document.querySelectorAll('.quest-card')[i]);
  toast(`⚔️ Quest complete! +${xp} XP`);
  await saveState(); renderAll();
}

// ── ADD XP ────────────────────────────────────────────────────────────────────
async function doAddXP() {
  const val=parseInt(document.getElementById('xpAction').value);
  S.xp+=val; todayXPEarned+=val;
  playSound('xp');
  showXPPop(`+${val} XP`,document.getElementById('totalXPDisp'));
  toast(`+${val} XP earned!`);
  await saveState(); renderAll(); closeModal();
}

// ── VOCAB ─────────────────────────────────────────────────────────────────────
function renderVocab() {
  const lang=document.getElementById('vocabLangFilter')?.value||'';
  const mastery=document.getElementById('vocabMasteryFilter')?.value||'';
  const search=document.getElementById('vocabSearch')?.value.toLowerCase()||'';
  let words=S.words.filter(w=>(!lang||w.language===lang)&&(!mastery||w.mastery===mastery)&&(!search||w.word.toLowerCase().includes(search)||w.meaning.toLowerCase().includes(search)));
  const el=document.getElementById('vocabGrid');if(!el)return;
  if(!words.length){el.innerHTML=`<div class="empty-state"><div class="big">📖</div>No words match — try changing the filters or add your first word!</div>`;return;}
  el.innerHTML=`<div class="vocab-grid">${words.map(w=>`
    <div class="word-card">
      <button class="word-delete" onclick="deleteWord('${w.id}')">✕</button>
      <div class="word-arabic">${w.word}</div>
      <div class="word-meaning">${w.meaning}</div>
      ${w.pronunciation?`<div class="word-pronun">${w.pronunciation}</div>`:''}
      ${w.example?`<div class="word-pronun" style="font-style:italic;margin-top:4px">"${w.example}"</div>`:''}
      <div style="margin-top:8px">
        <span class="word-lang-badge">${w.language}</span>
        <span class="mastery-badge mastery-${w.mastery}">${w.mastery}</span>
      </div>
    </div>`).join('')}</div>`;
}
async function doAddWord() {
  const word={word:document.getElementById('newWord').value.trim(),meaning:document.getElementById('newMeaning').value.trim(),pronunciation:document.getElementById('newPronunciation').value.trim(),language:document.getElementById('newWordLang').value,example:document.getElementById('newExample').value.trim(),mastery:'New'};
  if(!word.word||!word.meaning){toast('Word and meaning are required!');return;}
  const{data,error}=await sb.from('sanctum_words').insert([word]).select();
  if(error){toast('Error saving — check Supabase connection');return;}
  S.words.unshift(data[0]); S.xp+=2; todayXPEarned+=2;
  playSound('xp'); showXPPop('+2 XP',document.getElementById('totalXPDisp'));
  toast('📖 Word saved! +2 XP'); await saveState(); closeModal(); renderAll();
}
async function deleteWord(id) {
  await sb.from('sanctum_words').delete().eq('id',id);
  S.words=S.words.filter(w=>w.id!==id); renderVocab(); toast('Word removed');
}

// ── FLASHCARDS ────────────────────────────────────────────────────────────────
let fcDeck=[],fcIndex=0;
function startFlashcards() {
  const lang=document.getElementById('fcLang').value,mastery=document.getElementById('fcMastery').value;
  fcDeck=S.words.filter(w=>(!lang||w.language===lang)&&(!mastery||w.mastery===mastery)).sort(()=>Math.random()-0.5);
  fcIndex=0;
  if(!fcDeck.length){document.getElementById('fcArea').innerHTML=`<div class="fc-empty">No words match. Add words first in the Vocabulary tab!</div>`;return;}
  renderFlashcard();
}
function renderFlashcard() {
  const fc=document.getElementById('fcArea');if(!fc)return;
  if(fcIndex>=fcDeck.length){fc.innerHTML=`<div class="fc-done"><span class="big">✦</span><p>Session complete! ${fcDeck.length} cards reviewed.</p><button class="btn-gold" style="margin-top:20px" onclick="startFlashcards()">Go again</button></div>`;return;}
  const w=fcDeck[fcIndex];
  fc.innerHTML=`<div class="fc-card-wrap">
    <div class="fc-progress">${fcIndex+1} / ${fcDeck.length}</div>
    <div class="fc-card" id="fcCard" onclick="flipCard()">
      <div class="fc-hint">Tap to reveal meaning</div>
      <div class="fc-word">${w.word}</div>
      <div class="fc-meaning">${w.meaning}</div>
      ${w.pronunciation?`<div class="fc-pronun">${w.pronunciation}</div>`:''}
    </div>
    <div class="fc-btns" id="fcBtns" style="display:none">
      <button class="fc-btn wrong" onclick="fcAnswer(false)">✕ Didn't know</button>
      <button class="fc-btn right" onclick="fcAnswer(true)">✓ Got it</button>
    </div>
  </div>`;
}
function flipCard(){playSound('flip');document.getElementById('fcCard').classList.add('flipped');document.getElementById('fcBtns').style.display='flex';}
async function fcAnswer(correct) {
  const w=fcDeck[fcIndex],levels=['New','Learning','Reviewing','Mastered'];
  let idx=levels.indexOf(w.mastery);
  if(correct&&idx<3)idx++;else if(!correct&&idx>0)idx--;
  const newM=levels[idx];
  await sb.from('sanctum_words').update({mastery:newM}).eq('id',w.id);
  const sw=S.words.find(x=>x.id===w.id);if(sw)sw.mastery=newM;
  if(correct&&newM==='Mastered'){S.xp+=5;todayXPEarned+=5;playSound('quest');showXPPop('+5 XP',document.getElementById('fcArea'));toast('+5 XP — word mastered! ✨');await saveState();}
  else if(correct){playSound('xp');}
  fcIndex++;renderFlashcard();
}

// ── QURAN ─────────────────────────────────────────────────────────────────────
function renderQuran() {
  const p=S.quranProgress||{};
  const cr=SURAHS.filter(s=>p[s.num]?.canRead).length;
  const cm=SURAHS.filter(s=>p[s.num]?.canRecite).length;
  const cu=SURAHS.filter(s=>p[s.num]?.understand).length;
  const qs=document.getElementById('quranStats');
  if(qs)qs.innerHTML=`
    <div class="qstat"><span class="qstat-val">${cr}</span><span class="qstat-lbl">Can Read</span></div>
    <div class="qstat"><span class="qstat-val">${cm}</span><span class="qstat-lbl">Memorised</span></div>
    <div class="qstat"><span class="qstat-val">${cu}</span><span class="qstat-lbl">Understand</span></div>
    <div class="qstat"><span class="qstat-val">${SURAHS.length}</span><span class="qstat-lbl">Total</span></div>`;
  const ql=document.getElementById('quranList');
  if(ql)ql.innerHTML=SURAHS.map(s=>{
    const sp=p[s.num]||{};
    return `<div class="surah-card">
      <div class="surah-num">${s.num}</div>
      <div class="surah-info"><div class="surah-name">${s.name}</div><div class="surah-arabic">${s.arabic}</div><div class="surah-meta">${s.verses} verses · Juz ${s.juz}</div></div>
      <div class="surah-checks">
        <div class="schk" onclick="toggleSurah(${s.num},'canRead')"><div class="schk-box ${sp.canRead?'on':''}">✓</div><div class="schk-lbl">Read</div></div>
        <div class="schk" onclick="toggleSurah(${s.num},'canRecite')"><div class="schk-box ${sp.canRecite?'on':''}">✓</div><div class="schk-lbl">Memory</div></div>
        <div class="schk" onclick="toggleSurah(${s.num},'understand')"><div class="schk-box ${sp.understand?'on':''}">✓</div><div class="schk-lbl">Meaning</div></div>
      </div>
    </div>`;
  }).join('');
}
async function toggleSurah(num,field) {
  if(!S.quranProgress[num])S.quranProgress[num]={};
  const wasOn=S.quranProgress[num][field]; S.quranProgress[num][field]=!wasOn;
  if(!wasOn){const xm={canRead:20,canRecite:25,understand:30};const x=xm[field];S.xp+=x;todayXPEarned+=x;playSound('xp');showXPPop(`+${x} XP`,document.getElementById('quranList'));toast(`+${x} XP!`);}
  await saveState(); renderQuran(); renderProfile();
}

// ── TAJWEED ───────────────────────────────────────────────────────────────────
function renderTajweed() {
  const el=document.getElementById('tajweedGrid');if(!el)return;
  el.innerHTML=`<div class="tajweed-grid">${TAJWEED.map((r,i)=>{
    const m=S.tajweedMastered.includes(i);
    return `<div class="taj-card ${m?'mastered':''}">
      <div class="taj-header"><div><div class="taj-name">${r.name}</div><div class="taj-arabic">${r.arabic}</div></div><span class="taj-category">${r.cat}</span></div>
      <div class="taj-desc">${r.desc}</div>
      <div class="taj-example">${r.ex}</div>
      <div class="taj-mastered" onclick="toggleTajweed(${i})"><div class="taj-chk ${m?'on':''}">${m?'✓':''}</div><span>${m?'✦ Mastered':'Mark as mastered (+10 XP)'}</span></div>
    </div>`;
  }).join('')}</div>`;
}
async function toggleTajweed(i) {
  if(S.tajweedMastered.includes(i))S.tajweedMastered=S.tajweedMastered.filter(x=>x!==i);
  else{S.tajweedMastered.push(i);S.xp+=10;todayXPEarned+=10;playSound('quest');showXPPop('+10 XP',document.getElementById('tajweedGrid'));toast('+10 XP — Tajweed rule mastered! 📜');}
  await saveState(); renderTajweed(); renderProfile();
}

// ── SESSIONS ──────────────────────────────────────────────────────────────────
function renderSessions() {
  const el=document.getElementById('sessionsList');if(!el)return;
  if(!S.sessions.length){el.innerHTML=`<div class="empty-state"><div class="big">📝</div>No sessions yet — start a Pomodoro or log one manually!</div>`;return;}
  el.innerHTML=S.sessions.map(s=>{
    const d=new Date(s.created_at);
    return `<div class="session-card">
      <div class="sess-date"><span class="sess-day">${d.getDate()}</span>${d.toLocaleDateString('en-GB',{month:'short'})}</div>
      <div class="sess-info"><div class="sess-title">${s.title}</div><div class="sess-meta">${s.language} · ${s.type} · ${s.duration_label}</div>${s.notes?`<div class="sess-meta" style="font-style:italic">${s.notes}</div>`:''}</div>
      <div class="sess-xp">+${s.xp_earned} XP</div>
    </div>`;
  }).join('');
}
async function doAddSession() {
  const xp=parseInt(document.getElementById('sessDuration').value);
  const durLabel=document.getElementById('sessDuration').options[document.getElementById('sessDuration').selectedIndex].text.split(' (')[0];
  const session={title:document.getElementById('sessTitle').value.trim()||'Study Session',language:document.getElementById('sessLang').value,duration_label:durLabel,type:document.getElementById('sessType').value,notes:document.getElementById('sessNotes').value.trim(),xp_earned:xp};
  const{data,error}=await sb.from('sanctum_sessions').insert([session]).select();
  if(error){toast('Error saving session');return;}
  S.sessions.unshift(data[0]); S.xp+=xp; todayXPEarned+=xp;
  playSound('xp'); toast(`📝 Session logged! +${xp} XP`); await saveState(); closeModal(); renderAll();
}

// ── RESOURCES ─────────────────────────────────────────────────────────────────
function renderResources() {
  const el=document.getElementById('resourcesGrid');if(!el)return;
  if(!S.resources.length){el.innerHTML=`<div class="empty-state"><div class="big">📦</div>No resources yet — add your favourite apps, books and YouTube channels!</div>`;return;}
  const icons={'📱 App':'📱','🌐 Website':'🌐','📚 Book':'📚','🎥 YouTube':'🎥','🎧 Podcast':'🎧'};
  el.innerHTML=`<div class="resources-grid">${S.resources.map(r=>`
    <div class="res-card">
      <div class="res-header"><div class="res-type">${icons[r.type]||'📦'}</div><div class="res-name">${r.name}</div></div>
      <div class="res-badges"><span class="res-badge">${r.language}</span><span class="res-badge">${r.type}</span></div>
      ${r.notes?`<div class="res-notes">${r.notes}</div>`:''}
      ${r.link?`<a href="${r.link}" target="_blank" class="res-link">Open ↗</a>`:''}
    </div>`).join('')}</div>`;
}
async function doAddResource() {
  const res={name:document.getElementById('resName').value.trim(),language:document.getElementById('resLang').value,type:document.getElementById('resType').value,link:document.getElementById('resLink').value.trim(),notes:document.getElementById('resNotes').value.trim()};
  if(!res.name){toast('Name required!');return;}
  const{data,error}=await sb.from('sanctum_resources').insert([res]).select();
  if(error){toast('Error saving');return;}
  S.resources.unshift(data[0]); toast('📦 Resource saved!'); closeModal(); renderResources();
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function showPage(name) {
  playSound('click');
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  document.querySelector(`[data-page="${name}"]`)?.classList.add('active');
}

// ── MODALS ────────────────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'));
  document.getElementById(`modal-${id}`)?.classList.remove('hidden');
}
function closeModal() { document.getElementById('modalOverlay').classList.add('hidden'); }

// ── TOAST ─────────────────────────────────────────────────────────────────────
function toast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),3000);
}

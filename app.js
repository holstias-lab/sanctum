// ── CONFIG ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ruwuvwqsrenluygvigox.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XFMGI1GqaBvuv_TsVNEXJQ_dYrRoqQ6';
const PASSWORD     = 'sanctum2026';
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
  { f:'🇸🇦', n:'Arabic',   active:true,  locked:false },
  { f:'📖',  n:'Quranic',  active:true,  locked:false },
  { f:'🇨🇳', n:'Mandarin', active:false, locked:true  },
  { f:'🇩🇪', n:'German',   active:false, locked:true  },
  { f:'🇪🇸', n:'Spanish',  active:false, locked:true  },
  { f:'🇫🇷', n:'French',   active:false, locked:true  },
  { f:'🇮🇹', n:'Italian',  active:false, locked:true  },
  { f:'🇯🇵', n:'Japanese', active:false, locked:true  },
  { f:'🇰🇷', n:'Korean',   active:false, locked:true  },
  { f:'🇬🇭', n:'Twi',      active:false, locked:true  },
];
const SURAHS = [
  { num:1,   name:'Al-Fatiha',   arabic:'الفاتحة',  juz:1,  verses:7  },
  { num:114, name:'An-Nas',      arabic:'الناس',    juz:30, verses:6  },
  { num:113, name:'Al-Falaq',    arabic:'الفلق',    juz:30, verses:5  },
  { num:112, name:'Al-Ikhlas',   arabic:'الإخلاص',  juz:30, verses:4  },
  { num:111, name:'Al-Masad',    arabic:'المسد',    juz:30, verses:5  },
  { num:110, name:'An-Nasr',     arabic:'النصر',    juz:30, verses:3  },
  { num:109, name:'Al-Kafirun',  arabic:'الكافرون', juz:30, verses:6  },
  { num:108, name:'Al-Kawthar',  arabic:'الكوثر',   juz:30, verses:3  },
  { num:107, name:"Al-Ma'un",    arabic:'الماعون',  juz:30, verses:7  },
  { num:106, name:'Quraysh',     arabic:'قريش',     juz:30, verses:4  },
  { num:105, name:'Al-Fil',      arabic:'الفيل',    juz:30, verses:5  },
  { num:104, name:'Al-Humazah',  arabic:'الهمزة',   juz:30, verses:9  },
  { num:103, name:'Al-Asr',      arabic:'العصر',    juz:30, verses:3  },
  { num:102, name:'At-Takathur', arabic:'التكاثر',  juz:30, verses:8  },
  { num:101, name:"Al-Qari'ah",  arabic:'القارعة',  juz:30, verses:11 },
  { num:100, name:'Al-Adiyat',   arabic:'العاديات', juz:30, verses:11 },
  { num:99,  name:'Az-Zalzalah', arabic:'الزلزلة',  juz:30, verses:8  },
  { num:98,  name:'Al-Bayyinah', arabic:'البينة',   juz:30, verses:8  },
  { num:97,  name:'Al-Qadr',     arabic:'القدر',    juz:30, verses:5  },
  { num:96,  name:'Al-Alaq',     arabic:'العلق',    juz:30, verses:19 },
];
const TAJWEED_RULES = [
  { name:'Izhar', arabic:'إظهار', category:'Noon & Meem', desc:'When noon sakinah or tanween is followed by one of 6 throat letters (أ ه ع ح غ خ), the noon is pronounced clearly with no nasalisation.', example:'مِنْ عِلْمٍ — "min ilm"' },
  { name:'Idghaam', arabic:'إدغام', category:'Noon & Meem', desc:'When noon sakinah or tanween is followed by one of 6 letters (ي ر م ل و ن), the noon merges into the following letter.', example:'مَن يَعمل — the noon merges into the ya' },
  { name:'Ikhfa', arabic:'إخفاء', category:'Noon & Meem', desc:'When noon sakinah or tanween is followed by one of 15 letters, the noon is nasalised and slightly hidden.', example:'مِن تَحت — pronounced with nasal concealment' },
  { name:'Iqlab', arabic:'إقلاب', category:'Noon & Meem', desc:'When noon sakinah or tanween is followed by ب (ba), the noon converts to a meem sound with ghunna.', example:'مِنْ بَعد — noon becomes meem' },
  { name:'Ghunna', arabic:'غنة', category:'General', desc:'A nasal resonance from the nasal passage. Applied to shadda on noon or meem, held for 2 counts.', example:'إِنَّ — the shadda on noon requires ghunna' },
  { name:'Qalqalah', arabic:'قلقلة', category:'Letters', desc:"Echoing bounce on 5 letters (ق ط ب ج د) when they carry sukoon. Stronger at end of verse. Remember: 'QaTaBaJaDa'.", example:'يَقطَع — both ق and ط have qalqalah' },
  { name:"Madd Tabee'i", arabic:'مد طبيعي', category:'Madd', desc:'Natural 2-count elongation when alif follows fatha, waw follows damma, or ya follows kasra.', example:'كِتَاب — the alif after fatha = 2 counts' },
];

// ── STATE ────────────────────────────────────────────────────────────────────
let S = {
  xp:0, streak:0, lastLog:null,
  ritual:[], ritualDate:null,
  completedQuests:[],
  quranProgress:{}, tajweedMastered:[],
  words:[], sessions:[], resources:[],
  // Editable content
  custom: {
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
      { ico:'⚔️', name:'The Opening',      desc:'Read Surah Al-Fatiha fluently without hesitation',   xp:50,  type:'Main Quest',  status:'active' },
      { ico:'⚔️', name:'First Steps',      desc:'Complete 7 study sessions',                          xp:75,  type:'Main Quest',  status:'active' },
      { ico:'📜', name:'Word Hoarder I',   desc:'Learn your first 50 Arabic words',                   xp:60,  type:'Side Quest',  status:'active' },
      { ico:'⚡', name:'Daily Devotion',   desc:'Study for at least 15 minutes today',                xp:10,  type:'Daily',       status:'active' },
      { ico:'🏆', name:'Streak Keeper I',  desc:'Study 7 days in a row',                              xp:50,  type:'Challenge',   status:'active' },
      { ico:'⚔️', name:'The Reciter',      desc:"Complete Juz' Amma — read all 37 surahs fluently",   xp:300, type:'Main Quest',  status:'locked' },
      { ico:'🏆', name:'The Scholar',      desc:'Master all 7 tajweed rules',                         xp:100, type:'Challenge',   status:'locked' },
      { ico:'📜', name:'Word Hoarder II',  desc:'Reach 200 words in your Vocabulary Bank',            xp:150, type:'Side Quest',  status:'locked' },
      { ico:'🌟', name:'Unlock Mandarin',  desc:'Earn 500 XP to unlock your next language',           xp:50,  type:'Milestone',   status:'locked' },
      { ico:'🌟', name:'Streak Keeper II', desc:'Study 30 days in a row',                             xp:200, type:'Challenge',   status:'locked' },
    ],
    ritualItems: [
      'Log today\'s session',
      'Review 10 words in Vocabulary Bank',
      'Practise one surah',
      'Add XP for today',
      'Check active quests',
    ],
  }
};
let editMode = false;
let todayXPEarned = 0;

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
  document.getElementById('dateDisplay').textContent =
    new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  await loadState();
  applyCustom();
  renderAll();
}

async function loadState() {
  try {
    const { data } = await sb.from('sanctum_state').select('*').eq('key','main').single();
    if (data) {
      const saved = JSON.parse(data.value);
      S = { ...S, ...saved };
      if (saved.custom) S.custom = { ...S.custom, ...saved.custom };
      if (saved.custom?.quests) S.custom.quests = saved.custom.quests;
      if (saved.custom?.ritualItems) S.custom.ritualItems = saved.custom.ritualItems;
    }
  } catch(e) {}
  try { const { data } = await sb.from('sanctum_words').select('*').order('created_at',{ascending:false}); if (data) S.words = data; } catch(e) {}
  try { const { data } = await sb.from('sanctum_sessions').select('*').order('created_at',{ascending:false}); if (data) S.sessions = data; } catch(e) {}
  try { const { data } = await sb.from('sanctum_resources').select('*').order('created_at',{ascending:false}); if (data) S.resources = data; } catch(e) {}
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
  await sb.from('sanctum_state').upsert({key:'main', value:JSON.stringify(payload)},{onConflict:'key'});
}

// ── APPLY CUSTOM ─────────────────────────────────────────────────────────────
function applyCustom() {
  const c = S.custom;
  // Login
  document.querySelector('.login-wrap').style.backgroundImage =
    `linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.88)),url('${c.loginBg}')`;
  document.getElementById('loginPortrait').src = c.portraitUrl;
  document.getElementById('loginTitle').textContent = c.siteTitle;
  document.getElementById('loginSubtitle').textContent = c.siteSubtitle;
  // Site title
  document.getElementById('siteTitle').textContent = '🌙 ' + c.siteTitle;
  // Portrait
  document.getElementById('mainPortrait').src = c.portraitUrl;
  document.getElementById('adventurerName').textContent = c.adventurerName;
  // Covers
  const dashCover = document.getElementById('dashCover');
  if (dashCover) dashCover.style.backgroundImage =
    `linear-gradient(rgba(0,0,0,0.1),rgba(17,16,16,1)),url('${c.dashboardCover}')`;
  const questsCover = document.getElementById('questsCover');
  if (questsCover) questsCover.style.backgroundImage =
    `linear-gradient(rgba(0,0,0,0.2),rgba(17,16,16,1)),url('${c.questsCover}')`;
  const vocabCover = document.getElementById('vocabCover');
  if (vocabCover) vocabCover.style.backgroundImage =
    `linear-gradient(rgba(0,0,0,0.2),rgba(17,16,16,1)),url('${c.vocabCover}')`;
  const quranCover = document.getElementById('quranCover');
  if (quranCover) quranCover.style.backgroundImage =
    `linear-gradient(rgba(0,0,0,0.3),rgba(17,16,16,1)),url('${c.quranCover}')`;
  // Sidebar
  document.querySelector('.sidebar-hero').style.backgroundImage =
    `linear-gradient(rgba(10,8,6,0.3),rgba(10,8,6,0.7)),url('${c.portraitUrl}')`;
}

// ── EDIT MODE ─────────────────────────────────────────────────────────────────
function toggleEditMode() {
  editMode = !editMode;
  document.body.classList.toggle('edit-mode', editMode);
  document.getElementById('editToggle').textContent = editMode ? '✓ Done Editing' : '✏️ Edit';
  document.getElementById('editToggle').classList.toggle('editing', editMode);
  if (editMode) {
    toast('✏️ Edit mode on — click anything to edit');
    attachEditListeners();
  } else {
    toast('✓ Changes saved');
  }
}

function attachEditListeners() {
  // Editable text elements
  document.querySelectorAll('[data-editable]').forEach(el => {
    el.style.cursor = 'pointer';
    el.onclick = (e) => {
      if (!editMode) return;
      e.stopPropagation();
      const key = el.dataset.editable;
      const cur = el.dataset.editableIndex !== undefined
        ? S.custom[key][parseInt(el.dataset.editableIndex)]
        : S.custom[key] || el.textContent;
      openEditPopup(e.clientX, e.clientY, cur, async (val) => {
        if (el.dataset.editableIndex !== undefined) {
          S.custom[key][parseInt(el.dataset.editableIndex)] = val;
        } else {
          S.custom[key] = val;
        }
        await saveState();
        applyCustom();
        renderAll();
      });
    };
  });

  // Editable images
  document.querySelectorAll('[data-edit-img]').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = 'Click to change image';
    el.onclick = (e) => {
      if (!editMode) return;
      e.stopPropagation();
      const key = el.dataset.editImg;
      const cur = S.custom[key] || '';
      openEditPopup(e.clientX, e.clientY, cur, async (val) => {
        S.custom[key] = val;
        await saveState();
        applyCustom();
      }, 'Paste image URL');
    };
  });

  // Editable background covers
  document.querySelectorAll('[data-edit-cover]').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = 'Click to change cover image';
    el.onclick = (e) => {
      if (!editMode) return;
      e.stopPropagation();
      const key = el.dataset.editCover;
      const cur = S.custom[key] || '';
      openEditPopup(e.clientX, e.clientY, cur, async (val) => {
        S.custom[key] = val;
        await saveState();
        applyCustom();
      }, 'Paste cover image URL (from Unsplash, etc.)');
    };
  });
}

// ── EDIT POPUP ───────────────────────────────────────────────────────────────
function openEditPopup(x, y, currentVal, onSave, placeholder) {
  // Remove any existing popup
  document.getElementById('editPopup')?.remove();

  const popup = document.createElement('div');
  popup.id = 'editPopup';
  popup.className = 'edit-popup';

  // Clamp to viewport
  const left = Math.min(x, window.innerWidth - 340);
  const top = Math.min(y, window.innerHeight - 130);
  popup.style.left = left + 'px';
  popup.style.top = top + 'px';

  const isLong = (currentVal || '').length > 60 || placeholder?.includes('URL');
  popup.innerHTML = `
    ${isLong
      ? `<input id="editInput" class="edit-input" value="${(currentVal||'').replace(/"/g,'&quot;')}" placeholder="${placeholder||'Edit…'}">`
      : `<input id="editInput" class="edit-input" value="${(currentVal||'').replace(/"/g,'&quot;')}" placeholder="${placeholder||'Edit…'}">`
    }
    <div class="edit-popup-btns">
      <button class="edit-cancel" onclick="document.getElementById('editPopup').remove()">Cancel</button>
      <button class="edit-save" onclick="commitEdit()">Save ✓</button>
    </div>
  `;
  document.body.appendChild(popup);
  document.getElementById('editInput').focus();
  document.getElementById('editInput').select();

  window._editSave = onSave;

  document.getElementById('editInput').onkeydown = (e) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') popup.remove();
  };
}

function commitEdit() {
  const val = document.getElementById('editInput')?.value?.trim();
  const popup = document.getElementById('editPopup');
  if (val !== undefined && val !== null && window._editSave) {
    window._editSave(val);
  }
  popup?.remove();
}

// ── QUEST EDITOR ─────────────────────────────────────────────────────────────
function openQuestEditor(i) {
  if (!editMode) return;
  const q = S.custom.quests[i];
  openModal('editQuest');
  document.getElementById('eqName').value = q.name;
  document.getElementById('eqDesc').value = q.desc;
  document.getElementById('eqXP').value = q.xp;
  document.getElementById('eqIco').value = q.ico;
  document.getElementById('eqType').value = q.type;
  document.getElementById('eqStatus').value = q.status;
  window._editQuestIndex = i;
}

async function saveQuestEdit() {
  const i = window._editQuestIndex;
  S.custom.quests[i] = {
    ...S.custom.quests[i],
    name: document.getElementById('eqName').value,
    desc: document.getElementById('eqDesc').value,
    xp: parseInt(document.getElementById('eqXP').value) || 0,
    ico: document.getElementById('eqIco').value,
    type: document.getElementById('eqType').value,
    status: document.getElementById('eqStatus').value,
  };
  await saveState();
  closeModal();
  renderQuests();
  renderQuestsPreview();
  toast('Quest updated!');
}

async function addNewQuest() {
  S.custom.quests.push({ ico:'⚔️', name:'New Quest', desc:'Describe your quest here', xp:50, type:'Side Quest', status:'active' });
  await saveState();
  renderQuests();
  toast('New quest added!');
}

async function deleteQuest(i) {
  S.custom.quests.splice(i, 1);
  S.completedQuests = S.completedQuests.filter(x => x !== i).map(x => x > i ? x-1 : x);
  await saveState();
  renderQuests();
  toast('Quest deleted');
}

// ── RITUAL EDITOR ─────────────────────────────────────────────────────────────
async function editRitualItem(i) {
  if (!editMode) return;
  const cur = S.custom.ritualItems[i];
  const el = document.querySelectorAll('.ritual-item')[i];
  const rect = el.getBoundingClientRect();
  openEditPopup(rect.left, rect.top, cur, async (val) => {
    S.custom.ritualItems[i] = val;
    await saveState();
    renderRitual();
  });
}

async function addRitualItem() {
  S.custom.ritualItems.push('New ritual item');
  await saveState();
  renderRitual();
}

async function deleteRitualItem(i) {
  S.custom.ritualItems.splice(i, 1);
  S.ritual = S.ritual.filter(x => x !== i).map(x => x > i ? x-1 : x);
  await saveState();
  renderRitual();
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
  if (editMode) attachEditListeners();
}

// ── PROFILE ──────────────────────────────────────────────────────────────────
function getRank(xp) { let r=RANKS[0]; for(let x of RANKS){if(xp>=x.xp)r=x;} return r; }
function getNext(xp) { for(let x of RANKS){if(xp<x.xp)return x;} return null; }

function renderProfile() {
  const rank = getRank(S.xp), next = getNext(S.xp);
  document.getElementById('rankName').textContent = rank.label;
  document.getElementById('rankNum').textContent = `Rank ${rank.n}`;
  document.getElementById('xpCurrent').textContent = `${S.xp.toLocaleString()} XP`;
  document.getElementById('xpTarget').textContent = next ? `${next.xp.toLocaleString()} XP` : 'MAX';
  document.getElementById('nextRankName').textContent = next ? next.label : 'Maximum Rank';
  const pct = next ? Math.min(100,((S.xp-rank.xp)/(next.xp-rank.xp))*100) : 100;
  document.getElementById('xpBarFill').style.width = pct+'%';
  document.getElementById('totalXPDisp').textContent = S.xp.toLocaleString();
  document.getElementById('streakDisp').textContent = S.streak;
  const mastered = S.words.filter(w=>w.mastery==='Mastered').length;
  document.getElementById('wordsDisp').textContent = mastered;
  const today = new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  const tl = document.getElementById('todayLabel'); if(tl) tl.textContent = today;
  const ci = document.getElementById('currentRankInline'); if(ci) ci.textContent = rank.label;
  const mc = document.getElementById('masteredCount'); if(mc) mc.textContent = mastered;
  const sc = document.getElementById('surahCount'); if(sc) sc.textContent = SURAHS.filter(s=>S.quranProgress[s.num]?.canRead).length;
  const tx = document.getElementById('todayXP'); if(tx) tx.textContent = todayXPEarned+' XP';
  document.getElementById('adventurerName').textContent = S.custom.adventurerName;
}

// ── STREAK ───────────────────────────────────────────────────────────────────
function renderStreak() {
  document.getElementById('streakNum') && (document.getElementById('streakNum').textContent = S.streak);
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const lit = S.streak%7 || (S.streak>0 && S.streak%7===0 ? 7 : 0);
  document.getElementById('streakDots').innerHTML = days.map((d,i)=>
    `<div class="sdot ${i<lit?'lit':''}">${d}</div>`).join('');
}

async function logToday() {
  const today = new Date().toDateString(), yest = new Date(Date.now()-86400000).toDateString();
  if(S.lastLog===today){toast('Already logged today!');return;}
  S.streak = S.lastLog===yest ? S.streak+1 : 1;
  S.lastLog = today;
  let bonus = 0;
  if(S.streak===7){bonus=50;toast('🔥 7-day streak! +50 XP bonus!');}
  else if(S.streak===30){bonus=200;toast('🔥 30-day streak! +200 XP bonus!');}
  else toast(`🔥 Day ${S.streak} streak logged!`);
  S.xp+=bonus; todayXPEarned+=bonus;
  await saveState(); renderAll();
}

// ── LANG GRID ────────────────────────────────────────────────────────────────
function renderLangGrid() {
  const unlocked = S.xp>=500;
  document.getElementById('langGrid').innerHTML = LANGS.map(l=>{
    const lk=l.locked&&!unlocked;
    const pct=l.active?Math.min(100,(S.xp/500)*100):0;
    return `<div class="lang-item ${l.active?'active':''} ${lk?'locked':''}">
      <div class="lang-flag">${l.f}</div>
      <div class="lang-nm">${l.n}</div>
      <div class="lang-st">${lk?'🔒':l.active?'🟢':'✦'}</div>
      ${!lk?`<div class="lang-mini-bar"><div class="lang-mini-fill" style="width:${pct}%"></div></div>`:''}
    </div>`;
  }).join('');
}

// ── QUESTS PREVIEW ───────────────────────────────────────────────────────────
function renderQuestsPreview() {
  const active = S.custom.quests.filter((q,i)=>q.status==='active'&&!S.completedQuests.includes(i)).slice(0,4);
  document.getElementById('activeQuestsPreview').innerHTML = active.length
    ? active.map(q=>`<div class="qpi"><span>${q.ico}</span><span class="qpi-name">${q.name}</span><span class="qpi-xp">+${q.xp} XP</span></div>`).join('')
    : '<p style="color:var(--muted);font-size:0.85em;font-style:italic">All quests complete!</p>';
}

// ── RITUAL ───────────────────────────────────────────────────────────────────
function renderRitual() {
  const today = new Date().toDateString();
  if(S.ritualDate!==today){S.ritual=[];S.ritualDate=today;}
  document.getElementById('ritualList').innerHTML =
    S.custom.ritualItems.map((r,i)=>{
      const on=S.ritual.includes(i);
      return `<div class="ritual-item ${on?'done':''}" onclick="editMode?editRitualItem(${i}):toggleRitual(${i})">
        <div class="rchk ${on?'on':''}"></div>
        <span class="ritual-txt">${r}</span>
        ${editMode?`<button class="edit-del-btn" onclick="event.stopPropagation();deleteRitualItem(${i})">✕</button>`:''}
      </div>`;
    }).join('') +
    (editMode ? `<div style="margin-top:8px"><button class="btn-ghost" style="width:100%;font-size:0.6em" onclick="addRitualItem()">+ Add Item</button></div>` : '');
}

async function toggleRitual(i) {
  if(S.ritual.includes(i)) S.ritual=S.ritual.filter(x=>x!==i);
  else { S.ritual.push(i); if(S.ritual.length===S.custom.ritualItems.length) toast('✦ Daily ritual complete!'); }
  await saveState(); renderRitual();
}

// ── RANK LADDER ──────────────────────────────────────────────────────────────
function renderRankLadder() {
  const rank = getRank(S.xp);
  document.getElementById('rankLadder').innerHTML = RANKS.map(r=>{
    const done=S.xp>=r.xp&&r.label!==rank.label, now=r.label===rank.label;
    const cls=now?'now':done?'done':'future', dotCls=now?'now':done?'done':'';
    return `<div class="rank-row ${cls}">
      <div class="rank-dot ${dotCls}"></div>
      <div class="rr-num">${r.n}</div>
      <div class="rrn">${r.label}</div>
      <div class="rr-xp">${r.xp.toLocaleString()} XP</div>
    </div>`;
  }).join('');
}

// ── QUESTS ───────────────────────────────────────────────────────────────────
function renderQuests() {
  const active=S.custom.quests.filter((q,i)=>q.status==='active'&&!S.completedQuests.includes(i));
  const done=S.custom.quests.filter((q,i)=>S.completedQuests.includes(i));
  const locked=S.custom.quests.filter((q,i)=>q.status==='locked'&&!S.completedQuests.includes(i));
  let html='';
  if(active.length){html+=`<div class="quest-section-title">Active</div>`+active.map(q=>questCard(q,S.custom.quests.indexOf(q),false,false)).join('');}
  if(locked.length){html+=`<div class="quest-section-title">Locked</div>`+locked.map(q=>questCard(q,S.custom.quests.indexOf(q),true,false)).join('');}
  if(done.length){html+=`<div class="quest-section-title">Completed</div>`+done.map(q=>questCard(q,S.custom.quests.indexOf(q),false,true)).join('');}
  if(editMode) html+=`<div style="margin-top:14px"><button class="btn-gold small" onclick="addNewQuest()">+ Add Quest</button></div>`;
  document.getElementById('questsContainer').innerHTML = html;
}

function questCard(q,i,locked,done){
  return `<div class="quest-card ${locked?'locked':''} ${done?'done':''}" onclick="${editMode?`openQuestEditor(${i})`:done||locked?'':(`completeQuest(${i})`)}">
    <div class="quest-ico">${done?'✅':locked?'🔒':q.ico}</div>
    <div class="quest-info">
      <div class="quest-name">${q.name} ${editMode?'<span style="color:var(--gold2);font-size:0.7em">✏️</span>':''}</div>
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
  if(S.completedQuests.includes(i)) return;
  S.completedQuests.push(i);
  S.xp+=S.custom.quests[i].xp;
  todayXPEarned+=S.custom.quests[i].xp;
  toast(`⚔️ Quest complete! +${S.custom.quests[i].xp} XP`);
  await saveState(); renderAll();
}

// ── ADD XP ───────────────────────────────────────────────────────────────────
async function doAddXP() {
  const val=parseInt(document.getElementById('xpAction').value);
  S.xp+=val; todayXPEarned+=val;
  toast(`+${val} XP earned!`);
  await saveState(); renderAll(); closeModal();
}

// ── VOCABULARY ───────────────────────────────────────────────────────────────
function renderVocab() {
  const lang=document.getElementById('vocabLangFilter')?.value||'';
  const mastery=document.getElementById('vocabMasteryFilter')?.value||'';
  const search=document.getElementById('vocabSearch')?.value.toLowerCase()||'';
  let words=S.words.filter(w=>(!lang||w.language===lang)&&(!mastery||w.mastery===mastery)&&(!search||w.word.toLowerCase().includes(search)||w.meaning.toLowerCase().includes(search)));
  if(!words.length){document.getElementById('vocabGrid').innerHTML=`<div class="empty-state"><div class="big">📖</div>No words yet — add your first one!</div>`;return;}
  document.getElementById('vocabGrid').innerHTML=`<div class="vocab-grid">${words.map(w=>`
    <div class="word-card">
      <button class="word-delete" onclick="deleteWord('${w.id}')">✕</button>
      <div class="word-arabic">${w.word}</div>
      <div class="word-meaning">${w.meaning}</div>
      ${w.pronunciation?`<div class="word-pronun">${w.pronunciation}</div>`:''}
      ${w.example?`<div class="word-pronun">"${w.example}"</div>`:''}
      <div style="margin-top:8px">
        <span class="word-lang-badge">${w.language}</span>
        <span class="mastery-badge mastery-${w.mastery}">${w.mastery}</span>
      </div>
    </div>`).join('')}</div>`;
}

async function doAddWord() {
  const word={word:document.getElementById('newWord').value.trim(),meaning:document.getElementById('newMeaning').value.trim(),pronunciation:document.getElementById('newPronunciation').value.trim(),language:document.getElementById('newWordLang').value,example:document.getElementById('newExample').value.trim(),mastery:'New'};
  if(!word.word||!word.meaning){toast('Word and meaning required!');return;}
  const {data,error}=await sb.from('sanctum_words').insert([word]).select();
  if(error){toast('Error saving word');return;}
  S.words.unshift(data[0]); S.xp+=2; todayXPEarned+=2;
  toast('📖 Word saved! +2 XP'); await saveState(); closeModal(); renderAll();
}

async function deleteWord(id) {
  await sb.from('sanctum_words').delete().eq('id',id);
  S.words=S.words.filter(w=>w.id!==id); renderVocab(); toast('Word removed');
}

// ── FLASHCARDS ───────────────────────────────────────────────────────────────
let fcDeck=[],fcIndex=0;
function startFlashcards() {
  const lang=document.getElementById('fcLang').value, mastery=document.getElementById('fcMastery').value;
  fcDeck=S.words.filter(w=>(!lang||w.language===lang)&&(!mastery||w.mastery===mastery)).sort(()=>Math.random()-0.5);
  fcIndex=0;
  if(!fcDeck.length){document.getElementById('fcArea').innerHTML=`<div class="fc-empty">No words match. Add some words first!</div>`;return;}
  renderFlashcard();
}
function renderFlashcard() {
  if(fcIndex>=fcDeck.length){document.getElementById('fcArea').innerHTML=`<div class="fc-done"><span class="big">✦</span><p>Session complete! ${fcDeck.length} cards reviewed.</p><button class="btn-gold" style="margin-top:20px" onclick="startFlashcards()">Go again</button></div>`;return;}
  const w=fcDeck[fcIndex];
  document.getElementById('fcArea').innerHTML=`
    <div class="fc-card-wrap">
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
function flipCard(){document.getElementById('fcCard').classList.add('flipped');document.getElementById('fcBtns').style.display='flex';}
async function fcAnswer(correct) {
  const w=fcDeck[fcIndex], levels=['New','Learning','Reviewing','Mastered'];
  let idx=levels.indexOf(w.mastery);
  if(correct&&idx<3)idx++; else if(!correct&&idx>0)idx--;
  const newM=levels[idx];
  await sb.from('sanctum_words').update({mastery:newM}).eq('id',w.id);
  const sw=S.words.find(x=>x.id===w.id); if(sw)sw.mastery=newM;
  if(correct&&newM==='Mastered'){S.xp+=5;todayXPEarned+=5;toast('+5 XP — word mastered!');await saveState();}
  fcIndex++; renderFlashcard();
}

// ── QURAN ────────────────────────────────────────────────────────────────────
function renderQuran() {
  const p=S.quranProgress||{};
  const canRead=SURAHS.filter(s=>p[s.num]?.canRead).length;
  const canRecite=SURAHS.filter(s=>p[s.num]?.canRecite).length;
  const understand=SURAHS.filter(s=>p[s.num]?.understand).length;
  document.getElementById('quranStats').innerHTML=`
    <div class="qstat"><span class="qstat-val">${canRead}</span><span class="qstat-lbl">Can Read</span></div>
    <div class="qstat"><span class="qstat-val">${canRecite}</span><span class="qstat-lbl">Memorised</span></div>
    <div class="qstat"><span class="qstat-val">${understand}</span><span class="qstat-lbl">Understand</span></div>
    <div class="qstat"><span class="qstat-val">${SURAHS.length}</span><span class="qstat-lbl">Total</span></div>`;
  document.getElementById('quranList').innerHTML=SURAHS.map(s=>{
    const sp=p[s.num]||{};
    return `<div class="surah-card">
      <div class="surah-num">${s.num}</div>
      <div class="surah-info">
        <div class="surah-name">${s.name}</div>
        <div class="surah-arabic">${s.arabic}</div>
        <div class="surah-meta">${s.verses} verses · Juz ${s.juz}</div>
      </div>
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
  if(!wasOn){const xm={canRead:20,canRecite:25,understand:30};S.xp+=xm[field];todayXPEarned+=xm[field];toast(`+${xm[field]} XP!`);}
  await saveState(); renderQuran(); renderProfile();
}

// ── TAJWEED ──────────────────────────────────────────────────────────────────
function renderTajweed() {
  document.getElementById('tajweedGrid').innerHTML=`<div class="tajweed-grid">${TAJWEED_RULES.map((r,i)=>{
    const m=S.tajweedMastered.includes(i);
    return `<div class="taj-card">
      <div class="taj-header"><div><div class="taj-name">${r.name}</div><div class="taj-arabic">${r.arabic}</div></div><span class="taj-category">${r.category}</span></div>
      <div class="taj-desc">${r.desc}</div>
      <div class="taj-example">${r.example}</div>
      <div class="taj-mastered" onclick="toggleTajweed(${i})"><div class="taj-chk ${m?'on':''}">${m?'✓':''}</div><span>${m?'✦ Mastered':'Mark as mastered (+10 XP)'}</span></div>
    </div>`;
  }).join('')}</div>`;
}
async function toggleTajweed(i) {
  if(S.tajweedMastered.includes(i))S.tajweedMastered=S.tajweedMastered.filter(x=>x!==i);
  else{S.tajweedMastered.push(i);S.xp+=10;todayXPEarned+=10;toast('+10 XP — Tajweed rule mastered!');}
  await saveState(); renderTajweed(); renderProfile();
}

// ── SESSIONS ─────────────────────────────────────────────────────────────────
function renderSessions() {
  if(!S.sessions.length){document.getElementById('sessionsList').innerHTML=`<div class="empty-state"><div class="big">📝</div>No sessions yet!</div>`;return;}
  document.getElementById('sessionsList').innerHTML=S.sessions.map(s=>{
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
  const {data,error}=await sb.from('sanctum_sessions').insert([session]).select();
  if(error){toast('Error saving session');return;}
  S.sessions.unshift(data[0]); S.xp+=xp; todayXPEarned+=xp;
  toast(`📝 Session logged! +${xp} XP`); await saveState(); closeModal(); renderAll();
}

// ── RESOURCES ────────────────────────────────────────────────────────────────
function renderResources() {
  if(!S.resources.length){document.getElementById('resourcesGrid').innerHTML=`<div class="empty-state"><div class="big">📦</div>No resources yet!</div>`;return;}
  const icons={'📱 App':'📱','🌐 Website':'🌐','📚 Book':'📚','🎥 YouTube':'🎥','🎧 Podcast':'🎧'};
  document.getElementById('resourcesGrid').innerHTML=`<div class="resources-grid">${S.resources.map(r=>`
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
  const {data,error}=await sb.from('sanctum_resources').insert([res]).select();
  if(error){toast('Error saving resource');return;}
  S.resources.unshift(data[0]); toast('📦 Resource saved!'); closeModal(); renderResources();
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  document.querySelector(`[data-page="${name}"]`).classList.add('active');
}

// ── MODALS ───────────────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'));
  document.getElementById(`modal-${id}`).classList.remove('hidden');
}
function closeModal() { document.getElementById('modalOverlay').classList.add('hidden'); }

// ── TOAST ────────────────────────────────────────────────────────────────────
function toast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

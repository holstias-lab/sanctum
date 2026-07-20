/* ===== Sanctum shared sidebar navigation ===== */
const NAV_ITEMS = [
  { key: 'home', label: 'Language Hub', icon: 'dashboard', href: 'index.html' },
  { key: 'focus', label: 'Focus Timer', icon: 'timer', href: 'focus-timer.html' },
  { key: 'quests', label: 'Quests', icon: 'military_tech', href: 'quests.html' },
];

const NAV_ITEMS_2 = [
  { key: 'vocab', label: 'Vocabulary', icon: 'menu_book', href: 'vocabulary.html' },
  { key: 'flashcards', label: 'Flashcards', icon: 'style', href: 'flashcards.html' },
  { key: 'quran', label: 'Quran Reader', icon: 'auto_stories', href: 'quran-reader.html' },
  { key: 'quranprogress', label: 'Quran Progress', icon: 'trending_up', href: 'quran-progress.html' },
  { key: 'tajweed', label: 'Tajweed', icon: 'spellcheck', href: 'tajweed.html' },
  { key: 'sessions', label: 'Sessions', icon: 'groups', href: 'sessions.html' },
  { key: 'resources', label: 'Resources', icon: 'library_books', href: 'resources.html' },
  { key: 'profile', label: 'Profile', icon: 'person', href: 'profile.html' },
  { key: 'guide', label: 'Guide', icon: 'explore', href: 'guide.html' },
];

function langIconHtml(l, size) {
  size = size || 20;
  if (l.flag) return `<span style="font-size:${size}px;line-height:1">${l.flag}</span>`;
  return `<span class="material-symbols-outlined" style="font-size:${size}px">${l.icon || 'translate'}</span>`;
}

function renderSidebar(activeKey) {
  const s = Sanctum.state;
  const navHtml = items => items.map(i => `
    <a class="nav-item${i.key === activeKey ? ' active' : ''}" href="${i.href}">
      <span class="material-symbols-outlined">${i.icon}</span>
      <span>${i.label}</span>
    </a>`).join('');

  const langHtml = s.languages.filter(l => l.unlocked).map(l => `
    <a class="lang-item unlocked" href="index.html?lang=${l.code}">
      <div class="left">${langIconHtml(l)}<span>${l.name}</span></div>
      <div class="dot"></div>
    </a>`).join('') + `<a class="lang-item" href="#" onclick="promptAddLanguage(); return false;" style="color:var(--primary)">
      <div class="left"><span class="material-symbols-outlined" style="font-size:20px">add</span><span>Add language</span></div>
    </a>`;

  return `
    <div class="sidebar-brand">
      <h1 class="display-lg" style="font-size:28px;line-height:1">Nhoma</h1>
      <p>${Sanctum.currentRank().name} • ${s.profile.streak} Day Streak</p>
    </div>
    <nav class="sidebar-nav">
      ${navHtml(NAV_ITEMS)}
      <div class="nav-section-label"><span>My Languages</span><a href="index.html" style="font-size:12px;font-weight:700;color:var(--primary)">See all</a></div>
      <div class="lang-list">${langHtml}</div>
      <div style="height:1px;background:rgba(141,147,135,0.2);margin:12px 8px"></div>
      ${navHtml(NAV_ITEMS_2)}
    </nav>
    <div class="sidebar-footer">
      <button class="btn-start" onclick="location.href='focus-timer.html'">Start Session</button>
      <a class="nav-item" href="themes.html"><span class="material-symbols-outlined">palette</span><span>Themes</span></a>
      <a class="nav-item" href="settings.html"><span class="material-symbols-outlined">settings</span><span>Settings</span></a>
      <a class="nav-item" href="#" onclick="signOut(); return false;"><span class="material-symbols-outlined">logout</span><span>Sign Out</span></a>
    </div>
  `;
}

let sanctumActiveKey = null;

function promptAddLanguage() {
  const name = prompt('What language do you want to add?');
  if (!name) return;
  const lang = Sanctum.addLanguage(name);
  if (lang) {
    Sanctum.toast(name + ' added to My Languages');
    const sidebar = document.getElementById('sanctum-sidebar');
    if (sidebar) sidebar.innerHTML = renderSidebar(sanctumActiveKey);
  }
}

function mountShell(activeKey) {
  sanctumActiveKey = activeKey;
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.id = 'sanctum-sidebar';
  sidebar.innerHTML = renderSidebar(activeKey);
  document.body.insertBefore(sidebar, document.body.firstChild);

  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  backdrop.id = 'sanctum-backdrop';
  document.body.insertBefore(backdrop, sidebar.nextSibling);

  const mobileBar = document.createElement('div');
  mobileBar.className = 'mobile-topbar';
  mobileBar.innerHTML = `
    <button id="sanctum-menu-btn" aria-label="Menu"><span class="material-symbols-outlined">menu</span></button>
    <h1 class="headline-md">Nhoma</h1>
  `;
  const main = document.querySelector('.main');
  if (main) main.insertBefore(mobileBar, main.firstChild);

  function toggleSidebar(open) {
    sidebar.classList.toggle('open', open);
    backdrop.classList.toggle('show', open);
  }
  document.getElementById('sanctum-menu-btn').addEventListener('click', () => toggleSidebar(true));
  backdrop.addEventListener('click', () => toggleSidebar(false));

  mountFloatingClock();
}

function mountFloatingClock() {
  const clock = document.createElement('div');
  clock.className = 'floating-clock';
  clock.title = 'Current time';
  clock.innerHTML = `
    <div class="clock-face">
      <div class="hand hand-hour" id="hand-hour"></div>
      <div class="hand hand-min" id="hand-min"></div>
      <div class="hand hand-sec" id="hand-sec"></div>
      <div class="clock-center"></div>
    </div>`;
  document.body.appendChild(clock);
  function tick() {
    const now = new Date();
    const s = now.getSeconds(), m = now.getMinutes(), h = now.getHours();
    document.getElementById('hand-sec').style.transform = `rotate(${(s / 60) * 360}deg)`;
    document.getElementById('hand-min').style.transform = `rotate(${(m / 60) * 360 + (s / 60) * 6}deg)`;
    document.getElementById('hand-hour').style.transform = `rotate(${(h % 12 / 12) * 360 + (m / 60) * 30}deg)`;
  }
  tick();
  setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuth();
  if (!session) return;

  if (!sessionStorage.getItem('sanctum_synced')) {
    await Sanctum.cloudPull();
    sessionStorage.setItem('sanctum_synced', '1');
    location.reload();
    return;
  }

  if (!Sanctum.state.profile.onboarded) {
    location.href = 'onboarding.html';
    return;
  }

  const key = document.body.dataset.page;
  mountShell(key);
});

/* ===== Sanctum auth helpers ===== */

// Waits for supabase-js to settle its INITIAL_SESSION state, which only
// fires after any pending OAuth redirect (e.g. Google's ?code=...) has been
// exchanged for a session. Calling sbClient.auth.getSession() immediately on
// page load can race ahead of that exchange and wrongly report "no session".
function getSession() {
  return new Promise((resolve) => {
    let settled = false;
    const { data: { subscription } } = sbClient.auth.onAuthStateChange((event, session) => {
      if (settled) return;
      if (event === 'INITIAL_SESSION' || session) {
        settled = true;
        subscription.unsubscribe();
        resolve(session);
      }
    });
    setTimeout(() => {
      if (settled) return;
      settled = true;
      subscription.unsubscribe();
      sbClient.auth.getSession().then(({ data }) => resolve(data.session));
    }, 4000);
  });
}

async function signUp(email, password) {
  return sbClient.auth.signUp({ email, password });
}

async function signIn(email, password) {
  return sbClient.auth.signInWithPassword({ email, password });
}

async function signOut() {
  await sbClient.auth.signOut();
  sessionStorage.removeItem('sanctum_synced');
  location.href = 'login.html';
}

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    const page = location.pathname.split('/').pop() || 'index.html';
    location.href = 'login.html?redirect=' + encodeURIComponent(page);
    return null;
  }
  return session;
}

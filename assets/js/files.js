/* ===== Sanctum document storage — Supabase Storage, per-user per-language ===== */
const SANCTUM_BUCKET = 'sanctum-documents';

async function currentUserId() {
  const { data: { session } } = await sbClient.auth.getSession();
  return session ? session.user.id : null;
}

async function addDocument(lang, file) {
  const uid = await currentUserId();
  if (!uid) throw new Error('Not signed in');
  const safeName = file.name.replace(/[^\w.\-]+/g, '_');
  const path = `${uid}/${encodeURIComponent(lang)}/${Date.now()}_${safeName}`;
  const { error } = await sbClient.storage.from(SANCTUM_BUCKET).upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (error) throw error;
  return { path, name: file.name, type: file.type, size: file.size };
}

async function listDocuments(lang) {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await sbClient.storage.from(SANCTUM_BUCKET).list(`${uid}/${encodeURIComponent(lang)}`, {
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error || !data) return [];
  return data.filter(f => f.name).map(f => ({
    path: `${uid}/${encodeURIComponent(lang)}/${f.name}`,
    name: f.name.replace(/^\d+_/, ''),
    size: f.metadata ? f.metadata.size : 0,
    type: f.metadata ? f.metadata.mimetype : '',
    addedAt: f.created_at ? new Date(f.created_at).getTime() : Date.now(),
  }));
}

async function deleteDocument(path) {
  await sbClient.storage.from(SANCTUM_BUCKET).remove([path]);
}

async function getDocument(path) {
  const { data, error } = await sbClient.storage.from(SANCTUM_BUCKET).download(path);
  if (error || !data) return null;
  const name = path.split('/').pop().replace(/^\d+_/, '');
  return { path, name, type: data.type, size: data.size, blob: data };
}

function fmtBytes(n) {
  if (!n) return '0 B';
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return Math.round(n / 1024) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ===== Sanctum Supabase project (reuses the user's existing free-tier project) ===== */
const SANCTUM_SUPABASE_URL = 'https://ruwuvwqsrenluygvigox.supabase.co';
const SANCTUM_SUPABASE_KEY = 'sb_publishable_XFMGI1GqaBvuv_TsVNEXJQ_dYrRoqQ6';
const sbClient = supabase.createClient(SANCTUM_SUPABASE_URL, SANCTUM_SUPABASE_KEY);

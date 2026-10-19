/**
 * OREOS DELICACIES - Supabase Configuration & Optional Cloud Sync
 * Works fully offline by default, and seamlessly connects to Supabase when credentials are provided.
 */

const SUPABASE_CONFIG_KEY = 'oreos_supabase_keys_v1';

export function getSupabaseCredentials() {
  try {
    const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  // Optional global window injection
  if (window.OREOS_SUPABASE_URL && window.OREOS_SUPABASE_ANON_KEY) {
    return {
      url: window.OREOS_SUPABASE_URL,
      key: window.OREOS_SUPABASE_ANON_KEY
    };
  }

  return {
    url: '',
    key: ''
  };
}

export function saveSupabaseCredentials(url, key) {
  try {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url: url.trim(), key: key.trim() }));
    return true;
  } catch (e) {
    return false;
  }
}

export function getSupabaseClient() {
  const creds = getSupabaseCredentials();
  if (creds.url && creds.key && window.supabase && typeof window.supabase.createClient === 'function') {
    return window.supabase.createClient(creds.url, creds.key);
  }
  return null;
}

export async function testSupabaseConnection() {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'No Supabase credentials configured. Running in Local Storage Mode.' };
  }

  try {
    const { data, error } = await client.from('site_settings').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully connected to Supabase database!' };
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed' };
  }
}

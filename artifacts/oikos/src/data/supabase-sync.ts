import { supabase } from './supabase';

const OIKOS_PREFIX = 'oikos-';

let syncReady = false;
let syncPromise: Promise<void> | null = null;

const retryQueue: Map<string, string> = new Map();
let retryTimer: ReturnType<typeof setTimeout> | null = null;

function isOikosKey(key: string): boolean {
  return key.startsWith(OIKOS_PREFIX);
}

function scheduleRetry() {
  if (retryTimer) return;
  retryTimer = setTimeout(async () => {
    retryTimer = null;
    if (retryQueue.size === 0) return;
    await flushRetryQueue();
  }, 5000);
}

async function flushRetryQueue() {
  if (!supabase || retryQueue.size === 0) return;

  const entries = Array.from(retryQueue.entries());
  retryQueue.clear();

  const rows = entries.map(([key, rawValue]) => {
    let value: unknown;
    try { value = JSON.parse(rawValue); } catch { value = rawValue; }
    return { key, value, updated_at: new Date().toISOString() };
  });

  const { error } = await supabase
    .from('kv_store')
    .upsert(rows, { onConflict: 'key' });

  if (error) {
    console.warn('Supabase retry flush error:', error.message);
    for (const [key, val] of entries) {
      retryQueue.set(key, val);
    }
    scheduleRetry();
  }
}

function pushToSupabase(key: string, rawValue: string) {
  if (!supabase) return;

  let value: unknown;
  try { value = JSON.parse(rawValue); } catch { value = rawValue; }

  supabase
    .from('kv_store')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .then(({ error }) => {
      if (error) {
        console.warn(`Supabase sync error for ${key}:`, error.message);
        retryQueue.set(key, rawValue);
        scheduleRetry();
      }
    });
}

function removeFromSupabase(key: string) {
  if (!supabase) return;
  supabase
    .from('kv_store')
    .delete()
    .eq('key', key)
    .then(({ error }) => {
      if (error) console.warn(`Supabase delete error for ${key}:`, error.message);
    });
}

function patchLocalStorage() {
  const originalSetItem = localStorage.setItem.bind(localStorage);
  const originalRemoveItem = localStorage.removeItem.bind(localStorage);

  localStorage.setItem = (key: string, value: string) => {
    originalSetItem(key, value);
    if (syncReady && isOikosKey(key)) {
      pushToSupabase(key, value);
    }
  };

  localStorage.removeItem = (key: string) => {
    originalRemoveItem(key);
    if (syncReady && isOikosKey(key)) {
      removeFromSupabase(key);
    }
  };
}

async function pullFromSupabase(): Promise<void> {
  if (!supabase) return;

  const { data, error } = await supabase
    .from('kv_store')
    .select('key, value')
    .like('key', `${OIKOS_PREFIX}%`);

  if (error) {
    console.warn('Supabase pull error:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    await pushAllToSupabase();
    return;
  }

  const originalSetItem = Storage.prototype.setItem.bind(localStorage);
  for (const row of data) {
    const val = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);
    originalSetItem(row.key, val);
  }
}

async function pushAllToSupabase(): Promise<void> {
  if (!supabase) return;

  const rows: { key: string; value: unknown; updated_at: string }[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !isOikosKey(key)) continue;
    const raw = localStorage.getItem(key);
    if (raw === null) continue;

    let value: unknown;
    try { value = JSON.parse(raw); } catch { value = raw; }
    rows.push({ key, value, updated_at: now });
  }

  if (rows.length === 0) return;

  const { error } = await supabase
    .from('kv_store')
    .upsert(rows, { onConflict: 'key' });

  if (error) console.warn('Supabase initial push error:', error.message);
}

function setupVisibilitySync() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && syncReady) {
      pullFromSupabase();
    }
    if (document.visibilityState === 'hidden') {
      flushRetryQueue();
    }
  });

  window.addEventListener('focus', () => {
    if (syncReady) pullFromSupabase();
  });

  window.addEventListener('beforeunload', () => {
    flushRetryQueue();
  });

  setInterval(() => {
    if (syncReady) pullFromSupabase();
  }, 30_000);
}

export async function initSupabaseSync(): Promise<void> {
  if (syncPromise) return syncPromise;

  syncPromise = (async () => {
    patchLocalStorage();

    if (!supabase) {
      syncReady = true;
      return;
    }

    try {
      await pullFromSupabase();
    } catch (err) {
      console.warn('Supabase sync initialization failed:', err);
    }

    syncReady = true;
    setupVisibilitySync();
  })();

  return syncPromise;
}

export function isSyncReady(): boolean {
  return syncReady;
}

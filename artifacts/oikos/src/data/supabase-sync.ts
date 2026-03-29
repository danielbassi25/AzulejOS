import { supabase } from './supabase';

const OIKOS_PREFIX = 'oikos-';
const TS_PREFIX = 'oikos-ts-';

let syncReady = false;
let syncPromise: Promise<void> | null = null;
let lastSyncOk: boolean | null = null;

export function getSyncStatus(): 'pending' | 'ok' | 'error' | 'offline' {
  if (!syncReady) return 'pending';
  if (lastSyncOk === false) return 'error';
  return 'ok';
}

function isOikosKey(key: string): boolean {
  return key.startsWith(OIKOS_PREFIX) && !key.startsWith(TS_PREFIX);
}

function getTsKey(key: string): string {
  return TS_PREFIX + key;
}

function getLocalTs(key: string): number {
  return Number(localStorage.getItem(getTsKey(key)) || '0');
}

function setLocalTs(key: string, ts: number) {
  Storage.prototype.setItem.call(localStorage, getTsKey(key), String(ts));
}

function pushToSupabase(key: string, rawValue: string) {
  if (!supabase) return;
  const now = Date.now();
  setLocalTs(key, now);

  let value: unknown;
  try { value = JSON.parse(rawValue); } catch { value = rawValue; }

  supabase
    .from('kv_store')
    .upsert({ key, value, updated_at: new Date(now).toISOString() }, { onConflict: 'key' })
    .then(({ error }) => {
      if (error) {
        console.warn(`Supabase sync error for ${key}:`, error.message);
        lastSyncOk = false;
      } else {
        lastSyncOk = true;
      }
    });
}

function removeFromSupabase(key: string) {
  if (!supabase) return;
  supabase.from('kv_store').delete().eq('key', key).then();
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
    .select('key, value, updated_at')
    .like('key', `${OIKOS_PREFIX}%`);

  if (error) {
    console.warn('Supabase pull error:', error.message);
    lastSyncOk = false;
    return;
  }

  lastSyncOk = true;

  if (!data || data.length === 0) {
    await pushAllToSupabase();
    return;
  }

  const originalSetItem = Storage.prototype.setItem.bind(localStorage);

  for (const row of data) {
    const remoteTs = row.updated_at ? new Date(row.updated_at).getTime() : 0;
    const localTs = getLocalTs(row.key);

    // Only overwrite local if remote is newer (or local has no timestamp)
    if (remoteTs >= localTs) {
      const val = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);
      originalSetItem(row.key, val);
      setLocalTs(row.key, remoteTs);
    }
  }

  // Push any local keys that are newer than what Supabase had
  const remoteKeys = new Set(data.map(r => r.key));
  const remoteByKey: Record<string, number> = {};
  for (const row of data) {
    remoteByKey[row.key] = row.updated_at ? new Date(row.updated_at).getTime() : 0;
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !isOikosKey(key)) continue;
    const localTs = getLocalTs(key);
    const remoteTs = remoteByKey[key] ?? 0;

    if (!remoteKeys.has(key) || localTs > remoteTs) {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        let value: unknown;
        try { value = JSON.parse(raw); } catch { value = raw; }
        supabase.from('kv_store').upsert(
          { key, value, updated_at: new Date(localTs || Date.now()).toISOString() },
          { onConflict: 'key' }
        ).then();
      }
    }
  }
}

async function pushAllToSupabase(): Promise<void> {
  if (!supabase) return;

  const rows: { key: string; value: unknown; updated_at: string }[] = [];
  const now = Date.now();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !isOikosKey(key)) continue;
    const raw = localStorage.getItem(key);
    if (raw === null) continue;

    let value: unknown;
    try { value = JSON.parse(raw); } catch { value = raw; }
    const localTs = getLocalTs(key) || now;
    rows.push({ key, value, updated_at: new Date(localTs).toISOString() });
  }

  if (rows.length === 0) return;

  const { error } = await supabase.from('kv_store').upsert(rows, { onConflict: 'key' });
  if (error) console.warn('Supabase initial push error:', error.message);
}

function setupBackgroundSync() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && syncReady) {
      pullFromSupabase();
    }
  });

  window.addEventListener('focus', () => {
    if (syncReady) pullFromSupabase();
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
    setupBackgroundSync();
  })();

  return syncPromise;
}

export function isSyncReady(): boolean {
  return syncReady;
}

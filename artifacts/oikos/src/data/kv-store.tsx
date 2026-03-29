import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';

export type KVData = Record<string, unknown>;

interface KVContextType {
  data: KVData;
  set: (key: string, value: unknown) => Promise<void>;
  remove: (key: string) => Promise<void>;
  loading: boolean;
  syncError: boolean;
}

const KVContext = createContext<KVContextType | null>(null);

async function upsertRow(key: string, value: unknown): Promise<boolean> {
  const { error } = await supabase
    .from('kv_store')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) {
    console.error('[KV] upsert failed', key, error.message);
    return false;
  }
  return true;
}

async function upsertWithRetry(key: string, value: unknown): Promise<boolean> {
  const ok = await upsertRow(key, value);
  if (ok) return true;
  await new Promise(r => setTimeout(r, 2000));
  return upsertRow(key, value);
}

export function KVProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<KVData>({});
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(false);
  const prevData = useRef<KVData>({});

  const fetchAll = useCallback(async () => {
    const { data: rows, error } = await supabase
      .from('kv_store')
      .select('key, value')
      .like('key', 'oikos-%');
    if (error) {
      console.error('[KV] fetch failed', error.message);
      return;
    }
    const kv: KVData = {};
    if (rows) {
      for (const row of rows) {
        kv[row.key] = row.value;
      }
    }
    prevData.current = kv;
    setData(kv);
    setSyncError(false);
  }, []);

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));
    const interval = setInterval(fetchAll, 30_000);
    const onVisible = () => { if (document.visibilityState === 'visible') fetchAll(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [fetchAll]);

  const set = useCallback(async (key: string, value: unknown) => {
    const previous = prevData.current[key];
    prevData.current = { ...prevData.current, [key]: value };
    setData(prev => ({ ...prev, [key]: value }));
    setSyncError(false);

    const ok = await upsertWithRetry(key, value);
    if (!ok) {
      console.error('[KV] write ultimately failed, rolling back', key);
      prevData.current = { ...prevData.current, [key]: previous };
      setData(prev => {
        const next = { ...prev };
        if (previous === undefined) delete next[key];
        else next[key] = previous;
        return next;
      });
      setSyncError(true);
    }
  }, []);

  const remove = useCallback(async (key: string) => {
    const previous = prevData.current[key];
    prevData.current = { ...prevData.current };
    delete prevData.current[key];
    setData(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    const { error } = await supabase.from('kv_store').delete().eq('key', key);
    if (error) {
      console.error('[KV] delete failed', key, error.message);
      prevData.current = { ...prevData.current, [key]: previous };
      setData(prev => ({ ...prev, [key]: previous }));
      setSyncError(true);
    }
  }, []);

  return (
    <KVContext.Provider value={{ data, set, remove, loading, syncError }}>
      {syncError && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: '#c0392b', color: '#fff',
          fontFamily: 'system-ui, sans-serif', fontSize: '13px',
          textAlign: 'center', padding: '8px 16px',
        }}>
          Could not save — check your connection and try again.
        </div>
      )}
      {children}
    </KVContext.Provider>
  );
}

export function useKV(): KVContextType {
  const ctx = useContext(KVContext);
  if (!ctx) throw new Error('useKV must be used within KVProvider');
  return ctx;
}

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

export type KVData = Record<string, unknown>;

interface KVContextType {
  data: KVData;
  set: (key: string, value: unknown) => Promise<void>;
  remove: (key: string) => Promise<void>;
  loading: boolean;
}

const KVContext = createContext<KVContextType | null>(null);

export function KVProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<KVData>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const { data: rows } = await supabase
      .from('kv_store')
      .select('key, value')
      .like('key', 'oikos-%');
    const kv: KVData = {};
    if (rows) {
      for (const row of rows) {
        kv[row.key] = row.value;
      }
    }
    setData(kv);
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
    setData(prev => ({ ...prev, [key]: value }));
    await supabase
      .from('kv_store')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  }, []);

  const remove = useCallback(async (key: string) => {
    setData(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    await supabase.from('kv_store').delete().eq('key', key);
  }, []);

  return (
    <KVContext.Provider value={{ data, set, remove, loading }}>
      {children}
    </KVContext.Provider>
  );
}

export function useKV(): KVContextType {
  const ctx = useContext(KVContext);
  if (!ctx) throw new Error('useKV must be used within KVProvider');
  return ctx;
}

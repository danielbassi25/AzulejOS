import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://avbcyourzilgvunaeaqm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2YmN5b3VyemlsZ3Z1bmFlYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MTc0NDcsImV4cCI6MjA5MDE5MzQ0N30.7FRFIHrnUAi4M-sQpszrQgneQtnY3uJfwe_SfoWmOW8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

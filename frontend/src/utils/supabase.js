import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = (() => {
  if (!window.supabaseClient) {
    window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return window.supabaseClient;
})();

export { supabase };
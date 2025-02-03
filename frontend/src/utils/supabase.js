import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase_URLまたはANON_KEYが設定されていません。環境変数を確認してください。");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
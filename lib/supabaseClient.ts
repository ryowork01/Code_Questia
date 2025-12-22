import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // セッション情報をローカルストレージに保存
    autoRefreshToken: true, // トークンの自動更新を有効化
    detectSessionInUrl: true, // URLからセッション情報を検出
  },
});


export { createClient };


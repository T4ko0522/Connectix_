import { supabase } from "../utils/supabase";

export const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.error("Google Sign-In Error:", error.message);
    return;
  }

  // Supabaseの認証状態を監視し、ログイン完了後に処理を実行
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session) {
      const token = session.access_token;

      if (token) {
        try {
          // バックエンドに送信してJWTを取得
          // TODO 実装時
          // const response = await fetch("https://connectix-server.vercel.app/auth/google-auth", {
          const response = await fetch("http://localhost:3522/auth/google-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          const result = await response.json();

          if (result.jwt) {
            // JWTをlocalStorageに保存
            localStorage.setItem("auth_token", result.jwt);
          }
        } catch (err) {
          console.error("JWT取得エラー:", err);
        }
      }
    }
  });
};

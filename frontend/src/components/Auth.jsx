import { supabase } from "../utils/supabase";

export const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/auth/callback", // ✅ 修正：リダイレクトURLを指定
    },
  });

  if (error) {
    console.error("Google Sign-In Error:", error.message);
    return;
  }
};

// ✅ Google認証後のURLからトークンを取得して処理する関数
export const handleAuthCallback = async () => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1)); // "#access_token=..." をパース
  const accessToken = hashParams.get("access_token");

  if (accessToken) {
    localStorage.setItem("supabase_token", accessToken); // ✅ Supabaseのトークンを保存

    try {
      // 🔵 バックエンドにJWTをリクエスト
      const response = await fetch("https://connectix-server.vercel.app/auth/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: accessToken }),
      });

      const result = await response.json();

      if (result.jwt) {
        localStorage.setItem("jwt_token", result.jwt); // ✅ JWTをlocalStorageに保存
        window.location.replace("/"); // ✅ ホーム画面にリダイレクト
      } else {
        console.error("JWTの取得に失敗:", result);
      }
    } catch (err) {
      console.error("Google Auth コールバックエラー:", err);
    }
  }
};
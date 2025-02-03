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
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get("access_token");

  if (!accessToken) {
    console.error("Google Auth 失敗: access_token が見つかりません");
    return;
  }

  localStorage.setItem("supabase_token", accessToken); // ✅ Supabase のトークンを保存

  try {
    const response = await fetch("https://connectix-server.vercel.app/api/auth/google_auth", { // ✅ 修正
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: accessToken }),
    });

    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const result = await response.json();

    if (result.jwt) {
      localStorage.setItem("jwt_token", result.jwt);
      window.location.replace("/"); // ✅ ホーム画面にリダイレクト
    } else {
      console.error("JWTの取得に失敗:", result);
    }
  } catch (err) {
    console.error("Google Auth コールバックエラー:", err);
  }
};
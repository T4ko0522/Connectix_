import express from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import crypto from "crypto";
import { sendVerificationEmail } from "./verify.js"; 
import { authenticateToken } from "../utils/jwt.js"; // 追加

// ローカル
dotenv.config({ path: '../config/.env' });
//Vercel
// dotenv.config();

const router = express.Router();
const saltRounds = 12;
const SUPABASE_URL = process.env.SUPABASE_URL || "SUPABASE_URL";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY  || "SUPABASE_ANON_KEY";
const forbiddenWords = [
    "admin","staff","moderator","official",
    "home","about","contact","dashboard","update","sign-in","sign-up","sign-out","settings","profile","account","user","auth","verify","reset","forgot","forgot-password","reset-password",
]

console.log("🔍Supabase_Anon_Key :", SUPABASE_ANON_KEY)
console.log("🔍Supabase_URL :", SUPABASE_URL)

const isValidUsername = (username) => {
  if (username.length < 3 || username.length > 30) return false; // 長すぎる・短すぎる
  if (!/^[a-zA-Z0-9ぁ-んァ-ヶー一-龠]+$/.test(username)) return false; // 記号含む場合
  return true;
};

// Sign Up
router.post("/sign_up", async (req, res) => {
    const { name, email, password } = req.body;

    // 🚫 ワードチェック
    if (!isValidUsername(name) || forbiddenWords.includes(name.toLowerCase())) {
      return res.status(400).json({ message: "このユーザー名は使用できません。" });
    }

    try {
        // 既に登録済みかチェック
        const { rows: existingUser } = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "このメールアドレスは既に登録されています。" });
        }

        // 認証用トークン生成
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 仮登録（認証前）
        await db.query(
            "INSERT INTO users (username, email, password_hash, verification_token, is_verified) VALUES ($1, $2, $3, $4, $5)",
            [name, email, hashedPassword, verificationToken, false]
        );

        // 認証メールを送信
        await sendVerificationEmail(email, verificationToken);

        res.status(200).json({ message: "認証メールを送信しました。" });

    } catch (error) {
        console.error("ユーザー登録エラー:", error);
        res.status(500).json({ message: "サーバーエラー" });
    }
});

// 📌 認証済みのユーザーのみログインできるようにする
router.post("/sign_in", async (req, res) => {
    const { email, password } = req.body;

    try {
        const { rows: userResult } = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userResult.length === 0) {
            return res.status(401).json({ message: "メールアドレスまたはパスワードが間違っています。" });
        }

        const user = userResult[0];

        // 認証チェック
        if (!user.is_verified) {
            return res.status(401).json({ message: "メールアドレスが未認証です。" });
        }

        // パスワード検証
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "メールアドレスまたはパスワードが間違っています。" });
        }

        // JWTトークンを発行
        const token = generateToken({ id: user.id, email: user.email });

        res.status(200).json({ message: "サインイン成功", token });
    } catch (error) {
        console.error("ログインエラー:", error);
        res.status(500).json({ message: "サーバーエラー" });
    }
});

// Google Auth
router.post("/google_auth", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    console.error("❌ Google Auth 失敗: トークンが提供されていません");
    return res.status(400).json({ message: "トークンが提供されていません。" });
  }

  console.log("✅ 受け取ったトークン:", token);

  try {
    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apiKey: SUPABASE_ANON_KEY,
      },
    });

    if (!userResponse.ok) {
      console.error("❌ Supabase 認証エラー:", await userResponse.text());
      return res.status(401).json({ message: "Supabase 認証エラー" });
    }

    const user = await userResponse.json();
    console.log("✅ Supabase ユーザー:", user);

    if (!user || !user.email) {
      return res.status(401).json({ message: "無効なユーザー情報" });
    }

    let userId;
    const { rows: existingUser } = await db.query("SELECT * FROM users WHERE email = $1", [user.email]);

    if (existingUser.length > 0) {
      userId = existingUser[0].id;
    } else {
      const newUser = await db.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
        [user.email.split("@")[0], user.email, "GOOGLE_AUTH"]
      );
      userId = newUser.rows[0].id;
    }

    const jwtToken = generateToken({ id: userId, email: user.email });

    res.json({ jwt: jwtToken });
  } catch (error) {
    console.error("❌ Google認証エラー:", error);
    res.status(500).json({ message: "Google 認証に失敗しました。" });
  }
});

router.get("/username", authenticateToken, async (req, res) => {
  try {
    console.log("✅ /username エンドポイントにリクエストが来ました");
    console.log("🔍 認証されたユーザー:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "認証情報が不正です" });
    }

    const { rows } = await db.query("SELECT username FROM Users WHERE id = $1", [req.user.id]);
    console.log("📌 クエリ結果:", rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ユーザーが見つかりません。" });
    }

    res.json({ username: rows[0].username });
  } catch (error) {
    console.error("❌ ユーザー名取得エラー:", error);
    res.status(500).json({ message: "サーバーエラー" });
  }
});

export default router;
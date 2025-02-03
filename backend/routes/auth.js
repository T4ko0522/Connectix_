import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from 'dotenv';

dotenv.config({ path: '../config/.env' });

const router = express.Router();
const saltRounds = 12;
const JWT_Secret = process.env.JWT_Secret || "JWT_Secret";
const SUPABASE_URL = process.env.SUPABASE_URL || "SUPABASE_URL";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY  || "SUPABASE_ANON_KEY";

// Sign Up
router.post("/sign_up", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // メールが既に登録されているか確認
    const { rows: existingUser } = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "このメールアドレスは既に登録されています。" });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // データベースに保存
    await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "ユーザー登録が完了しました。" });
  } catch (error) {
    // 重複エラーをハンドリング（※PostgreSQL用に修正が必要な場合あり）
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage?.includes('Users.username')) {
      console.error("ユーザー名重複エラー:", error);
      return res.status(400).json({ message: "このユーザー名は既に使用されています。" });
    }

    console.error("ユーザー登録エラー:", error);
    res.status(500).json({ message: "サーバーエラー" });
  }
});

// Sign In
router.post("/sign_in", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔍 リクエスト内容:", req.body);

    // ユーザーをデータベースから取得 (PostgreSQL 形式)
    const { rows: userResult } = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    console.log("🔍 データベース結果:", userResult);

    // ユーザーが存在しない場合
    if (userResult.length === 0) {
      return res.status(401).json({ message: "メールアドレスまたはパスワードが間違っています。" });
    }

    const user = userResult[0];

    // パスワードを検証（bcrypt）
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log("🔍 パスワード一致:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "メールアドレスまたはパスワードが間違っています。" });
    }

    // JWT トークンを発行
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_Secret,
      { expiresIn: "1h" }
    );
    console.log("🔍 JWT トークン:", token);

    // サインイン成功
    res.status(200).json({ message: "サインイン成功", token });
  } catch (error) {
    console.error("ログインエラー:", error); // 詳細ログを出力
    res.status(500).json({ message: "サーバーエラー" });
  }
});

// Google Auth
router.post("/google-auth", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "トークンが提供されていません。" });
  }

  try {
    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apiKey: SUPABASE_ANON_KEY,
      },
    });

    if (!userResponse.ok) {
      return res.status(401).json({ message: "Supabase 認証エラー" });
    }

    const user = await userResponse.json();

    if (!user || !user.email) {
      return res.status(401).json({ message: "無効なユーザー情報" });
    }

    const { rows: existingUser } = await db.query("SELECT * FROM users WHERE email = $1", [user.email]);

    let userId;
    if (existingUser.length > 0) {
      userId = existingUser[0].id;
    } else {
      const newUser = await db.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
        [user.email.split("@")[0], user.email, "GOOGLE_AUTH"]
      );
      userId = newUser.rows[0].id;
    }

    const jwtToken = jwt.sign({ id: userId, email: user.email }, JWT_Secret, { expiresIn: "1h" });

    res.json({ jwt: jwtToken });
  } catch (error) {
    console.error("Google認証エラー:", error);
    res.status(500).json({ message: "Google 認証に失敗しました。" });
  }
});

export default router;
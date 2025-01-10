import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from 'dotenv';

dotenv.config({ path: '../config/.env' });

const router = express.Router();
const saltRounds = 12; // 強度を上げる（SHA-256用に調整）
const JWT_SECRET = process.env.JWT_SECRET || "JWT_Secret"; // JWTキー

// Sign Up
router.post("/sign_up", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // メールが既に登録されているか確認
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "このメールアドレスは既に登録されています。" });
    }

    // パスワードのハッシュ化（強度を向上）
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // データベースに保存
    await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "ユーザー登録が完了しました。" });
  } catch (error) {
    console.error("ユーザー登録エラー:", error);
    res.status(500).json({ message: "サーバーエラー" });
  }
});

// Sign In
router.post("/sign_in", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ユーザーをデータベースから取得
    const [userResult] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    // ユーザーが存在しない場合
    if (userResult.length === 0) {
      return res.status(401).json({ message: "メールアドレスまたはパスワードが間違っています。" });
    }

    const user = userResult[0];

    // パスワードを検証（bcrypt + SHA-256）
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "メールアドレスまたはパスワードが間違っています。" });
    }

    // JWT トークンを発行
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // トークンの有効期限を1時間に設定
    );

    // ログイン成功
    res.status(200).json({ message: "ログイン成功", token });

  } catch (error) {
    console.error("ログインエラー:", error);
    res.status(500).json({ message: "サーバーエラー" });
  }
});

export default router;
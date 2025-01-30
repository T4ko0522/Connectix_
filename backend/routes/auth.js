import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from 'dotenv';

dotenv.config({ path: '../config/.env' });

const router = express.Router();
const saltRounds = 12; // 強度を上げる（SHA-256用に調整）
const JWT_SECRET = process.env.JWT_Secret || "JWT_Secret"; // JWTキー

// Sign Up
router.post("/sign_up", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // メールが既に登録されているか確認
    const { rows: existingUser } = await db.query("SELECT * FROM Users WHERE email = $1", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "このメールアドレスは既に登録されています。" });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // データベースに保存
    await db.query(
      "INSERT INTO Users (username, email, password_hash) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "ユーザー登録が完了しました。" });
  } catch (error) {
    // 重複エラーをハンドリング
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('Users.username')) {
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

    // ユーザーをデータベースから取得
    const [userResult] = await db.query("SELECT * FROM Users WHERE email = ?", [email]); // 修正:テーブル名を大文字に変更
    console.log("🔍 データベース結果:", userResult);

    // ユーザーが存在しない場合
    if (userResult.length === 0) {
      return res.status(401).json({ message: "メールアドレスまたはパスワードが間違っています。" });
    }

    const user = userResult[0];

    // パスワードを検証（bcrypt + SHA-256）
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log("🔍 パスワード一致:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "メールアドレスまたはパスワードが間違っています。" });
    }

    // JWT トークンを発行
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
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

export default router;
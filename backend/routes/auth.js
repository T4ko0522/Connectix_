import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from 'dotenv';

dotenv.config({ path: '../config/.env' });

const router = express.Router();
const saltRounds = 8; // パスワードの強度
const JWT_SECRET = process.env.JWT_SECRET || "JWT_Secret"; // JWTキー

// Sign Up
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // メールが既に登録されているか確認
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "このメールアドレスは既に登録されています。" });
    }

    // パスワードのハッシュ化
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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ユーザー確認
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) {
      return res.status(401).json({ message: "メールアドレスまたはパスワードが間違っています。" });
    }

    // パスワードの照合
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "メールアドレスまたはパスワードが間違っています。" });
    }

    // JWTトークン生成
    const token = jwt.sign({ id: user[0].id, username: user[0].username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "ログイン成功", token });
  } catch (error) {
    console.error("ログインエラー:", error);
    res.status(500).json({ message: "サーバーエラー" });
  }
});

//  デバッグ
// console.log(JWT_SECRET)

export default router;
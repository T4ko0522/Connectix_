import express from "express";
import nodemailer from "nodemailer";
// import crypto from "crypto";
import db from "../config/db.js";
import dotenv from "dotenv"

// dotenv.config();
dotenv.config({ path: '/usr/src/app/config/.env' });

console.log("📌 SMTP_HOST:", process.env.SMTP_HOST);
console.log("📌 SMTP_PORT:", process.env.SMTP_PORT);
console.log("📌 SMTP_USER:", process.env.SMTP_USER);
console.log("📌 SMTP_PASS:", process.env.SMTP_PASS ? "*****" : "未設定");

const router = express.Router();
export const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST.trim(),
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER.trim(),
            pass: process.env.SMTP_PASS.trim(),
        },
        tls: {
            rejectUnauthorized: false // 証明書のエラーを無視
        }
    });

    const verificationLink = `http://localhost:3522/api/verify/verify_email?token=${token}`;

    await transporter.sendMail({
        from: `"認証システム" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "メールアドレスの確認",
        html: `<p>以下のリンクをクリックしてメールアドレスを確認してください:</p>
               <a href="${verificationLink}">メール認証</a>`,
    });
};

// 📌 メール認証処理
router.get("/verify_email", async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: "トークンが見つかりません。" });
    }

    try {
        // トークンを検証
        const { rows } = await db.query(
            "SELECT id FROM users WHERE verification_token = $1",
            [token]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "無効なトークンです。" });
        }

        // ユーザーを認証済みにする
        await db.query(
            "UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1",
            [rows[0].id]
        );

        res.json({ message: "メール認証が完了しました！" });
    } catch (error) {
        console.error("メール認証エラー:", error);
        res.status(500).json({ message: "認証に失敗しました。" });
    }
});

export default router;
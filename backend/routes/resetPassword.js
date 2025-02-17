import express from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = express.Router();
const saltRounds = 12;

// 📌 1. パスワードリセットリクエスト（メール送信）
router.post("/request-reset", async (req, res) => {
    const { email } = req.body;
    console.log("🔍 受信したリクエストのメールアドレス:", email);  // 🛠 デバッグ用

    try {
        // 📌 メールアドレスが登録されているかチェック（大文字小文字を無視）
        const { rows } = await db.query("SELECT id, is_verified FROM users WHERE LOWER(email) = LOWER($1)", [email]);
        console.log("🗄 取得したデータ:", rows); 

        if (rows.length === 0) {
            return res.status(400).json({ message: "このメールアドレスは登録されていません。" });
        }

        // 📌 is_verified = false の場合、リセットを拒否
        if (!rows[0].is_verified) {
            return res.status(400).json({ message: "このアカウントは未認証のため、パスワードをリセットできません。" });
        }

        // 📌 リセットトークンを生成
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1時間後に失効

        // 📌 データベースにトークンを保存
        await db.query(
            "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3", 
            [resetTokenHash, resetTokenExpiry, rows[0].id]
        );

        // 📌 メール送信
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const resetLink = `https://connectix-xi.vercel.app/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: `"サポート" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "パスワードリセット",
            html: `<p>以下のリンクをクリックして、パスワードをリセットしてください。</p>
                   <a href="${resetLink}">パスワードをリセット</a>
                   <p>このリンクは1時間後に無効になります。</p>`,
        });

        res.json({ message: "パスワードリセットのリンクを送信しました。" });
    } catch (error) {
        console.error("パスワードリセットリクエストエラー:", error);
        res.status(500).json({ message: "サーバーエラー" });
    }
});

// 📌 2. パスワードリセット（新しいパスワードを設定）
router.post("/reset", async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // 📌 トークンをハッシュ化して検索
        const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const { rows } = await db.query(
            "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()", 
            [resetTokenHash]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "無効または期限切れのリセットトークンです。" });
        }

        // 📌 新しいパスワードをハッシュ化
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // 📌 パスワードを更新し、トークンを削除
        await db.query(
            "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2", 
            [hashedPassword, rows[0].id]
        );

        res.json({ message: "パスワードがリセットされました。" });
    } catch (error) {
        console.error("パスワードリセットエラー:", error);
        res.status(500).json({ message: "サーバーエラー" });
    }
});

export default router;
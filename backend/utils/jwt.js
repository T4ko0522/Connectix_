import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//LINK - Local
// dotenv.config({ path: path.resolve(__dirname, "../config/.env") });
//Vercel
dotenv.config();

const secretKey = process.env.JWT_Secret;

export function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '72h' });
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "認証エラー: トークンがありません" });
    console.log("🔍 受け取ったヘッダー:", authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: "認証エラー: トークンがありません" });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: "認証エラー: トークンの形式が不正" });
    }

    const token = tokenParts[1];

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                console.error("❌ JWT 期限切れ:", err);
                return res.status(401).json({ message: "認証エラー: トークンの有効期限が切れました。再ログインしてください。" });
            }
            console.error("❌ JWT 検証エラー:", err);
            return res.status(403).json({ message: "認証エラー: 無効なトークン" });
        }
        req.user = user;
        next();
    });    
}
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, "../config/.env") });

const secretKey = process.env.JWT_Secret;

// debug
console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET);

export function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "認証エラー: トークンがありません" });

    const token = authHeader.split(' ')[1]; 
    if (!token) return res.status(401).json({ message: "認証エラー: トークンの形式が不正" });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: "認証エラー: 無効なトークン" });

        req.user = user;
        next();
    });
}
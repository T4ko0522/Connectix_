import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import log4js from "log4js";
import { fileURLToPath } from "url";
import pool from "./config/db.js"; // db接続
import authRoutes from "./routes/auth.js"; // 認証

// TODO 未実装
// import profileRoutes from "./routes/profile.js"; // プロフィール
// import linkRoutes from "./routes/links.js"; // リンク管理

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./config/.env") });

console.log("🔍 DATABASE_HOST:", process.env.DATABASE_HOST);

// log4jsの設定
log4js.configure(path.resolve(__dirname, "./log4js-config.json"));
const logger = log4js.getLogger();

// Expressアプリケーション
const app = express();

// ミドルウェア設定
app.use(express.json());
app.use(cors());

// APIルートの登録
app.use("/api/auth", authRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/links", linkRoutes);

// サーバー起動
const PORT = process.env.PORT || 7293;
app.listen(PORT, () => {
  logger.info(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
});

// データベース接続確認（修正済み）
db.query("SELECT 1", (err, results) => {
  if (err) {
    logger.error("データベース接続エラー:", err);
    console.error("データベース接続エラー:", err);
    return;
  }
  logger.info("✅ データベースに接続しました");
  console.log("✅ データベースに接続しました");
});

// debug
app.get("/", (req, res) => {
  res.send("クローンサーバーが動作中");
});
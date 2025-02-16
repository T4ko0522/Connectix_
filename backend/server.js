import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import log4js from "log4js";
import { fileURLToPath } from "url";
import pool from "./config/db.js"; // db接続
import authRoutes from "./routes/auth.js"; // 認証
import verifyRoutes from "./routes/verify.js"; // メール認証
import passwordResetRoutes from "./routes/resetPassword.js"; // パスワードリセット

// TODO 未実装
// import profileRoutes from "./routes/profile.js"; // プロフィール
// import linkRoutes from "./routes/links.js"; // リンク管理

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ローカル環境
// dotenv.config({ path: path.resolve(__dirname, "./config/.env") });
// Vercel環境
dotenv.config();

console.log("🔍 POSTGRES_URL:", process.env.POSTGRES_URL);

// log4jsの設定
log4js.configure(path.resolve(__dirname, "./log4js-config.json"));
const logger = log4js.getLogger();

const app = express();

app.use(express.json());
app.use(cors());

// APIの登録
app.use("/api/auth", authRoutes);
app.use("/api/verify", verifyRoutes); // ✅ メール認証APIを統合
app.use("/api/password-reset", passwordResetRoutes); // ✅ パスワードリセットAPIを統合
// app.use("/api/profile", profileRoutes);
// app.use("/api/links", linkRoutes);

app.use(cors({
  origin: ["http://localhost:3232", "https://connectix-server.vercel.app"], //TODO localhost:3232を本番時削除
  credentials: true
}));

// サーバー起動
const PORT = process.env.PORT || 3522;
app.listen(PORT, async () => {
  logger.info(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);

  // ✅ データベース接続を確認
  try {
    console.log("🔍 データベース接続を確認中...");
    const result = await pool.query("SELECT 1"); // ✅ `pool.connect()` ではなく `query()` を使用
    if (result) {
      console.log("✅ データベースに接続しました");
      logger.info("✅ データベースに接続しました");
    }
  } catch (err) {
    logger.error("❌ データベース接続エラー:", err.message);
    console.error("❌ データベース接続エラー:", err.message);
  }
});

app.get("/", (req, res) => {
  res.send("API is running...");
});
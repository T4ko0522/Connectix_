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

console.log("🔍 POSTGRES_URL:", process.env.POSTGRES_URL);

// log4jsの設定
log4js.configure(path.resolve(__dirname, "./log4js-config.json"));
const logger = log4js.getLogger();

const app = express();

app.use(express.json());
app.use(cors());

// APIの登録
app.use("/api/auth", authRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/links", linkRoutes);

// サーバー起動
const PORT = process.env.PORT || 3522;
app.listen(PORT, () => {
  logger.info(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
});

// データベース接続確認
(async () => {
  let client;
  try {
      console.log("🔍 データベース接続を確認中...");
      client = await pool.connect(); // ✅ PostgreSQL の正しい接続方法

      if (!client) {
          throw new Error("データベース接続に失敗しました。接続オブジェクトが取得できません。");
      }

      console.log("✅ データベースに接続しました");
      logger.info("✅ データベースに接続しました");
  } catch (err) {
      logger.error("データベース接続エラー:", err);
      console.error("❌ データベース接続エラー:", err.code, err.message);
      console.error("🔍 エラースタック:", err.stack);
  } finally {
      if (client) {
          client.release(); // ✅ 正しい変数名を使用
          console.log("🔓 データベース接続を解放しました");
      }
  }
})();

app.get("/", (req, res) => {
  res.send("API is running...");
});
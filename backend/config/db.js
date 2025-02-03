import pkg from "pg";
import log4js from "log4js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

log4js.configure(path.resolve(__dirname, "../log4js-config.json"));
const logger = log4js.getLogger();

// ✅ PostgreSQL 接続設定（エラーハンドリング追加）
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL.replace("sslmode=require", "sslmode=no-verify"),
    ssl: { rejectUnauthorized: false },
});

// ✅ 接続テスト（接続を即座に開放しない）
pool.query("SELECT NOW()")
    .then((res) => {
        logger.info("✅ データベース接続成功:", res.rows[0]);
    })
    .catch((err) => {
        logger.error("❌ データベース接続エラー:", err);
    });

export default pool;
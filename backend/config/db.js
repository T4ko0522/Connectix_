import mysql from 'mysql';
import log4js from 'log4js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

log4js.configure(path.resolve(__dirname, '../log4js-config.json'));

const logger = log4js.getLogger();

// createPool()を使用（getConnection() を利用可能にする）
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "password",
    database: process.env.DATABASE_NAME || "mydatabase",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// データベース接続テスト
pool.getConnection((err, connection) => {
  if (err) {
    logger.error("データベース接続エラー:", err);
    console.error("データベース接続エラー:", err);
  } else {
    console.log("✅ データベースに接続しました");
    connection.release();
  }
});

// モジュールのエクスポート
export default pool;

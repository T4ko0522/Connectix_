// caching_sha2_passwordに対応させるためにmysql2を使用 大幅アップデート
// impoty mysql from 'mysql' から import mysql from 'mysql2' に変更
// caching_sha2_passwordに対応させるためにmysql2にしたが、うまくいかなかったので、従来のmysql_native_passwordを使うことに。。。ここ最近の努力が無駄になった。。。めんたるおれりゅ～＾＾；
// import mysql from 'mysql2';
import mysql from 'mysql2/promise';
import log4js from 'log4js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

log4js.configure(path.resolve(__dirname, '../log4js-config.json'));
const logger = log4js.getLogger();
// デバッグ
console.log("🔍 DATABASE_HOST:", process.env.DATABASE_HOST);
console.log("🔍 DATABASE_PORT:", process.env.DATABASE_PORT);
console.log("🔍 DATABASE_USER:", process.env.DATABASE_USER);
console.log("🔍 DATABASE_NAME:", process.env.DATABASE_NAME);

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "password",
  database: process.env.DATABASE_NAME || "mydatabase",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: false // 証明書なしで接続許可
  }
});

// データベース接続テスト
(async () => {
  console.log("🔍 データベース接続を試行...");
  let connection;
  try {
      connection = await pool.getConnection();

      if (!connection) {
          console.error("❌ データベース接続エラー: 取得した接続が null または undefined です");
          logger.error("❌ データベース接続エラー: 取得した接続が null または undefined です");
          return;
      }
      
      console.log("✅ データベースに接続しました");
  } catch (err) {
      logger.error("❌ データベース接続エラー:", err);
      console.error("❌ データベース接続エラー:", err.message);
      if (err.code) {
          console.error("🔍 エラーコード:", err.code);
      }
      if (err.fatal) {
          console.error("⚠ 致命的なエラー: MySQL がクラッシュした可能性があります");
      }
      console.error("🔍 エラースタック:", err.stack);
  } finally {
      if (connection) {
          connection.release();
          console.log("🔓 データベース接続を解放しました");
      }
  }
})();

export default pool;
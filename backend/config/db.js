import mysql from 'mysql2/promise';  // caching_sha2_passwordに対応させるためにmysql2を使用 大幅アップデート
import log4js from 'log4js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

log4js.configure(path.resolve(__dirname, '../log4js-config.json'));
const logger = log4js.getLogger();

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "password",
    database: process.env.DATABASE_NAME || "mydatabase",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    authPlugins: {  // caching_sha2_passwordに対応
        caching_sha2_password: mysql.authPlugins.caching_sha2_password
    }
});

// データベース接続テスト
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ データベースに接続しました");
        connection.release();
    } catch (err) {
        logger.error("データベース接続エラー:", err);
        console.error("データベース接続エラー:", err);
    }
})();

export default pool;
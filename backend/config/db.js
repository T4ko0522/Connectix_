import pkg from "pg";
import log4js from "log4js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../config/.env") });

log4js.configure(path.resolve(__dirname, "../log4js-config.json"));
const logger = log4js.getLogger();

// ✅ NODE_TLS_REJECT_UNAUTHORIZED を 0 に設定（自己署名証明書を許可）
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }, // ✅ SSL の自己署名証明書を許可
});

export default pool;
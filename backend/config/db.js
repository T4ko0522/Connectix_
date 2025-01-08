import mysql from 'mysql';
import log4js from 'log4js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESモジュールでは __dirname が使えないため、代わりにfileURLToPathを使用
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .envファイルの読み込み
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

// log4jsの設定ファイルを読み込み
log4js.configure(path.resolve(__dirname, '../log4js-config.json'));

// ロガーの取得
const logger = log4js.getLogger();

// データベース接続情報の設定
const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

// データベースへの接続
connection.connect((err) => {
  if (err) {
    logger.error('データベース接続エラー:', err);
    return;
  }
  console.log('データベースに接続しました');
});

// モジュールのエクスポート
export default connection;

// // 環境変数のデバッグ用ログ
// console.log("環境変数:", process.env);

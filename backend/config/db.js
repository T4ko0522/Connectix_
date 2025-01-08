const mysql = require('mysql');
const log4js = require('log4js');
require('dotenv').config({ path: './config/.env' });

log4js.configure('./log4js-config.json');

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

module.exports = connection;
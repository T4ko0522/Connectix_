# ベースイメージをNode.js v20に指定
FROM node:20

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# wait-for-it.sh をコピーして実行権限を付与
COPY wait-for-it.sh /usr/src/app/
RUN chmod +x /usr/src/app/wait-for-it.sh

# 依存関係をインストール
COPY package*.json ./
RUN npm ci

# TypeScriptの設定ファイルとアプリケーションコードをコピー
COPY tsconfig.json ./
COPY . .

# TypeScriptのコンパイル
RUN npm run build

# ポートを公開
EXPOSE 3522

# MySQLが起動するまで待機し、その後アプリケーションを起動
CMD ["./wait-for-it.sh", "db:3306", "--", "npm", "run", "start:prod"]

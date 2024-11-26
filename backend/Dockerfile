# ベースイメージをNode.js v20.18.0に指定
FROM node:20.18.0

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# wait-for-it.sh を追加
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# TypeScriptの設定ファイルをコピーして、ビルド
COPY tsconfig.json ./
COPY . .

# TypeScriptのコンパイル
RUN npm run build

# ポートを公開
EXPOSE 3522

# MySQLが起動するまで待機し、その後バックエンドを起動
CMD ["./wait-for-it.sh", "db:3306", "--", "npm", "run", "start:prod"]

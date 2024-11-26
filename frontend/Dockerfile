# ベースイメージをNode.js v20.18.0に指定
FROM node:20.18.0

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

EXPOSE 3232
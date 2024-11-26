# ベースイメージの指定
FROM node:20

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係をインストール
COPY package.json ./
RUN npm install

# ソースコードをコンテナ内にコピー
COPY . ./

# ポートを環境変数で指定
ENV PORT=3232

# アプリケーション起動
CMD ["npm", "start"]

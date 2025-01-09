# ベースイメージをNode.js v20に指定
FROM node:20

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# ポートを公開
EXPOSE 3522

# # アプリケーションを起動
# CMD ["npm", "start"]
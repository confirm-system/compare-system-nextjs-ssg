# Next.js Dockerfile (開発環境用)
FROM node:24-alpine

WORKDIR /app

# 依存関係をコピーしてインストール
COPY package.json ./
RUN npm install

# アプリケーションコードをコピー
COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]


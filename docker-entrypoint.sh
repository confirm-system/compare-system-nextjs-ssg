#!/bin/sh
set -e

echo "Starting Next.js development server..."

# ボリュームマウントでnode_modulesが上書きされる可能性があるため、
# 常に依存関係をインストール（ただし、既に存在する場合はスキップ）
if [ ! -d "node_modules/@tanstack/react-query" ]; then
  echo "Installing dependencies..."
  if [ -f "package-lock.json" ]; then
    npm ci --prefer-offline --no-audit
  else
    npm install --prefer-offline --no-audit
  fi
else
  echo "Dependencies already installed."
fi

echo "Starting dev server on port ${PORT:-3002}..."

# 開発サーバーを起動
exec npm run dev

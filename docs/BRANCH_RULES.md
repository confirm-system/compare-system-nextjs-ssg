# ブランチルール

このプロジェクトでは、以下のブランチルールを遵守してください。

## 🌿 ブランチ構成

- **main**: 本番環境用ブランチ（保護ブランチ）
- **develop**: 開発環境用ブランチ（保護ブランチ）
- **feature/xxx**: 機能開発用ブランチ
- **hotfix/xxx**: 緊急修正用ブランチ
- **release/xxx**: リリース準備用ブランチ

## 🛡️ ブランチ保護ルール

### mainブランチ
- ❌ **直接プッシュ禁止**
- ✅ **プルリクエスト必須**
- ✅ **developブランチからのみマージ可能**
- ✅ **強制プッシュ禁止**
- ✅ **ブランチ削除禁止**

### developブランチ
- ❌ **直接プッシュ禁止**
- ✅ **プルリクエスト必須**
- ✅ **featureブランチからのみマージ可能**
- ✅ **強制プッシュ禁止**
- ✅ **ブランチ削除禁止**

## 🔄 ブランチ運用フロー

### 1. 機能開発

```bash
# developブランチからfeatureブランチを作成
git checkout develop
git pull origin develop
git checkout -b feature/機能名

# 開発・コミット
git add .
git commit -m "feat: 機能を追加"

# featureブランチをプッシュ
git push origin feature/機能名
```

**ルール**: featureブランチは直接プッシュ可能です。

### 2. developブランチへのマージ

1. GitHubでプルリクエストを作成
   - ベース: `develop`
   - 比較: `feature/機能名`
2. プルリクエストをレビュー
3. マージ（承認不要）

**ルール**: developブランチへの直接プッシュは禁止です。必ずプルリクエスト経由でマージしてください。

### 3. リリース（develop → main）

1. GitHubでプルリクエストを作成
   - ベース: `main`
   - 比較: `develop`
2. プルリクエストをレビュー
3. マージ

**ルール**: mainブランチへの直接プッシュは禁止です。必ずプルリクエスト経由でマージしてください。

### 4. 緊急修正（hotfix）

```bash
# mainブランチからhotfixブランチを作成
git checkout main
git pull origin main
git checkout -b hotfix/修正内容

# 修正・コミット
git add .
git commit -m "fix: 緊急修正"

# hotfixブランチをプッシュ
git push origin hotfix/修正内容
```

**ルール**: hotfixはmainとdevelopの両方にマージしてください。

## 📝 ブランチ命名規則

- **feature/xxx**: 機能追加（例: `feature/user-authentication`）
- **fix/xxx**: バグ修正（例: `fix/login-error`）
- **hotfix/xxx**: 緊急修正（例: `hotfix/security-patch`）
- **refactor/xxx**: リファクタリング（例: `refactor/api-structure`）
- **docs/xxx**: ドキュメント更新（例: `docs/readme-update`）
- **test/xxx**: テスト追加・修正（例: `test/user-service`）

## ⚠️ 注意事項

- `main`と`develop`ブランチへの直接プッシュは**絶対に禁止**です
- 必ずプルリクエスト経由でマージしてください
- featureブランチはマージ後、削除してください
- ブランチ名は明確で分かりやすいものにしてください


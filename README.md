# Event Matching App

## 📋 プロジェクト概要
ユーザーがカレンダーから日付と希望のイベント内容を登録するだけで、システムが最適なグループを自動でマッチングし、イベントを提案する「おまかせ」ソーシャルマッチングアプリ。

## 🏗️ システム構成図
![システム構成図](./docs/system-architecture.png)

## 🛠️ 技術スタック

### フロントエンド
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query + Context API
- **HTTP Client**: Fetch API
- **UI Components**: 自作コンポーネント

### バックエンド (AWS)
- **API**: API Gateway + Lambda
- **Database**: RDS (PostgreSQL)
- **Storage**: S3
- **CDN**: CloudFront

## 🚀 セットアップ

### 前提条件
- Node.js 16.x 以上
- npm または yarn

### インストール手順
```bash
# リポジトリをクローン
git clone <repository-url>
cd event-matching

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

### 環境変数
`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
REACT_APP_API_BASE_URL=https://your-api-gateway-url
REACT_APP_AWS_REGION=ap-northeast-1
```

## 📱 主要機能

### ユーザー機能
- [ ] ユーザー登録・ログイン
- [ ] プロフィール編集
- [ ] カレンダー表示・操作

### イベント機能
- [ ] イベント登録フォーム
- [ ] マッチング状況確認
- [ ] イベント詳細表示
- [ ] グループチャット

### マッチング機能
- [ ] 自動マッチング
- [ ] 店舗提案
- [ ] 参加者管理

## 🎨 UI/UX設計

### デザインシステム
- **Color Palette**: 
  - Primary: #3B82F6 (Blue)
  - Secondary: #10B981 (Green)
  - Accent: #F59E0B (Orange)
  - Background: #F9FAFB (Gray-50)
- **Typography**: Inter font family
- **Spacing**: Tailwind CSS spacing scale (4px base)

### レスポンシブ対応
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 📂 ディレクトリ構造

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── common/         # 汎用コンポーネント
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Form/
│   │   └── Layout/
│   ├── event/          # イベント関連コンポーネント
│   │   ├── EventCard/
│   │   ├── EventList/
│   │   ├── EventForm/
│   │   └── Calendar/
│   └── user/           # ユーザー関連コンポーネント
│       ├── UserProfile/
│       └── UserCard/
├── pages/              # ページコンポーネント
│   ├── Dashboard/
│   ├── Events/
│   ├── Profile/
│   ├── Matching/
│   └── Auth/
├── hooks/              # カスタムフック
│   ├── useAuth.ts
│   ├── useEvents.ts
│   ├── useApi.ts
│   └── useLocalStorage.ts
├── services/           # API通信・外部サービス
│   ├── api/
│   │   ├── events.ts
│   │   ├── users.ts
│   │   ├── matching.ts
│   │   └── client.ts
│   └── auth/
├── types/              # TypeScript型定義
│   ├── event.ts
│   ├── user.ts
│   ├── group.ts
│   └── api.ts
├── utils/              # ユーティリティ関数
│   ├── dateUtils.ts
│   ├── validation.ts
│   ├── formatters.ts
│   └── constants.ts
├── store/              # 状態管理
│   ├── queryClient.ts
│   └── contexts/
└── styles/             # スタイル関連
    ├── globals.css
    └── components.css
```

## 🔌 API仕様

### Base URL
```
Production: https://api.event-matching.com
Development: http://localhost:3001
```

### エンドポイント

#### 1. イベント登録
```http
POST /api/forms
Content-Type: application/json

{
  "hobbyId": 1,
  "userId": 1,
  "date": "2025-09-25",
  "timeslot": "午後",
  "intensity": "ガチ",
  "attendees": 2,
  "minCapacity": 4,
  "maxCapacity": 6
}
```

#### 2. イベント詳細取得
```http
GET /api/users/{userId}/calendars/{calendarId}
```

#### 3. ユーザーカレンダー取得
```http
GET /api/users/{userId}/calendars
```

## 🗄️ データベース設計

### 主要テーブル
1. **users** - ユーザー情報
2. **user_calendars** - ユーザーのイベント情報
3. **hobbies** - 趣味カテゴリマスター
4. **groups** - マッチンググループ
5. **group_chat** - グループチャット

詳細は `docs/database-schema.md` を参照。

## 🧪 テスト

```bash
# 単体テスト実行
npm test

# カバレッジレポート生成
npm run test:coverage

# E2Eテスト実行
npm run test:e2e
```

## 📦 ビルド・デプロイ

```bash
# プロダクションビルド
npm run build

# 静的ファイルサーバーで確認
npm run serve
```

## 🤝 開発ルール

### コーディング規約
- ESLint + Prettier使用
- TypeScript strict mode
- コンポーネントはPascalCase
- ファイル名はkebab-case

### ブランチ戦略
- `main`: プロダクション
- `develop`: 開発
- `feature/*`: 機能開発
- `fix/*`: バグ修正

### コミットメッセージ
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: スタイル変更
refactor: リファクタリング
test: テスト追加・修正
```

## 📝 TODO

### 高優先度
- [ ] 認証機能の実装
- [ ] カレンダーコンポーネントの作成
- [ ] イベント登録フォームの実装

### 中優先度
- [ ] マッチング結果表示画面
- [ ] グループチャット機能
- [ ] プッシュ通知機能

### 低優先度
- [ ] 管理者画面
- [ ] 分析ダッシュボード
- [ ] 多言語対応

## 📞 サポート・問い合わせ

開発に関する質問や問題がある場合は、以下までご連絡ください：

- **Email**: [your-email@domain.com]
- **Slack**: #event-matching-dev
- **Issue Tracker**: GitHub Issues

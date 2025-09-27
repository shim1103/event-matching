# Event Matching App

## 📋 プロジェクト概要
ユーザーがカレンダーから日付と希望のイベント内容を登録するだけで、システムが最適なグループを自動でマッチングし、イベントを提案する「おまかせ」ソーシャルマッチングアプリ。

### ⚠️ 重要な制約事項
- **バックエンドリソース**: AWS上で保存されているが、NTTドコモのリソースを使用
- **リソース有効期限**: まもなく失効予定
- **データ保持**: バックエンドコードとデータは一時的なものとして開発

## 🗃️ データベース構造

詳細なデータベース設計については、[`docs/database-schemas/dynamodb-tables.md`](./docs/database-schemas/dynamodb-tables.md)を参照してください。

### 主要テーブル
- **users** - ユーザー情報
- **user_calendars** - ユーザーカレンダー
- **hobbies** - 趣味カテゴリー
- **groups** - マッチンググループ
- **group_chat** - グループチャット

## 🏗️ システム構成図
![システム構成図](./docs/system-architecture.png)

## 📱 画面設計

### 主要画面構成
1. **ダッシュボード画面（カレンダー）** - `/dashboard`
   - カレンダー表示（月次表示）
   - 今日の日付・予定ありの日付表示
   - 月移動機能

2. **予定登録画面** - `/register`
   - 選択日付表示
   - アクティビティ選択（ボードゲーム、バレーボール、カラオケ、映画鑑賞）
   - 楽しみ方選択（エンジョイ、ガチ）
   - グループ人数設定
   - 最終合計人数選択

3. **募集中画面** - `/recruiting`
   - 募集状況表示
   - 参加者数表示
   - イベント詳細確認

4. **マッチング中画面** - `/matching`
   - マッチング進行状況
   - 現在の参加者数表示
   - メンバー募集状況

5. **アプリ提案画面** - `/proposal`
   - イベント詳細表示
   - 場所候補リスト（推奨・通常）
   - 参加・辞退ボタン

### UI/UXデザイン仕様

#### カラーパレット
- **Primary**: #E53E3E (親しみやすい赤系)
- **Secondary**: #FED7D7 (ピンク背景)
- **Success**: #10B981 (グリーン)
- **Warning**: #F59E0B (オレンジ)
- **Background**: #FFFFFF (ホワイト)
- **Text**: #2D3748 (ダークグレー)

#### コンポーネントデザイン
- **カード型レイアウト**: 角丸、シャドウ付き
- **ボタン**: 角丸、適切なホバーエフェクト
- **フォーム要素**: 直感的な選択UI

#### レスポンシブ対応
- **Mobile First**: 320px-414px (iPhone対応)
- **Tablet**: 768px-1024px
- **Desktop**: 1024px+

## 🛠️ 技術スタック

### フロントエンド
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **State Management**: React Query (TanStack Query)
- **Authentication**: AWS Amplify UI React
- **Date Handling**: date-fns, react-calendar, react-date-picker
- **HTTP Client**: Fetch API
- **Icons**: React Icons
- **Testing**: React Testing Library, Jest

### バックエンド (AWS)
- **Authentication**: AWS Amplify Auth
- **API**: API Gateway + Lambda
- **Database**: DynamoDB
- **Storage**: S3
- **CDN**: CloudFront
- **Hosting**: AWS Amplify Hosting

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

### AWS Amplify設定
このプロジェクトはAWS Amplifyを使用しており、以下の設定ファイルが含まれています：
- `amplifyconfiguration.json`: Amplify設定
- `aws-exports.js`: AWS設定のエクスポート
- `amplify/`: Amplifyバックエンド設定

### AWS バックエンド詳細
AWS側のバックエンド実装詳細については、[`docs/aws-backend-notes.md`](./docs/aws-backend-notes.md)を参照してください。
- アーキテクチャ構成
- API エンドポイント仕様
- DynamoDB テーブル設計
- Lambda関数実装詳細

## 📂 ディレクトリ構造

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── calendar/        # カレンダーコンポーネント
│   │   └── Calendar.tsx
│   ├── common/          # 汎用コンポーネント
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   └── Layout/
│   │       ├── Layout.tsx
│   │       └── index.ts
│   ├── event/           # イベント関連コンポーネント
│   │   └── EventSummary/
│   │       ├── EventSummary.tsx
│   │       └── index.ts
│   ├── LoadingScreen/   # ローディング画面
│   │   └── LoadingScreen.tsx
│   ├── recruiting/      # 募集関連コンポーネント
│   │   ├── MatchingStatus/
│   │   │   ├── MatchingStatus.tsx
│   │   │   └── index.ts
│   │   └── ParticipantCounter/
│   │       ├── ParticipantCounter.tsx
│   │       └── index.ts
│   └── venue/           # 場所関連コンポーネント
│       └── VenueCard/
│           ├── VenueCard.tsx
│           └── index.ts
├── pages/               # ページコンポーネント
│   ├── dashboard/       # ダッシュボード（カレンダー）
│   │   └── Dashboard.tsx
│   ├── register/        # 予定登録
│   │   └── Register.tsx
│   ├── Recruiting/      # 募集中
│   │   ├── Recruiting.tsx
│   │   └── index.ts
│   └── Proposal/        # アプリ提案
│       ├── Proposal.tsx
│       └── index.ts
├── services/            # API通信・外部サービス
│   └── api/
│       ├── api.ts       # API設定
│       ├── calendarApi.ts # カレンダーAPI
│       ├── client.ts    # HTTPクライアント
│       └── dto/         # 型定義（Data Transfer Object）
│           ├── getCalendarDetailApi-dto.ts
│           ├── getCalendarListApi-dto.ts
│           ├── getHobbyListApi-dto.ts
│           ├── registerCalendarApi-dto.ts
│           └── registerUserApi-dto.ts
├── dummydata/           # ダミーデータ
│   ├── groupchat.json
│   ├── groups.json
│   ├── hobbies.json
│   ├── user_calendars.json
│   ├── users.json
│   └── venues.json
├── utils/               # ユーティリティ関数
│   └── constants.ts
├── App.tsx              # メインアプリケーション
├── router.tsx           # ルーティング設定
└── index.tsx            # エントリーポイント
```

## 🔌 API仕様 & 型定義

### 型定義の管理方針
- **全ての型定義は `services/api/dto/` ディレクトリに集約**
- **API レスポンス・リクエストの型は DTO (Data Transfer Object) として管理**
- **ページコンポーネント内での型の重複定義を避ける**

### API詳細
詳細なAPI仕様については、[`docs/aws-backend-notes.md`](./docs/aws-backend-notes.md)を参照してください。

### 主要エンドポイント
- `GET /api/hobbies/list` - 趣味一覧取得
- `POST /api/users/register` - ユーザー登録・取得
- `POST /api/calendar/register` - カレンダー予定登録
- `GET /api/calendar/detail/{userId}/{calendarId}` - カレンダー詳細取得
- `GET /api/calendar/list/{userId}` - カレンダー一覧取得

## 🧪 テスト

```bash
# 単体テスト実行
npm test

# カバレッジレポート生成
npm run test:coverage
```

## 📦 ビルド・デプロイ

```bash
# プロダクションビルド
npm run build

# 静的ファイルサーバーで確認
npm run serve
```

## 🔧 開発ルール

### 型定義のルール
- **新しい型定義は必ず `services/api/dto/` に作成**
- **ページコンポーネント内での型定義は禁止**
- **API のリクエスト/レスポンスに関する型は DTO として管理**
- **共通で使用される型は適切な DTO ファイルに配置**

### コーディング規約
- ESLint + Prettier使用
- TypeScript strict mode
- コンポーネントはPascalCase
- ファイル名はkebab-case

### コミットメッセージ
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: スタイル変更
refactor: リファクタリング
test: テスト追加・修正
```

## 📝 開発状況

### 実装済み機能
- [x] プロジェクト初期化
- [x] AWS Amplify認証システム
- [x] 基本コンポーネント (Button, Card, Layout等)
- [x] カレンダーコンポーネント
- [x] ダッシュボード画面
- [x] 予定登録画面
- [x] 募集中画面
- [x] 提案画面
- [x] ローディング画面
- [x] レスポンシブデザイン

### 現在の実装状況
- **認証**: AWS Amplify UI Reactを使用した認証システム
- **ルーティング**: React Router DOM v7による画面遷移
- **状態管理**: React Query (TanStack Query)によるAPI状態管理
- **スタイリング**: Tailwind CSSによるレスポンシブデザイン
- **型安全性**: TypeScriptによる型定義の管理

### 今後の課題
1. **バックエンド連携**: 現在はダミーデータを使用
2. **型定義の統一**: 一部の型定義で不整合がある可能性
3. **テストカバレッジ**: ユニットテストの追加
4. **パフォーマンス最適化**: 必要に応じた最適化

## 📞 サポート・問い合わせ

開発に関する質問や問題がある場合は、以下までご連絡ください：

- **Email**: [your-email@domain.com]
- **Slack**: #event-matching-dev
- **Issue Tracker**: GitHub Issues

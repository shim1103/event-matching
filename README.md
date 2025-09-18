# Event Matching App

## 📋 プロジェクト概要
ユーザーがカレンダーから日付と希望のイベント内容を登録するだけで、システムが最適なグループを自動でマッチングし、イベントを提案する「おまかせ」ソーシャルマッチングアプリ。

## 🗃️ データベース構造

### ユーザ情報（users）
| カラム名 | 型 | 説明 |
|---------|----|----|
| id | int | ユーザID（主キー） |
| name | varchar | ユーザー名 |
| phone_number | varchar | 電話番号 |
| email | varchar | メールアドレス |
| address | varchar | 住所 |
| bio | text | 自己紹介 |

### ユーザのカレンダー（user_calendars）
| カラム名 | 型 | 説明 |
|---------|----|----|
| id | int | カレンダーID（主キー） |
| user_id | int | ユーザID（外部キー） |
| hobby_id | int | 趣味ID（外部キー） |
| group_id | int | グループID（外部キー） |
| date | date | 日付 |
| time_slot | enum | 時間帯（morning, afternoon, evening） |
| intensity | enum | 参加レベル（serious, casual） |
| attendees | int | 参加者数 |
| status | enum | ステータス（recruiting, matched） |

### マッチング趣味カテゴリー（hobbies）
| カラム名 | 型 | 説明 |
|---------|----|----|
| id | int | 趣味ID（主キー） |
| name | varchar | 趣味名 |
| max_capacity | int | 最大定員 |
| min_capacity | int | 最小定員 |

### マッチンググループ（groups）
| カラム名 | 型 | 説明 |
|---------|----|----|
| id | int | グループID（主キー） |
| hobby_id | int | 趣味ID（外部キー） |
| date | date | 日付 |
| time_slot | enum | 時間帯（morning, afternoon, evening） |
| intensity | enum | 参加レベル（serious, casual） |
| count | int | 現在の人数 |
| status | enum | ステータス（recruiting, matched） |
| shops | json | 店舗リスト |

### グループチャット（group_chat）
| カラム名 | 型 | 説明 |
|---------|----|----|
| id | int | チャットID（主キー） |
| group_id | int | グループID（外部キー） |
| user_id | int | ユーザID（外部キー） |
| timestamp | datetime | タイムスタンプ |
| message | text | メッセージ内容 |

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
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Date Handling**: date-fns
- **HTTP Client**: Fetch API
- **Calendar**: react-calendar

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

## 📂 ディレクトリ構造

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── Calendar.tsx    # カレンダーコンポーネント
│   ├── common/         # 汎用コンポーネント
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Header/
│   │   └── Layout/
│   ├── event/          # イベント関連コンポーネント
│   │   ├── EventCard/
│   │   └── EventSummary/
│   ├── recruiting/     # 募集関連コンポーネント
│   │   ├── MatchingStatus/
│   │   └── ParticipantCounter/
│   └── venue/          # 場所関連コンポーネント
│       ├── VenueCard/
│       ├── VenueList/
│       └── VenueSearch/
├── pages/              # ページコンポーネント
│   ├── dashboard/      # ダッシュボード（カレンダー）
│   ├── register/       # 予定登録
│   ├── Recruiting/     # 募集中
│   ├── Matching/       # マッチング中
│   ├── Proposal/       # アプリ提案
│   └── Profile/        # プロフィール
├── hooks/              # カスタムフック
├── services/           # API通信・外部サービス
│   └── api/
│       ├── api.ts      # API設定
│       ├── calendarApi.ts # カレンダーAPI
│       ├── client.ts   # HTTPクライアント
│       └── dto/        # 型定義（Data Transfer Object）
│           ├── getCalendarDetailApi-dto.ts
│           ├── getCalendarListApi-dto.ts
│           └── registerCalendarApi-dto.ts
├── dummydata/          # ダミーデータ
│   ├── groupchat.json
│   ├── groups.json
│   ├── hobbies.json
│   ├── user_calendars.json
│   ├── users.json
│   └── venues.json
├── store/              # 状態管理
│   └── {contexts}/
├── styles/             # スタイル関連
└── utils/              # ユーティリティ関数
    └── constants.ts
```

## 🔌 API仕様 & 型定義

### 型定義の管理方針
- **全ての型定義は `services/api/dto/` ディレクトリに集約**
- **API レスポンス・リクエストの型は DTO (Data Transfer Object) として管理**
- **ページコンポーネント内での型の重複定義を避ける**

### 現在の型定義ファイル

#### 1. カレンダー登録 (`registerCalendarApi-dto.ts`)
```typescript
interface RegisterCalendar {
    hobbyId: string;
    userId: string;
    date: string;
    timeSlot: string;
    intensity: "serious" | "casual";
    attendees: number;
    status: "recruiting" | "matched" | "closed" | null;
}

interface RegisterCalendarResponse {
    calendarId: string;
}
```

#### 2. カレンダー詳細取得 (`getCalendarDetailApi-dto.ts`)
#### 3. カレンダー一覧取得 (`getCalendarListApi-dto.ts`)

### Base URL
```
Production: https://api.event-matching.com
Development: http://localhost:3001
```

### 主要エンドポイント

#### 1. カレンダー登録
```http
POST /api/calendar/register
Content-Type: application/json

{
  "hobbyId": 1,
  "userId": 1,
  "date": "2024-12-25",
  "timeSlot": "afternoon",
  "intensity": "casual",
  "attendees": 2,
  "status": "recruiting"
}
```

#### 2. カレンダー一覧取得
```http
GET /api/calendar/list?userId={userId}
```

#### 3. カレンダー詳細取得
```http
GET /api/calendar/detail/{calendarId}
```

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
- [x] 基本コンポーネント (Button, Card, Layout等)
- [x] カレンダーコンポーネント
- [x] ダッシュボード画面
- [x] 予定登録画面
- [x] 募集中画面
- [x] マッチング中画面
- [x] 提案画面

### 型定義の課題
以下の型定義に関する問題があります：

1. **intensity値の不整合**
   - DTO: `"serious" | "casual"`
   - 実装: `"エンジョイ" | "ガチ"`

2. **複数ファイルでの型重複**
   - `EventData`型が複数のページで重複定義
   - `MatchingState`型がローカル定義されている

3. **不足している型定義**
   - 会場情報 (Venue)
   - ユーザー情報 (User)
   - マッチング結果 (MatchingResult)

## 📞 サポート・問い合わせ

開発に関する質問や問題がある場合は、以下までご連絡ください：

- **Email**: [your-email@domain.com]
- **Slack**: #event-matching-dev
- **Issue Tracker**: GitHub Issues

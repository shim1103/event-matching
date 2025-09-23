# AWS バックエンド実装メモ

> **⚠️ 重要**: このバックエンドはNTTドコモのリソースを使用しており、まもなく失効予定です。  
> 開発期間: 2024年8月16日-19日 (NTTドコモ夏ハッカソン第2タームBチーム「Synergy Sparks」)

## 🏗️ アーキテクチャ概要

### システム構成
```
User → AWS Cloud
├── Frontend (React + TypeScript)
│   ├── Amplify (認証・ホスティング管理)
│   ├── CloudFront (CDN)
│   └── S3 (静的ファイルホスティング)
├── Authentication
│   └── Cognito (ユーザー認証)
├── API Layer
│   └── API Gateway (API ルーティング)
├── Backend Logic
│   └── Lambda Functions (Python)
│       ├── マッチング処理
│       ├── グループ情報更新
│       ├── グループ新規登録
│       ├── カレンダー予定登録
│       └── カレンダー情報取得
└── Database
    └── DynamoDB (データ永続化)
```

## 🔌 API エンドポイント

### 1. 趣味一覧取得
- **Lambda関数**: hobby-list
- **エンドポイント**: `GET /api/hobbies/list`
- **機能**: DynamoDBから全趣味カテゴリーを取得
- **詳細**: [`docs/api-endpoints/hobby-list.md`](./api-endpoints/hobby-list.md)

### 2. ユーザー登録・取得
- **Lambda関数**: user-register
- **エンドポイント**: `POST /api/users/register`
- **機能**: メールアドレスで既存ユーザー検索、存在しなければ新規作成
- **詳細**: [`docs/api-endpoints/user-register.md`](./api-endpoints/user-register.md)

### 3. カレンダー予定登録
- **Lambda関数**: calendar-register
- **エンドポイント**: `POST /api/calendar/register`
- **機能**: ユーザーの予定を登録し、既存グループに参加または新規グループを作成
- **詳細**: [`docs/api-endpoints/calendar-register.md`](./api-endpoints/calendar-register.md)

### 4. カレンダー詳細取得
- **Lambda関数**: calendar-detail
- **エンドポイント**: `GET /api/calendar/detail/{userId}/{calendarId}`
- **機能**: 指定されたユーザーのカレンダー詳細情報を取得
- **詳細**: [`docs/api-endpoints/calendar-detail.md`](./api-endpoints/calendar-detail.md)

### 5. カレンダー一覧取得
- **Lambda関数**: calendar-list
- **エンドポイント**: `GET /api/calendar/list/{userId}`
- **機能**: 指定されたユーザーのカレンダー一覧を取得
- **詳細**: [`docs/api-endpoints/calendar-list.md`](./api-endpoints/calendar-list.md)

## 🗄️ DynamoDB テーブル設計

### テーブル一覧
1. **users** - ユーザー情報
2. **user_calendars** - ユーザーカレンダー
3. **hobbies** - 趣味カテゴリー
4. **groups** - マッチンググループ
5. **group_chat** - グループチャット

### 詳細設計
詳細なテーブル設計については、[`docs/database-schemas/dynamodb-tables.md`](./database-schemas/dynamodb-tables.md)を参照してください。

### 主要テーブル構造

#### users テーブル
```json
{
  "id": "string (Partition Key)",
  "name": "string",
  "email": "string",
  "phone_number": "string",
  "address": "string",
  "bio": "string"
}
```

#### user_calendars テーブル
```json
{
  "id": "string (Partition Key)",
  "user_id": "string",
  "hobby_id": "string",
  "group_id": "string",
  "date": "string",
  "time_slot": "string (morning|afternoon|evening)",
  "intensity": "string (serious|casual)",
  "attendees": "number",
  "status": "string (recruiting|matched)"
}
```

#### groups テーブル
```json
{
  "id": "string (Partition Key)",
  "hobby_id": "string",
  "date": "string",
  "time_slot": "string",
  "intensity": "string",
  "count": "number",
  "status": "string",
  "shops": "list"
}
```

## 🐍 Lambda関数実装詳細

### 開発言語
- **Python 3.9+**

### 主要ライブラリ
```python
import boto3
import json
import uuid
from datetime import datetime
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError
```

### 詳細実装
各Lambda関数の詳細な実装については、[`docs/deployment/lambda-functions.md`](./deployment/lambda-functions.md)を参照してください。

### 共通処理
- DynamoDB接続: `boto3.resource('dynamodb')`
- エラーハンドリング: 統一されたレスポンス形式
- ログ出力: CloudWatch Logs

### レスポンス形式
```python
{
    "statusCode": 200,
    "headers": {
        "Content-Type": "application/json"
    },
    "body": json.dumps({
        "data": {...}
    }, ensure_ascii=False)
}
```

## 🔐 認証・認可

### Cognito設定
- **ユーザープール**: メールアドレス認証
- **認証フロー**: カスタム認証フロー
- **トークン**: JWT形式

### API Gateway認証
- **認証方式**: Cognito User Pool Authorizer
- **スコープ**: 各APIエンドポイントに適用

## 📊 監視・ログ

### CloudWatch
- **ロググループ**: `/aws/lambda/{function-name}`
- **メトリクス**: 実行時間、エラー率、呼び出し回数
- **アラーム**: エラー率閾値設定

### ログレベル
- **INFO**: 正常処理のログ
- **WARN**: 警告レベルのログ
- **ERROR**: エラーログ

## 🚀 デプロイメント

### デプロイ方法
1. **Amplify CLI**: `amplify push`
2. **Lambda関数**: 個別デプロイ
3. **API Gateway**: 自動デプロイ

### 環境変数
```bash
DYNAMODB_TABLE_PREFIX=event_matching_
AWS_REGION=ap-northeast-1
```

## ⚠️ 制約事項・注意点

### リソース制約
- **実行時間**: Lambda関数最大15分
- **メモリ**: 最大10GB
- **同時実行**: 1000リクエスト/秒
- **DynamoDB**: オンデマンド課金

### セキュリティ
- **IAMロール**: 最小権限の原則
- **VPC**: プライベートサブネット使用
- **暗号化**: DynamoDB暗号化有効

### コスト最適化
- **Lambda**: プロビジョンド同時実行数設定
- **DynamoDB**: オンデマンド課金モード
- **CloudFront**: キャッシュ設定最適化

## 📝 開発メモ

### 実装時の課題
1. **CORS設定**: API GatewayでのCORS設定が複雑
2. **DynamoDB設計**: パーティションキー設計の最適化
3. **エラーハンドリング**: 統一されたエラーレスポンス形式
4. **テスト**: ローカル環境でのテストが困難

### 改善点
1. **バリデーション**: 入力値の検証強化
2. **キャッシュ**: DynamoDBクエリの最適化
3. **モニタリング**: より詳細なメトリクス収集
4. **ドキュメント**: API仕様書の自動生成

## 🔗 関連リソース

- **AWS Amplify**: フロントエンド・バックエンド統合
- **API Gateway**: RESTful API管理
- **Lambda**: サーバーレス関数実行
- **DynamoDB**: NoSQLデータベース
- **Cognito**: ユーザー認証・認可
- **CloudFront**: CDN・静的ファイル配信

---

**最終更新**: 2024年8月19日  
**開発チーム**: NTTドコモ夏ハッカソン第2タームBチーム「Synergy Sparks」

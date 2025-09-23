# Lambda関数実装詳細

## 関数一覧

### 1. hobby-list
- **ランタイム**: Python 3.9
- **メモリ**: 128MB
- **タイムアウト**: 30秒
- **環境変数**: `DYNAMO_TABLE=hobbies`

### 2. user-register
- **ランタイム**: Python 3.9
- **メモリ**: 256MB
- **タイムアウト**: 30秒
- **環境変数**: なし

### 3. calendar-register
- **ランタイム**: Python 3.9
- **メモリ**: 512MB
- **タイムアウト**: 60秒
- **環境変数**: 
  - `TABLE_USERS=users`
  - `TABLE_HOBBIES=hobbies`
  - `TABLE_GROUPS=groups`
  - `TABLE_USER_CALENDAR=user_calendars`

### 4. calendar-detail
- **ランタイム**: Python 3.9
- **メモリ**: 256MB
- **タイムアウト**: 30秒
- **環境変数**: なし

### 5. calendar-list
- **ランタイム**: Python 3.9
- **メモリ**: 256MB
- **タイムアウト**: 30秒
- **環境変数**: `DYNAMO_TABLE=user_calendars`

## 共通ライブラリ

### 必須ライブラリ
```python
import json
import boto3
import uuid
from datetime import datetime
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError
```

### 外部ライブラリ
- `placesapi`: Google Places API連携用（calendar-registerのみ）

## IAMロール権限

### 最小権限ポリシー
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:TransactWriteItems"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/*"
    }
  ]
}
```

## デプロイメント

### パッケージ化
```bash
# 依存関係を含むパッケージ作成
pip install -r requirements.txt -t .
zip -r function.zip .
```

### デプロイコマンド
```bash
aws lambda update-function-code \
  --function-name hobby-list \
  --zip-file fileb://function.zip
```

## 監視・ログ

### CloudWatch Logs
- ロググループ: `/aws/lambda/{function-name}`
- 保持期間: 14日間

### メトリクス
- 実行時間
- エラー率
- 呼び出し回数
- 同時実行数

## エラーハンドリング

### 共通エラーレスポンス
```python
{
  "statusCode": 400/500,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": json.dumps({
    "message": "エラーメッセージ",
    "error": "詳細エラー情報"
  })
}
```

### エラーコード
- **400**: バリデーションエラー、無効なリクエスト
- **404**: リソースが見つからない
- **500**: 内部エラー、DynamoDBエラー

# カレンダー一覧取得API

## エンドポイント
- **URL**: `GET /api/calendar/list/{userId}`
- **Lambda関数**: カレンダー一覧取得
- **機能**: 指定されたユーザーのカレンダー一覧を取得

## Lambda関数コード

```python
import json
import boto3
import os
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError

# DynamoDB リソース初期化
dynamodb = boto3.resource("dynamodb")
table_name = os.environ.get("DYNAMO_TABLE", "user_calendars")
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # パスパラメータから userId を取得
        user_id = event["pathParameters"]["userId"]

        # DynamoDB Scan で user_id が一致するアイテムを検索
        response = table.scan(
            FilterExpression=Attr("user_id").eq(user_id)
        )
        items = response.get("Items", [])

        # レスポンス用に整形
        calendars = []
        for item in items:
            calendars.append({
                "calendarId": item.get("id"),
                "date": item.get("date"),
                "status": item.get("status")
            })

        return {
            "statusCode": 200,
            "body": json.dumps(calendars)
        }

    except ClientError as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Error querying DynamoDB",
                "error": str(e)
            })
        }
    except Exception as e:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": "Invalid request",
                "error": str(e)
            })
        }
```

## パスパラメータ
- `userId`: ユーザーID

## レスポンス例

```json
[
  {
    "calendarId": "e5f6g7h8",
    "date": "2024-12-25",
    "status": "matched"
  },
  {
    "calendarId": "i9j0k1l2",
    "date": "2024-12-26",
    "status": "recruiting"
  },
  {
    "calendarId": "m3n4o5p6",
    "date": "2024-12-27",
    "status": "matched"
  }
]
```

## 機能詳細
- **ユーザー別検索**: 指定された`userId`のカレンダーエントリのみを取得
- **シンプルなレスポンス**: カレンダーID、日付、ステータスのみを返却
- **Scan操作**: DynamoDBのScanを使用して全件検索（効率は考慮しない）

## 環境変数
- `DYNAMO_TABLE`: DynamoDBテーブル名（デフォルト: "user_calendars"）

## エラーハンドリング
- **400**: 無効なリクエスト
- **500**: DynamoDBアクセスエラー

## パフォーマンス考慮事項
- 現在はScan操作を使用しているため、大量データの場合は遅くなる可能性
- 本格運用時はGSI（Global Secondary Index）の検討を推奨

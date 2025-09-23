# 趣味一覧取得API

## エンドポイント
- **URL**: `GET /api/hobbies/list`
- **Lambda関数**: 趣味一覧取得
- **機能**: DynamoDBから全趣味カテゴリーを取得

## Lambda関数コード

```python
import json
import boto3
import os
from botocore.exceptions import ClientError

# DynamoDB リソース初期化
dynamodb = boto3.resource("dynamodb")
table_name = os.environ.get("DYNAMO_TABLE", "hobbies")
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # DynamoDB から全件取得
        response = table.scan()
        items = response.get("Items", [])
        hobbies = []
        for item in items:
            hobbies.append({
                "hobbyId": item["id"],
                "name": item["name"]
            })

        # 趣味id　と　名前を返す
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps(hobbies, ensure_ascii=False)
        }

    except ClientError as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Error scanning DynamoDB",
                "error": str(e)
            })
        }
```

## レスポンス例

```json
[
  {
    "hobbyId": "1",
    "name": "ボードゲーム"
  },
  {
    "hobbyId": "2", 
    "name": "バレーボール"
  },
  {
    "hobbyId": "3",
    "name": "カラオケ"
  },
  {
    "hobbyId": "4",
    "name": "映画鑑賞"
  }
]
```

## 環境変数
- `DYNAMO_TABLE`: DynamoDBテーブル名（デフォルト: "hobbies"）

## エラーハンドリング
- **500**: DynamoDBアクセスエラー
- **ClientError**: AWS SDKエラー

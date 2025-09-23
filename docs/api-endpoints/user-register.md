# ユーザー登録・取得API

## エンドポイント
- **URL**: `POST /api/users/register`
- **Lambda関数**: ユーザー登録・取得
- **機能**: メールアドレスで既存ユーザーを検索、存在しなければ新規作成

## Lambda関数コード

```python
import json
import uuid
import boto3
from boto3.dynamodb.conditions import Attr

# --- DynamoDB テーブル取得（固定名で） ---
dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table("users")

def lambda_handler(event, context):
    # body 取得（API GW プロキシ想定）
    body = event.get("body")
    if isinstance(body, str):
        body = json.loads(body)
    elif not body:
        return {"statusCode": 400, "body": json.dumps({"message": "invalid body"})}

    name    = body.get("name")
    email   = body.get("email")
    phone   = body.get("phone")
    address = body.get("address")
    bio     = body.get("bio")

    if not email or not name:
        return {"statusCode": 400, "body": json.dumps({"message": "name と email は必須です"})}

    # 1) email で既存ユーザーを探す（効率気にしない前提なので Scan）
    resp = users_table.scan(FilterExpression=Attr("email").eq(email))
    if resp.get("Items"):
        user = resp["Items"][0]
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {"id": user["id"], "name": user.get("name"), "email": user.get("email")},
                ensure_ascii=False
            ),
        }

    # 2) 見つからなければ新規作成
    new_id = str(uuid.uuid4())[:8]  # 簡易ID（連番にしたい場合は別途実装）
    item = {
        "id": new_id,
        "name": name,
        "email": email,
        "phone_number": phone,
        "address": address,
        "bio": bio,
    }
    users_table.put_item(Item=item)

    res = {"id": new_id, "name": name, "email": email}
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(res, ensure_ascii=False),
    }
```

## リクエスト例

```json
{
  "name": "田中太郎",
  "email": "tanaka@example.com",
  "phone": "090-1234-5678",
  "address": "東京都渋谷区",
  "bio": "よろしくお願いします"
}
```

## レスポンス例

### 新規ユーザー作成時
```json
{
  "id": "a1b2c3d4",
  "name": "田中太郎",
  "email": "tanaka@example.com"
}
```

### 既存ユーザー取得時
```json
{
  "id": "e5f6g7h8",
  "name": "田中太郎",
  "email": "tanaka@example.com"
}
```

## バリデーション
- **必須フィールド**: `name`, `email`
- **email重複チェック**: 既存ユーザーがいる場合は新規作成せずに既存情報を返却

## エラーハンドリング
- **400**: 必須フィールド不足、無効なリクエストボディ

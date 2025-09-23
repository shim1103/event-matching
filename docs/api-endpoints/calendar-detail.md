# カレンダー詳細取得API

## エンドポイント
- **URL**: `GET /api/calendar/detail/{userId}/{calendarId}`
- **Lambda関数**: カレンダー詳細取得
- **機能**: 指定されたユーザーのカレンダー詳細情報を取得

## Lambda関数コード

```python
import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
user_calendars_table = dynamodb.Table("user_calendars")
hobbies_table = dynamodb.Table("hobbies")
groups_table = dynamodb.Table("groups")

def lambda_handler(event, context):
    # API Gateway → Lambda に渡されるパスパラメータを取得
    user_id = event["pathParameters"]["userId"]
    calendar_id = event["pathParameters"]["calendarId"]

    # user_calendars から1件取得
    response = user_calendars_table.get_item(
       Key={
        "id": str(calendar_id),
       }
    )
    calendar = response.get("Item")

    if not calendar or calendar["user_id"] != user_id:
        return {
            "statusCode": 404,
            "body": json.dumps({"message": "Calendar not found"})
        }

    # hobbies から min_capacity / max_capacity を取得
    hobby_id = calendar["hobby_id"]
    hobby_resp = hobbies_table.get_item(Key={
        "id": str(hobby_id),
    })
    hobby = hobby_resp.get("Item", {})

    # groups から shops を取得
    group_id = calendar.get("group_id")
    shops = []
    count = None
    if group_id:
        group_resp = groups_table.get_item(Key={"id": str(group_id)})
        group = group_resp.get("Item")
        if group:
            shops = group.get("shops", [])
            count = group.get("count")

    # レスポンス組み立て
    result = {
        "userId": calendar["user_id"],
        "hobbyId": calendar["hobby_id"],
        "date": calendar["date"],
        "timeSlot": calendar["time_slot"],   # 日本語変換するならここでマッピング
        "intensity": calendar["intensity"],  # "ガチ"/"カジュアル" 変換もここ
        "mincapacity": hobby.get("min_capacity"),
        "maxcapacity": hobby.get("max_capacity"),
        "attendees": calendar.get("attendees", 0),
        "status": calendar["status"],
        "shops": shops,
        "count": count
    }
    return {
    "statusCode": 200,
    "body": json.dumps(result, ensure_ascii=False, default=str)
    }
```

## パスパラメータ
- `userId`: ユーザーID
- `calendarId`: カレンダーID

## レスポンス例

```json
{
  "userId": "a1b2c3d4",
  "hobbyId": "1",
  "date": "2024-12-25",
  "timeSlot": "afternoon",
  "intensity": "casual",
  "mincapacity": 2,
  "maxcapacity": 6,
  "attendees": 2,
  "status": "matched",
  "shops": [
    {
      "name": "ボードゲームカフェ",
      "address": "東京都渋谷区",
      "rating": 4.5
    }
  ],
  "count": 4
}
```

## データ取得フロー
1. **ユーザーカレンダー取得**: `user_calendars`テーブルから指定IDのレコードを取得
2. **ユーザー認証**: カレンダーの`user_id`がリクエストの`userId`と一致するかチェック
3. **趣味情報取得**: `hobbies`テーブルから最小・最大定員情報を取得
4. **グループ情報取得**: グループが存在する場合、`groups`テーブルから店舗情報と参加者数を取得

## エラーハンドリング
- **404**: カレンダーが見つからない、またはユーザーIDが一致しない

## 関連テーブル
- `user_calendars`: メインデータ
- `hobbies`: 趣味の定員情報
- `groups`: グループの店舗情報と参加者数

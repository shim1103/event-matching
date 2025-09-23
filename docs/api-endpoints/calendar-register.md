# カレンダー予定登録API

## エンドポイント
- **URL**: `POST /api/calendar/register`
- **Lambda関数**: カレンダー予定登録
- **機能**: ユーザーの予定を登録し、既存グループに参加または新規グループを作成

## Lambda関数コード

```python
import os
import json
import uuid
from datetime import datetime
import boto3
from boto3.dynamodb.conditions import Attr
from placesapi import search_place_by_name

dynamodb = boto3.resource("dynamodb")
client = boto3.client("dynamodb")

TABLE_USERS = os.environ.get("TABLE_USERS", "users")
TABLE_HOBBIES = os.environ.get("TABLE_HOBBIES", "hobbies")
TABLE_GROUPS = os.environ.get("TABLE_GROUPS", "groups")
TABLE_USER_CALENDAR = os.environ.get("TABLE_USER_CALENDAR", "user_calendars")

t_users = dynamodb.Table(TABLE_USERS)
t_hobbies = dynamodb.Table(TABLE_HOBBIES)
t_groups = dynamodb.Table(TABLE_GROUPS)
t_ucal = dynamodb.Table(TABLE_USER_CALENDAR)

# --- 入力バリデーションのみ（表記ゆれ吸収/日本語変換はしない） ---
def normalize_payload(body: dict) -> dict:
    required = ["hobbyId", "userId", "date", "timeSlot", "intensity"]
    for key in required:
        if key not in body:
            raise ValueError(f"Missing required field: {key}")

    # YYYY-MM-DD チェック
    try:
        datetime.strptime(body["date"], "%Y-%m-%d")
    except Exception:
        raise ValueError("date must be 'YYYY-MM-DD'.")

    attendees = body.get("attendees", 1)
    if not isinstance(attendees, int) or attendees <= 0:
        raise ValueError("attendees must be positive integer.")

    return {
        "hobby_id": str(body["hobbyId"]),
        "user_id": str(body["userId"]),
        "date": body["date"],
        "time_slot": body["timeSlot"],     # "morning" / "afternoon" / "evening"
        "intensity": body["intensity"],    # "serious" / "casual"
        "attendees": attendees,
    }

def get_hobby_caps(hobby_id: str):
    resp = t_hobbies.get_item(Key={"id": hobby_id}) 
    item = resp.get("Item")
    if not item:
        raise ValueError(f"hobby_id={hobby_id} not found.")
    min_cap = int(item.get("min_capacity", 2))
    max_cap = int(item.get("max_capacity", 6))
    hobby_name = item["name"]

    return min_cap, max_cap, hobby_name

def scan_available_group_with_filter(hobby_id: str, date_str: str, time_slot: str,
                                     intensity: str, attendees: int, max_capacity: int):
    """
    FilterExpression を使って Scan。
    条件: hobby_id, date, time_slot, intensity
    の中から、(current_count + attendees <= max_capacity) を満たす
    最大 current_count の 1件を返す。
    """
    fe = (
        Attr("hobby_id").eq(hobby_id) &
        Attr("date").eq(date_str) &
        Attr("time_slot").eq(time_slot) &
        Attr("intensity").eq(intensity) &
        Attr("status").eq("recruiting")
    )

    items = []
    kwargs = {"FilterExpression": fe}
    while True:
        resp = t_groups.scan(**kwargs)
        items.extend(resp.get("Items", []))
        if "LastEvaluatedKey" not in resp:
            break
        kwargs["ExclusiveStartKey"] = resp["LastEvaluatedKey"]

    candidates = []
    for g in items:
        cur = int(g.get("count", 0))
        if cur + attendees <= max_capacity:
            candidates.append(g)

    if not candidates:
        return None

    candidates.sort(key=lambda x: int(x.get("count", 0)), reverse=True)
    return candidates[0]

def update_all_user_calendars_to_matched(group_id: str):
    """
    同一 group_id の UserCalendars を全件 matched に更新（効率無視で scan→update）
    """
    fe = Attr("group_id").eq(group_id) & Attr("status").ne("matched")
    kwargs = {"FilterExpression": fe}
    ids_to_update = []

    while True:
        resp = t_ucal.scan(**kwargs)
        for it in resp.get("Items", []):
            ids_to_update.append(it["id"])
        if "LastEvaluatedKey" not in resp:
            break
        kwargs["ExclusiveStartKey"] = resp["LastEvaluatedKey"]

    for uc_id in ids_to_update:
        t_ucal.update_item(
            Key={"id": uc_id},
            UpdateExpression="SET #st = :m",
            ExpressionAttributeNames={"#st": "status"},
            ExpressionAttributeValues={":m": "matched"},
        )

def lambda_handler(event, context):
    
    try:
        body = json.loads(event.get("body") or "{}")
        data = normalize_payload(body)

        hobby_id   = data["hobby_id"]
        user_id    = data["user_id"]
        date_str   = data["date"]
        time_slot  = data["time_slot"]
        intensity  = data["intensity"]
        attendees  = data["attendees"]

        min_cap, max_cap, hobby_name = get_hobby_caps(hobby_id)

        
        group = scan_available_group_with_filter(
            hobby_id, date_str, time_slot, intensity, attendees, max_cap
        )

        transact_items = []

        def next_status(after_count: int):
            return "matched" if after_count >= min_cap else "recruiting"

        if group:
            # 既存グループに参加
            group_id = group["id"]
            cur = int(group.get("count", 0))
            after = cur + attendees
            status_after = next_status(after)

            limit_value = max_cap - attendees  # after = count + attendees <= max_cap  <=>  count <= max_cap - attendees

            transact_items.append({
                "Update": {
                    "TableName": TABLE_GROUPS,
                    "Key": {"id": {"S": group_id}},
                    # 予約語 'count' を #cnt エイリアスで回避
                    "UpdateExpression": "SET #cnt = #cnt + :a, #st = :st",
                    # ← 算術はNGなので「現在値で比較」に変更
                    "ConditionExpression": "#st_in = :recruit AND #cnt <= :limit",
                    "ExpressionAttributeNames": {
                        "#cnt": "count",
                        "#st": "status",
                        "#st_in": "status"
                    },
                    "ExpressionAttributeValues": {
                        ":a":       {"N": str(attendees)},
                        ":st":      {"S": status_after},     # 更新後ステータス
                        ":recruit": {"S": "recruiting"},     # 現在ステータスが募集状態
                        ":limit":   {"N": str(limit_value)}  # max_cap - attendees
                    }
                }
            })


        else:
            # 新規グループ作成
            group_id = str(uuid.uuid4())
            after = attendees
            status_after = next_status(after)

            transact_items.append({
                "Put": {
                    "TableName": TABLE_GROUPS,
                    "Item": {
                        "id": {"S": group_id},
                        "hobby_id": {"S": hobby_id},
                        "date": {"S": date_str},
                        "time_slot": {"S": time_slot},
                        "intensity": {"S": intensity},
                        "count": {"N": str(attendees)},
                        "status": {"S": status_after},
                        "shops": {"L": []}
                    },
                    "ConditionExpression": "attribute_not_exists(id)"
                }
            })

        # 申込ユーザのカレンダー追加
        uc_id = str(uuid.uuid4())
        transact_items.append({
            "Put": {
                "TableName": TABLE_USER_CALENDAR,
                "Item": {
                    "id": {"S": uc_id},
                    "user_id": {"S": user_id},
                    "hobby_id": {"S": hobby_id},
                    "group_id": {"S": group_id},
                    "date": {"S": date_str},
                    "time_slot": {"S": time_slot},
                    "intensity": {"S": intensity},
                    "attendees": {"N": str(attendees)},
                    "status": {"S": "matched" if status_after == "matched" else "recruiting"},
                },
                "ConditionExpression": "attribute_not_exists(id)"
            }
        })

        # 原子的にコミット
        client.transact_write_items(TransactItems=transact_items)

        # --- ここから threshold 到達後の一括ステータス更新 ---
        if after >= min_cap:
            # Groups: recruiting → matched（既に matched なら無視）
            try:
                t_groups.update_item(
                    Key={"id": group_id},
                    UpdateExpression="SET #st = :m",
                    ConditionExpression=Attr("status").eq("recruiting"),
                    ExpressionAttributeNames={"#st": "status"},
                    ExpressionAttributeValues={":m": "matched"},
                )
            except t_groups.meta.client.exceptions.ConditionalCheckFailedException:
                pass

            # UserCalendars: 同 group_id を matched に
            update_all_user_calendars_to_matched(group_id)

        # 最新グループ情報でレスポンス形成（英語のまま返す）
        g = t_groups.get_item(Key={"id": group_id}).get("Item", {}) or {}

        # === if / else 共通で Google API 呼び出し ===
        if g.get("status") == "matched" and (not g.get("shops")):
            keyword = event.get("keyword", hobby_name)
            try:
                results = search_place_by_name(keyword, limit=3)
                shop_list = results if isinstance(results, list) else []
                t_groups.update_item(
                    Key={"id": group_id},
                    UpdateExpression="SET shops = :s",
                    ExpressionAttributeValues={":s": shop_list}
                )
                g["shops"] = shop_list
            except Exception:
                g["shops"] = []

        res = {
            "calendarId": uc_id,
            "status": g.get("status", "recruiting"),
        }

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(res, ensure_ascii=False)
        }

    except ValueError as ve:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": str(ve)}, ensure_ascii=False),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": "internal error", "detail": str(e)}, ensure_ascii=False),
        }
```

## リクエスト例

```json
{
  "hobbyId": "1",
  "userId": "a1b2c3d4",
  "date": "2024-12-25",
  "timeSlot": "afternoon",
  "intensity": "casual",
  "attendees": 2
}
```

## レスポンス例

```json
{
  "calendarId": "e5f6g7h8",
  "status": "recruiting"
}
```

## 機能詳細

### マッチングロジック
1. **既存グループ検索**: 同じ趣味・日付・時間帯・強度の募集グループを検索
2. **定員チェック**: 現在の参加者数 + 新規参加者数 ≤ 最大定員
3. **グループ選択**: 参加者数が最も多いグループを選択
4. **新規グループ作成**: 条件に合うグループがない場合は新規作成

### トランザクション処理
- DynamoDBの`transact_write_items`を使用して原子性を保証
- グループ更新とユーザーカレンダー登録を同時実行

### ステータス管理
- **recruiting**: 募集中（最小定員未満）
- **matched**: マッチング完了（最小定員以上）

## 環境変数
- `TABLE_USERS`: ユーザーテーブル名
- `TABLE_HOBBIES`: 趣味テーブル名
- `TABLE_GROUPS`: グループテーブル名
- `TABLE_USER_CALENDAR`: ユーザーカレンダーテーブル名

## エラーハンドリング
- **400**: 必須フィールド不足、日付形式エラー、無効な参加者数
- **500**: 内部エラー、DynamoDBエラー

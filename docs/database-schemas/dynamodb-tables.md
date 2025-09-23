# DynamoDB テーブル設計

## テーブル一覧

### 1. users テーブル
**用途**: ユーザー情報の管理

| 属性名 | 型 | 説明 | 必須 |
|--------|----|----|------|
| id | String | ユーザーID（パーティションキー） | ✓ |
| name | String | ユーザー名 | ✓ |
| email | String | メールアドレス | ✓ |
| phone_number | String | 電話番号 | - |
| address | String | 住所 | - |
| bio | String | 自己紹介 | - |

**インデックス**: なし（emailでの検索はScanを使用）

### 2. hobbies テーブル
**用途**: 趣味カテゴリーの管理

| 属性名 | 型 | 説明 | 必須 |
|--------|----|----|------|
| id | String | 趣味ID（パーティションキー） | ✓ |
| name | String | 趣味名 | ✓ |
| min_capacity | Number | 最小定員 | ✓ |
| max_capacity | Number | 最大定員 | ✓ |

**インデックス**: なし

### 3. groups テーブル
**用途**: マッチンググループの管理

| 属性名 | 型 | 説明 | 必須 |
|--------|----|----|------|
| id | String | グループID（パーティションキー） | ✓ |
| hobby_id | String | 趣味ID | ✓ |
| date | String | 日付（YYYY-MM-DD） | ✓ |
| time_slot | String | 時間帯（morning/afternoon/evening） | ✓ |
| intensity | String | 参加レベル（serious/casual） | ✓ |
| count | Number | 現在の参加者数 | ✓ |
| status | String | ステータス（recruiting/matched） | ✓ |
| shops | List | 店舗リスト（JSON配列） | - |

**インデックス**: なし（複合条件での検索はScanを使用）

### 4. user_calendars テーブル
**用途**: ユーザーのカレンダーエントリ管理

| 属性名 | 型 | 説明 | 必須 |
|--------|----|----|------|
| id | String | カレンダーID（パーティションキー） | ✓ |
| user_id | String | ユーザーID | ✓ |
| hobby_id | String | 趣味ID | ✓ |
| group_id | String | グループID | ✓ |
| date | String | 日付（YYYY-MM-DD） | ✓ |
| time_slot | String | 時間帯（morning/afternoon/evening） | ✓ |
| intensity | String | 参加レベル（serious/casual） | ✓ |
| attendees | Number | 参加者数 | ✓ |
| status | String | ステータス（recruiting/matched） | ✓ |

**インデックス**: なし（user_idでの検索はScanを使用）

### 5. group_chat テーブル
**用途**: グループチャットメッセージの管理

| 属性名 | 型 | 説明 | 必須 |
|--------|----|----|------|
| id | String | チャットID（パーティションキー） | ✓ |
| group_id | String | グループID | ✓ |
| user_id | String | ユーザーID | ✓ |
| timestamp | String | タイムスタンプ（ISO 8601） | ✓ |
| message | String | メッセージ内容 | ✓ |

**インデックス**: なし

## データ型の詳細

### String型
- すべての文字列はUTF-8エンコーディング
- 日付は`YYYY-MM-DD`形式
- タイムスタンプはISO 8601形式

### Number型
- 整数のみ使用
- 負の値は使用しない

### List型
- shops属性のみで使用
- JSON配列として格納

## パーティションキー設計

### 設計方針
- すべてのテーブルで`id`をパーティションキーとして使用
- UUIDまたは短縮UUIDを使用して分散を図る
- ソートキーは使用しない（シンプルな設計）

### 分散の考慮
- ユーザーID: `str(uuid.uuid4())[:8]`で8文字の短縮UUID
- グループID: `str(uuid.uuid4())`で完全なUUID
- カレンダーID: `str(uuid.uuid4())`で完全なUUID

## クエリパターン

### 主要なクエリパターン
1. **ユーザー別カレンダー取得**: `user_calendars`テーブルで`user_id`によるScan
2. **グループ検索**: `groups`テーブルで複合条件によるScan
3. **趣味一覧取得**: `hobbies`テーブルの全件Scan
4. **ユーザー検索**: `users`テーブルで`email`によるScan

### パフォーマンス考慮事項
- 現在の実装ではScan操作を多用
- 本格運用時はGSI（Global Secondary Index）の検討が必要
- 特に`user_id`と`email`での検索はGSI化を推奨

## データ整合性

### トランザクション
- カレンダー登録時は`transact_write_items`を使用
- グループ更新とユーザーカレンダー登録を原子性保証

### 制約事項
- 外部キー制約はアプリケーションレベルで実装
- データの整合性はLambda関数内でチェック

## バックアップ・復旧

### バックアップ設定
- DynamoDBのPoint-in-Time Recoveryを有効化
- 定期的なバックアップは不要（マネージドサービス）

### 復旧手順
- AWS CLIまたはコンソールから復旧実行
- 復旧時間はデータ量に依存

## セキュリティ

### 暗号化
- 保存時暗号化: AWS KMSによる暗号化
- 転送時暗号化: HTTPS/TLS

### アクセス制御
- IAMロールによる最小権限の原則
- Lambda関数専用のIAMロールを作成

## コスト最適化

### 課金モード
- オンデマンド課金モードを使用
- プロビジョンドキャパシティは使用しない

### データライフサイクル
- 古いデータの自動削除は実装していない
- 必要に応じてTTL（Time To Live）の検討

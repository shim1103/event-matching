# DESIGN

最終更新: 2026-08-23

地図・起動・確認手順は `README.md`。本書は **このリポに実在する境界・依存・I/O・認証・test配置** だけを書く。存在しない層・Port・coverage gate は置かない。

## 1. System境界

| 系 | 責務 | 依存してよいもの |
|----|------|------------------|
| browser SPA（`src/`） | 画面・認証 UI・API 呼び出し | Amplify Auth、API Gateway（`fetch`） |
| Amplify | Cognito 認証、Hosting | AWS |
| API Gateway + Lambda | ユーザー・カレンダー・趣味の読み書き | DynamoDB |
| DynamoDB | 永続化 | なし |

禁止: 設計規則を `README.md` へ写すこと。schema / 応答形の百科を本書へ置くこと。

## 2. 全体構成

```text
browser
  Amplify Auth（Cognito）
  → React Router（画面）
  → services/api（DTO + fetch）
        ↓
  API Gateway（URL の正は constants の BASE_URL）
        ↓
  Lambda（Python） → DynamoDB
```

Hosting は Amplify Hosting。SPA fallback は `public/_redirects` の `/* /index.html 200`。

Amplify `backend-config` にある category は `auth` と `hosting`。`api` category は無い。API は Amplify 外の API Gateway。

## 3. Componentと責務

| 場所 | 責務 |
|------|------|
| `src/pages/` | 画面 |
| `src/components/` | 共通 UI |
| `src/services/api/dto/` | 送受信型の正 |
| `src/services/api/client.ts` | endpoint 関数 |
| `src/services/api/api.ts` | `fetch` 実行 |
| `src/utils/constants.ts` | `BASE_URL` ほか画面定数 |
| `src/dummydata/` | 画面が参照する固定 JSON |
| Lambda / DynamoDB | この repo 外。呼び出し側だけが残る |

## 4. 依存方向

確認できる向き:

1. page / App → `services/api/client.ts` → `api.ts` → `BASE_URL` + `fetch`
2. page の一部 → `src/dummydata/*.json` を直接 import
3. router → page + `AuthenticatedLayout`

page が API Gateway の URL を直接持たない。URL の正は `constants.ts` の `BASE_URL`。

## 5. Dataと外部I/O

| 操作 | 入口（名前だけ） | 実体 |
|------|------------------|------|
| ユーザー登録 | `POST /users` | API Gateway |
| カレンダー登録 | `POST /forms` | API Gateway |
| カレンダー一覧 | `GET /users/:id/calendars` | API Gateway |
| カレンダー詳細 | `GET /users/:id/calendars/:id` | API Gateway |
| 趣味一覧 | `GET /hobbies` | API Gateway |

`API_ENDPOINTS` 定数（`/api/events` 等）は存在するが、`client.ts` は使っていない。

dummy JSON を import している箇所: `Dashboard`、`Recruiting`、`Proposal`、`calendarApi.ts`。

`REACT_APP_*` を読む実行経路は無い。起動に環境変数は必須ではない。

## 6. 認証と公開境界

1. 入場は Amplify Auth（Cognito）。`/` が認証画面
2. `/dashboard` `/register` `/recruiting` `/proposal` は `AuthenticatedLayout` 配下
3. 未定義 path は `/` へ戻す
4. API Gateway URL は repo 内定数。token 付与の詳細は写さない
5. マルチテナント運用は定義していない

## 7. Testの配置

| 種類 | 場所 | 範囲 |
|------|------|------|
| CRA 初期 test | `src/App.test.tsx` | `<App />` に `learn react` が出るか |

unit / integration の配置規則は未定義。理想の pyramid は置かない。

## 8. 現在の制約

1. 4日間ハッカソンの prototype。Clean Architecture の層・Port・`contracts/` は採用していない
2. API は Amplify 管理下に無い。Gateway が機能ごとに分かれる
3. 画面の一部は dummy JSON に依存する
4. `npm test` は初期 scaffold のまま

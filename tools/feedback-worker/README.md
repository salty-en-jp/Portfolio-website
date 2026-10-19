# Elevator Talk フィードバック用 Worker

Elevator Talk（`works/elevator-talk/`）から呼ばれ、Gemini API に英文を送ってフィードバックを返す中継サーバーです。
APIキーをWebページに置かないために使います。

## セットアップ（Cloudflare の管理画面）

画面の名前は変わることがあります。

1. **Workers & Pages** → **作成** → **Worker を作成**（Hello World のひな形でよい）→ 名前を `elevator-talk-feedback` にしてデプロイ
2. **コードを編集** を開き、中身を `worker.js` の内容に置き換えて **デプロイ**
3. **設定** → **変数とシークレット** で次を追加
   - `GEMINI_API_KEY`：種類を **シークレット** にして、Google AI Studio で発行したAPIキーを貼る
   - `GEMINI_MODEL`（任意）：Google AI Studio で使えるモデル名。未設定なら `gemini-3.5-flash-lite`
4. Worker のURL（`https://elevator-talk-feedback.<アカウント名>.workers.dev`）を `works/elevator-talk/config.js` の `feedbackEndpoint` に書く

## 守り

- `https://salty-en-jp.github.io` 以外のページからの呼び出しは拒否する
- 1回に送れる文章は1200文字まで
- 返ってきた内容は件数と長さを切り詰めてから返す

使われすぎを防ぐため、Google AI Studio 側でも利用状況を時々確認してください。
必要なら Cloudflare の管理画面で、この Worker への回数制限（レート制限）ルールを追加します。

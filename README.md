# Portfolio | 塩田 颯

GitHub Pagesで公開するためのポートフォリオサイトです。

## Overview

Webアプリケーションやゲームなど、興味を持ったものを企画・実装し、
試行錯誤しながら形にしてきた制作物をまとめています。

このサイトでは、主に以下の内容を紹介しています。

- About：制作に対する考え方
- Skills：これまで使用してきた技術
- Works：制作したWebアプリケーション
- Activities：学校での活動・掲載実績

## Main Work

### Educational Video Creator

動画学習を管理するWebアプリケーションのプロトタイプです。

自宅PCをサーバーとして使用し、LAN内の端末から動画教材を視聴できます。
単純な動画再生だけではなく、視聴状況をサーバー側で管理し、
学習の進捗を確認できる仕組みを実装しています。

主な機能：

- 動画のストリーミング再生
- 5秒ごとのハートビートによる再生位置の送信
- 視聴済み区間の管理
- シークによる飛ばし見への対策
- 極端な倍速再生への対策
- 動画途中へのクイズ挿入
- クイズ不正解時の巻き戻し
- ログイン機能
- 管理者画面
- 動画教材のアップロード・管理

使用技術：

- Python
- FastAPI
- JavaScript
- HTML / CSS
- Uvicorn

Repository:

https://github.com/salty-en-jp/Educational_video_creator

## Skills

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Python
- FastAPI
- WebSocket

### Development

- Git
- GitHub

## Activities

### 学生プレス / 学生ブログ

さいたまIT・WEB専門学校の学生プレスの活動として、
学校公式サイトに掲載される学生ブログを執筆しました。

掲載記事：

https://www.siw.ac.jp/archives/4059

## Design

サイトは、作品そのものと文章が見やすくなることを優先し、
白を基調としたシンプルなデザインにしています。

大きな写真や装飾を多用せず、余白と文字の大きさ・配置によって
情報を整理しています。

## File Structure

```text
.
├── index.html
├── style.css
├── favicon.svg      # ブラウザのタブに表示するアイコン
├── ogp.png          # SNS共有時のプレビュー画像（1200×630）
├── docs/
│   ├── roadmap.md               # リニューアル計画（ガントチャート・完了条件）
│   └── elevator-talk-spec.md    # 英語学習ツールの仕様書
├── works/
│   └── elevator-talk/           # 英語学習ツール Elevator Talk（静的ページ）
├── tools/
│   └── feedback-worker/         # AIフィードバック用の中継サーバー（Cloudflare Workers）
└── README.md
```

## License

このポートフォリオは個人の制作物として公開しています。
掲載している外部サービス・作品リポジトリ等については、それぞれの利用規約・ライセンスに従ってください。

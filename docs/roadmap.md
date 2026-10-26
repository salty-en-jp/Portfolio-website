# リニューアル計画

締め切り：2026-11-02

```mermaid
gantt
    title ポートフォリオサイト リニューアル計画
    dateFormat YYYY-MM-DD
    axisFormat %m/%d

    section 0 方針決定
    想定読者・志望職種・ゴール定義        :a0, 2026-10-12, 1d
    完了条件の設定                        :a1, after a0, 1d

    section 1 既存実績の強化
    担当範囲とAI活用の線引きを明記        :b5, after a1, 1d
    実績文の書き直し(課題→設計→工夫→結果→学び) :b1, after a1, 3d
    スクショ・構成図の作成                :b2, after a1, 5d
    デモGIFの撮影・編集                   :b3, after b1, 3d
    埋め込みとスマホ表示の検証            :b4, after b3, 2d
    実績強化完了                          :milestone, m1, after b4, 0d

    section 2 基本情報と導線
    既存バグ修正(改行抜け・グリッド崩れ)  :c0, 2026-10-12, 1d
    About・スキル・経歴の最新化           :c1, after b5, 3d
    連絡先の追加                          :c2, after c1, 1d
    OGP画像・ファビコン設定               :c3, after c2, 2d
    OGPのシェア表示確認                   :c5, after c3, 1d
    更新日の表示(手書き)                  :c4, after c3, 1d
    リニューアル公開                      :milestone, m2, after b4 c5, 0d

    section 3 新規実績(最小プロトタイプ)
    解決したい課題の洗い出し・テーマ決定  :d1, after m2, 1d
    設計                                  :d2, after d1, 2d
    実装                                  :d3, after d2, 3d
    デモ制作と掲載                        :d4, after d3, 3d
    予備日                                :crit, buf, after d4, 2d
    締め切り                              :milestone, m3, 2026-11-02, 0d
```

## ゴールと完了条件

- **想定読者**：まだ職種を絞っていない私を見る人（講師・企業の人）
- **ゴール**：「人が学ぶこと・知ることを、改善する人」だと3分で伝わる
- **新規実績のテーマ**：英語学習の小さな補助ツール（最小プロトタイプ）

### 完了条件

- [ ] すべての実績に画像かGIFが1つ以上ある（Works 02 は開発中のため画像なし）
- [ ] すべての実績に「課題→工夫→結果→学び」が書かれている（Works 01・03 は済み、02 は未対応）
- [x] ボランティア経験（英語指導・環境保全祭りのガイド）が Activities に載っている
- [x] 連絡先がある（Googleフォーム）
- [x] スマホ幅で表示が崩れない（幅320〜1920pxの7サイズで確認）
- [x] 新規実績が最小限の形で公開されている（Elevator Talk、Works 03）

## あとでやるテスト・確認

本人が手元でやるもの。終わったらチェックを入れる。

- [ ] PageSpeed Insights（https://pagespeed.web.dev/）でトップと Elevator Talk を測る（Lighthouse では 2026-10-19 に全項目100を確認済み）
- [ ] 実機のスマホでトップと Elevator Talk の表示を確認する（iPhone と Android）
- [ ] 実機のスマホで Elevator Talk のマイク入力（文字起こし）を試す。特に iPhone の Safari
- [ ] お問い合わせフォームのボタンを押し、フォームが開いて回答を受け付けているか確認する
- [ ] LINE や Slack にURLを貼り、OGP画像が表示されるか確認する
- [ ] Elevator Talk のセリフの型（`works/elevator-talk/data.js` の THEMES）が自然な英語か確認する
- [ ] 違和感チェック8問（同じく CHECK_QUESTIONS）の英語と解説を確認する。特に「very delicious」「play with」の2問
- [ ] サークルのメンバーに Elevator Talk を使ってもらい、型ありと型なしで「話し切れた」割合を比べる

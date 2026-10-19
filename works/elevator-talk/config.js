// AIフィードバック用の中継サーバー（Cloudflare Workers）のURL。
// 空のままだと、フィードバックボタンは押せない状態になります。
window.ELEVATOR_TALK_CONFIG = {
  feedbackEndpoint: "https://elevator-talk-feedback.8810shiota.workers.dev/"
};

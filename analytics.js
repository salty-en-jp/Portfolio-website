// GA4 の独自イベント
// タグ本体（gtag.js）は各ページの <head> のすぐ下に直接貼ってある。このファイルはイベントを送るだけ。
(function () {
  "use strict";

  function send(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    // 「読まれた」：作品欄が画面に入ったら1回だけ送る
    var works = document.getElementById("works");
    if (works && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          send("view_works");
          io.disconnect();
        }
      }, { threshold: 0.15 });
      io.observe(works);
    }

    // ボタンのクリック：data-track の値をラベルとして送る
    document.addEventListener("click", function (e) {
      var el = e.target.closest && e.target.closest("[data-track]");
      if (el) send("cta_click", { cta_name: el.getAttribute("data-track") });
    });

    // 「詳しく見る」を開いたとき
    document.querySelectorAll("details.work-details").forEach(function (d, i) {
      d.addEventListener("toggle", function () {
        if (d.open) send("open_details", { work_index: i + 1 });
      });
    });
  });
})();

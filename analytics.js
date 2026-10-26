// Google アナリティクス 4（GA4）
// MEASUREMENT_ID に GA4 の測定ID（G- で始まる）を入れると計測が始まる。空のままなら何もしない。
(function () {
  "use strict";

  var MEASUREMENT_ID = "";
  if (!MEASUREMENT_ID) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);

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
          window.gtag("event", "view_works");
          io.disconnect();
        }
      }, { threshold: 0.15 });
      io.observe(works);
    }

    // ボタンのクリック：data-track の値をラベルとして送る
    document.addEventListener("click", function (e) {
      var el = e.target.closest && e.target.closest("[data-track]");
      if (el) window.gtag("event", "cta_click", { cta_name: el.getAttribute("data-track") });
    });

    // 「詳しく見る」を開いたとき
    document.querySelectorAll("details.work-details").forEach(function (d, i) {
      d.addEventListener("toggle", function () {
        if (d.open) window.gtag("event", "open_details", { work_index: i + 1 });
      });
    });
  });
})();

(function () {
  "use strict";

  const THEMES = window.THEMES;
  const QUESTIONS = window.CHECK_QUESTIONS;
  const ENDPOINT = (window.ELEVATOR_TALK_CONFIG || {}).feedbackEndpoint || "";
  const FLOORS = 5;

  const $ = (id) => document.getElementById(id);
  const el = {
    theme: $("theme"), level: $("level"), duration: $("duration"), shuffle: $("shuffle"),
    themeTitle: $("themeTitle"), templates: $("templates"), floor: $("floor"), seconds: $("seconds"),
    car: $("car"), start: $("start"), mic: $("mic"), micNote: $("micNote"), answer: $("answer"),
    selfcheck: $("selfcheck"), feedbackBtn: $("feedbackBtn"), feedback: $("feedback"),
    stats: $("stats"), checkMode: $("checkMode"), quiz: $("quiz")
  };

  // ---------- storage (works without it) ----------
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) { /* private mode etc. */ }
    }
  };
  const HISTORY_KEY = "elevatorTalk.history";
  const MISTAKES_KEY = "elevatorTalk.mistakes";

  // ---------- tabs ----------
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-pressed", String(on));
      });
      document.querySelectorAll(".panel").forEach((p) => { p.hidden = p.id !== tab.dataset.tab; });
      if (tab.dataset.tab === "check") renderQuiz();
    });
  });

  // ---------- theme & templates ----------
  // Options are pre-rendered in HTML to avoid layout shift; rebuild only if they drift from data.js.
  if (el.theme.options.length !== THEMES.length || [...el.theme.options].some((o, i) => o.text !== THEMES[i].title)) {
    el.theme.replaceChildren(...THEMES.map((t, i) => new Option(t.title, String(i))));
  }

  function currentTheme() {
    return THEMES[Number(el.theme.value)];
  }

  function visibleTemplates() {
    const level = Number(el.level.value);
    const all = currentTheme().templates;
    return level === 1 ? all : level === 2 ? all.slice(0, 1) : [];
  }

  function renderTheme() {
    el.themeTitle.textContent = currentTheme().title;
    el.templates.replaceChildren();
    const list = visibleTemplates();
    if (list.length === 0) {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = "型なし。自由に話してみましょう。";
      el.templates.append(li);
    }
    list.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      el.templates.append(li);
    });
    if (!running) resetTimer();
  }

  el.theme.addEventListener("change", renderTheme);
  el.level.addEventListener("change", renderTheme);
  el.duration.addEventListener("change", () => { if (!running) resetTimer(); });
  el.shuffle.addEventListener("click", () => {
    let next;
    do { next = Math.floor(Math.random() * THEMES.length); } while (THEMES.length > 1 && String(next) === el.theme.value);
    el.theme.value = String(next);
    renderTheme();
  });

  // ---------- timer & elevator ----------
  let running = false;
  let timerId = null;
  let endAt = 0;

  function totalSeconds() {
    return Number(el.duration.value);
  }

  function paint(remaining) {
    const total = totalSeconds();
    const progress = Math.min(1, Math.max(0, (total - remaining) / total));
    const floor = Math.min(FLOORS, 1 + Math.floor(progress * FLOORS));
    el.seconds.textContent = String(Math.ceil(remaining));
    el.floor.textContent = floor + "F";
    el.car.style.setProperty("--progress", String(progress));
  }

  function resetTimer() {
    paint(totalSeconds());
  }

  function startTimer() {
    running = true;
    endAt = Date.now() + totalSeconds() * 1000;
    el.start.textContent = "ストップ";
    el.selfcheck.hidden = true;
    el.feedback.hidden = true;
    [el.theme, el.level, el.duration, el.shuffle].forEach((c) => { c.disabled = true; });
    if (micWanted) startRecognition();
    tick();
    timerId = setInterval(tick, 200);
  }

  function tick() {
    const remaining = Math.max(0, (endAt - Date.now()) / 1000);
    paint(remaining);
    if (remaining <= 0) stopTimer(true);
  }

  function stopTimer(arrived) {
    running = false;
    clearInterval(timerId);
    el.start.textContent = "もう一度";
    [el.theme, el.level, el.duration, el.shuffle].forEach((c) => { c.disabled = false; });
    stopRecognition();
    if (arrived) el.floor.textContent = FLOORS + "F";
    el.selfcheck.hidden = false;
    updateFeedbackButton();
  }

  el.start.addEventListener("click", () => {
    if (running) {
      stopTimer(false);
    } else {
      startTimer();
      el.answer.focus({ preventScroll: true });
    }
  });

  // ---------- speech recognition (optional) ----------
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let micWanted = false;
  let baseText = "";

  if (Recognition) {
    el.mic.hidden = false;
    el.mic.addEventListener("click", () => {
      micWanted = !micWanted;
      el.mic.textContent = "マイクで話す：" + (micWanted ? "オン" : "オフ");
      el.mic.classList.toggle("is-on", micWanted);
      el.micNote.textContent = micWanted
        ? "スタートすると文字起こしが始まります。音声はブラウザの音声認識サービスに送られます。"
        : "";
      if (running) micWanted ? startRecognition() : stopRecognition();
    });
  } else {
    el.micNote.textContent = "このブラウザでは文字起こしが使えません。キーボードかスマホの音声入力で入力してください。";
  }

  function startRecognition() {
    if (!Recognition || recognition) return;
    recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    baseText = el.answer.value ? el.answer.value.trimEnd() + " " : "";
    recognition.onresult = (event) => {
      let finalText = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript + " ";
        else interim += r[0].transcript;
      }
      el.answer.value = (baseText + finalText + interim).replace(/\s+/g, " ").trimStart();
      updateFeedbackButton();
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        el.micNote.textContent = "マイクが使えませんでした。キーボードかスマホの音声入力で入力してください。";
      }
    };
    recognition.onend = () => {
      // Browsers end recognition after silence; restart while the timer runs.
      if (running && micWanted && recognition) {
        baseText = el.answer.value ? el.answer.value.trimEnd() + " " : "";
        try { recognition.start(); } catch (e) { recognition = null; }
      } else {
        recognition = null;
      }
    };
    try { recognition.start(); } catch (e) { recognition = null; }
  }

  function stopRecognition() {
    if (!recognition) return;
    const r = recognition;
    recognition = null;
    try { r.stop(); } catch (e) { /* already stopped */ }
  }

  // ---------- self check & history ----------
  el.selfcheck.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-result]");
    if (!btn) return;
    const history = store.get(HISTORY_KEY, []);
    history.push({
      at: new Date().toISOString(),
      theme: currentTheme().id,
      level: Number(el.level.value),
      result: btn.dataset.result
    });
    store.set(HISTORY_KEY, history.slice(-200));
    el.selfcheck.hidden = true;
    renderStats();
  });

  function renderStats() {
    const history = store.get(HISTORY_KEY, []);
    if (history.length === 0) {
      el.stats.textContent = "まだ記録はありません。";
      return;
    }
    const done = history.filter((h) => h.result === "done").length;
    const byLevel = [1, 2, 3].map((lv) => {
      const rows = history.filter((h) => h.level === lv);
      if (rows.length === 0) return null;
      const ok = rows.filter((h) => h.result === "done").length;
      return "レベル" + lv + "：" + ok + "/" + rows.length;
    }).filter(Boolean);
    el.stats.textContent = "話し切れた回数 " + done + "/" + history.length + "（" + byLevel.join("、") + "）";
  }

  // ---------- AI feedback ----------
  function updateFeedbackButton() {
    el.feedbackBtn.disabled = !ENDPOINT || running || el.answer.value.trim().length < 3;
    el.feedbackBtn.title = ENDPOINT ? "" : "AIフィードバックは準備中です";
  }
  el.answer.addEventListener("input", updateFeedbackButton);

  el.feedbackBtn.addEventListener("click", async () => {
    const text = el.answer.value.trim();
    el.feedbackBtn.disabled = true;
    el.feedback.hidden = false;
    el.feedback.replaceChildren(makeP("フィードバックを作成中です…", "muted"));
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: currentTheme().title,
          level: Number(el.level.value),
          templates: visibleTemplates(),
          text
        })
      });
      if (!res.ok) throw new Error("status " + res.status);
      const data = await res.json();
      renderFeedback(data);
      saveMistakes(data.improvements || []);
    } catch (err) {
      el.feedback.replaceChildren(makeP("フィードバックを取得できませんでした。時間をおいてもう一度試してください。", "error"));
    } finally {
      updateFeedbackButton();
    }
  });

  function makeP(text, cls) {
    const p = document.createElement("p");
    if (cls) p.className = cls;
    p.textContent = text;
    return p;
  }

  function renderFeedback(data) {
    const good = Array.isArray(data.good_points) ? data.good_points : [];
    const imps = Array.isArray(data.improvements) ? data.improvements : [];
    const frag = document.createDocumentFragment();

    const h1 = document.createElement("h3");
    h1.textContent = "よかったところ";
    frag.append(h1);
    const ul = document.createElement("ul");
    (good.length ? good : ["最後まで挑戦できました。"]).forEach((g) => {
      const li = document.createElement("li");
      li.textContent = String(g);
      ul.append(li);
    });
    frag.append(ul);

    const h2 = document.createElement("h3");
    h2.textContent = "改善ポイント";
    frag.append(h2);
    if (imps.length === 0) {
      frag.append(makeP("目立つ不自然さはありませんでした。", "muted"));
    }
    imps.forEach((imp) => {
      const box = document.createElement("div");
      box.className = "improvement";
      const from = makeP(String(imp.original || ""), "from");
      const to = makeP(String(imp.natural || ""), "to");
      const why = makeP(String(imp.reason || ""), "why");
      box.append(from, to, why);
      frag.append(box);
    });
    if (imps.length) {
      frag.append(makeP("改善ポイントは「違和感チェック → 自分のまちがい」に保存しました。", "muted"));
    }
    frag.append(makeP("AIの指摘はまちがうこともあります。自分の感覚でも確かめてください。", "muted small"));
    el.feedback.replaceChildren(frag);
  }

  function saveMistakes(improvements) {
    const list = store.get(MISTAKES_KEY, []);
    improvements.forEach((imp) => {
      if (!imp || !imp.original || !imp.natural) return;
      if (list.some((m) => m.original === imp.original)) return;
      list.push({
        original: String(imp.original),
        natural: String(imp.natural),
        reason: String(imp.reason || ""),
        streak: 0
      });
    });
    store.set(MISTAKES_KEY, list.slice(-100));
  }

  // ---------- odd-one-out check ----------
  let basicIndex = Math.floor(Math.random() * QUESTIONS.length);

  el.checkMode.addEventListener("change", renderQuiz);

  function renderQuiz() {
    if (el.checkMode.value === "mine") renderMistakeCard();
    else renderBasicQuestion();
  }

  function renderBasicQuestion() {
    const q = QUESTIONS[basicIndex % QUESTIONS.length];
    const frag = document.createDocumentFragment();
    frag.append(makeP("この英文、どこか不自然です。", "card-label"));
    frag.append(makeP(q.sentence, "quiz-sentence"));
    const list = document.createElement("div");
    list.className = "choices";
    q.choices.forEach((c, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.textContent = c;
      b.addEventListener("click", () => {
        list.querySelectorAll("button").forEach((x, j) => {
          x.disabled = true;
          if (j === q.answer) x.classList.add("is-correct");
        });
        if (i !== q.answer) b.classList.add("is-wrong");
        const result = makeP((i === q.answer ? "正解！ " : "おしい。 ") + q.reason, "why");
        const next = document.createElement("button");
        next.type = "button";
        next.className = "primary";
        next.textContent = "次の問題";
        next.addEventListener("click", () => { basicIndex++; renderBasicQuestion(); });
        el.quiz.append(result, next);
      });
      list.append(b);
    });
    frag.append(list);
    el.quiz.replaceChildren(frag);
  }

  function renderMistakeCard() {
    const list = store.get(MISTAKES_KEY, []);
    const pending = list.filter((m) => m.streak < 2);
    if (pending.length === 0) {
      el.quiz.replaceChildren(
        makeP("まだ問題がありません。", "quiz-sentence"),
        makeP("エレベータートークでAIフィードバックをもらうと、改善ポイントがここに問題として追加されます。", "muted")
      );
      return;
    }
    const m = pending[Math.floor(Math.random() * pending.length)];
    const frag = document.createDocumentFragment();
    frag.append(makeP("あなたが話した文です。もっと自然に言うと？", "card-label"));
    frag.append(makeP(m.original, "quiz-sentence"));
    frag.append(makeP("頭の中で言い直してから、答えを見てください。", "muted"));
    const reveal = document.createElement("button");
    reveal.type = "button";
    reveal.className = "primary";
    reveal.textContent = "答えを見る";
    reveal.addEventListener("click", () => {
      reveal.remove();
      const row = document.createElement("div");
      row.className = "choices";
      [["言えた", 1], ["まだ", -1]].forEach(([label, delta]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "choice";
        b.textContent = label;
        b.addEventListener("click", () => {
          const all = store.get(MISTAKES_KEY, []);
          const target = all.find((x) => x.original === m.original);
          if (target) target.streak = Math.max(0, target.streak + delta);
          store.set(MISTAKES_KEY, all);
          renderMistakeCard();
        });
        row.append(b);
      });
      el.quiz.append(makeP(m.natural, "to"), makeP(m.reason, "why"), row);
    });
    frag.append(reveal);
    el.quiz.replaceChildren(frag);
  }

  // ---------- init ----------
  renderTheme();
  renderStats();
  updateFeedbackButton();
})();

// テーマとセリフの型。英語が自然かどうかは本人が確認する。
window.THEMES = [
  {
    id: "intro",
    title: "自己紹介",
    templates: ["Hi, I'm ___.", "I'm a student at ___.", "In my free time, I ___."]
  },
  {
    id: "food",
    title: "好きな食べ物",
    templates: ["My favorite food is ___.", "I like it because ___.", "The best place to eat it is ___."]
  },
  {
    id: "weekend",
    title: "週末の予定",
    templates: ["This weekend, I'm going to ___.", "I'm looking forward to it because ___.", "If it rains, I'll ___."]
  },
  {
    id: "place",
    title: "おすすめの場所",
    templates: ["You should visit ___.", "It's famous for ___.", "The best time to go is ___."]
  },
  {
    id: "lately",
    title: "最近ハマっていること",
    templates: ["Lately, I've been into ___.", "I got into it when ___.", "What I like most about it is ___."]
  }
];

// 違和感チェックの通常問題。answer が choices の中の正解の位置。
window.CHECK_QUESTIONS = [
  {
    sentence: "I'm very interesting in music.",
    choices: ["I'm very interested in music.", "I'm very interest in music.", "I'm very interesting music."],
    answer: 0,
    reason: "自分が興味を持っているときは interested。interesting は「（物事が）おもしろい」。"
  },
  {
    sentence: "Please teach me your phone number.",
    choices: ["Please teach your phone number to me.", "Could you tell me your phone number?", "Please say me your phone number."],
    answer: 1,
    reason: "teach は知識や技術を教えるとき。情報を伝えるときは tell を使う。"
  },
  {
    sentence: "I went to shopping yesterday.",
    choices: ["I went for shopping yesterday.", "I did go to shopping yesterday.", "I went shopping yesterday."],
    answer: 2,
    reason: "go shopping / go swimming のように、go の後ろに -ing を直接つなげる。"
  },
  {
    sentence: "I played with my friends at the mall.",
    choices: ["I hung out with my friends at the mall.", "I played together my friends at the mall.", "I enjoyed with my friends at the mall."],
    answer: 0,
    reason: "大人や学生が友達と遊ぶときは hang out。play with は子どもの遊びに聞こえる。"
  },
  {
    sentence: "Let's enjoy to talk in English!",
    choices: ["Let's enjoy talk in English!", "Let's have fun talking in English!", "Let's enjoy to talking in English!"],
    answer: 1,
    reason: "enjoy の後ろは to ではなく -ing。have fun -ing もよく使う。"
  },
  {
    sentence: "I have been to Kyoto last year.",
    choices: ["I have went to Kyoto last year.", "I was gone to Kyoto last year.", "I went to Kyoto last year."],
    answer: 2,
    reason: "last year のように過去の時点がはっきりしているときは、現在完了ではなく過去形。"
  },
  {
    sentence: "I'm boring, so let's go somewhere.",
    choices: ["I'm bored, so let's go somewhere.", "I'm bore, so let's go somewhere.", "I'm boredom, so let's go somewhere."],
    answer: 0,
    reason: "自分が退屈しているときは bored。I'm boring は「私はつまらない人間だ」になる。"
  },
  {
    sentence: "I'm looking forward to see you.",
    choices: ["I'm looking forward to seeing you.", "I'm looking forward for seeing you.", "I'm looking forward to saw you."],
    answer: 0,
    reason: "look forward to の to は前置詞なので、後ろは動詞の -ing 形になる。"
  }
];

// 上級（どれが自然？）。どれも文法としては正しいが、その場面では natural がいちばん自然な問題。
// others は、正しいけれど硬い・場面に合わない言い方。
window.ADVANCED_QUESTIONS = [
  {
    scene: "友達とラーメンを食べながら",
    natural: "This ramen is so good.",
    others: ["This ramen is very delicious.", "This ramen has a delicious taste."],
    reason: "very delicious もまちがいではないが、delicious はそれだけで「とてもおいしい」。has a delicious taste は説明書きのようで回りくどい。友達との会話では so good や really good のほうがよく使われる。"
  },
  {
    scene: "友達に「元気？」と聞かれて",
    natural: "Pretty good! How about you?",
    others: ["I'm fine, thank you. And you?", "I'm in good health."],
    reason: "I'm fine, thank you. も正しいが、教科書どおりで少し硬く、そっけなく聞こえることもある。I'm in good health. は「体の調子」の話になり、健康診断のよう。友達には Pretty good! や Not bad! が気軽。"
  },
  {
    scene: "友達を少し待たせるとき",
    natural: "Hang on a sec.",
    others: ["Please wait a moment.", "Would you kindly wait for a moment?"],
    reason: "Please wait a moment. はお店や受付のような丁寧な場面向き。Would you kindly ...? はさらに改まった言い方で、友達に使うと冗談か皮肉に聞こえる。友達には Hang on a sec. や Just a sec. が自然。"
  },
  {
    scene: "初対面の人に趣味を聞くとき",
    natural: "What do you like to do in your free time?",
    others: ["What's your hobby?", "What is your favorite pastime?"],
    reason: "What's your hobby? も通じるが、hobby は「打ち込んでいる趣味」の響きがあり、会話のきっかけとしては少し唐突。pastime は書き言葉っぽく古風。free time を聞くほうが答えやすい。"
  },
  {
    scene: "アメリカのレストランでトイレの場所を聞くとき",
    natural: "Where's the restroom?",
    others: ["Where is the toilet?", "Where is the lavatory?"],
    reason: "toilet はアメリカでは便器そのものを指すことが多く、少し直接的に聞こえる。lavatory は飛行機の中などで使う改まった言葉。お店では restroom（イギリスでは toilet や loo）が自然。"
  }
];

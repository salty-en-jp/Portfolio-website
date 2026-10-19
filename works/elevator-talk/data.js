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
    sentence: "This ramen is very delicious.",
    choices: ["This ramen is much delicious.", "This ramen is so good.", "This ramen is very deliciously."],
    answer: 1,
    reason: "delicious はそれだけで「とてもおいしい」なので very はあまり付けない。会話では so good が自然。"
  }
];

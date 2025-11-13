// 梗圖列表
const MEME_IMAGES = [
  "eatingcat.jpg",      // 你好 我吃一點
  "laolao.jpg",         // 老師 菜菜 捞捞
  "fakerx2.jpg",        // Faker 們
  "studyingdog.jpg",    // 當你廢了兩三個月卻突然要你讀書
  "dancingcat.gif",     // 跳舞貓
  "stresscat.gif",      // AAAAA STRESSS
  "bananacat.gif",      // 香蕉貓
  "oiiaoiiacat.gif",    // OIIAOIIA 貓
  "laughingmouse.jpeg", // 鼠笑
  "germancat.gif"       // 德國貓
];

document.addEventListener("DOMContentLoaded", () => {
  const holes = document.querySelectorAll(".hole");
  if (!holes.length) return;

  const memes = document.querySelectorAll(".meme");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const startBtn = document.getElementById("start-btn");
  const difficultySelect = document.getElementById("difficulty");

  let score = 0;
  let timeLeft = 30;
  let gameTimer = null;
  let memeTimer = null;
  let gameRunning = false;

  const randomItem = list =>
    list[Math.floor(Math.random() * list.length)];

  function resetMemes() {
    memes.forEach(m => {
      m.classList.remove("active");
      m.style.backgroundImage = "";
    });
  }

  function showRandomMeme() {
    resetMemes();
    const hole = randomItem(holes);
    const meme = hole.querySelector(".meme");
    meme.style.backgroundImage = `url("${randomItem(MEME_IMAGES)}")`;
    meme.classList.add("active");
  }

  function startGame() {
    if (gameRunning) return;
    gameRunning = true;

    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    startBtn.disabled = true;

    const speed = Number(difficultySelect.value) || 800;

    showRandomMeme();
    memeTimer = setInterval(showRandomMeme, speed);

    gameTimer = setInterval(() => {
      timeLeft -= 1;
      timeEl.textContent = timeLeft;

      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    clearInterval(gameTimer);
    clearInterval(memeTimer);
    gameRunning = false;
    startBtn.disabled = false;

    resetMemes();

    alert(`時間到！你的分數是：${score}`);

    const playerName =
      prompt("輸入你的名字（將記錄在排行榜）：", "Player") || "Player";

    // ---- Top5 排行榜整合 ----
    const leaderboard =
      JSON.parse(localStorage.getItem("memeLeaderboard") || "[]");

    leaderboard.push({ name: playerName, score });

    leaderboard.sort((a, b) => b.score - a.score);

    const top5 = leaderboard.slice(0, 5);

    localStorage.setItem("memeLeaderboard", JSON.stringify(top5));
    // -------------------------

    alert("本次分數已加入排行榜！");
  }

  holes.forEach(hole => {
    hole.addEventListener("click", () => {
      if (!gameRunning) return;

      const meme = hole.querySelector(".meme");

      if (meme.classList.contains("active")) {
        score += 1;
        meme.classList.remove("active");
        meme.style.backgroundImage = "";
      } else {
        score -= 1;
      }

      scoreEl.textContent = score;
    });
  });

  startBtn.addEventListener("click", startGame);
});

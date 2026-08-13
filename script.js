let currentUser = null; // Quản lý tài khoản đăng nhập

const gameState = {
  day: 1,
  maxDays: 40,
  water: 100,
  food: 100,
  health: 100,
  faith: 50,
  hasMaintainedFullFaith: true,
  isHardcore: false,
  timerInterval: null,
  timeLeft: 10,
  currentWeather: "normal",
};

const eventPool = [
  {
    day: 1,
    icon: "🐪",
    title: "Năm thứ 1: Rời khỏi Ai-cập",
    desc: "Bỏ lại phía sau kiếp nô lệ, đoàn người bỡ ngỡ bước qua ranh giới tự do theo tiếng gọi của Thiên Chúa.",
    choices: [
      {
        text: "Hân hoan cất bước theo ơn gọi, dâng trọn lòng tin tưởng",
        water: 0,
        food: 0,
        health: 0,
        faith: 15,
      },
    ],
  },
  {
    day: 2,
    icon: "🌊",
    title: "Năm thứ 2: Biển Đỏ & Suối Ma-ra",
    desc: "Vượt qua dòng nước rẽ lối kỳ diệu, nhưng đoàn người lại đối diện với nguồn nước đắng ngắt tại Ma-ra.",
    choices: [
      {
        text: "Oán trách hoàn cảnh khắc nghiệt, tự tìm đường đi riêng",
        water: 10,
        food: 0,
        health: -10,
        faith: -25,
      },
      {
        text: "Kiên nhẫn cầu nguyện, dùng cành cây thanh lọc dòng nước theo lời chỉ dẫn",
        water: 10,
        food: 0,
        health: 0,
        faith: 10,
        rewardCard: 2,
      },
    ],
  },
  ...Array.from({ length: 37 }, (_, index) => {
    const yearNum = index + 3;
    const eventsList = [
      {
        icon: "🍞",
        title: `Năm thứ ${yearNum}: Sa mạc Sin & Bánh Man-na`,
        desc: `Năm thứ ${yearNum} trong hoang địa. Lương thực cạn kiệt, bánh Man-na rơi xuống từ trời mỗi sớm mai. Thử thách lòng tin qua việc tuân thủ luật lệ.`,
        choices: [
          {
            text: "Cố tình tích trữ thật nhiều lương thực qua đêm cho chắc ăn",
            water: 0,
            food: 25,
            health: 0,
            faith: -25,
            hoardedFood: true,
          },
          {
            text: "Chỉ nhặt vừa đủ dùng trong ngày theo Lời Chúa dạy",
            water: 0,
            food: 10,
            health: 5,
            faith: 15,
            rewardCard: 1,
          },
        ],
      },
      {
        icon: "⛏️",
        title: `Năm thứ ${yearNum}: Cơn khát tại Rê-phi-đim`,
        desc: `Năm thứ ${yearNum}: Nắng cháy da thịt, dân chúng nổi giận vì khát nước và suýt ném đá lãnh đạo.`,
        choices: [
          {
            text: "Tranh chấp hỗn loạn để giành giật nguồn nước ít ỏi",
            water: 20,
            food: 0,
            health: -15,
            faith: -30,
          },
          {
            text: "Lặng lẽ quỳ xuống kêu cầu và đập gậy vào tảng đá hoang mạc",
            water: 30,
            food: 0,
            health: 5,
            faith: 15,
            rewardCard: 3,
          },
        ],
      },
      {
        icon: "📜",
        title: `Năm thứ ${yearNum}: Giao ước núi Xi-nai`,
        desc: `Năm thứ ${yearNum}: Dựng lều quanh ngọn núi thánh sấm chớp bao trùm, đón nhận Mười Điều Răn làm la bàn sống.`,
        choices: [
          {
            text: "Khắc ghi luật pháp vào tâm trí, hết lòng tuân giữ",
            water: 0,
            food: 0,
            health: 5,
            faith: 20,
            rewardCard: 4,
          },
        ],
      },
      {
        icon: "🐂",
        title: `Năm thứ ${yearNum}: Cơn cám dỗ Bê Vàng`,
        desc: `Năm thứ ${yearNum}: Giữa lúc chờ đợi mỏi mòn, một bộ phận dân chúng đòi đúc tượng vàng để thỏa mãn giác quan.`,
        choices: [
          {
            text: "Hùa theo đám đông tìm sự an ủi vật chất trước mắt",
            water: 25,
            food: 25,
            health: 10,
            faith: -40,
          },
          {
            text: "Kiên quyết từ chối, đứng vững trong giao ước thánh",
            water: 0,
            food: 0,
            health: 0,
            faith: 20,
            rewardCard: 5,
          },
        ],
      },
      {
        icon: "🐍",
        title: `Năm thứ ${yearNum}: Nạn rắn lửa hoành hành`,
        desc: `Năm thứ ${yearNum}: Sự phàn nàn kéo dài khiến bầy rắn độc xuất hiện cắn chết nhiều người trong trại.`,
        choices: [
          {
            text: "Ngước mắt nhìn lên Con Rắn Đồng với lòng sám hối ăn năn",
            water: 0,
            food: 0,
            health: -10,
            faith: 20,
          },
        ],
      },
    ];
    return eventsList[index % eventsList.length];
  }),
  {
    day: 40,
    icon: "✨",
    title: "Năm thứ 40: Bên kia sông Gio-đan (Đất Hứa)",
    desc: "Trải qua 40 năm thanh luyện qua nhiều thế hệ, những bước chân kiên cường cuối cùng đã đứng trước cửa ngõ Đất Hứa đượm sữa và mật.",
    choices: [
      {
        text: "Cảm tạ Thiên Chúa vì đã trung tín dẫn dắt qua trọn vẹn 40 năm giông bão!",
        water: 0,
        food: 0,
        health: 10,
        faith: 25,
        rewardCard: 6,
      },
    ],
  },
];

const cardCollection = [
  {
    id: 1,
    title: "Bánh Từ Trời",
    text: '"Này là bánh từ trời xuống..." (Ga 6, 51)',
    unlocked: false,
    legendary: false,
  },
  {
    id: 2,
    title: "Nguồn Sức Mạnh",
    text: '"Chúa là sức mạnh tôi..." (Tv 28, 7)',
    unlocked: false,
    legendary: false,
  },
  {
    id: 3,
    title: "Đôi Tay Cầu Nguyện",
    text: '"Khi tay Mô-se giơ lên..." (Xh 17, 11)',
    unlocked: false,
    legendary: false,
  },
  {
    id: 4,
    title: "Giao Ước Vĩnh Cửu",
    text: '"Ta sẽ là Thiên Chúa của các ngươi..." (Lv 26, 12)',
    unlocked: false,
    legendary: false,
  },
  {
    id: 5,
    title: "Trung Thành Tuyệt Đối",
    text: '"Ngươi phải thờ lạy Chúa..." (Mt 4, 10)',
    unlocked: false,
    legendary: false,
  },
  {
    id: 6,
    title: "Lữ Khách Bình An",
    text: '"Chúa là mục tử chăn dắt tôi..." (Tv 23, 1)',
    unlocked: false,
    legendary: false,
  },
  {
    id: 7,
    title: "Cột Mây Cột Lửa",
    text: '"Ban ngày cột mây, ban đêm cột lửa..." (Xh 13, 21)',
    unlocked: false,
    legendary: true,
  },
];

// Xử lý đăng nhập / đăng xuất
function handleLogin() {
  const inputVal = document.getElementById("username-input").value.trim();
  if (!inputVal) {
    alert("Vui lòng nhập tên tài khoản hợp lệ!");
    return;
  }
  currentUser = inputVal;
  alert(
    `Đăng nhập thành công: ${currentUser}! Thành tựu của bạn sẽ được lưu giữ.`,
  );
  loadSavedCards();
  switchScreen("start-screen");
}

function skipLogin() {
  currentUser = null;
  alert(
    "Bạn đang chơi ở chế độ khách. Thành tựu sẽ không được lưu và sẽ mất khi tải lại trang!",
  );
  loadSavedCards();
  switchScreen("start-screen");
}

function logout() {
  currentUser = null;
  cardCollection.forEach((c) => (c.unlocked = false));
  updateCodexCount();
  document.getElementById("username-input").value = "";
  switchScreen("login-screen");
}

function loadSavedCards() {
  if (!currentUser) {
    cardCollection.forEach((c) => (c.unlocked = false));
    updateCodexCount();
    return;
  }
  const saved = localStorage.getItem(`desert_cards_${currentUser}`);
  if (saved) {
    const savedIds = JSON.parse(saved);
    cardCollection.forEach((c) => {
      if (savedIds.includes(c.id)) c.unlocked = true;
    });
  } else {
    cardCollection.forEach((c) => (c.unlocked = false));
  }
  updateCodexCount();
}

function saveCards() {
  if (!currentUser) return; // Không login thì KHÔNG LƯU
  const unlockedIds = cardCollection.filter((c) => c.unlocked).map((c) => c.id);
  localStorage.setItem(
    `desert_cards_${currentUser}`,
    JSON.stringify(unlockedIds),
  );
  updateCodexCount();
}

function updateCodexCount() {
  const count = cardCollection.filter((c) => c.unlocked).length;
  document.getElementById("card-count").innerText = count;
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === "water") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      600,
      audioCtx.currentTime + 0.25,
    );
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } else if (type === "danger") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc.frequency.setValueAtTime(130, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }
}

let typewriterTimeout;
function typeWriter(text, elementId, callback) {
  const el = document.getElementById(elementId);
  el.innerText = "";
  clearTimeout(typewriterTimeout);
  let i = 0;
  function typing() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i);
      i++;
      typewriterTimeout = setTimeout(typing, 20);
    } else if (callback) {
      callback();
    }
  }
  typing();
}

function startGame(hardcore = false) {
  gameState.isHardcore = hardcore;
  gameState.day = 1;
  gameState.water = 100;
  gameState.food = 100;
  gameState.health = 100;
  gameState.faith = 50;
  gameState.hasMaintainedFullFaith = true;
  gameState.currentWeather = "normal";

  document.getElementById("game-container").classList.remove("golden-aura");
  switchScreen("game-screen");
  loadNextEvent();
}

function switchScreen(screenId) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function randomizeWeather() {
  const rand = Math.random();
  const weatherBadge = document.getElementById("weather-badge");
  if (rand < 0.3) {
    gameState.currentWeather = "storm";
    weatherBadge.className = "weather-storm";
    weatherBadge.innerText = "🌪️ Bão Cát Hoang Mạc";
    gameState.water -= 8;
    gameState.health -= 5;
  } else if (rand < 0.55) {
    gameState.currentWeather = "cold";
    weatherBadge.className = "weather-cold";
    weatherBadge.innerText = "❄️ Đêm Lạnh Thấu Xương";
    gameState.health -= 8;
  } else {
    gameState.currentWeather = "normal";
    weatherBadge.className = "weather-normal";
    weatherBadge.innerText = "☀️ Nắng Gắt";
  }
}

function loadNextEvent() {
  if (
    gameState.water <= 0 ||
    gameState.food <= 0 ||
    gameState.health <= 0 ||
    gameState.faith <= 0
  ) {
    stopTimer();
    endGame(false);
    return;
  }
  if (gameState.day > gameState.maxDays) {
    stopTimer();
    endGame(true);
    return;
  }

  if (gameState.day === 1) {
    gameState.currentWeather = "normal";
    const weatherBadge = document.getElementById("weather-badge");
    weatherBadge.className = "weather-normal";
    weatherBadge.innerText = "☀️ Nắng Gắt";
  } else {
    randomizeWeather();
  }
  updateUI();

  const currentEvent =
    eventPool[gameState.day - 1] || eventPool[eventPool.length - 1];

  document.getElementById("visual-icon").innerText = currentEvent.icon;
  document.getElementById("story-title").innerText = currentEvent.title;
  typeWriter(currentEvent.desc, "story-desc");

  const choicesPanel = document.getElementById("choices-panel");
  choicesPanel.innerHTML = "";

  currentEvent.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = choice.text;
    btn.onclick = () => {
      stopTimer();
      handleChoice(choice);
    };
    choicesPanel.appendChild(btn);
  });

  if (gameState.isHardcore) {
    startTimer();
  }
}

function startTimer() {
  stopTimer();
  gameState.timeLeft = 10;
  let timerContainer = document.getElementById("timer-container");
  const panel = document.getElementById("choices-panel");

  if (!timerContainer) {
    timerContainer = document.createElement("div");
    timerContainer.id = "timer-container";
    panel.parentNode.insertBefore(timerContainer, panel);
  }
  timerContainer.innerHTML = `⏱️ Thời gian suy nghĩ: <span id="time-left">10</span>s`;

  gameState.timerInterval = setInterval(() => {
    gameState.timeLeft--;
    const timeEl = document.getElementById("time-left");
    if (timeEl) timeEl.innerText = gameState.timeLeft;

    if (gameState.timeLeft <= 0) {
      stopTimer();
      handleChoice({ water: -15, food: -15, health: -15, faith: -20 });
    }
  }, 1000);
}

function stopTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
  const timerContainer = document.getElementById("timer-container");
  if (timerContainer) timerContainer.remove();
}

function handleChoice(choice) {
  gameState.water += choice.water || 0;
  gameState.food += choice.food || 0;
  gameState.health += choice.health || 0;
  gameState.faith += choice.faith || 0;

  // Cân bằng man-na vừa phải
  if ((choice.faith || 0) > 0) {
    gameState.food += 3;
    gameState.water += 3;
    gameState.health += 2;
  }

  if (choice.hoardedFood && gameState.food > 70) {
    gameState.food -= 25;
    gameState.faith -= 15;
    setTimeout(() => {
      alert(
        "⚠️ Chuột bọ đã phá hoại số lương thực tích trữ trái luật! (-25% Lương thực)",
      );
    }, 200);
  }

  gameState.water -= 5;
  gameState.health -= 3;
  gameState.food -= 5;

  if ((choice.faith || 0) < 0) {
    gameState.hasMaintainedFullFaith = false;
  }

  let unlockedCard = null;
  if (choice.rewardCard) {
    const card = cardCollection.find((c) => c.id === choice.rewardCard);
    if (card && !card.unlocked) {
      card.unlocked = true;
      saveCards();
      unlockedCard = card;
    }
  }

  if (
    (choice.water < 0 ||
      choice.food < 0 ||
      choice.health < 0 ||
      choice.faith < 0) &&
    gameState.faith > 0
  ) {
    playSound("danger");
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    triggerEffect("shake", "danger-flash");
  } else {
    playSound("water");
    triggerEffect("", "gold-glow");
  }

  gameState.day++;

  if (gameState.day % 5 === 0 && gameState.day <= gameState.maxDays) {
    triggerNightEvent(() => {
      if (unlockedCard) showScripturePopup(unlockedCard);
      else loadNextEvent();
    });
  } else {
    if (unlockedCard) {
      showScripturePopup(unlockedCard);
    } else {
      loadNextEvent();
    }
  }
}

function triggerNightEvent(callback) {
  const nightEvents = [
    {
      title: "🌙 HOANG ĐỊA: Bầy rắn lửa ban đêm!",
      desc: "Giữa màn đêm buốt giá, tiếng sột soạt vang lên quanh các lều trại. Bầy rắn lửa bò vào tấn công đoàn người!",
      choices: [
        {
          text: "Đốt lửa lớn và cầu nguyện xin ơn bảo vệ (Tốn tài nguyên để giữ mạng)",
          effect: () => {
            gameState.water -= 5;
            gameState.food -= 8;
            gameState.health -= 5;
            gameState.faith += 5;
          },
        },
        {
          text: "Hoảng loạn tự vệ mà không kịp chuẩn bị gì",
          effect: () => {
            gameState.health -= 15;
            gameState.water -= 8;
            gameState.faith -= 10;
          },
        },
      ],
    },
    {
      title: "🌙 HOANG ĐỊA: Cơn lạnh thấu xương",
      desc: "Nhiệt độ sa mạc tụt dốc không phanh, cái lạnh buốt giá làm tê cóng những thế hệ trẻ sinh ra trong hoang địa.",
      choices: [
        {
          text: "Hy sinh bớt lương thực dự trữ để nấu nước ấm sưởi ấm cho đoàn",
          effect: () => {
            gameState.food -= 12;
            gameState.water -= 5;
            gameState.health -= 3;
            gameState.faith += 5;
          },
        },
        {
          text: "Cắn răng chịu đựng qua đêm giá buốt không dám dùng tài nguyên",
          effect: () => {
            gameState.health -= 18;
            gameState.water -= 10;
          },
        },
      ],
    },
  ];

  const randomEvent =
    nightEvents[Math.floor(Math.random() * nightEvents.length)];

  document.getElementById("visual-icon").innerText = "🌙";
  document.getElementById("story-title").innerText = randomEvent.title;
  typeWriter(randomEvent.desc, "story-desc");

  const choicesPanel = document.getElementById("choices-panel");
  choicesPanel.innerHTML = "";

  randomEvent.choices.forEach((ch) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = ch.text;
    btn.onclick = () => {
      ch.effect();
      callback();
    };
    choicesPanel.appendChild(btn);
  });
}

function showScripturePopup(card) {
  document.getElementById("popup-title").innerText =
    `${card.legendary ? "🌟 [THẺ BÀI HUYỀN THOẠI]" : "✨ Thẻ Bài"}: ${card.title}`;
  document.getElementById("popup-verse").innerText = card.text;
  document.getElementById("scripture-popup").classList.remove("hidden");
}

function closeScripturePopup() {
  document.getElementById("scripture-popup").classList.add("hidden");
  loadNextEvent();
}

function updateUI() {
  gameState.water = Math.max(0, Math.min(100, gameState.water));
  gameState.food = Math.max(0, Math.min(100, gameState.food));
  gameState.health = Math.max(0, Math.min(100, gameState.health));
  gameState.faith = Math.max(0, Math.min(100, gameState.faith));

  if (gameState.faith >= 80) {
    document.getElementById("game-container").classList.add("golden-aura");
  } else {
    document.getElementById("game-container").classList.remove("golden-aura");
  }

  document.getElementById("day-counter").innerText =
    `Năm thứ ${gameState.day} / ${gameState.maxDays} ${gameState.isHardcore ? "🔥 [Hardcore]" : ""}`;

  const isNight = gameState.day % 5 === 0;
  document.getElementById("time-indicator").innerText = isNight
    ? "🌙 Đêm Hoang Địa"
    : "☀️ Giai đoạn";

  document.getElementById("water-fill").style.width = gameState.water + "%";
  document.getElementById("water-text").innerText = gameState.water + "%";

  document.getElementById("food-fill").style.width = gameState.food + "%";
  document.getElementById("food-text").innerText = gameState.food + "%";

  const healthFill = document.getElementById("health-fill");
  const healthText = document.getElementById("health-text");
  if (healthFill) healthFill.style.width = gameState.health + "%";
  if (healthText) healthText.innerText = gameState.health + "%";

  document.getElementById("faith-fill").style.width = gameState.faith + "%";
  document.getElementById("faith-text").innerText = gameState.faith + "%";
}

function triggerEffect(animClass, colorClass) {
  const container = document.getElementById("game-container");
  if (animClass) container.classList.add(animClass);
  if (colorClass) container.classList.add(colorClass);
  setTimeout(() => {
    if (animClass) container.classList.remove(animClass);
    if (colorClass) container.classList.remove(colorClass);
  }, 400);
}

function openCodex() {
  switchScreen("codex-screen");
  const grid = document.getElementById("codex-grid");
  grid.innerHTML = "";
  cardCollection.forEach((card) => {
    const div = document.createElement("div");
    div.className = `codex-card ${card.unlocked ? (card.legendary ? "legendary unlocked" : "unlocked") : "locked"}`;
    div.innerHTML = `<strong>${card.title} ${card.legendary ? "⭐" : ""}</strong><p>${card.unlocked ? card.text : "🔒 (Chưa mở khóa trong hành trình 40 năm)"}</p>`;
    grid.appendChild(div);
  });
}

function closeCodex() {
  switchScreen("start-screen");
}

function endGame(isWin) {
  switchScreen("end-screen");
  const endIcon = document.getElementById("end-icon");
  const endTitle = document.getElementById("end-title");
  const endDesc = document.getElementById("end-desc");
  const notice = document.getElementById("reward-card-notice");

  notice.innerText = "";
  document.getElementById("game-container").classList.remove("golden-aura");

  if (isWin) {
    endIcon.innerText = "✨";
    if (gameState.faith === 100 && gameState.hasMaintainedFullFaith) {
      endTitle.innerText = "ĐOẠN KẾT BÍ MẬT: ĐẤT HỨA VINH HIỂN!";
      endTitle.style.color = "#ff9f43";
      endDesc.innerHTML = `Tuyệt đỉnh! Trải qua trọn vẹn 40 năm thử thách, các thế hệ đã được thanh luyện và vững vàng đặt chân vào Đất Hứa.<br><br>🌟 <em>Thưởng riêng:</em> Mở khóa Thẻ Bài Huyền Thoại đặc biệt!`;

      const legendaryCard = cardCollection.find((c) => c.id === 7);
      if (legendaryCard && !legendaryCard.unlocked) {
        legendaryCard.unlocked = true;
        saveCards();
        notice.innerHTML = `🎁 <strong>Mở khóa Thẻ Bài Huyền Thoại: [${legendaryCard.title}]!</strong>`;
      }
    } else {
      endTitle.innerText = "HOÀN TẤT HÀNH TRÌNH 40 NĂM!";
      endTitle.style.color = "#f1c40f";
      endDesc.innerText = `Chúc mừng bạn đã dẫn dắt đoàn lữ hành vượt qua 40 năm hoang địa đầy thử thách để đến bên bờ sông Gio-đan!`;

      const finalCard = cardCollection.find((c) => c.id === 6);
      if (finalCard && !finalCard.unlocked) {
        finalCard.unlocked = true;
        saveCards();
        notice.innerText = `🎁 Nhận được Thẻ Bài: [${finalCard.title}]!`;
      }
    }
  } else {
    endIcon.innerText = "💀";
    endTitle.innerText = "GỤC NGÃ TRONG HOANG ĐỊA";
    endTitle.style.color = "#e43f5a";
    endDesc.innerHTML = `
            <div style="background: rgba(0,0,0,0.4); padding: 15px; border-radius: 8px; border-left: 3px solid #e74c3c; margin-bottom: 10px;">
                <em>"Ta đã thề trong cơn thịnh nộ của Ta rằng chúng sẽ không được vào chốn nghỉ ngơi của Ta."</em>
            </div>
            Tài nguyên hoặc đức tin đã cạn kiệt trước khi kịp chạm tay vào Đất Hứa. Toàn bộ hành trình 40 năm đứt gãy. Hãy thử lại để chuộc lại lỗi lầm!
        `;
  }
}

const asset = (name) => encodeURI(name);

const state = {
  playerName: "Optimizer01",
  route: "start",
  selectedMove: "Hook",
  selectedOpponent: "Ar Ghong",
  selectedOpponentImage: null,
  activeStep: 0,
  score: 87.63,
  total: 100,
  perfect: 100,
  great: 100,
  bad: 100,
  paused: false,
  showFeedback: false,
  uploadTarget: null,
};

const moves = [
  {
    id: "Hook",
    name: "Hook",
    image: "Practice Mode-1.png",
    position: "left",
  },
  {
    id: "Shoryuken",
    name: "Shoryuken",
    image: "Practice Mode-1.png",
    position: "center",
  },
  {
    id: "Hanumarn Tawhaiwaen",
    name: "Hanumarn<br />Tawhaiwaen",
    image: "Practice Mode-1.png",
    position: "right",
  },
];

const opponents = [
  { id: "pjim", name: "P'Jim", image: null },
  { id: "arghong", name: "Ar Ghong", image: "Start 5.png", featured: true },
  { id: "style", name: "สไตล์ ลักปิด", image: null },
];

const arenaFrames = [
  "Practice Mode-3.png",
  "Practice Mode-3.png",
  "Practice Mode-3.png",
  "Practice Mode-3.png",
  "Practice Mode-3.png",
];

const instructions = [
  "Step 1 : ท่าเตรียมพร้อม",
  "Step 2 : ยกการ์ด",
  "Step 3 : ปล่อยหมัดให้ตรงจังหวะ",
  "Step 4 : คืนท่า",
  "Step 5 : ถูกต้อง",
];

const leaderboard = [
  ["Ar ghong", 99],
  ["Optimizer", 87],
  ["Optimizer01", 76],
  ["Optimizer02", 67],
  ["Optimizer03", 45],
  ["Optimizer04", 35],
];

const app = document.querySelector("#app");

function setRoute(route) {
  state.route = route;
  state.paused = false;
  state.showFeedback = false;
  render();
}

function updateName(value) {
  state.playerName = value || "Optimizer01";
}

function render() {
  const screens = {
    start: renderStart,
    modes: renderModes,
    practice: renderPracticeMoves,
    opponents: renderOpponents,
    arena: renderArena,
    leaderboard: renderLeaderboard,
    results: renderResults,
  };

  app.innerHTML = screens[state.route]();
  bindRouteEvents();
  window.scrollTo({ top: 0, left: 0 });
}

function renderStart() {
  return `
    <section class="screen cream-screen start-screen">
      <figure class="hero-photo" aria-label="Ar Ghong boxing preview"></figure>
      <h1 class="title-xl">Boxing With Ar Ghong</h1>
      <div class="name-row">
        <label for="player-name">Name:</label>
        <input id="player-name" type="text" value="${escapeHtml(state.playerName)}" autocomplete="off" />
      </div>
      <button class="start-btn" data-action="start">START</button>
    </section>
  `;
}

function renderModes() {
  const cards = [
    {
      action: "practice",
      label: "Practice",
      sub: "ฝึกท่าทาง ให้ถูกต้อง",
      image: "Practice Mode-1.png",
      imageClass: "thumb-left",
    },
    {
      action: "opponents",
      label: "Fight mode",
      sub: "ออกกำลังกาย",
      image: "Practice Mode-2.png",
      imageClass: "thumb-center",
    },
    {
      action: "leaderboard",
      label: "Leader Board",
      sub: "ดูคะแนนของคุณ",
      image: "ต่อยอากง 20.png",
      imageClass: "thumb-right",
    },
  ];

  return `
    <section class="screen mode-screen">
      <div class="mode-header">
        <h1 class="title-md">Mode Selection</h1>
        <div class="mode-pill">Training Mode</div>
      </div>
      <div class="mode-grid">
        ${cards
          .map(
            (card) => `
              <button class="mode-card" data-action="${card.action}">
                <img class="${card.imageClass}" src="${asset(card.image)}" alt="${card.label}" />
                <span class="mode-pill">${card.label}</span>
                <p>${card.sub}</p>
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="coming-soon">Casual Mode<br />[coming soon]</div>
    </section>
  `;
}

function renderPracticeMoves() {
  return `
    <section class="screen cream-screen">
      <div class="top-row">
        <button class="back-btn" data-action="modes">back</button>
        <h1 class="title-md">Practice Move</h1>
        <span aria-hidden="true"></span>
      </div>
      <div class="practice-grid">
        ${moves
          .map(
            (move) => `
              <button class="move-card" data-action="select-move" data-move="${move.id}">
                <span class="move-art move-${move.position}" role="img" aria-label="${stripHtml(move.name)}">
                  <img src="${asset(move.image)}" alt="" />
                </span>
                <strong>${move.name}</strong>
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderOpponents() {
  return `
    <section class="screen cream-screen opponent-screen">
      <button class="back-btn" data-action="modes">back</button>
      <h1 class="title-lg">Choose Opponents</h1>
      <div class="opponent-grid">
        ${opponents
          .map((opponent, index) => {
            const uploaded =
              index === 0 ? state.leftUpload : index === 2 ? state.rightUpload : null;
            const image = uploaded || opponent.image;
            return `
              <button class="opponent-card ${opponent.featured ? "featured" : ""}" data-action="choose-opponent" data-opponent="${opponent.name}">
                <span class="flame-frame">
                  <span class="avatar">
                    ${
                      image
                        ? `<img src="${asset(image)}" alt="${opponent.name}" />`
                        : `<span class="placeholder-person" aria-hidden="true">●</span>`
                    }
                  </span>
                </span>
                ${
                  image
                    ? `<strong>${opponent.name}</strong>`
                    : `<span class="upload-btn" data-action="open-upload" data-target="${index === 0 ? "leftUpload" : "rightUpload"}">Upload image</span>`
                }
              </button>
            `;
          })
          .join("")}
      </div>
      <div class="opponent-actions">
        <button class="secondary-btn" data-action="open-upload" data-target="leftUpload">Create Character</button>
        <button class="primary-btn" data-action="start-fight">Start</button>
      </div>
      ${state.uploadTarget ? renderUploadModal() : ""}
    </section>
  `;
}

function renderUploadModal() {
  return `
    <div class="upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-title">
      <h2 id="upload-title">Upload image</h2>
      <label class="drop-zone">
        <span>Select Files To Upload</span>
        <span>or Drag and Drop, Copy and Paste Files</span>
        <input id="character-upload" type="file" accept="image/*" />
      </label>
      <button class="secondary-btn" data-action="close-upload">Close</button>
    </div>
  `;
}

function renderLeaderboard() {
  return `
    <section class="screen cream-screen">
      <button class="back-btn" data-action="modes">back</button>
      <h1 class="title-lg">Leader Board</h1>
      <table class="leaderboard-table">
        <thead>
          <tr><th>Name</th><th>Score</th></tr>
        </thead>
        <tbody>
          ${leaderboard
            .map(([name, score]) => `<tr><td>${name}</td><td>${score}</td></tr>`)
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderArena() {
  const frame = arenaFrames[state.activeStep] || arenaFrames[0];
  const starCount = Math.min(5, state.activeStep + 1);
  return `
    <section class="arena-screen">
      <div class="arena-frame" style="--arena-image: url('${asset(frame)}')">
        <button class="pause-btn" data-action="pause" aria-label="pause">
          <span class="pause-icon" aria-hidden="true"></span>
        </button>
        <div class="star-panel" aria-label="${starCount} stars">
          ${Array.from({ length: 5 }, (_, index) => `<span class="star ${index < starCount ? "active" : ""}">★</span>`).join("")}
        </div>
        <div class="instruction">${instructions[state.activeStep] || instructions[0]}</div>
        <div class="arena-actions">
          <button class="secondary-btn" data-action="step">ถูกต้อง</button>
          <button class="secondary-btn" data-action="step">ต่อย ${state.selectedMove}</button>
          <button class="primary-btn" data-action="step">ไปต่อ</button>
          <button class="danger-btn" data-action="finish">จบเกม</button>
        </div>
        ${state.paused ? renderPauseMenu() : ""}
        ${state.showFeedback ? renderFeedback() : ""}
      </div>
    </section>
  `;
}

function renderPauseMenu() {
  return `
    <div class="pause-menu" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <h2 id="pause-title">Menu select</h2>
      <button data-action="resume">Resume</button>
      <button data-action="restart-arena">Restart</button>
      <button data-action="modes">Quit</button>
    </div>
  `;
}

function renderFeedback() {
  return `
    <div class="feedback-card" role="status">
      <div>Step ${state.activeStep + 1} ถูกต้อง</div>
      <div>ไปต่อใน 5.4.3.2.1</div>
    </div>
  `;
}

function renderResults() {
  return `
    <section class="screen results-screen">
      <h1 class="title-lg">The Results!!</h1>
      <div class="results-score">SCORE : ${state.score.toFixed(2)}%</div>
      <div class="result-lines">
        <div>ต่อย total: ${state.total}</div>
        <div>ต่อย perfect: ${state.perfect}</div>
        <div>ต่อย great: ${state.great}</div>
        <div>ต่อย bad: ${state.bad}</div>
      </div>
      <div class="result-actions">
        <button class="danger-btn" data-action="restart-arena">เล่นอีกครั้ง</button>
        <button class="secondary-btn" data-action="modes">กลับหน้าหลัก</button>
      </div>
    </section>
  `;
}

function bindRouteEvents() {
  app.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", handleAction);
  });

  const nameInput = app.querySelector("#player-name");
  if (nameInput) {
    nameInput.addEventListener("input", (event) => updateName(event.target.value));
  }

  const upload = app.querySelector("#character-upload");
  if (upload) {
    upload.addEventListener("change", handleUpload);
  }
}

function handleAction(event) {
  const target = event.currentTarget;
  const action = target.dataset.action;

  if (action === "start" || action === "modes") setRoute("modes");
  if (action === "practice") setRoute("practice");
  if (action === "opponents") setRoute("opponents");
  if (action === "leaderboard") setRoute("leaderboard");

  if (action === "select-move") {
    state.selectedMove = target.dataset.move;
    startArena();
  }

  if (action === "choose-opponent") {
    state.selectedOpponent = target.dataset.opponent;
  }

  if (action === "start-fight") startArena();

  if (action === "pause") {
    state.paused = true;
    render();
  }

  if (action === "resume") {
    state.paused = false;
    render();
  }

  if (action === "restart-arena") startArena();

  if (action === "step") nextStep();
  if (action === "finish") finishGame();

  if (action === "open-upload") {
    event.stopPropagation();
    state.uploadTarget = target.dataset.target || "leftUpload";
    render();
  }

  if (action === "close-upload") {
    state.uploadTarget = null;
    render();
  }
}

function startArena() {
  state.activeStep = 0;
  state.paused = false;
  state.showFeedback = false;
  state.route = "arena";
  render();
}

function nextStep() {
  if (state.activeStep >= instructions.length - 1) {
    finishGame();
    return;
  }

  state.showFeedback = true;
  render();

  window.setTimeout(() => {
    state.activeStep += 1;
    state.showFeedback = false;
    render();
  }, 700);
}

function finishGame() {
  const base = 78 + state.activeStep * 2.4;
  state.score = Math.min(99.99, Math.max(70, base + Math.random() * 9));
  state.total = 100;
  state.perfect = Math.round(state.score);
  state.great = Math.max(0, 100 - Math.round((100 - state.score) / 2));
  state.bad = Math.max(0, 100 - Math.round(100 - state.score));
  setRoute("results");
}

function handleUpload(event) {
  const file = event.target.files?.[0];
  if (!file || !state.uploadTarget) return;

  const reader = new FileReader();
  reader.onload = () => {
    state[state.uploadTarget] = reader.result;
    state.uploadTarget = null;
    render();
  };
  reader.readAsDataURL(file);
}

function stripHtml(value) {
  return value.replace(/<[^>]*>/g, "");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

render();

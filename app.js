const STORAGE_KEY = "sorteos-state-v1";
const LIGHT_COLORS = ["#8ddfd2", "#ffb38a", "#8fb8ff", "#f7d77a", "#c9a7ff", "#9be7a8", "#ff9fbd", "#9de2f5"];
const DARK_COLORS = ["#0f766e", "#9a3412", "#1d4ed8", "#a16207", "#6d28d9", "#15803d", "#9f1239", "#0e7490"];
const FACTORY_COLORS = ["#d92d20", "#155eef", "#f7b801", "#0e9384", "#93370d", "#4e5ba6", "#b42318", "#175cd3"];
const WINNER_LIGHT = ["#ff005c", "#ff7a00", "#ffe600", "#00ff85", "#00c8ff", "#7a35ff", "#ff005c"];
const WINNER_DARK = ["#050816", "#101b4f", "#2b1055", "#081833", "#020617"];
const WINNER_FACTORY = ["#d92d20", "#155eef", "#f7b801", "#d92d20"];
const THEMES = ["light", "dark", "factory"];
const SPEEDS = {
  1: { duration: 5200, pause: 1300, spins: 7 },
  2: { duration: 3900, pause: 900, spins: 6 },
  3: { duration: 2700, pause: 620, spins: 5 },
  4: { duration: 1200, pause: 240, spins: 4 },
};

const els = {
  bulkNames: document.querySelector("#bulkNames"),
  bulkTools: document.querySelector("#bulkTools"),
  loadNames: document.querySelector("#loadNames"),
  shuffleNames: document.querySelector("#shuffleNames"),
  shuffleNamesCompact: document.querySelector("#shuffleNamesCompact"),
  mobileParticipantsMore: document.querySelector("#mobileParticipantsMore"),
  mobileParticipantsOpen: document.querySelector("#mobileParticipantsOpen"),
  mobileParticipantsBackdrop: document.querySelector("#mobileParticipantsBackdrop"),
  mobileSettingsMore: document.querySelector("#mobileSettingsMore"),
  settingsAdvanced: document.querySelector("#settingsAdvanced"),
  singleNameForm: document.querySelector("#singleNameForm"),
  singleName: document.querySelector("#singleName"),
  participantsCount: document.querySelector("#participantsCount"),
  participantsList: document.querySelector("#participantsList"),
  clearNames: document.querySelector("#clearNames"),
  drawMode: document.querySelector("#drawMode"),
  nthConfig: document.querySelector("#nthConfig"),
  winnerIndex: document.querySelector("#winnerIndex"),
  speedRange: document.querySelector("#speedRange"),
  avoidRepeat: document.querySelector("#avoidRepeat"),
  soundToggle: document.querySelector("#soundToggle"),
  startDraw: document.querySelector("#startDraw"),
  resetSession: document.querySelector("#resetSession"),
  winnerName: document.querySelector("#winnerName"),
  resultDetail: document.querySelector("#resultDetail"),
  roundsList: document.querySelector("#roundsList"),
  clearHistory: document.querySelector("#clearHistory"),
  canvas: document.querySelector("#wheelCanvas"),
  confettiCanvas: document.querySelector("#confettiCanvas"),
  centerLabel: document.querySelector("#centerLabel"),
  toast: document.querySelector("#toast"),
  themeToggle: document.querySelector("#themeToggle"),
  totalDraws: document.querySelector("#totalDraws"),
  topWinner: document.querySelector("#topWinner"),
  topParticipant: document.querySelector("#topParticipant"),
  topEliminated: document.querySelector("#topEliminated"),
  winnersRanking: document.querySelector("#winnersRanking"),
  neverWonList: document.querySelector("#neverWonList"),
  historyList: document.querySelector("#historyList"),
  wheelWrap: document.querySelector(".wheel-wrap"),
  winnerAlert: document.querySelector("#winnerAlert"),
  winnerAlertName: document.querySelector("#winnerAlertName"),
  winnerAlertDetail: document.querySelector("#winnerAlertDetail"),
  winnerAlertClose: document.querySelector("#winnerAlertClose"),
};

const ctx = els.canvas.getContext("2d");
const confettiCtx = els.confettiCanvas.getContext("2d");
let state = loadState();
let rotation = 0;
let spinning = false;
let drawRunId = 0;
let confettiFrame = 0;
let victoryAudio = null;
let spinNoise = null;
let spinNoiseBuffer = null;
let audioPrimed = false;

function defaultState() {
  return {
    participants: [],
    settings: {
      mode: "first",
      winnerIndex: 5,
      speed: 2,
      avoidRepeat: false,
      soundEnabled: true,
      theme: "light",
    },
    history: [],
    sessionWinners: [],
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultState(), ...saved, settings: { ...defaultState().settings, ...(saved?.settings || {}) } };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeName(name) {
  return name.trim().replace(/\s+/g, " ");
}

function uniqueNames(names) {
  const seen = new Set();
  return names
    .map(normalizeName)
    .filter(Boolean)
    .filter((name) => {
      const key = name.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function setTheme() {
  document.body.classList.toggle("dark", state.settings.theme === "dark");
  document.body.classList.toggle("factory", state.settings.theme === "factory");
  const label = {
    light: "Tema claro",
    dark: "Tema oscuro",
    factory: "Tema fabrica",
  }[state.settings.theme] || "Tema claro";
  els.themeToggle.title = label;
  els.themeToggle.setAttribute("aria-label", label);
  els.themeToggle.textContent = {
    light: "◐",
    dark: "✦",
    factory: "▣",
  }[state.settings.theme] || "◐";
}

function render() {
  setTheme();
  renderSoundToggle();
  els.bulkNames.value = state.participants.join("\n");
  els.participantsCount.textContent = `${state.participants.length} participante${state.participants.length === 1 ? "" : "s"}`;
  els.drawMode.value = state.settings.mode;
  els.winnerIndex.value = state.settings.winnerIndex;
  els.speedRange.value = state.settings.speed;
  els.avoidRepeat.checked = state.settings.avoidRepeat;
  els.nthConfig.classList.toggle("hidden", state.settings.mode !== "nth");
  renderParticipants();
  renderRounds([]);
  renderStats();
  renderHistory();
  drawWheel(state.participants);
}

function renderSoundToggle() {
  const enabled = state.settings.soundEnabled !== false;
  els.soundToggle.textContent = enabled ? "🔊" : "🔇";
  els.soundToggle.title = enabled ? "Silenciar sonido" : "Activar sonido";
  els.soundToggle.setAttribute("aria-label", enabled ? "Silenciar sonido" : "Activar sonido");
  els.soundToggle.classList.toggle("muted", !enabled);
}

function renderParticipants() {
  els.participantsList.innerHTML = "";
  if (!state.participants.length) {
    const empty = document.createElement("li");
    empty.className = "participant-item";
    empty.innerHTML = "<span>Sin participantes</span>";
    els.participantsList.appendChild(empty);
    return;
  }

  state.participants.forEach((name, index) => {
    const item = document.createElement("li");
    item.className = "participant-item";
    item.innerHTML = `<span title="${escapeHtml(name)}">${escapeHtml(name)}</span>`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "X";
    remove.title = "Quitar";
    remove.addEventListener("click", () => {
      state.participants.splice(index, 1);
      saveState();
      render();
    });
    item.appendChild(remove);
    els.participantsList.appendChild(item);
  });
}

function drawWheel(names, highlightName = "") {
  const width = els.canvas.width;
  const height = els.canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getCss("--panel-soft");
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 26, 0, Math.PI * 2);
  ctx.fill();

  const list = names.length ? names : ["Agrega nombres"];
  const slice = (Math.PI * 2) / list.length;

  list.forEach((name, index) => {
    const start = -Math.PI / 2 + index * slice;
    const end = start + slice;
    const isWinnerSegment = highlightName === name;
    const segmentColor = segmentFill(index, name, highlightName, cx, cy, radius);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = segmentColor;
    ctx.fill();
    if (isWinnerSegment && state.settings.theme === "dark") {
      drawStarryPrizeSegment(cx, cy, radius, start, end, name);
    }
    if (isWinnerSegment && state.settings.theme === "factory") {
      drawFactoryPrizeSegment(cx, cy, radius, start, end);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.72)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    const baseColor = highlightName === name ? winnerBaseColor() : palette()[index % palette().length];
    const textColors = textColorsFor(baseColor);
    ctx.fillStyle = textColors.fill;
    ctx.strokeStyle = textColors.stroke;
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.font = "800 24px system-ui, sans-serif";
    ctx.shadowColor = textColors.shadow;
    ctx.shadowBlur = 2;
    const label = name.length > 18 ? `${name.slice(0, 17)}...` : name;
    ctx.strokeText(label, radius - 22, 8);
    ctx.fillText(label, radius - 22, 8);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = getCss("--ink");
  ctx.lineWidth = 10;
  ctx.stroke();
}

function palette() {
  if (state.settings.theme === "dark") return DARK_COLORS;
  if (state.settings.theme === "factory") return FACTORY_COLORS;
  return LIGHT_COLORS;
}

function winnerBaseColor() {
  if (state.settings.theme === "dark") return "#4c1d95";
  if (state.settings.theme === "factory") return "#d92d20";
  return "#ff2d75";
}

function segmentFill(index, name, highlightName, cx, cy, radius) {
  if (highlightName !== name) {
    return palette()[index % palette().length];
  }

  const gradient = ctx.createRadialGradient(cx, cy, radius * 0.06, cx, cy, radius);
  const stops = {
    dark: WINNER_DARK,
    factory: WINNER_FACTORY,
    light: WINNER_LIGHT,
  }[state.settings.theme] || WINNER_LIGHT;
  stops.forEach((color, stopIndex) => {
    gradient.addColorStop(stopIndex / (stops.length - 1), color);
  });
  return gradient;
}

function drawFactoryPrizeSegment(cx, cy, radius, start, end) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radius, start, end);
  ctx.closePath();
  ctx.clip();

  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = "#fff1a8";
  ctx.lineWidth = 8;
  for (let i = -2; i <= 2; i += 1) {
    const angle = start + (end - start) * (0.5 + i * 0.12);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  drawGrabHand(cx - radius * 0.18, cy - radius * 0.04, radius * 0.28, "#d92d20", -0.28);
  drawGrabHand(cx + radius * 0.18, cy + radius * 0.04, radius * 0.28, "#155eef", 0.28);
  ctx.restore();
}

function drawGrabHand(x, y, size, color, rotationAngle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotationAngle);
  ctx.fillStyle = color;
  ctx.strokeStyle = "rgba(255,255,255,0.88)";
  ctx.lineWidth = Math.max(3, size * 0.08);
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(0,0,0,0.34)";
  ctx.shadowBlur = 10;

  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.roundRect(i * size * 0.16 - size * 0.045, -size * 0.54, size * 0.09, size * 0.42, size * 0.045);
    ctx.fill();
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(0, -size * 0.04, size * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(-size * 0.08, size * 0.12, size * 0.16, size * 0.36, size * 0.08);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawStarryPrizeSegment(cx, cy, radius, start, end, seedText) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radius, start, end);
  ctx.closePath();
  ctx.clip();

  const seed = [...seedText].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  for (let i = 0; i < 46; i += 1) {
    const t = seededUnit(seed + i * 17);
    const u = seededUnit(seed + i * 31);
    const angle = start + (end - start) * t;
    const distance = radius * (0.18 + 0.78 * u);
    const x = cx + Math.cos(angle) * distance;
    const y = cy + Math.sin(angle) * distance;
    const size = 1.2 + seededUnit(seed + i * 47) * 2.8;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${0.42 + seededUnit(seed + i * 53) * 0.48})`;
    ctx.shadowColor = "rgba(147, 197, 253, 0.75)";
    ctx.shadowBlur = 8;
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const nebula = ctx.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius * 0.86);
  nebula.addColorStop(0, "rgba(124, 58, 237, 0.32)");
  nebula.addColorStop(0.45, "rgba(45, 212, 191, 0.18)");
  nebula.addColorStop(1, "rgba(15, 23, 42, 0)");
  ctx.fillStyle = nebula;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();
}

function seededUnit(value) {
  return Math.abs(Math.sin(value * 12.9898) * 43758.5453) % 1;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function textColorsFor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const lightSegment = luminance > 0.56;
  return {
    fill: lightSegment ? "#101828" : "#ffffff",
    stroke: lightSegment ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.88)",
    shadow: lightSegment ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.30)",
  };
}

function getCss(token) {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[char]);
}

function randomIndex(max) {
  return Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 * max);
}

function pickOne(pool) {
  return pool[randomIndex(pool.length)];
}

function eligibleParticipants() {
  if (!state.settings.avoidRepeat) return [...state.participants];
  const blocked = new Set(state.sessionWinners.map((name) => name.toLocaleLowerCase()));
  return state.participants.filter((name) => !blocked.has(name.toLocaleLowerCase()));
}

function buildDraw() {
  const available = eligibleParticipants();
  if (state.participants.length < 2) {
    throw new Error("Agrega al menos 2 participantes.");
  }
  if (!available.length) {
    throw new Error("Todos ya ganaron con la opcion de repetidos bloqueada.");
  }

  const mode = state.settings.mode;
  if (mode === "first") {
    const winner = pickOne(available);
    return { mode, winner, drawnNames: [winner], eliminated: [], rounds: 1 };
  }

  if (mode === "nth") {
    const target = Math.max(2, Number(state.settings.winnerIndex) || 5);
    const drawnNames = [];
    for (let i = 0; i < target; i += 1) {
      drawnNames.push(pickOne(available));
    }
    return { mode, winner: drawnNames[drawnNames.length - 1], drawnNames, eliminated: [], rounds: target };
  }

  const pool = [...state.participants];
  const eliminated = [];
  while (pool.length > 1) {
    const idx = randomIndex(pool.length);
    eliminated.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return { mode, winner: pool[0], drawnNames: eliminated.concat(pool[0]), eliminated, rounds: eliminated.length };
}

function angleForName(name, names) {
  const index = names.indexOf(name);
  const safeIndex = Math.max(0, index);
  const sliceDeg = 360 / names.length;
  const centerDeg = safeIndex * sliceDeg + sliceDeg / 2;
  return normalizeDegrees(-centerDeg);
}

function alignSingleWinnerToPointer() {
  rotation = 0;
  document.documentElement.style.setProperty("--spin-duration", "0ms");
  document.documentElement.style.setProperty("--wheel-rotation", "0deg");
  els.canvas.style.transition = "none";
  els.canvas.style.transform = "rotate(0deg)";
  void els.canvas.offsetWidth;
  els.canvas.style.removeProperty("transition");
  els.canvas.style.removeProperty("transform");
  requestAnimationFrame(() => {
    document.documentElement.style.removeProperty("--spin-duration");
  });
}

function normalizeDegrees(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function resetWheelPosition() {
  rotation = 0;
  document.documentElement.style.setProperty("--spin-duration", "0ms");
  document.documentElement.style.setProperty("--wheel-rotation", "0deg");
  requestAnimationFrame(() => {
    document.documentElement.style.removeProperty("--spin-duration");
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setControlsLocked(locked) {
  const keepEnabled = new Set([els.resetSession, els.speedRange, els.soundToggle]);
  document.querySelectorAll("button, input, select, textarea").forEach((control) => {
    if (keepEnabled.has(control)) {
      control.disabled = false;
      return;
    }
    control.disabled = locked;
  });
}

async function spinTo(name, names, isFinal) {
  const runId = drawRunId;
  const speed = SPEEDS[state.settings.speed] || SPEEDS[2];
  const target = angleForName(name, names);
  const current = normalizeDegrees(rotation);
  const delta = normalizeDegrees(target - current);
  rotation += speed.spins * 360 + delta;
  if (!spinNoise) startWheelSpinSound();
  rampWheelSpinSound(speed.duration);
  drawWheel(names);
  document.documentElement.style.setProperty("--spin-duration", `${speed.duration}ms`);
  document.documentElement.style.setProperty("--wheel-rotation", `${rotation}deg`);
  els.centerLabel.textContent = isFinal ? "Final" : "Ronda";
  await delay(speed.duration + 80);
  stopWheelSpinSound(false);
  if (runId !== drawRunId) return false;
  drawWheel(names, name);
  els.centerLabel.textContent = name;
  await delay(speed.pause);
  if (runId !== drawRunId) return false;
  return true;
}

async function runDraw() {
  if (spinning) return;
  let result;
  try {
    result = buildDraw();
  } catch (error) {
    showToast(error.message);
    return;
  }

  spinning = true;
  drawRunId += 1;
  const runId = drawRunId;
  startWheelSpinSound();
  setControlsLocked(true);
  els.winnerName.classList.remove("celebrate");
  els.wheelWrap.classList.remove("winner-flash");
  drawWheel(state.participants);
  els.winnerName.textContent = "Girando...";
  els.resultDetail.textContent = "La ruleta esta buscando el resultado.";
  renderRounds([]);

  const visibleNames = [...state.participants];
  const roundNames = [];

  if (result.mode === "elimination") {
    for (const eliminated of result.eliminated) {
      const finalElimination = visibleNames.length === 2;
      const completed = await spinTo(eliminated, visibleNames, false);
      if (!completed || runId !== drawRunId) return;
      roundNames.push({ name: eliminated, label: "Eliminado" });
      const index = visibleNames.indexOf(eliminated);
      if (index >= 0) visibleNames.splice(index, 1);
      drawWheel(visibleNames);
      renderRounds(roundNames);
      if (finalElimination && visibleNames.length === 1) {
        els.centerLabel.textContent = visibleNames[0];
        drawWheel(visibleNames, visibleNames[0]);
        alignSingleWinnerToPointer();
        break;
      }
    }
  } else {
    for (let i = 0; i < result.drawnNames.length; i += 1) {
      const name = result.drawnNames[i];
      const final = i === result.drawnNames.length - 1;
      const completed = await spinTo(name, visibleNames, final);
      if (!completed || runId !== drawRunId) return;
      roundNames.push({ name, label: final ? "Ganador" : "No gana" });
      renderRounds(roundNames);
    }
  }

  if (runId !== drawRunId) return;
  finishDraw(result);
}

function finishDraw(result) {
  stopWheelSpinSound();
  const now = new Date().toISOString();
  state.sessionWinners.push(result.winner);
  state.history.unshift({
    id: now,
    date: now,
    mode: result.mode,
    winnerIndex: state.settings.winnerIndex,
    participants: [...state.participants],
    participantsCount: state.participants.length,
    winner: result.winner,
    drawnNames: result.drawnNames,
    eliminated: result.eliminated,
    rounds: result.rounds,
  });
  state.history = state.history.slice(0, 100);
  saveState();
  els.winnerName.textContent = result.winner;
  els.resultDetail.textContent = result.mode === "elimination"
    ? "Gano por ser el ultimo participante en pie."
    : `Gano en la ronda ${result.drawnNames.length}.`;
  els.winnerName.classList.remove("celebrate");
  void els.winnerName.offsetWidth;
  els.winnerName.classList.add("celebrate");
  showWinnerAlert(result);
  playVictorySound();
  startConfetti();
  spinning = false;
  setControlsLocked(false);
  renderStats();
  renderHistory();
}

function renderRounds(rounds) {
  els.roundsList.innerHTML = "";
  if (!rounds.length) {
    const empty = document.createElement("li");
    empty.textContent = "Aqui apareceran las rondas.";
    els.roundsList.appendChild(empty);
    return;
  }
  rounds.forEach((round, index) => {
    const item = document.createElement("li");
    item.textContent = `${index + 1}. ${round.name} - ${round.label}`;
    els.roundsList.appendChild(item);
  });
}

function calculateStats() {
  const stats = {
    wins: new Map(),
    participations: new Map(),
    eliminated: new Map(),
  };

  state.history.forEach((entry) => {
    stats.wins.set(entry.winner, (stats.wins.get(entry.winner) || 0) + 1);
    entry.participants.forEach((name) => {
      stats.participations.set(name, (stats.participations.get(name) || 0) + 1);
    });
    entry.eliminated.forEach((name) => {
      stats.eliminated.set(name, (stats.eliminated.get(name) || 0) + 1);
    });
  });
  return stats;
}

function topFromMap(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] || null;
}

function renderStats() {
  const stats = calculateStats();
  const topWinner = topFromMap(stats.wins);
  const topParticipant = topFromMap(stats.participations);
  const topEliminated = topFromMap(stats.eliminated);
  els.totalDraws.textContent = String(state.history.length);
  els.topWinner.textContent = topWinner ? `${topWinner[0]} (${topWinner[1]})` : "Nadie";
  els.topParticipant.textContent = topParticipant ? `${topParticipant[0]} (${topParticipant[1]})` : "Nadie";
  els.topEliminated.textContent = topEliminated ? `${topEliminated[0]} (${topEliminated[1]})` : "Nadie";

  renderRanking(els.winnersRanking, stats.wins, "Sin ganadores todavia.");
  const neverWon = state.participants.filter((name) => !stats.wins.has(name));
  renderList(els.neverWonList, neverWon, "Todos los participantes actuales han ganado o no hay historial.");
}

function renderRanking(target, map, emptyText) {
  const items = [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  target.innerHTML = "";
  if (!items.length) {
    const item = document.createElement("li");
    item.textContent = emptyText;
    target.appendChild(item);
    return;
  }
  items.slice(0, 12).forEach(([name, count], index) => {
    const item = document.createElement("li");
    item.textContent = `${index + 1}. ${name} - ${count}`;
    target.appendChild(item);
  });
}

function renderList(target, list, emptyText) {
  target.innerHTML = "";
  if (!list.length) {
    const item = document.createElement("li");
    item.textContent = emptyText;
    target.appendChild(item);
    return;
  }
  list.forEach((name) => {
    const item = document.createElement("li");
    item.textContent = name;
    target.appendChild(item);
  });
}

function renderHistory() {
  els.historyList.innerHTML = "";
  if (!state.history.length) {
    const item = document.createElement("li");
    item.textContent = "Sin sorteos registrados.";
    els.historyList.appendChild(item);
    return;
  }
  state.history.forEach((entry) => {
    const item = document.createElement("li");
    const date = new Date(entry.date).toLocaleString();
    item.innerHTML = `<strong>${escapeHtml(entry.winner)}</strong><br><span>${date} | ${escapeHtml(modeLabel(entry.mode))} | ${entry.participantsCount} participantes</span>`;
    els.historyList.appendChild(item);
  });
}

function modeLabel(mode) {
  return {
    first: "Gana el primero",
    nth: "Gana el N resultado",
    elimination: "Eliminacion",
  }[mode] || mode;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2400);
}

function winnerDetail(result) {
  return result.mode === "elimination"
    ? "El ganador ha sido el ultimo participante en pie. Que se escuche la victoria."
    : `El ganador ha sido elegido en la ronda ${result.drawnNames.length}. Momento de celebrar.`;
}

function showWinnerAlert(result) {
  els.winnerAlertName.textContent = result.winner;
  els.winnerAlertDetail.textContent = winnerDetail(result);
  els.winnerAlert.classList.remove("hidden");
  document.body.classList.add("winner-alert-open");
  els.winnerAlertClose.focus();
}

function closeWinnerAlert() {
  els.winnerAlert.classList.add("hidden");
  document.body.classList.remove("winner-alert-open");
}

function playVictorySound() {
  if (state.settings.soundEnabled === false) return;
  try {
    const audio = unlockVictorySound();
    if (!audio) return;
    if (audio.state === "suspended") audio.resume();
    const master = audio.createGain();
    master.gain.setValueAtTime(0.0001, audio.currentTime);
    master.gain.exponentialRampToValueAtTime(0.16, audio.currentTime + 0.03);
    master.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 1.35);
    master.connect(audio.destination);

    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      const start = audio.currentTime + index * 0.16;
      const oscillator = audio.createOscillator();
      const noteGain = audio.createGain();
      oscillator.type = index === 3 ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      noteGain.gain.setValueAtTime(0.0001, start);
      noteGain.gain.exponentialRampToValueAtTime(0.8, start + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
      oscillator.connect(noteGain);
      noteGain.connect(master);
      oscillator.start(start);
      oscillator.stop(start + 0.38);
    });
  } catch {
    // Browsers can block audio in some contexts; the visual celebration still runs.
  }
}

function startWheelSpinSound() {
  if (state.settings.soundEnabled === false) return;
  try {
    stopWheelSpinSound(false);
    const audio = unlockVictorySound();
    if (!audio) return;
    if (audio.state === "suspended") audio.resume();

    const master = audio.createGain();
    const noise = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    noise.buffer = getSpinNoiseBuffer(audio);
    noise.loop = true;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(760, audio.currentTime);
    filter.Q.setValueAtTime(2.6, audio.currentTime);
    master.gain.setValueAtTime(0.0001, audio.currentTime);
    master.gain.exponentialRampToValueAtTime(0.018, audio.currentTime + 0.12);
    noise.connect(filter);
    filter.connect(master);
    master.connect(audio.destination);
    noise.start();

    spinNoise = { audio, noise, filter, master, clickTimer: 0, active: false };
  } catch {
    spinNoise = null;
  }
}

function rampWheelSpinSound(durationMs) {
  if (!spinNoise) return;
  const { audio, filter, master } = spinNoise;
  const now = audio.currentTime;
  const duration = Math.max(0.6, durationMs / 1000);
  try {
    filter.frequency.cancelScheduledValues(now);
    master.gain.cancelScheduledValues(now);

    filter.frequency.setValueAtTime(860, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + duration * 0.95);
    master.gain.setValueAtTime(0.02, now);
    master.gain.exponentialRampToValueAtTime(0.004, now + duration * 0.88);
    scheduleRouletteClicks(durationMs);
  } catch {
    // The spin sound is optional; keep the visual draw running.
  }
}

function scheduleRouletteClicks(durationMs) {
  if (!spinNoise) return;
  clearTimeout(spinNoise.clickTimer);
  spinNoise.active = true;
  const started = performance.now();
  const duration = Math.max(500, durationMs);

  function queueNext() {
    if (!spinNoise?.active) return;
    const elapsed = performance.now() - started;
    const progress = Math.min(1, elapsed / duration);
    const interval = 24 + progress * progress * 170;
    const pitch = 1320 - progress * 620;
    const volume = 0.075 - progress * 0.045;
    playRouletteClick(pitch, volume);
    if (progress >= 0.98) return;
    spinNoise.clickTimer = setTimeout(queueNext, interval);
  }

  queueNext();
}

function playRouletteClick(frequency, volume) {
  if (!spinNoise) return;
  const audio = spinNoise.audio;
  const now = audio.currentTime;
  try {
    const click = audio.createOscillator();
    const gain = audio.createGain();
    const filter = audio.createBiquadFilter();
    click.type = "triangle";
    click.frequency.setValueAtTime(frequency, now);
    click.frequency.exponentialRampToValueAtTime(Math.max(220, frequency * 0.42), now + 0.035);
    filter.type = "highpass";
    filter.frequency.setValueAtTime(420, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.006, volume), now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    click.connect(filter);
    filter.connect(gain);
    gain.connect(audio.destination);
    click.start(now);
    click.stop(now + 0.055);
  } catch {
    // Skip individual clicks if audio is unavailable.
  }
}

function stopWheelSpinSound(playBrake = false) {
  if (!spinNoise) {
    if (playBrake) playBrakeSound();
    return;
  }
  const { audio, noise, master } = spinNoise;
  const now = audio.currentTime;
  try {
    spinNoise.active = false;
    clearTimeout(spinNoise.clickTimer);
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    noise.stop(now + 0.08);
  } catch {
    // Sound nodes may already be stopped.
  }
  spinNoise = null;
  if (playBrake) playBrakeSound();
}

function playBrakeSound() {
  if (state.settings.soundEnabled === false) return;
  try {
    const audio = unlockVictorySound();
    if (!audio) return;
    if (audio.state === "suspended") audio.resume();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(180, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(48, audio.currentTime + 0.16);
    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.22);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.24);
  } catch {
    // Keep reset behavior silent if audio is blocked.
  }
}

function unlockVictorySound() {
  if (state.settings.soundEnabled === false) return null;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!victoryAudio || victoryAudio.state === "closed") {
      victoryAudio = new AudioContext();
    }
    if (victoryAudio.state === "suspended") {
      const resume = victoryAudio.resume();
      if (resume?.catch) resume.catch(() => {});
    }
    return victoryAudio;
  } catch {
    return null;
  }
}

function getSpinNoiseBuffer(audio) {
  if (spinNoiseBuffer && spinNoiseBuffer.sampleRate === audio.sampleRate) {
    return spinNoiseBuffer;
  }
  const bufferSize = audio.sampleRate * 2;
  spinNoiseBuffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = spinNoiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.32;
  }
  return spinNoiseBuffer;
}

function primeAudio() {
  if (state.settings.soundEnabled === false) return;
  if (audioPrimed) return;
  const audio = unlockVictorySound();
  if (!audio) return;
  getSpinNoiseBuffer(audio);
  try {
    const gain = audio.createGain();
    const oscillator = audio.createOscillator();
    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    oscillator.frequency.setValueAtTime(1, audio.currentTime);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.03);
  } catch {
    // Prewarm is best-effort.
  }
  audioPrimed = true;
}

function resizeConfettiCanvas() {
  const dpr = window.devicePixelRatio || 1;
  els.confettiCanvas.width = Math.floor(window.innerWidth * dpr);
  els.confettiCanvas.height = Math.floor(window.innerHeight * dpr);
  els.confettiCanvas.style.width = `${window.innerWidth}px`;
  els.confettiCanvas.style.height = `${window.innerHeight}px`;
  confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function startConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  cancelAnimationFrame(confettiFrame);
  resizeConfettiCanvas();
  els.confettiCanvas.classList.add("show");
  const colors = ["#ff3d71", "#ffb020", "#12b76a", "#2e90fa", "#9b5cff", "#f7b801", "#14b8a6"];
  const pieces = Array.from({ length: Math.min(170, Math.floor(window.innerWidth / 4)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.35,
    size: 6 + Math.random() * 9,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: 2.8 + Math.random() * 4.8,
    drift: -2 + Math.random() * 4,
    rotation: Math.random() * Math.PI * 2,
    spin: -0.22 + Math.random() * 0.44,
  }));
  const started = performance.now();
  const duration = 3200;

  function draw(now) {
    const elapsed = now - started;
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.rotation += piece.spin;
      confettiCtx.save();
      confettiCtx.translate(piece.x, piece.y);
      confettiCtx.rotate(piece.rotation);
      confettiCtx.fillStyle = piece.color;
      confettiCtx.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.62);
      confettiCtx.restore();
    });
    if (elapsed < duration) {
      confettiFrame = requestAnimationFrame(draw);
      return;
    }
    els.confettiCanvas.classList.remove("show");
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  confettiFrame = requestAnimationFrame(draw);
}

function shuffleParticipants() {
  state.participants = state.participants
    .map((value) => ({ value, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map((item) => item.value);
  resetWheelPosition();
  saveState();
  render();
}

function toggleMobileSection(button, target) {
  const expanded = target.classList.toggle("mobile-expanded");
  button.setAttribute("aria-expanded", String(expanded));
  button.textContent = "...";
  button.setAttribute("aria-label", expanded ? "Mostrar menos" : "Mostrar mas");
}

function setMobileParticipantsPanel(open) {
  document.body.classList.toggle("mobile-participants-open", open);
  els.mobileParticipantsOpen.setAttribute("aria-expanded", String(open));
}

function bindEvents() {
  document.addEventListener("pointerdown", primeAudio, { once: true });
  document.addEventListener("keydown", primeAudio, { once: true });

  els.loadNames.addEventListener("click", () => {
    state.participants = uniqueNames(els.bulkNames.value.split(/\n|,/));
    resetWheelPosition();
    saveState();
    render();
    showToast("Lista cargada.");
  });

  els.shuffleNames.addEventListener("click", () => {
    shuffleParticipants();
  });

  els.shuffleNamesCompact.addEventListener("click", shuffleParticipants);

  els.mobileParticipantsMore.addEventListener("click", () => {
    toggleMobileSection(els.mobileParticipantsMore, els.bulkTools);
  });

  els.mobileParticipantsOpen.addEventListener("click", () => {
    setMobileParticipantsPanel(true);
  });

  els.mobileParticipantsBackdrop.addEventListener("click", () => {
    setMobileParticipantsPanel(false);
  });

  els.mobileSettingsMore.addEventListener("click", () => {
    toggleMobileSection(els.mobileSettingsMore, els.settingsAdvanced);
  });

  els.singleNameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = normalizeName(els.singleName.value);
    if (!name) return;
    state.participants = uniqueNames([...state.participants, name]);
    els.singleName.value = "";
    resetWheelPosition();
    saveState();
    render();
  });

  els.clearNames.addEventListener("click", () => {
    state.participants = [];
    resetWheelPosition();
    saveState();
    render();
  });

  els.drawMode.addEventListener("change", () => {
    state.settings.mode = els.drawMode.value;
    saveState();
    render();
  });

  els.winnerIndex.addEventListener("input", () => {
    state.settings.winnerIndex = Number(els.winnerIndex.value) || 5;
    saveState();
  });

  els.speedRange.addEventListener("input", () => {
    state.settings.speed = Number(els.speedRange.value);
    saveState();
  });

  els.avoidRepeat.addEventListener("change", () => {
    state.settings.avoidRepeat = els.avoidRepeat.checked;
    saveState();
  });

  els.soundToggle.addEventListener("click", () => {
    state.settings.soundEnabled = state.settings.soundEnabled === false;
    if (!state.settings.soundEnabled) {
      stopWheelSpinSound(false);
    } else {
      audioPrimed = false;
      primeAudio();
    }
    saveState();
    renderSoundToggle();
  });

  els.startDraw.addEventListener("pointerdown", primeAudio);
  els.startDraw.addEventListener("click", () => {
    primeAudio();
    runDraw();
  });

  els.winnerAlertClose.addEventListener("click", closeWinnerAlert);
  els.winnerAlert.querySelector("[data-winner-close]").addEventListener("click", closeWinnerAlert);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.winnerAlert.classList.contains("hidden")) {
      closeWinnerAlert();
    }
  });

  els.resetSession.addEventListener("click", () => {
    drawRunId += 1;
    spinning = false;
    stopWheelSpinSound(true);
    setControlsLocked(false);
    state.sessionWinners = [];
    resetWheelPosition();
    drawWheel(state.participants);
    renderRounds([]);
    els.centerLabel.textContent = "Listo";
    els.winnerName.textContent = "Sin ganador aun";
    els.resultDetail.textContent = "Sesion reiniciada.";
    els.winnerName.classList.remove("celebrate");
    saveState();
    showToast("Sesion reiniciada.");
  });

  els.clearHistory.addEventListener("click", () => {
    state.history = [];
    state.sessionWinners = [];
    saveState();
    render();
    showToast("Historial borrado.");
  });

  els.themeToggle.addEventListener("click", () => {
    const current = THEMES.indexOf(state.settings.theme);
    state.settings.theme = THEMES[(current + 1) % THEMES.length];
    saveState();
    render();
  });

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((tab) => tab.classList.remove("active"));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("active-view"));
      button.classList.add("active");
      document.querySelector(`#${button.dataset.view}View`).classList.add("active-view");
      if (button.dataset.view !== "wheel") {
        setMobileParticipantsPanel(false);
      }
    });
  });

  document.querySelectorAll(".coming-card").forEach((card) => {
    card.addEventListener("click", () => showToast("Mas sorteos proximamente."));
  });

  window.addEventListener("resize", () => {
    drawWheel(state.participants);
    if (els.confettiCanvas.classList.contains("show")) resizeConfettiCanvas();
  });
}

bindEvents();
render();

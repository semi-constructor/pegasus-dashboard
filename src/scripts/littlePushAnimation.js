#!/usr/bin/env node
const readline = require("readline");

const isTTY = Boolean(process.stdout.isTTY);
const ESC = "\x1b[";

const color = {
  reset: `${ESC}0m`,
  bold: `${ESC}1m`,
  dim: `${ESC}2m`,
  cyan: `${ESC}36m`,
  magenta: `${ESC}35m`,
  yellow: `${ESC}33m`,
  green: `${ESC}32m`,
  red: `${ESC}31m`,
  gray: `${ESC}90m`,
  blue: `${ESC}34m`,
};

const c = (name, text) => (isTTY ? `${color[name]}${text}${color.reset}` : text);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- Robust multi-line redraw ----------
let lastFrameHeight = 0;

function draw(lines) {
  if (lastFrameHeight > 0) {
    readline.moveCursor(process.stdout, 0, -lastFrameHeight);
    readline.clearScreenDown(process.stdout);
  }
  const text = lines.join("\n") + "\n";
  process.stdout.write(text);
  lastFrameHeight = lines.length;
}

const CHECKS = ["staged changes", "local branch", "remote origin", "auth token"];

async function preflight() {
  const lines = [
    c("bold", "┌─────────────────────────────┐"),
    c("bold", "│   PUSH LAUNCH SEQUENCE      │"),
    c("bold", "└─────────────────────────────┘"),
    "",
  ];
  draw([...lines, ...CHECKS.map((chk) => `  ${c("dim", "○")} ${chk}`)]);
  await sleep(150);

  for (let i = 0; i < CHECKS.length; i++) {
    await sleep(180);
    const rows = CHECKS.map((chk, idx) =>
      idx <= i ? `  ${c("green", "●")} ${chk} ${c("dim", "ok")}` : `  ${c("dim", "○")} ${chk}`
    );
    draw([...lines, ...rows]);
  }
  await sleep(300);
}

// ---------- Stage 2: countdown ----------
async function countdown() {
  for (let n = 3; n >= 1; n--) {
    draw([
      "",
      c("bold", `        T-minus ${c("yellow", String(n))}...`),
      "",
    ]);
    await sleep(350);
  }
  draw(["", c("bold", `        ${c("red", "IGNITION")}`), ""]);
  await sleep(300);
}

const WIDTH = 34;
const HEIGHT = 10;
const COMMITS = 5;

function starRow(x0, y, step) {
  let row = "";
  for (let x = 0; x < WIDTH; x++) {
    const seed = (x * 7 + y * 13 + step * 5) % 97;
    if (seed % 23 === 0) row += c("gray", ".");
    else if (seed % 37 === 0) row += c("dim", "·");
    else row += " ";
  }
  return row;
}

function commitTrail(pushed) {
  const dots = Array.from({ length: COMMITS }, (_, i) =>
    i < pushed ? c("green", "●") : c("dim", "○")
  ).join(c("dim", "─"));
  return `  ${dots}`;
}

async function ascent() {
  const totalFrames = HEIGHT + 6;
  const rocketX = Math.floor(WIDTH / 2);

  for (let t = 0; t < totalFrames; t++) {
    const rows = [];
    for (let y = 0; y < HEIGHT; y++) rows.push(starRow(0, y, t).split(""));

    const rocketRow = Math.max(HEIGHT - 1 - t, -4);
    const flame = t % 2 === 0 ? "▽" : "▿";
    const smokeChar = t % 3 === 0 ? "░" : "▒";
    const parts = [
      [rocketRow - 2, c("cyan", "▲")],
      [rocketRow - 1, c("cyan", "█")],
      [rocketRow, c("yellow", flame)],
      [rocketRow + 1, c("gray", smokeChar)],
      [rocketRow + 2, c("dim", smokeChar)],
    ];
    for (const [y, glyph] of parts) {
      if (y >= 0 && y < HEIGHT) rows[y][rocketX] = glyph;
    }

    const ground = c("gray", "‾".repeat(WIDTH));
    const pushed = Math.min(COMMITS, Math.floor((t / totalFrames) * (COMMITS + 1)));
    const label =
      t < totalFrames - 3
        ? c("cyan", "pushing to origin...")
        : c("green", "reached orbit!");

    draw([
      ...rows.map((r) => r.join("")),
      ground,
      commitTrail(pushed),
      label,
    ]);

    await sleep(65);
  }
}

async function finale() {
  const banner = [
    "",
    c("bold", c("green", "  ╔══════════════════════════╗")),
    c("bold", c("green", "  ║      PUSH SUCCESSFUL     ║")),
    c("bold", c("green", "  ╚══════════════════════════╝")),
    `  ${c("yellow", "🚀")}  all commits delivered  ${c("yellow", "🚀")}`,
    "",
  ];
  draw(banner);
}

async function main() {
  if (!isTTY) {
    console.log("pushing to origin...");
    console.log("done -- push successful");
    return;
  }

  process.stdout.write(`${ESC}?25l`);
  try {
    await preflight();
    await countdown();
    await ascent();
    await finale();
  } finally {
    process.stdout.write(`${ESC}?25h`); 
  }
}

main().catch((err) => {
  process.stdout.write(`${ESC}?25h`);
  console.error(err);
  process.exit(1);
});
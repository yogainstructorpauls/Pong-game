import Input from './Input.js';
import Button from './Button.js';

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const input = new Input(canvas);
canvas.width = 800;
canvas.height = 500;
let currentScene = "menu";
let gameOver = false;
let player1;
let player2;
let ball;
let score1 = 0;
let score2 = 0;
const maxScore = 3;
const startButton = new Button(input, { text: "Start Game", x: 325, y: 250, width: 150, height: 50 });
const restartButton = new Button(input, { text: "Restart", x: 325, y: 300, width: 150, height: 50 });

  function resetGame() {  
  player1 = { x: 20, y: 200, w: 10, h: 100, speed: 6 };
  player2 = { x: 770, y: 200, w: 10, h: 100, speed: 4 };
  ball = { x: 400, y: 250, size: 10, vx: 5, vy: 5 };
  score1 = 0;
  score2 = 0;
  gameOver = false;
  }
  function updateMenu() {
  if (startButton.clicked()) {
    resetGame();
    currentScene = "game";
  }
  }
  function updateGame() {
  if (gameOver) {
    currentScene = "gameover";
    return;
  }
  if (input.getKey("W")) player1.y -= player1.speed;
  if (input.getKey("S")) player1.y += player1.speed;
  player1.y = Math.max(0, Math.min(canvas.height - player1.h, player1.y));

  if (player2.y + player2.h / 2 < ball.y - 40) player2.y += 1.5;
  else if (player2.y + player2.h / 2 > ball.y + 40) player2.y -= 1.5;

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y <= 0 || ball.y >= canvas.height - ball.size) ball.vy *= -1;

  if (
    ball.x < player1.x + player1.w &&
    ball.x + ball.size > player1.x &&
    ball.y < player1.y + player1.h &&
    ball.y + ball.size > player1.y
  ) ball.vx *= -1;

  if (
    ball.x + ball.size > player2.x &&
    ball.x < player2.x + player2.w &&
    ball.y < player2.y + player2.h &&
    ball.y + ball.size > player2.y
  ) ball.vx *= -1;

  if (ball.x < 0) {
    score2++;
    resetBall();
  } else if (ball.x > canvas.width) {
    score1++;
    resetBall();
  }

  if (score1 === maxScore || score2 === maxScore) gameOver = true;
  }

function updateGameOver() {
  if (restartButton.clicked()) {
    resetGame();
    currentScene = "game";
  }
  }

function drawMenu() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Pong", canvas.width / 2, 180);

  startButton.draw(ctx);
  }

  function drawGame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.fillRect(canvas.width / 2 - 1, y, 2, 10);
  }

  ctx.fillRect(player1.x, player1.y, player1.w, player1.h);
  ctx.fillRect(player2.x, player2.y, player2.w, player2.h);
  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText(score1, 390 - 50, 50);
  ctx.fillText(score2, 390 + 50, 50);
  }
 
  function drawGameOver() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", 390, 200);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  const winner = score1 > score2 ? "You win" : "AI wins";
  ctx.fillText(winner, 390, 260);

  restartButton.draw(ctx);
  }

  function resetBall() {
  ball.x = 400;
  ball.y = 250;
  ball.vx = (Math.random() > 0.5 ? 5 : -5);
  ball.vy = (Math.random() > 0.5 ? 5 : -5);
  }

  function update() {
  if (currentScene === "menu") updateMenu();
  else if (currentScene === "game") updateGame();
  else if (currentScene === "gameover") updateGameOver();
  }

  function draw() {
  if (currentScene === "menu") drawMenu();
  else if (currentScene === "game") drawGame();
  else if (currentScene === "gameover") drawGameOver();
  }

  function gameLoop() {
  input.update();
  update();
  draw();
  requestAnimationFrame(gameLoop);
  }

  resetGame();
  currentScene = "menu";
  gameLoop();

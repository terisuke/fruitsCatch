const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = canvas.width / 2;
const playerWidth = 75;
const playerHeight = 10;

let fruits = [];
let score = 0;

let timeLeft = 30;
let timer;
let gameStarted = false;

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const fullscreenButton = document.getElementById("fullscreenButton");

function startGame() {
    if (!gameStarted) {
        startButton.style.display = "none";
        resetGame();
        gameStarted = true;
        gameLoop();
    }
}

function resetGame() {
    clearInterval(timer); // Clear the existing timer

    fruits = [];
    score = 0;
    timeLeft = 30;

    timer = setInterval(function () {
        timeLeft -= 1;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up! Your score is: " + score);
            restartButton.style.display = "block";
            gameStarted = false;
        }
    }, 1000);
}

startButton.addEventListener("click", startGame);
startButton.style.display = "block";

restartButton.addEventListener("click", function () {
    gameStarted = true;
    resetGame();
    gameLoop();
});

function randomFruit() {
    const types = ["apple", "banana", "cherry"];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
        x: Math.random() * canvas.width,
        y: 0,
        type: type,
        speed: 1 + Math.random() * 3
    };
}

function drawPlayer() {
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(playerX, canvas.height - playerHeight, playerWidth, playerHeight);
}

function drawFruits() {
    fruits.forEach(fruit => {
        let emoji;
        switch (fruit.type) {
            case "apple":
                emoji = "🍎";
                break;
            case "banana":
                emoji = "🍌";
                break;
            case "cherry":
                emoji = "🍒";
                break;
        }
        ctx.font = "30px Arial";
        ctx.fillText(emoji, fruit.x - 15, fruit.y + 10); // 絵文字の中心をフルーツの中心に合わせるために位置を調整
    });
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawTimeLeft() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Time Left: " + timeLeft + "s", canvas.width - 100, 20);
}

function catchFruit() {
    for (let i = 0; i < fruits.length; i++) {
        if (fruits[i].y >= canvas.height - playerHeight && fruits[i].y <= canvas.height &&
            fruits[i].x >= playerX && fruits[i].x <= (playerX + playerWidth)) {
            switch (fruits[i].type) {
                case "apple":
                    score += 1;
                    break;
                case "banana":
                    score += 3;
                    break;
                case "cherry":
                    score += 5;
                    break;
            }
            fruits.splice(i, 1);
        }
    }
}

function gameLoop() {
    if (!gameStarted) return;
    if (timeLeft <= 0) {
        alert("Time's up! Your score is: " + score);
        clearTimeout(timer);
        restartButton.style.display = "block";
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
        fruits.push(randomFruit());
    }

    drawPlayer();
    drawFruits();
    drawScore();
    drawTimeLeft();

    fruits.forEach(fruit => {
        fruit.y += fruit.speed;
    });

    catchFruit();
    fruits = fruits.filter(fruit => fruit.y <= canvas.height);

    requestAnimationFrame(gameLoop);
}

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    playerX = e.clientX - rect.left - playerWidth / 2;
});

// タイムリミットのカウントダウン
timer = setInterval(function () {
    timeLeft -= 1;
}, 1000);

// リスタートボタン
restartButton.addEventListener("click", resetGame);

// フルスクリーンボタン
fullscreenButton.addEventListener("click", function () {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari & Opera
        canvas.webkitRequestFullscreen();
    } else if (canvas.mozRequestFullScreen) { // Firefox
        canvas.mozRequestFullScreen();
    } else if (canvas.msRequestFullscreen) { // IE/Edge
        canvas.msRequestFullscreen();
    }
});
restartButton.addEventListener("click", function () {
    gameStarted = true; // リスタート時にゲームスタートフラグを再設定
    resetGame();
    gameLoop();
});

// Path: index.js

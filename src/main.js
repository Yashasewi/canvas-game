import "../style.css";
import { Player, Enemy, ShootPower } from "./Characters";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 30, "blue", 5);

const ShootPowers = [];
const Enemies = [];

let gameIsPaused = false;

document.addEventListener("visibilitychange", () => {
    gameIsPaused = document.hidden;
});

function SpawnEnemies() {
    let x;
    let y;
    setInterval(() => {
        if (!gameIsPaused) {
            const radius = Math.random() * 30 + 10;
            // const radius = Math.random() * 3 + 1;
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
                y = Math.random() * canvas.height;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            }

            // const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
            const angle = Math.atan2(player.y - y, player.x - x);
            const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle),
            };
            Enemies.push(new Enemy(x, y, radius, "green", velocity));
        }
    }, 1000);
}

let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    // console.log("enamies", Enemies.length);
    // console.log(ShootPowers.length);

    ShootPowers.forEach((power) => {
        power.update();
        if (
            power.x + power.radius < 0 ||
            power.x - power.radius > canvas.width ||
            power.y + power.radius < 0 ||
            power.y - power.radius > canvas.height
        ) {
            setTimeout(() => {
                ShootPowers.splice(0, 1);
            }, 0);
        }
    });
    // console.log(ShootPowers.length);

    Enemies.forEach((enemy, enemyIndex) => {
        if (
            enemy.x + enemy.radius < 0 ||
            enemy.x - enemy.radius > canvas.width ||
            enemy.y + enemy.radius < 0 ||
            enemy.y - enemy.radius > canvas.height
        ) {
            setTimeout(() => {
                Enemies.splice(enemyIndex, 1);
            }, 0);
        }
        const distanceBTPlayer = Math.hypot(
            enemy.x - player.x,
            enemy.y - player.y
        );
        if (distanceBTPlayer - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
        }

        enemy.update();
        ShootPowers.forEach((power, powerIndex) => {
            const distance = Math.hypot(enemy.x - power.x, enemy.y - power.y);
            if (distance - enemy.radius - power.radius < 1) {
                setTimeout(() => {
                    Enemies.splice(enemyIndex, 1);
                    ShootPowers.splice(powerIndex, 1);
                }, 0);
            }
        });
    });
}

animate();
SpawnEnemies();

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            player.moveUp = true;
            break;
        case "s":
            player.moveDown = true;
            break;
        case "a":
            player.moveLeft = true;
            break;
        case "d":
            player.moveRight = true;
            break;
        case " ":
            console.log(gameIsPaused);
            gameIsPaused ? resumeGame() : pauseGame();
            console.log(animationId);
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
            player.moveUp = false;
            break;
        case "s":
            player.moveDown = false;
            break;
        case "a":
            player.moveLeft = false;
            break;
        case "d":
            player.moveRight = false;
            break;
    }
});

function shoot(event) {
    // console.log("Shoot:", event.clientX, event.clientY);
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const angle = Math.atan2(y - player.y, x - player.x);
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
    };
    ShootPowers.push(new ShootPower(player.x, player.y, 5, "red", velocity));
}

window.addEventListener("click", shoot);

// TODO : add game menu
function pauseGame() {
    cancelAnimationFrame(animationId);
    gameIsPaused = true;
}

function resumeGame() {
    animationId = requestAnimationFrame(animate);
    gameIsPaused = false;
}

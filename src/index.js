import "../style.css";

import { canvas, ctx } from "./utils/canvas.js";
import { Player } from "./classes/Player.js";
import { Projectile } from "./classes/Projectile.js";
import { Enemy } from "./classes/Enemy.js";
import { Particle } from "./classes/Particle.js";

// TODO
// [ ] increase player speed thing
// [ ] add game menu
// [ ] add high score thing
// [ ] add restart game thing

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const score = document.getElementsByClassName("score-count")[0];
const time = document.getElementsByClassName("time-count")[0];

const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 30, "blue", 6);

const ShootPowers = [];
const Enemies = [];
const ParticlesArr = [];

let scoreCount = 0;
let gameIsPaused = false;
let timeSpent = 0;
let enemiesSpeed = 2;

let intervalId = createInterval();
function createInterval() {
    return setInterval(() => {
        timeSpent = timeSpent + 1;
        time.innerHTML = " " + timeSpent;
        if (timeSpent % 10 == 0) {
            enemiesSpeed = enemiesSpeed + 1;
        }
    }, 1000);
}

function ChangeScore() {
    scoreCount = scoreCount + 1;
    score.innerHTML = " " + scoreCount;
}

document.addEventListener("visibilitychange", () => {
    gameIsPaused = document.hidden;
});

window.addEventListener("blur", pauseGame);
window.addEventListener("focus", resumeGame);

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
            const randomSpeed = {
                x: Math.random() * enemiesSpeed + 1,
                y: Math.random() * enemiesSpeed + 1,
            };
            Enemies.push(
                new Enemy(x, y, radius, "green", velocity, randomSpeed)
            );
        }
    }, 1500);
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
        // ctx.strokeStyle = "orange";
        // ctx.beginPath();
        // ctx.moveTo(player.x, player.y);
        // ctx.lineTo(enemy.x, enemy.y);
        // ctx.stroke();
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
            clearInterval(intervalId);
        }
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };

        enemy.ChangeVelocity(velocity);
        enemy.update();
        ShootPowers.forEach((power, powerIndex) => {
            const distance = Math.hypot(enemy.x - power.x, enemy.y - power.y);
            if (distance - enemy.radius - power.radius < 1) {
                setTimeout(() => {
                    Enemies.splice(enemyIndex, 1);
                    ShootPowers.splice(powerIndex, 1);
                    ChangeScore();
                    SpawnParticles(power.x, power.y, enemy.radius);
                }, 0);
            }
        });
    });

    ParticlesArr.forEach((p, index) => {
        const distance = Math.hypot(p.oldX - p.x, p.oldY - p.y);
        if (distance > 200)
            setTimeout(() => {
                ParticlesArr.splice(index, 1);
            }, 0);
        p.Update();
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
    ShootPowers.push(new Projectile(player.x, player.y, 5, "red", velocity));
}

window.addEventListener("click", shoot);
function SpawnParticles(x, y, r) {
    ParticlesArr.splice(0, ParticlesArr.length);
    for (let i = 0; i <= 4 * (r / 2); i++) {
        const velocity = {
            x:
                Math.ceil(Math.random() * 5) *
                (Math.round(Math.random()) ? 1 : -1),
            y:
                Math.ceil(Math.random() * 5) *
                (Math.round(Math.random()) ? 1 : -1),
        };
        ParticlesArr.push(
            new Particle(
                x +
                    Math.ceil(Math.random() * (r / 4)) *
                        (Math.round(Math.random()) ? 1 : -1),
                y +
                    Math.ceil(Math.random() * (r / 4)) *
                        (Math.round(Math.random()) ? 1 : -1),
                Math.random() * 8,
                velocity
            )
        );
    }
}


function pauseGame() {
    if (gameIsPaused === false) {
        cancelAnimationFrame(animationId);
        gameIsPaused = true;
        clearInterval(intervalId);
    }
}

function resumeGame() {
    if (gameIsPaused) {
        animationId = requestAnimationFrame(animate);
        gameIsPaused = false;
        intervalId = createInterval();
    }
}

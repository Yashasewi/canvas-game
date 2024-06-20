const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class ShootPower {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 30, "blue");

const ShootPowers = [];
const Enemies = [];

function SpawnEnemies() {
    let x;
    let y;
    setInterval(() => {
        const radius = Math.random() * 30 + 10;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
        Enemies.push(new Enemy(x, y, radius, "green", velocity));
    }, 1000);
}

let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

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
    console.log(ShootPowers.length);

    Enemies.forEach((enemy, enemyIndex) => {
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

window.addEventListener("click", (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    );
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    };
    ShootPowers.push(
        new ShootPower(canvas.width / 2, canvas.height / 2, 5, "red", velocity)
    );
});

animate();
SpawnEnemies();

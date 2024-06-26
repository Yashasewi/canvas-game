import { ctx } from "../utils/canvas.js";

export class Enemy {
    constructor(x, y, radius, color, velocity, randomSpeed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.randomSpeed = randomSpeed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    ChangeVelocity(velocity) {
        this.velocity = {
            x: velocity.x * this.randomSpeed.x,
            y: velocity.y * this.randomSpeed.y,
        };
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

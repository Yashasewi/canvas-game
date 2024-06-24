import { ctx } from "../utils/canvas.js";

export class Player {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.speed = speed; // Adjust as needed
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        if (this.moveUp) {
            this.y -= this.speed;
            console.log("Moving up", this.y);
        }
        if (this.moveDown) {
            this.y += this.speed;
            console.log("Moving down", this.y);
        }
        if (this.moveLeft) {
            this.x -= this.speed;
            console.log("Moving left", this.x);
        }
        if (this.moveRight) {
            this.x += this.speed;
            console.log("Moving right", this.x);
        }
        this.draw();
    }
}

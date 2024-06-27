import { ctx } from "../utils/canvas";

const ColorArray = [
    "#FF74B1",
    "#815B5B",
    "#DD5353",
    "#F08A5D",
    "#6A2C70",
    "#F9ED69",
    "#95E1D3",
    "#1FAB89",
    "#797A7E",
    "#071A52",
    "#17B978",
];

export class Particle {
    #color;
    #speed;
    #radius;

    constructor(
        x,
        y,
        radius,
        speed,
        color = ColorArray[Math.floor(Math.random() * ColorArray.length)]
    ) {
        this.x = x;
        this.y = y;
        this.#color = color;
        this.#speed = speed;
        this.#radius = radius;
        this.oldX = x;
        this.oldY = y;
    }
    Update() {
        this.draw();
        this.x += this.#speed.x;
        this.y += this.#speed.y;
        if (this.#radius > 1) this.#radius -= 0.3;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.#radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.#color;
        ctx.fill();
    }
}

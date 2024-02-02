import { Shape } from './shape.js';

export class Circle extends Shape {
    constructor(startPos) {
        super(startPos);
        this.radius = 0; // Initialize with 0
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.startPos.x, this.startPos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    resize(mousePos) {
        this.radius = this.startPos.distance(mousePos);
    }
}

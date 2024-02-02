import { Shape } from './shape.js';

export class Rectangle extends Shape {
    constructor(startPos) {
        super(startPos);
        this.width = 0;
        this.height = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.startPos.x, this.startPos.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();
    }

    resize(mousePos) {
        this.width = mousePos.x - this.startPos.x;
        this.height = mousePos.y - this.startPos.y;
        // Adjust for negative width/height in draw method or here
    }
}
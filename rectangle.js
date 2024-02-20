import { Shape } from './Shape.js';
import { Style } from './Style.js';

export class Rectangle extends Shape {
    constructor(position, width, height, style = new Style()) {
        super(position, style);
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillStyle = this.style.fillColor;
        ctx.fill();
        ctx.strokeStyle = this.style.borderColor;
        ctx.lineWidth = this.style.lineWidth;
        ctx.stroke();
    }

    updateShape(dt) {
        // Update rectangle properties, similar to the Circle example
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }
    
    resize(mousePos) {
        const tempWidth = mousePos.x - this.position.x;
        const tempHeight = mousePos.y - this.position.y;
        this.width = Math.abs(tempWidth);
        this.height = Math.abs(tempHeight);
    }
}
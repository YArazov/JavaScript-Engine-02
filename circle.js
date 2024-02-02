import { Shape } from './shape.js';
import { Style } from './style.js';

export class Circle extends Shape {
    constructor(startPos, radius, style) { // Ensure style is included here
        super(startPos);
        this.radius = radius;
        this.style = style; // Make sure style is assigned to this.style
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.startPos.x, this.startPos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.style?.fillColor ?? 'black'; // Use nullish coalescing operator to provide default value
        ctx.fill();
        ctx.strokeStyle = this.style?.borderColor ?? 'black';
        ctx.lineWidth = this.style?.lineWidth ?? 1;
        ctx.stroke();
    }

    resize(mousePos) {
        this.radius = this.startPos.distance(mousePos);
    }
}

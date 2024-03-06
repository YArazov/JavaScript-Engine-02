import { Aabb } from './aabb.js';
import { Shape } from './Shape.js';
import { Style } from './Style.js';
import { Vec } from './vector.js';

export class Circle extends Shape {
    constructor(position, radius = 0, style = new Style()) {
        super(position, style); // Correctly pass position and style to the Shape constructor
        this.radius = radius; // Initialize radius

        this.aabb = new Aabb(new Vec(0, 0), new Vec(0, 0));
    }

    updateAabb() {
        this.aabb.min = this.position.clone().subtractX(this.radius).subtractY(this.radius);
        this.aabb.max = this.position.clone().addX(this.radius).addY(this.radius);
    }

    draw(ctx) {
        ctx.beginPath(); // Start a new path for the circle
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // Draw the circle
        ctx.fillStyle = this.style?.fillColor ?? 'black';  // Default to black if fillColor is undefined
        ctx.fill();
        ctx.strokeStyle = this.style?.borderColor ?? 'black';// Default to black if borderColor is undefined
        ctx.lineWidth = this.style?.lineWidth ?? 1; // Default to a lineWidth of 1 if undefined
        ctx.stroke();
    }
}
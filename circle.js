import { Shape } from './Shape.js';
import { Style } from './Style.js';
import { RigidBody } from './rigidBody.js';

export class Circle extends Shape {
    constructor(position, radius = 0, style = new Style()) {
        super(position, style); // Correctly pass position and style to the Shape constructor
        this.radius = radius; // Initialize radius
        this.rigidBody = new RigidBody(this); // Use RigidBody instance directly
    }

    draw(ctx) {
        ctx.beginPath(); // Start a new path for the circle
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // Draw the circle
        ctx.fillStyle = this.style.fillColor;
        ctx.fill();
        ctx.strokeStyle = this.style.borderColor;
        ctx.lineWidth = this.style.lineWidth;
        ctx.stroke();
    }

    updateShape(dt) {
        // Update circle properties, like position based on velocity
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }

    resize(mousePos) {
        // Correct usage of this.position to calculate the new radius
        this.radius = this.position.distance(mousePos); // Update radius based on distance to mousePos
    }
}

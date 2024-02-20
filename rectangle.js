import { Shape } from './Shape.js';
import { Style } from './Style.js';
import { Vec } from './vector.js'; // Make sure to import the Vec class
import { RigidBody } from './rigidBody.js';
import { Circle } from './circle.js';


export class Rectangle extends Shape {
    constructor(position, width, height, style = new Style()) {
        super(position, style);
        this.firstClick;
        this.width = width;
        this.height = height;
        this.rigidBody = new RigidBody(this); // Use RigidBody instance directly
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
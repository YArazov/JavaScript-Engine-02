import { Shape } from './shape.js';
import { Style } from './style.js';

export class Rectangle extends Shape {
    constructor(position, width, height, style) {
        super(position, style);
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillStyle = this.style?.fillColor ?? 'black';  // Default to black if fillColor is undefined
        ctx.fill();
        ctx.strokeStyle = this.style?.borderColor ?? 'black';// Default to black if borderColor is undefined
        ctx.lineWidth = this.style?.lineWidth ?? 1; // Default to a lineWidth of 1 if undefined
        ctx.stroke();
    }
    
    resize(mousePos) {
        // Calculate new dimensions based on mouse position
        const tempWidth = mousePos.x - this.position.x;
        const tempHeight = mousePos.y - this.position.y;

        // Update drawing start positions based on the direction of resizing
        this.drawStartX = tempWidth < 0 ? mousePos.x : this.position.x;
        this.drawStartY = tempHeight < 0 ? mousePos.y : this.position.y;

        // Always store width and height as positive values
        this.width = Math.abs(tempWidth);
        this.height = Math.abs(tempHeight);
    }
}
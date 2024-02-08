import { Shape } from './shape.js';
import { Style } from './style.js';

export class Rectangle extends Shape {
    constructor(position, width = 0, height = 0, style = new Style()) {
        super(position, style); // Assuming Shape's constructor is adjusted to accept style.
        this.width = width;
        this.height = height;
        // Initialize dynamic drawing start positions
        this.drawStartX = position.x;
        this.drawStartY = position.y;
    }

    draw(ctx) {
        ctx.beginPath();
        // Use dynamic start positions for drawing to handle all directions
        ctx.rect(this.drawStartX, this.drawStartY, this.width, this.height);
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
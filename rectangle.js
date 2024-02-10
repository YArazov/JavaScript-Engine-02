import { Shape } from './shape.js';
import { Style } from './style.js';

export class Rectangle extends Shape {
    constructor(position, width, height, style) {
        super(position, style);
        this.firstClick;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.fillStyle = this.style?.fillColor ?? 'black';  // Default to black if fillColor is undefined
        ctx.fillRect(
            - this.width/2,
            - this.height/2,
            this.width,
            this.height,
        );
        
        ctx.strokeStyle = this.style?.borderColor ?? 'black';// Default to black if borderColor is undefined
        ctx.lineWidth = this.style?.lineWidth ?? 1; // Default to a lineWidth of 1 if undefined
       	ctx.strokeRect(
            - this.width/2,
            - this.height/2,
            this.width,
            this.height,
        );
        ctx.restore();

    }
    
    resize(mousePos) {
        let vectorFromFirstToCurrent = mousePos.clone().subtract(this.firstClick);
        //find point halfway between two mouse positions
        this.position = this.firstClick.clone().add(vectorFromFirstToCurrent.clone().divide(2));

        // Always store width and height as positive values
        this.width = Math.abs(vectorFromFirstToCurrent.x);
        this.height = Math.abs(vectorFromFirstToCurrent.y);
    }
}
// Assuming Shape is a base class for all shapes
import { Vec } from "./vector.js";

export class Shape {
    constructor(position, style) {
        this.position = position; // Vec instance for position
        this.style = style; // Style instance
        this.velocity = new Vec(0, 0); // Now part of Shape
        this.isMoved = false; // Indicates if the shape is being moved
    }

    // Add method to update position based on velocity and time
    updatePosition(time) {
        if (this.isMoved) {
            const ds = this.velocity.clone().multiply(time);
            this.position.add(ds);
        }
    }
    // Ensure subclasses implement their own draw method
    draw(ctx) {
        throw new Error('Subclasses must implement their own draw method.');
    }

    // Add a method for moving the shape, if not already present
    moveTo(newPosition) {
        this.position = newPosition;
    }
}

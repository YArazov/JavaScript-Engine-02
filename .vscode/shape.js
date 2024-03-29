export class Shape {
    constructor(position, style) {
        this.position = position; // Vec instance for position
        this.style = style; // Style instance
    }

    // Ensure subclasses implement their own draw method
    draw(ctx) {
        throw new Error('Subclasses must implement their own draw method.');
    }

}
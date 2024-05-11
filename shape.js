export class Shape {
    constructor(position, style) {
        if (!position) throw new Error("Position must be provided for Shape.");
        this.position = position; // Vec instance for position
        this.style = style; // Style instance
    }

    // Ensure subclasses implement their own draw method
    draw(ctx) {
        throw new Error('Subclasses must implement their own draw method.');
    }

     // Define a default calculateMass method, possibly overridden
     calculateMass(density) {
        throw new Error('calculateMass method not implemented');
    }

}

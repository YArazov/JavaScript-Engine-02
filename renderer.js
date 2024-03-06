export class Renderer {
    constructor(canv, ctx) {
        this.canvas = canv;
        this.ctx = ctx;
        this.adjustCanvasForDPI();
        // Initialize arrays for persistent and temporary renderings
        this.renderedAlways = [];   // Objects always rendered
        this.renderedNextFrame = []; // Objects rendered for only one frame
    }

    adjustCanvasForDPI() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.ctx.imageSmoothingEnabled = false;
    }

    drawFrame(objects) {
        this.clearFrame();
    
        // Assuming each object has a shape with a draw method that handles its own styling
        objects.forEach(object => {
            object.shape.draw(this.ctx); // The draw method uses the shape's own style
        });

        // Draw temporary objects and clear the list afterward
        this.renderedNextFrame.forEach(tempObject => {
            tempObject.shape.draw(this.ctx);
        });
        this.renderedNextFrame = [];

        // Draw persistent objects, do not clear the list
        this.renderedAlways.forEach(alwaysObject => {
            alwaysObject.shape.draw(this.ctx);
        });
    }

    clearFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

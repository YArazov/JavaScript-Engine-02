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

    drawFrame(objects, fillCol, bordCol) {
        // First, clear the canvas to prepare for new drawings
        this.clearFrame();

        // Draw each object and its AABB
        objects.forEach(object => {
            object.shape.draw(this.ctx, fillCol, bordCol);
            // Assuming shape.aabb.draw() method exists and works similarly to the 'Rect' project
            object.shape.aabb.draw(this.ctx, "red");
        });

        // Draw temporary objects and clear the list afterward
        this.renderedNextFrame.forEach(tempObject => {
            tempObject.draw(this.ctx, fillCol, bordCol);
        });
        this.renderedNextFrame = [];

        // Draw persistent objects, do not clear the list
        this.renderedAlways.forEach(alwaysObject => {
            alwaysObject.draw(this.ctx, fillCol, bordCol);
        });
    }

    clearFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

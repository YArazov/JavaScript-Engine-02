export class Renderer {
    constructor(canv, ctx) {
        this.canvas = canv;
        this.ctx = ctx;
        this.adjustCanvasForDPI();
    }
    // method makes outline and image equal and clear
    adjustCanvasForDPI() {
        const dpr = window.devicePixelRatio || 1; //sees if more than one pixel per pixel, if not default to 1
        const rect = this.canvas.getBoundingClientRect(); //gets size of canvas on page
        this.canvas.width = rect.width * dpr; // make canvas bigger if screen has higher resolution
        this.canvas.height = rect.height * dpr; //make canvas bigger if screen has higher resolution
        this.ctx.scale(dpr, dpr); //makes canvas size the one you set
        this.ctx.imageSmoothingEnabled = false; //turns off image smoothing so image isnt blury
    }

    drawRectangle(rectangle, strokeColor, fillColor) {

        // Fill the rectangle
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(
            rectangle.position.x,
            rectangle.position.y,
            rectangle.width,
            rectangle.height
        ); // Filling rectangle 

        // Stroke the rectangle, adjust position and dimensions to account for the stroke width
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 3; // Set outline width 
        this.ctx.strokeRect(
            rectangle.position.x,
            rectangle.position.y,
            rectangle.width,
            rectangle.height
        ); // Drawing rectangle outline
    }

    clearFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
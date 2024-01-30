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

    drawCircle(circle, strokeColor, fillColor) {
        this.ctx.beginPath();
        this.ctx.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2, true);
        if (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();    //ctx colors the background of the circle
        }
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();  //ctx draws the border of the circle
    }

    drawRect(rect, strokeColor, fillColor) {
        this.ctx.save();
        this.ctx.translate(rect.position.x, rect.position.y);
        if (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fillRect(
                - rect.width / 2, // (-) is a negative symbol, so negative rect.width 
                - rect.height / 2,
                rect.width,
                rect.height,
            );
        }
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            - rect.width / 2, // these on fill and stroke are half the width and height to the top and left, so it centers on origin since it is half its l and w from origin
            - rect.height / 2,
            rect.width,
            rect.height,
        );
        this.ctx.restore();
    }

    drawFrame(objects, fillCol, bordCol) {
        for (let i = 0; i < objects.length; i++) {
            this.drawCircle(objects[i], bordCol, fillCol);
        } 
        
    }

    clearFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
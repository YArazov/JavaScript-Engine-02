export class Renderer {
    constructor (canv, ctx) {
        this.canvas = canv;
        this.ctx = ctx;
    }

    drawCircle(circle, strokeColor, fillColor) {
        this.ctx.beginPath();
        this.ctx.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI*2, true);
        if (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill(); //ctx colors the backround of the circle
        }
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 3;
        this.ctx.stroke(); //ctx draws the border of the cirfle
    }

    clearFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
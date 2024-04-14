import { Aabb } from './aabb.js';
import { Shape } from './shape.js';
import { Style } from './style.js';
import { Vec } from './vector.js';


export class Rectangle extends Shape {
    constructor(position, width, height, style = new Style()) {
        super(position, style);
        this.width = width;
        this.height = height;
        this.orientation = 0;

        this.vertices = [new Vec(0, 0), new Vec(0, 0), new Vec(0, 0), new Vec(0, 0)];
        this.aabb = new Aabb(new Vec(0, 0), new Vec(0, 0));
    }

    //0 1
    //3 2

    updateVertices() {
        this.vertices[0].setX(-this.width / 2).setY(-this.height / 2).rotate(this.orientation).add(this.position);
        this.vertices[1].setX(this.width / 2).setY(-this.height / 2).rotate(this.orientation).add(this.position);
        this.vertices[2].setX(this.width / 2).setY(this.height / 2).rotate(this.orientation).add(this.position);
        this.vertices[3].setX(-this.width / 2).setY(this.height / 2).rotate(this.orientation).add(this.position);
    }

    updateAabb() {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;
        let vertexX;
        let vertexY;

        for (let i = 0; i < this.vertices.length; i++) {
            vertexX = this.vertices[i].x;
            vertexY = this.vertices[i].y;
            //find the min and max x and y
            minX = vertexX < minX ? vertexX : minX;
            maxX = vertexX > maxX ? vertexX : maxX;
            minY = vertexY < minY ? vertexY : minY;
            maxY = vertexY > maxY ? vertexY : maxY;

        }
        //store min and max y in aabb
        this.aabb.min.x = minX;
        this.aabb.min.y = minY;
        this.aabb.max.x = maxX;
        this.aabb.max.y = maxY;
    }

    calculateMass(density) {
        const area = this.width * this.height;
        return area * density;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.orientation);
        ctx.beginPath();
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height); // Corrected position
        ctx.fillStyle = this.style.fillColor;
        ctx.fill();
        ctx.strokeStyle = this.style.borderColor;
        ctx.lineWidth = this.style.lineWidth;
        ctx.stroke();
        ctx.restore();
    }
    
}
import { Circle } from "./circle.js";

export class Collisions {
    constructor() {
        this.collisions = [];
    }

    clearCollisions() {
        this.collisions = []; //reset it (assigns it to empty array)
    }

    narrowPhazeDetection(objects) {
        for (let i = 0; i < objects.length; i++) {
            for (let j = 1; j < objects.length; j++) {  // try j = i+1
                if (j > i) {
                    if (objects[i].shape instanceof Circle && objects[j].shape instanceof Circle) {
                        this.detectCollisionCircleCircle(objects[i], objects[j]);
                    }   //  later detect rectangle rectangle here
                }
            }
        }
    }

    detectCollisionCircleCircle(obj1, obj2) {   //  obj1 and abj2 are rigid bodies from array objects in main
        const circle1 = obj1.shape;  //  rigid bodies have shape, circle or rectangle
        const circle2 = obj2.shape;  //  shape has position and radius
        const distance = circle1.position.distanceTo(circle2.position);   //  returns magnitude of ditance between these two shapes as a vector (position is from circle class)

        if (distance < circle1.radius + circle2.radius) {   //  finding if the objects touch/overlap, if they do, the collision acts on it
            const overlap = circle1.radius + circle2.radius - distance; //  vector from circle1 to circle2
            const normal = circle2.position.clone().subtract(circle1.position).normalize(); //  dont want to change original vector, so we subtract from a clone() is a unit vector means directon
            this.collisions.push({  //  make a object without a constructor
                collidedPair: [obj1, obj2], //  make array of objects that are colliding
                overlap: overlap,
                normal: normal
            })
        }
    }

    //  detect rectangles collisions

    pushOffObjects(obj1, obj2, overlap, normal) {
        obj1.shape.position.subtract(normal.clone().multiply(overlap / 2));
        obj2.shape.position.add(normal.clone().multiply(overlap / 2));

    }

    resolveCollisions() {
        let collidedPair, overlap, normal, obj1, obj2;
        for (let i = 0; i < this.collisions.length; i++) {
            ({ collidedPair, overlap, normal } = this.collisions[i]);
            [obj1, obj2] = collidedPair;
            this.pushOffObjects(obj1, obj2, overlap, normal);
        }
    }
}
import { Circle } from "./circle.js";
import { Rectangle } from "./rectangle.js";
import { renderer } from "./main.js";

export class Collisions {
    constructor() {
        this.possibleCollisions = [];
        this.collisions = [];
    }

    clearCollisions() {
        this.possibleCollisions = [];
        this.collisions = []; //reset it (assigns it to empty array)
    }

    broadPhazeDetection(objects) {
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                this.detectAabbCollision(objects[i], objects[j]);
            }
        }
    }

    narrowPhaseDetection(objects) {
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {

                if (objects[i].shape instanceof Circle && objects[j].shape instanceof Circle) {
                    this.detectCollisionCircleCircle(objects[i], objects[j]);
                }  
                else if (objects[i].shape instanceof Circle && objects[j].shape instanceof Rectangle) {
                    this.detectCollisionCirclePolygon(objects[i], objects[j]);
                } 
                else if (objects[i].shape instanceof Rectangle && objects[j].shape instanceof Circle) {
                    this.detectCollisionCirclePolygon(objects[j], objects[i]);
                }
                 else if (objects[i].shape instanceof Rectangle && objects[j].shape instanceof Rectangle) {
                    this.detectCollisionPolygonPolygon(objects[i], objects[j]);
                }
            }
        }
    }

    detectAabbCollision(obj1, obj2) {
        let obj1aabb = obj1.shape.aabb;
        let obj2aabb = obj2.shape.aabb;
        if (obj1aabb.max.x > obj2aabb.min.x &&
            obj1aabb.max.y > obj2aabb.min.y &&
            obj2aabb.max.x > obj1aabb.min.x &&
            obj2aabb.max.y > obj1aabb.min.y) {
            this.possibleCollisions.push([obj1, obj2]);
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

    detectCollisionCirclePolygon(circle, polygon) {
        // Revised logic for clarity and correctness
        const vertices = polygon.shape.vertices;
        const circleShape = circle.shape;
        let overlap = Number.MAX_VALUE;
        let normal, axis;

        for (let i = 0; i < vertices.length; i++) {
            const v1 = vertices[i];
            const v2 = vertices[(i + 1) % vertices.length];
            axis = v2.clone().subtract(v1).rotateCCW90().normalize();

            const [min1, max1] = this.projectVertices(vertices, axis);
            const [min2, max2] = this.projectCircle(circleShape.position, circleShape.radius, axis);

            if (min2 >= max1 || min1 >= max2) return;

            const axisOverlap = Math.min(max2 - min1, max1 - min2);
            if (axisOverlap <= overlap) {
                overlap = axisOverlap;
                normal = axis;
            }
        }

        const closestVertex = this.findClosestVertex(vertices, circleShape.position);
        axis = closestVertex.clone().subtract(circleShape.position).normalize();

        const [min1, max1] = this.projectVertices(vertices, axis);
        const [min2, max2] = this.projectCircle(circleShape.position, circleShape.radius, axis);

        if (!(min1 >= max2 || min2 >= max1)) {
            const axisOverlap = Math.min(max2 - min1, max1 - min2);
            if (axisOverlap < overlap) {
                overlap = axisOverlap;
                normal = axis;
            }

            const vec1to2 = polygon.shape.position.clone().subtract(circle.shape.position);
            if (normal.dot(vec1to2) < 0) {
                normal.invert();
            }

            this.collisions.push({
                collidedPair: [circle, polygon],
                overlap: overlap,
                normal: normal,
            });
        }
    }

    projectVertices(vertices, axis) {
        let min = vertices[0].dot(axis), max = min;

        for (let i = 1; i < vertices.length; i++) {
            const proj = vertices[i].dot(axis);
            if (proj < min) {
                min = proj;
            }
            if (proj > max) {
                max = proj;
            }
        }

        return [min, max];
    }

    projectCircle(center, radius, axis) {
        let min, max;
        const points = [center.clone().moveDistanceInDirection(radius, axis), center.clone().moveDistanceInDirection(-radius, axis)];   // points on circle
        min = points[0].dot(axis);
        max = points[1].dot(axis);
        if (min > max) {
            const temp = min;   //swapping min and max values
            min = max;
            max = temp;
        }

        return [min, max];
    }


    findClosestVertex(vertices, center) {
        let minDistance = Number.MAX_VALUE;
        let vertexDistance, closestVertex;

        for (let i = 0; i < vertices.length; i++) {
            vertexDistance = vertices[i].distanceTo(center);
            if (vertexDistance < minDistance) {
                minDistance = vertexDistance;
                closestVertex = vertices[i];
            }
        }
        renderer.renderedNextFrame.push(closestVertex); //add closest vertex to renderer array
        return closestVertex;
    }


    detectCollisionPolygonPolygon(obj1, obj2) {
        const vertices1 = obj1.shape.vertices;
        const vertices2 = obj2.shape.vertices;
        let smallestOverlap = Number.MAX_VALUE;
        let collisionNormal, axis;

        const vector1to2 = obj2.shape.position.clone().subtract(obj1.shape.position);

        const edges1 = this.calculateEdges(vertices1);
        const axes1 = [];

        for (let i = 0; i < edges1.length; i++) {
            axes1.push(edges1[i].rotateCCW90().normalize());
        }

        //check if axes are not on the back side of rectangle
        for (let i = 0; i < axes1.length; i++) {
            const axis = axes1[i];
            if (axis.dot(vector1to2) < 0) {
                //axes is in the wrong direction, i.e it is on the backside of rectangle
                continue;
            }

            //calculate overlap on axis
            const { overlap, normal } = this.calculateOverlap(vertices1, vertices2, axis);

            if (overlap <= 0) {
                return; //seperating axis found, no collision
            } else if (overlap < smallestOverlap) {
                smallestOverlap = overlap;
                collisionNormal = normal;
            }
        }

        // object 2 edges
        const vector2to1 = vector1to2.clone().invert();
        const edges2 = this.calculateEdges(vertices2);
        const axes2 = [];

        for (let i = 0; i < edges2.length; i++) {
            axes2.push(edges2[i].rotateCCW90().normalize());
        }
        for (let i = 0; i < axes2.length; i++) {
            const axis = axes2[i];
            if (axis.dot(vector2to1) < 0) {
                continue;
            }
            const { overlap, normal } = this.calculateOverlap(vertices1, vertices2, axis);
            if (overlap <= 0) {
                return;
            } else if (overlap < smallestOverlap) {
                smallestOverlap = overlap;
                collisionNormal = normal;
            }
        }

        const normal = this.correctNormalDirection(collisionNormal, obj1, obj2);

        this.collisions.push({
            collidedPair: [obj1, obj2],
            overlap: smallestOverlap,
            normal: normal,     //direction from obj1 to obj2, normal points out of obj1
        });
    }

    calculateEdges(vertices) {
        const edges = [];
        for (let i = 0; i < vertices.length; i++) {
            const v1 = vertices[i];
            const v2 = vertices[(i + 1) % vertices.length];
            edges.push(v2.clone().subtract(v1));
        }
        return edges;
    }

    calculateOverlap(vertices1, vertices2, axis) {
        const [min1, max1] = this.projectVertices(vertices1, axis);
        const [min2, max2] = this.projectVertices(vertices2, axis);

        if (min1 >= max2 || min2 >= max1) {
            return {
                overlap: 0,
                normal: null
            }
        }
        return {
            overlap: Math.min(max2 - min1, max1 - min2),
            normal: axis.clone(),
        };
    }

    correctNormalDirection(normal, obj1, obj2) {
        const vecO1O2 = obj2.shape.position.clone().subtract(obj1.shape.position);
        const dot = normal.dot(vecO1O2);
        if (dot >= 0) {
            return normal;
        } else {
            return normal.invert();
        }
    }

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
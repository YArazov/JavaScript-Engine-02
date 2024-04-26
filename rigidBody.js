import { Vec } from './vector.js';
import { Rectangle } from './rectangle.js';

export class RigidBody {
    constructor(shape, isStatic = false) {
        this.shape = shape;
        this.velocity = new Vec(0, 0);
        this.angularVelocity = 0;
        this.mass = 0; // Initialize with a default value
        this.inverseMass;
        this.density = 1;
        this.isStatic = isStatic; // Use consistently
        this.acceleration = new Vec(0, 0);
        this.inertia;
        this.inverseInertia;
    }

    updateShape(dt) {

        const dv = this.acceleration.clone().multiply(dt);
        this.velocity.add(dv);
        const ds = this.velocity.clone().multiply(dt);  //multiply v * dt = giving you displacement per frame
        this.shape.position.add(ds);
        this.shape.orientation += this.angularVelocity * dt;


        // Update vertices and aabb of shape if it is a rectangle
        if (this.shape instanceof Rectangle) {
            this.shape.updateVertices();
        }
        //update aabb
        this.shape.updateAabb();
    }

    setMass() {
        this.mass = this.shape.calculateMass(this.density);
        this.inertia = this.shape.calculateMass(this.mass);

        if (this.isStatic) { // Correctly using isStatic
            this.inverseMass = 0;   // 0 for collisions means that the mass is infinity
            this.inverseInertia = 0;
        } else {
            this.inverseMass = 1 / this.mass;
            this.inverseInertia = 1 / this.inertia;
        }
    }

    checkTooFar(worldSize) {
        if (this.shape.position.magnitude() > worldSize) {
            return true;
        }
    }
}

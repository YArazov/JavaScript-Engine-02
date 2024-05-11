import { Shape } from './shape.js';
import { RigidBody } from './rigidBody.js';
import { Vec } from './vector.js';
import { Aabb } from './aabb.js';
import { Style } from './style.js';

export class Circle extends Shape {
    constructor(position, radius = 0, style = new Style()) {
        console.log()
        super(position, style); // Correctly pass position and style to the Shape constructor
        this.radius = radius; // Initialize radius

        this.aabb = new Aabb(new Vec(0, 0), new Vec(0, 0));
        this.orientation = 0;

        
        // Log Circle initialization
        console.log(`Circle created with radius ${this.radius} at position (${position.x}, ${position.y})`);
        console.log(`RigidBody initialized: ${this.rigidBody !== undefined}`);
        console.log(`Initial AABB - Min: (${this.aabb.min.x}, ${this.aabb.min.y}), Max: (${this.aabb.max.x}, ${this.aabb.max.y})`);
         
        // Automatically create a rigid body for this circle
        this.rigidBody = new RigidBody(this, false); // Assuming the circle is not static by default
       
    }

    calculateMass(density) {
        const area = Math.PI * this.radius * this.radius;
        return area * density;
    }

    updateAabb() {
        this.aabb.min.setX(this.position.x - this.radius).setY(this.position.y - this.radius);
        this.aabb.max.setX(this.position.x + this.radius).setY(this.position.y + this.radius);

         
    }

    update(dt) {
        // Assume this method is called within the game loop
        this.rigidBody.updateShape(dt);
        this.updateAabb();
    }

    applyForce(force) {
        this.rigidBody.applyForce(force);
        // Log application of force
        console.log(`Force applied to Circle: (${force.x}, ${force.y})`);
    }
     calculateInertia(mass) {
        return 0.5 * mass * this.radius * this.radius; // I = 1/2 m r^2
    }

    draw(ctx) {
        ctx.beginPath(); // Start a new path for the circle
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // Draw the circle
        ctx.fillStyle = this.style.fillColor;
        ctx.fill();
        ctx.strokeStyle = this.style.borderColor;
        ctx.lineWidth = this.style.lineWidth;
        ctx.stroke();

        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(
            this.position.x + this.radius * Math.cos(this.orientation),
            this.position.y + this.radius * Math.sin(this.orientation),
        );
        ctx.stroke();
    }
}
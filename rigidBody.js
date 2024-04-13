import {Vec} from './vector.js';
import { Rectangle } from './rectangle.js';

export class RigidBody {
	constructor(shape) {
		this.shape = shape;   
		this.velocity = new Vec(0, 0);

		this.angularVelocity = 0.1;

		this.mass;
		this.inverseMass;
		this.density = 1;
	}	

	updateShape(dt) {	//just for rectangle right now
		const ds = this.velocity.clone().multiply(dt);  //multiply v * dt = giving you displacement per frame
		this.shape.position.add(ds);

		this.shape.orientation += this.angularVelocity * dt;

		//update vertices and aabb of shape if it is rectangle
		if (this.shape instanceof Rectangle) {
			this.shape.updateVertices();
		}
		//update aabb
		this.shape.updateAabb();
    } 

	setMass() {
		this.mass = this.shape.calculateMass(this.density);
		this.inverseMass = 1 / this.mass;
	}

	checkTooFar (worldSize) {
		if (this.shape.position.magnitude() > worldSize) {
			return true;
		}
	}

}
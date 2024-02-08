import { Vec } from "./vector";

export class RigidBody {    //any object with physics and fixed shape
    
    constructor(s) {
    this.shape = s;
    this.velocity = new Vec(0, 0);
    this.isMoved = false;
    }

    updateShape(time) {
        const ds = this.velocity.clone().multiply(time); //method chaning (first clone the multiply)
        this.shape.position.add(ds);
    }
}
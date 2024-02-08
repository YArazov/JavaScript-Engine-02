import { Vec } from "./vector";

export class RigidBody {
    constructor(position = new Vec(0, 0)) {
        this.position = position;
    }

    moveTo(newPosition) {
        this.position = newPosition.clone();
    }

    updateShape(time) {
        const ds = this.velocity.clone().multiply(time); //method chaning (first clone the multiply)
        this.shape.position.add(ds);
    }
}
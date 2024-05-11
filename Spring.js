export class Spring {
    constructor(objectA, objectB, restLength, stiffness) {
        console.log("Creating Spring:", {objectA, objectB, restLength, stiffness});

        this.objectA = objectA;
        this.objectB = objectB;
        this.restLength = restLength;
        this.stiffness = stiffness;
    }

    applyForce() {
        console.log("Object A position:", this.objectA.position);
        console.log("Object B position:", this.objectB.position);
        console.log(`Applying force: Positions A: ${this.objectA.position}, B: ${this.objectB.position}`);
        if (!this.objectA.position || !this.objectB.position) {
            console.error("Undefined position detected", this.objectA, this.objectB);
            return; // Abort force application if positions are undefined
        }
        let distanceVec = this.objectB.position.subtract(this.objectA.position);
        let distance = distanceVec.magnitude();
        let extension = distance - this.restLength;
        let forceMagnitude = -this.stiffness * extension; // Hooke's Law: F = -kx
        let force = distanceVec.normalize().multiply(forceMagnitude);
    
        this.objectA.applyForce(force);
        this.objectB.applyForce(force.multiply(-1)); // Apply equal and opposite force
    }
    
    draw(ctx) {
        if (!this.objectA.position || !this.objectB.position) {
            return; // Do not attempt to draw if positions are undefined
        }
        ctx.beginPath();
        ctx.moveTo(this.objectA.position.x, this.objectA.position.y);
        ctx.lineTo(this.objectB.position.x, this.objectB.position.y);
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }
}

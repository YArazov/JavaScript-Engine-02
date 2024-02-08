export class Vec {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //chainable methods 

    copy(v) {   //make this vector have the same value (coords) as another vector
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    add(v) {    //add v's and y to this vector;s x y and return the newest vector
        this.x += v.x; //operators
        this.y += v.y;
        return this;    //used for chaining methods
    }

    subtract(v) {    //add v's x and y to this vector's x y and return the new vector
        this.x -= v.x;  //operators
        this.y -= v.y;  
        return this;    //used for chaining methods
    }

    divide(s) { // updated divide to handle cases of dividing by 0
        if (s !== 0) {
            this.x /= s;
            this.y /= s;
        }
        return this;
    }

    multiply(s) {   //multiply vector by a scalar (lengthening vector)
        this.x *= s;
        this.y *= s;
        return this;
    }

    // Method to calculate the distance between this vector and another vector
    distance(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    absolute() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }
    //non-chainable methods
    clone() {   //create a new  vector with same coords
        return new Vec(this.x, this.y);
    }

    magnitude() {      //find magnitude (the length of vector)
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
}

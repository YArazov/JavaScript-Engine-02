export class Vec {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //chainable methods 

    copy(v) {   //make this vector have the same value (coords) as another vector
        this.x = v.x;
        this.y = this.y;
        return this;
    }

    add(v) {    //add v's and y to this vector;s x y and return the newest vector
        this.x += v.x; //operators
        this.y += v.y;
        return this;    //used for chaining methods
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiply(s) {   //multiply vector by a scalar (lengthening vector)
        this.x *= s;
        this.y *= s;
        return this;
    }

    divide(s) {     //divide vector by scalar (shortening vector)
        this.x /= s;
        this.y /= s;
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
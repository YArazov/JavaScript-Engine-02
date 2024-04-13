import { Renderer } from './renderer.js';
import { Circle } from './circle.js';
import { Rectangle } from './rectangle.js';
import { Input } from './input.js';
import { RigidBody } from './rigidBody.js';
import { Collisions } from './collisions.js';
import { Style } from './style.js';

// Setup constants and utility functions
const SMALLEST_RADIUS = 10;
const WORLD_SIZE = 5000;
const dt = 1 / 60; // Time per frame, for consistent movement and physics calculations

// Assuming Style class is properly imported or defined
let defaultStyle = new Style('black', 'red', 3); // default style

const canv = document.getElementById("canvas");
const ctx = canv.getContext("2d");

export const renderer = new Renderer(canv, ctx);    //export renderer, is in collision

const inp = new Input(canv, window, dt);
inp.resizeCanvas();
inp.addListeners();

const col = new Collisions();
const objects = [];
let shapeBeingMade = null;
//button variables
let shapeSelected = 'r';
const circleButton = document.getElementById("c");
const rectButton = document.getElementById("r");
circleButton.onclick = function () {
    shapeSelected = 'c';
};
rectButton.onclick = function () {
    shapeSelected = 'r';
};

//MAIN LOOP
function updateAndDraw() {

    //make objects
    if (inp.inputs.lclick && shapeBeingMade == null) {
        //make rectangles & circles with mouse
        if (shapeSelected == 'c') {
            shapeBeingMade = new Circle(inp.inputs.mouse.position.clone(), SMALLEST_RADIUS, defaultStyle);
        } else if (shapeSelected == 'r') {
            shapeBeingMade = new Rectangle(inp.inputs.mouse.position.clone(), SMALLEST_RADIUS * 2, SMALLEST_RADIUS * 2, defaultStyle);
        }

    }
    //adjust radius
    if (inp.inputs.lclick && shapeBeingMade instanceof Circle) {
        const selectedRadius = shapeBeingMade.position.clone().subtract(inp.inputs.mouse.position).magnitude();
        shapeBeingMade.radius = selectedRadius < SMALLEST_RADIUS ? shapeBeingMade.radius : selectedRadius;
    }
    //adjust rectangle
    else if (inp.inputs.lclick && shapeBeingMade instanceof Rectangle) {
        const selectionVector = shapeBeingMade.position.clone().subtract(inp.inputs.mouse.position).absolute();
        shapeBeingMade.width = selectionVector.x > SMALLEST_RADIUS ? selectionVector.x * 2 : SMALLEST_RADIUS * 2;
        shapeBeingMade.height = selectionVector.y > SMALLEST_RADIUS ? selectionVector.y * 2 : SMALLEST_RADIUS * 2;
    }

    //add objects
    if (shapeBeingMade && !inp.inputs.lclick) {
        addObject(shapeBeingMade);
        shapeBeingMade = null;
    }

    //move objects with mouse
    if (!inp.inputs.lclick && inp.inputs.rclick && !inp.inputs.mouse.movedObject) {
        const closestObject = findClosestObject(objects, inp.inputs.mouse.position);
        inp.inputs.mouse.movedObject = closestObject == null ? null : closestObject;
    }
    if (!inp.inputs.rclick || inp.inputs.lclick) {
        inp.inputs.mouse.movedObject = null;
    }
    if (inp.inputs.mouse.movedObject) {
        moveObjectWithMouse(inp.inputs.mouse.movedObject);
    }

    //update object positions with velocity
    for (let i = 0; i < objects.length; i++) {
        objects[i].updateShape(dt);
    }

    //COLLISIONS
    col.clearCollisions();
    col.broadPhazeDetection(objects);
    // console.log(col.possibleCollisions.length);
    col.narrowPhaseDetection(objects);  //detect all possible collisions
    col.resolveCollisionsLinear();    //push off


     //remove objects that are too far
     const objectsToRemove = [];
     for (let i=0; i<objects.length; i++) {
         if (objects[i].checkTooFar(WORLD_SIZE)) {
             objectsToRemove.push(objects[i]);
         }
     }
     removeObjects(objectsToRemove);

    //draw objects
    renderer.clearFrame();
    renderer.drawFrame(objects);
    //draw shape
    if (shapeBeingMade) {
        shapeBeingMade.draw(ctx); // Style is already assigned to the shape, no need for extra parameters
    }
}
let renderInterval = setInterval(updateAndDraw, 1000 / 60);

function findClosestObject(objects, vector) {
    let closestObject = null;
    let distance;
    let lowestDistance = 30;
    for (let i = 0; i < objects.length; i++) {
        distance = objects[i].shape.position.distanceTo(vector);
        if (distance < lowestDistance) {
            lowestDistance = distance;
            closestObject = objects[i];
        }
    }
    return closestObject;
}

function moveObjectWithMouse(object) {
    object.shape.position.copy(inp.inputs.mouse.position);
    object.velocity.copy(inp.inputs.mouse.velocity);
}

function addObject(shape) {
    const object = new RigidBody(shape);
    object.setMass();
    objects.push(object);
}

    console.log(object.mass, object.inverseMass);
 

function removeObjects(objectsToRemove) {
    for (let i=0; i<objects.length; i++) {
        for (let j=0; j<objectsToRemove.length; j++) {
            if (objects[i] == objectsToRemove[j]) {
                objects.splice(i, 1);
            }
        }
    }
}

//1 relative velocity
const velocityTruckEarth = new Vec (0, 70);
const velocityEarthTruck = velocityTruckEarth.invert();
const velocityCarEarth = new Vec (80, 0);
const velocityCarTruck = velocityCarEarth.add(velocityEarthTruck);
console.log(velocityCarTruck.magnitude());
console.log(velocityCarTruck.angle());

//2 coefficient of restitution e
const bounceHeight = 1100;
const dropHeight = 1685;
const e = Math.sqrt(bounceHeight / dropHeight);
console.log(e);
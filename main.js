import { Renderer } from './renderer.js';
import { Circle } from './circle.js';
import { Rectangle } from './rectangle.js';
import { Input } from './input.js';
import { RigidBody } from './rigidBody.js';
import { Collisions } from './collisions.js';
import { Vec } from './vector.js';
import { Style } from './Style.js';

// Setup constants and utility functions
const SMALLEST_RADIUS = 10;
const dt = 1 / 60; // Time per frame, for consistent movement and physics calculations

// Assuming Style class is properly imported or defined
let defaultStyle = new Style('black', 'red', 3); // default style

const canv = document.getElementById("canvas");
const ctx = canv.getContext("2d");

const renderer = new Renderer(canv, ctx);


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
    console.log(col.possibleCollisions.length);
    col.narrowPhazeDetection(objects);  //detect all possible collisions
    col.resolveCollisions();    //push off

    //draw objects
    renderer.clearFrame();
    renderer.drawFrame(objects);
    //draw shape
    if (shapeBeingMade) {
        shapeBeingMade.draw(ctx); // Style is already assigned to the shape, no need for extra parameters
    }

    //assignment6
    ctx.font = "20px serif";
    ctx.fillStyle = 'red';
    ctx.fillText("Vector Multiplication", 725, 350);
    ctx.fillStyle = 'purple';
    ctx.fillText("Vector Subtraction", 375, 400);
    ctx.fillStyle = 'blue';
    ctx.fillText("Vector Rotation", 550, 800);
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
    objects.push(object);
}

//making vectors
const origin = new Vec(200, 100);

const vector1 = new Vec(50, 60);
vector1.renderOrigin = origin;
vector1.color = "red";

const vector2 = new Vec(-50, 60);
vector2.renderOrigin = origin;
vector2.color = "blue";

const testVector = vector1.clone().add(vector2);
testVector.renderOrigin = origin;


//assignment 6
const origin2 = new Vec(600, 400);
const origin3 = new Vec(670, 600);
const origin4 = new Vec(600, 700);

ctx.fillText("Vector Addition", 50, 50);
const vector3 = new Vec(-100, 100);
vector3.renderOrigin = origin2;
vector3.color = "purple";

ctx.fillText("Vector Addition", 50, 50);
const vector4 = new Vec(-100, -100);
vector4.renderOrigin = origin2;
vector4.color = "green";

ctx.fillText("Vector Addition", 50, 50);
const differenceVector = vector3.clone().subtract(vector4);
differenceVector.renderOrigin = origin2;
differenceVector.color = "yellow";

ctx.fillText("Vector Addition", 50, 50);
const vector5 = new Vec(200, -200);
vector5.renderOrigin = origin3;
vector5.color = "red";

ctx.fillText("Vector Addition", 50, 50);
const multVector = vector5.clone().multiply(2);
multVector.renderOrigin = origin3;
multVector.color = "red";

ctx.fillText("Vector Addition", 50, 50);
const vector6 = new Vec(-200,200);
vector6.renderOrigin = origin4;
vector6.color = "blue";

ctx.fillText("Vector Addition", 50, 50);
const rotateVector = vector6.clone().rotate(Math.PI * -0.5);
rotateVector.renderOrigin = origin4;
rotateVector.color = "blue"

renderer.renderedAlways.push(vector1, vector2, vector3, vector4, vector5, vector6, differenceVector, multVector, rotateVector, testVector);
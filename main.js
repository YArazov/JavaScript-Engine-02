import { Input } from './input.js';
import { Circle } from './circle.js';
import { Rectangle } from './rectangle.js';
import { Renderer } from './renderer.js';
import { Shape } from './shape.js'; // If needed for reference
import { Style } from './style.js';
import { Vec } from './vector.js';


let currentShapeType = 'circle'; // Dynamically change this to add more shapes
const time = 1 / 60;  //based on seconds per frame
const LOWEST_DISTANCE_MOVING_OBJ = 30;


document.addEventListener('DOMContentLoaded', () => {   //button implement
    document.getElementById('shapeToggle').addEventListener('click', toggleShape);
});


const canvas = document.getElementById("canvas");   //find the canvas element on the web page
const ctx = canvas.getContext("2d");    //used to draw shapes on the canvas


const input = new Input(canvas, window);
input.addListeners();


const renderer = new Renderer(canvas, ctx);


let objects = [];
let shapeBeingMade = null;
let movingShape = false;


function toggleShape() {    //logic for button to switch between shapes
    // Extend this toggle logic for more shapes
    currentShapeType = currentShapeType === 'circle' ? 'rectangle' : 'circle';
}


function createShape(startPos) {
    // Example style - make this dynamic or user-configurable
    const defaultStyle = new Style('cyan', 'grey', 3);

    switch (currentShapeType) {
        case 'circle':
            return new Circle(startPos, 0, defaultStyle); // Circle takes startPos, radius, and style
        case 'rectangle':
            return new Rectangle(startPos, 0, 0, defaultStyle); // Rectangle takes startPos, width, height, and style
        // Add cases for new shapes here, initializing them with defaultStyle or a specific style
    }
}


function updateAndDraw() {
    if (input.inputs.lclick && !shapeBeingMade) {

        const startPos = input.inputs.mouse.position.clone();
        shapeBeingMade = createShape(startPos);

    } else if (input.inputs.lclick && shapeBeingMade) {

        // Ensure input.inputs.mouse.position is defined and correctly structured
        if (input.inputs.mouse.position) {
            shapeBeingMade.resize(input.inputs.mouse.position);
        } else {
            console.error('Mouse position is undefined');
        }

    } else if (!input.inputs.lclick && shapeBeingMade) {

        objects.push(shapeBeingMade);
        shapeBeingMade = null;
    }


    //move objects with mouse
    let closestObji = null;
    let distanceMouseObj;
    let currentLowestDistance = LOWEST_DISTANCE_MOVING_OBJ; // thresh-hold
    if (input.inputs.rclick && !input.inputs.rclick && !movingShape) {
        for (let i = 0; i < objects.length; i++) {  //goes over objects array
            const obj = objects[i];
            distanceMouseObj = obj.shape.position.distanceTo(input.inputs.mouse.position);
            if (distanceMouseObj < currentLowestDist) {
                currentLowestDistance = distanceMouseObj;
                closestObji = i;    //the i of the closest object to the mouse
            }
        }
    }

    if (closestObji != null) {
        movingShape = true;
        objects[closestObji].isMoved = true;
    }
    if (movingShape && !input.inputs.rclick) {
        movingShape = false;    // stop moving objects
        for (let i = 0; i < objects.length; i++) {
            objects[i].isMoved = false; // whennot rclick anymore set isMoved to false (stop moving it)
        }
    }

    // update the positions and velocities for all moved objects
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].isMoved) {
            const movedObj = objects[i];
            movedObj.shape.position.copy(inp.inputs.mouse.position); //updates the position of the moved obj
        }
    }


    renderer.clearFrame();
    objects.forEach(obj => obj.draw(ctx)); // Each shape uses its own style for drawing
    if (shapeBeingMade) shapeBeingMade.draw(ctx);   // draw method for creating shape

    requestAnimationFrame(updateAndDraw);
}

input.resizeCanvas();
requestAnimationFrame(updateAndDraw);
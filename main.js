import { Input } from './input.js';
import { Circle } from './circle.js';
import { Rectangle } from './rectangle.js';
import { Renderer } from './renderer.js';
import { Shape } from './shape.js'; // If needed for reference
import { Vec } from './vector.js';

let currentShapeType = 'circle'; // Dynamically change this to add more shapes

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('shapeToggle').addEventListener('click', toggleShape);
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const input = new Input(canvas, window);
input.addListeners();
const renderer = new Renderer(canvas, ctx);

let objects = [];
let shapeBeingMade = null;

function toggleShape() {
    // Extend this toggle logic for more shapes
    currentShapeType = currentShapeType === 'circle' ? 'rectangle' : 'circle';
}

function createShape(startPos) {
    switch (currentShapeType) {
        case 'circle':
            return new Circle(startPos);
        case 'rectangle':
            return new Rectangle(startPos);
        // Add cases for new shapes here
    }
}

function updateAndDraw() {
    if (input.inputs.lclick && !shapeBeingMade) {
        const startPos = input.inputs.mouse.position.clone();
        shapeBeingMade = createShape(startPos);
    } else if (input.inputs.lclick && shapeBeingMade) {
        shapeBeingMade.resize(input.inputs.mouse.position);
    } else if (!input.inputs.lclick && shapeBeingMade) {
        objects.push(shapeBeingMade);
        shapeBeingMade = null;
    }

    renderer.clearFrame();
    objects.forEach(obj => obj.draw(ctx));
    if (shapeBeingMade) shapeBeingMade.draw(ctx);

    requestAnimationFrame(updateAndDraw);
}

input.resizeCanvas();
requestAnimationFrame(updateAndDraw);
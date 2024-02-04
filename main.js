import { Input } from './input.js';
import { Circle } from './circle.js';
import { Rectangle } from './rectangle.js';
import { Renderer } from './renderer.js';
import { Shape } from './shape.js'; // If needed for reference
import { Style } from './style.js';
import { Vec } from './vector.js';

let currentShapeType = 'circle'; // Dynamically change this to add more shapes
const time = 1/60;  //based on seconds per frame

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
    // Example style - you might make this dynamic or user-configurable
    const defaultStyle = new Style('cyan', 'grey', 3);

    switch (currentShapeType) {
        case 'circle':
            return new Circle(startPos, 0, defaultStyle); // Assuming Circle takes startPos, radius, and style
        case 'rectangle':
            return new Rectangle(startPos, 0, 0, defaultStyle); // Assuming Rectangle takes startPos, width, height, and style
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

    renderer.clearFrame();
    objects.forEach(obj => obj.draw(ctx)); // Each shape uses its own style for drawing
    if (shapeBeingMade) shapeBeingMade.draw(ctx);

    requestAnimationFrame(updateAndDraw);
}

input.resizeCanvas();
requestAnimationFrame(updateAndDraw);
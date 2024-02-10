import { Input } from './input.js';
import { Circle } from './circle.js';
import { Rectangle } from './rectangle.js';
import { Renderer } from './renderer.js';
import { Style } from './style.js';
import { Vec } from './vector.js';

let currentShapeType = 'circle'; // Dynamically change this to add more shapes
const LOWEST_DISTANCE_MOVING_OBJ = 30;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('shapeToggle').addEventListener('click', toggleShape);
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const renderer = new Renderer(canvas, ctx);
const input = new Input(canvas, window);
input.addListeners();
let initialMousePosForMove = null;

let objects = [];
let shapeBeingMade = null;
let movingShape = false;

function toggleShape() {
    currentShapeType = currentShapeType === 'circle' ? 'rectangle' : 'circle';
    document.getElementById('shapeToggle').innerText = currentShapeType.charAt(0).toUpperCase() + currentShapeType.slice(1);
}

function createShape(mousePosition) {
    const position = new Vec(mousePosition.x, mousePosition.y);
    const defaultStyle = new Style('cyan', 'grey', 3);

    switch (currentShapeType) {
        case 'circle':
            const circle = new Circle(position, 0, defaultStyle);
            circle.velocity = new Vec(0, 0); // Initialize velocity for the circle
            return circle;
        case 'rectangle':
            const rectangle = new Rectangle(position, 0, 0, defaultStyle);
            rectangle.firstClick = position;
            rectangle.velocity = new Vec(0, 0); // Initialize velocity for the rectangle
            return rectangle;
    }
}

function updateAndDraw() {
    if (input.inputs.lclick && !shapeBeingMade) {
        const startPos = input.inputs.mouse.position.clone();
        shapeBeingMade = createShape(startPos);
    } else if (input.inputs.lclick && shapeBeingMade) {
        if (input.inputs.mouse.position) {
            shapeBeingMade.resize(input.inputs.mouse.position);
        } else {
            console.error('Mouse position is undefined');
        }
    } else if (!input.inputs.lclick && shapeBeingMade) {
        objects.push(shapeBeingMade);
        shapeBeingMade = null;
    }

    if (input.inputs.rclick && !movingShape) {
        
        initialMousePosForMove = input.inputs.mouse.position.clone(); // Capture initial position for velocity calculation

        let closestObji = null;
        let currentLowestDist = LOWEST_DISTANCE_MOVING_OBJ;
        objects.forEach((obj, i) => {
            let isInsideShape = false;

            if (obj instanceof Circle) {
                const distance = obj.position.distance(input.inputs.mouse.position);
                isInsideShape = distance <= obj.radius;
            } else if (obj instanceof Rectangle) {
                const left = obj.position.x;
                const right = obj.position.x + obj.width;
                const top = obj.position.y;
                const bottom = obj.position.y + obj.height;
                const clickX = input.inputs.mouse.position.x;
                const clickY = input.inputs.mouse.position.y;

                // Correct use of logical AND (&&) for accurate hit detection
                isInsideShape = clickX >= left && clickX <= right && clickY >= top && clickY <= bottom;
            }


            if (isInsideShape && currentLowestDist > 0) { // Ensures we pick the first shape under cursor
                closestObji = i;
                currentLowestDist = 0; // Update based on your needs
            }
        });

        if (closestObji !== null) {
            movingShape = true;
            objects[closestObji].isMoved = true;
        }
    }

    if (!input.inputs.rclick && movingShape) {
        const finalMousePos = input.inputs.mouse.position.clone();
        movingShape = false;
            objects.forEach(obj => {
            if (obj.isMoved) {
                obj.isMoved = false;
                if (initialMousePosForMove) {
                    // Calculate velocity based on the difference between initial and final mouse positions
                    const velocityX = finalMousePos.x - initialMousePosForMove.x;
                    const velocityY = finalMousePos.y - initialMousePosForMove.y;
                    obj.velocity = new Vec(velocityX, velocityY).normalize().scale(5); // Normalize and scale velocity
                    initialMousePosForMove = null; // Reset initial position for next movement
                }
            }
        });
    }
    
        objects.forEach(obj => {
        if (!obj.isMoved) {
            obj.position.x += obj.velocity.x;
            obj.position.y += obj.velocity.y;
        }
    });

    for (let i = 0; i < objects.length; i++) {
        if (objects[i].isMoved) {
            const movedObj = objects[i];
            movedObj.position.copy(input.inputs.mouse.position); //updates the position of the moved obj
        }
    }

    renderer.clearFrame();
    objects.forEach(obj => obj.draw(ctx));
    if (shapeBeingMade) shapeBeingMade.draw(ctx);

    requestAnimationFrame(updateAndDraw);
}

input.resizeCanvas();
requestAnimationFrame(updateAndDraw);





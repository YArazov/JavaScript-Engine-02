import { Renderer } from './renderer.js';
import { Circle } from './circle.js';
import { Rectangle } from './rectangle.js';
import { Input } from './input.js';
import { RigidBody } from './rigidBody.js';
import { Collisions } from './collisions.js';
import { Vec } from './vector.js';
import { Style } from './style.js';

// Setup constants and utility functions
const SMALLEST_RADIUS = 10;
const LOWEST_DISTANCE_MOVING_OBJ = 30;
const dt = 1 / 60; // Time per frame, for consistent movement and physics calculations

// Main class that handles the entire canvas, input, rendering, and physics
class Main {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.renderer = new Renderer(this.canvas, this.ctx);
        this.input = new Input(this.canvas, window, dt);
        this.collisions = new Collisions();
        this.objects = []; // Stores all the rigid bodies
        this.shapeBeingMade = null; // The shape currently being created
        this.shapeSelected = 'rectangle'; // Default shape to create

        // Setup event listeners for UI and canvas
        this.setupUI();
        this.input.addListeners();
        this.animate();

        this.movingShape = false;
        this.initialMousePosForMove = null;
    }

    // Setup UI controls and event listeners
    setupUI() {
        const circleButton = document.getElementById("c");
        const rectangleButton = document.getElementById("r");

        // Toggle shape selection based on button clicks
        circleButton.addEventListener('click', () => this.shapeSelected = 'circle');
        rectangleButton.addEventListener('click', () => this.shapeSelected = 'rectangle');

        // Resize canvas to fit window and adjust on resize
        this.input.resizeCanvas();
        window.addEventListener('resize', () => this.input.resizeCanvas());
    }

    // The main animation loop
    animate() {
        requestAnimationFrame(() => this.animate());
        this.handleInput();
        this.updatePhysics();
        this.handleCollisions();
        this.renderer.clearFrame();
        this.objects.forEach(obj => obj.draw(this.ctx));
        if (this.shapeBeingMade) this.shapeBeingMade.draw(this.ctx);
    }

    // Handle user input for creating and moving shapes
    handleInput() {
        // Handle shape creation and resizing
        if (this.input.inputs.lclick && !this.shapeBeingMade) {
            const startPos = this.input.inputs.mouse.position.clone();
            this.shapeBeingMade = this.createShape(startPos);
        } else if (this.input.inputs.lclick && this.shapeBeingMade) {
            this.shapeBeingMade.resize(this.input.inputs.mouse.position);
        } else if (!this.input.inputs.lclick && this.shapeBeingMade) {
            this.objects.push(this.shapeBeingMade);
            this.shapeBeingMade = null;
        }

        // Handle shape selection and moving
        this.handleShapeMoving();
    }

    createShape(mousePosition) {
        const position = new Vec(mousePosition.x, mousePosition.y);
        const defaultStyle = new Style('cyan', 'grey', 3);
        let shape = null;

        switch (this.shapeSelected) {
            case 'circle':
                shape = new Circle(position, 0, defaultStyle);
                break;
            case 'rectangle':
                shape = new Rectangle(position, 0, 0, defaultStyle);
                break;
        }

        if (shape) {
            shape.velocity = new Vec(0, 0); // Initialize velocity for the shape
        }

        return shape;
    }

    handleShapeMoving() {
        if (this.input.inputs.rclick && !this.movingShape) {
            this.initialMousePosForMove = this.input.inputs.mouse.position.clone();
            this.selectAndMarkShapeForMoving();
        } else if (!this.input.inputs.rclick && this.movingShape) {
            this.finalizeShapeMovement();
        }
    }

    selectAndMarkShapeForMoving() {
        let closestObjIndex = null;
        let currentLowestDist = LOWEST_DISTANCE_MOVING_OBJ;

        this.objects.forEach((obj, i) => {
            const distance = obj.position.distance(this.input.inputs.mouse.position);
            const isInsideShape = obj instanceof Circle ? distance <= obj.radius :
                obj instanceof Rectangle ? this.isInsideRectangle(obj, this.input.inputs.mouse.position) :
                    false;

            if (isInsideShape && distance < currentLowestDist) {
                closestObjIndex = i;
                currentLowestDist = distance;
            }
        });

        if (closestObjIndex !== null) {
            this.movingShape = true;
            this.objects[closestObjIndex].isMoved = true;
        }
    }

    finalizeShapeMovement() {
        const finalMousePos = this.input.inputs.mouse.position.clone();
        this.movingShape = false;

        this.objects.forEach(obj => {
            if (obj.isMoved) {
                obj.isMoved = false;
                const velocity = finalMousePos.subtract(this.initialMousePosForMove).normalize().scale(5);
                obj.velocity = velocity;
                this.initialMousePosForMove = null;
            }
        });
    }

    isInsideRectangle(rect, point) {
        const left = rect.position.x, right = rect.position.x + rect.width;
        const top = rect.position.y, bottom = rect.position.y + rect.height;
        return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
    }

    // Other existing methods like updatePhysics, handleCollisions, etc.

        // Update physics for all objects
        updatePhysics() {
            this.objects.forEach(obj => {
                if (!obj.isMoved) {
                    obj.updateShape(dt);
                }
            });
        }
    
        // Handle collisions among objects
        handleCollisions() {
            this.collisions.clearCollisions();
            this.collisions.narrowPhaseDetection(this.objects);
            this.collisions.resolveCollisions();
        }
}

// Additional methods to create shapes, resize them, move them, etc., would go here
// These methods would integrate the logic from both snippets, focusing on user interactions,
// shape manipulation, and applying physics for movement and collisions.

// Instantiate the main class to kick everything off
new Main();

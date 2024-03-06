import { Vec } from './vector.js';

export class Input {
    constructor(canv, win, dt, onShapeRelease) {
        this.canv = canv; // Canvas element
        this.window = win; // Window object
        this.dt = dt; // Delta time for velocity calculation
        this.onShapeRelease = onShapeRelease; // Callback when a shape is released

        // Initializing input states with extended functionality
        this.inputs = {
            mouse: {
                position: new Vec(0, 0), // Current mouse position
                velocity: new Vec(0, 0), // Current mouse velocity
                movedObject: null // Placeholder for object being moved, if any
            },
            lclick: false, // Left click state
            rclick: false, // Right click state
            space: false, // Spacebar state
            touches: 0 // Number of touch points
        };

        // Binding this context to event handlers
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
    }

    // Method to add event listeners for various user actions
    addListeners() {
        this.canv.addEventListener("mousedown", this.mouseDown);
        this.canv.addEventListener("mouseup", this.mouseUp);
        this.canv.addEventListener('contextmenu', this.onContextMenu);
        this.canv.addEventListener('mousemove', this.mouseMove);
        this.window.addEventListener('resize', this.resizeCanvas, false);
    }

    // Handles mouse down events
    mouseDown(e) {
        if (e.button == 0) {
            this.inputs.lclick = true;
        } else if (e.button == 2) {
            this.inputs.rclick = true;
        }
    }

    // Handles mouse up events
    mouseUp(e) {
        if (e.button == 0) {
            this.inputs.lclick = false;
        } else if (e.button == 2) {
            this.inputs.rclick = false;
        }
        if (e.button == 0 && this.onShapeRelease) {
            this.onShapeRelease(this.inputs.mouse.velocity);
        }
    }

    // Prevents the default context menu from appearing on right-click
    onContextMenu(e) {
        e.preventDefault();
    }

    // Handles mouse movement, updating position and velocity
    mouseMove(e) {
        let newPosition = new Vec(e.pageX - this.canv.offsetLeft, e.pageY - this.canv.offsetTop);
        let newVelocity = newPosition.clone().subtract(this.inputs.mouse.position).divide(this.dt);
        this.inputs.mouse.velocity = newVelocity;
        this.inputs.mouse.position = newPosition;
    }
    
    // Adjusts canvas size on window resize
    resizeCanvas() {
        this.canv.width = this.window.innerWidth;
        this.canv.height = this.window.innerHeight;
    }
}
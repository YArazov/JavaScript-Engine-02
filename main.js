import { Circle } from './circle.js';
import { Input } from './input.js';
import { Rectangle } from './rectangle.js';
import { Renderer } from './renderer.js';
import { Vec } from './vector.js';

const SMALLEST_RADIUS = 10;

const canv = document.getElementById("canvas"); //find canvas elements on  webpage reference html doc, element name is one of the things in html, in this case canvas
const ctx = canv.getContext("2d");  //used for drawing shapes on canvas, ctx has all the methods for drawing
const fillColor = "darkGray";
const bordCol = "black";


const inp = new Input(canv, window);
inp.resizeCanvas();
inp.addListeners();


const renderer = new Renderer(canv, ctx);   //object from imported class Renderer
const objects = [];
let shapeBeingMade = null;

//MAIN LOOP
function updateAndDraw() {
    //make objects
    if (inp.inputs.lclick && shapeBeingMade == null) {  //make circle
        shapeBeingMade = new Circle(inp.inputs.mouse.position.clone(), SMALLEST_RADIUS, 0);
    }
    if (inp.inputs.lclick && shapeBeingMade) {  //resize circle
        const selectedRadius = shapeBeingMade.position.clone().subtract(inp.inputs.mouse.position).magnitude();
        shapeBeingMade.radius = selectedRadius < SMALLEST_RADIUS ? shapeBeingMade.radius : selectedRadius;
    }

    //add objects
    if (shapeBeingMade && !inp.inputs.lclick) { //store ready circle after releasing left click
        objects.push(shapeBeingMade);   //push means add object to array
        shapeBeingMade = null;
    }

    //draw objects
    renderer.clearFrame();  //first clear
    renderer.drawFrame(objects, fillColor, bordCol);
    //draw shape
    if (shapeBeingMade) {
        renderer.drawCircle(shapeBeingMade, bordCol, null);
    }
}
let renderInterval = setInterval(updateAndDraw, 1000 / 60);
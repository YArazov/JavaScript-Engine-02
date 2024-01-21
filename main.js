import { Renderer } from './renderer.js';
import { Rectangle } from './rectangle.js';

const canv = document.getElementById("canvas"); //find canvas elements on  webpage reference html doc, element name is one of the things in html, in this case canvas
const ctx = canv.getContext("2d");  //used for drawing shapes on canvas, ctx has all the methods for drawing

const renderer = new Renderer(canv, ctx);   //object from imported class Renderer

//Main Loop
function updateAndDraw() {
    //make objects
    const rectangle = new Rectangle({ x: 50, y: 60 }, 400, 200);
    //draw objects
    renderer.clearFrame();
    renderer.drawRectangle(rectangle, "red", "black");
}
let renderInterval = setInterval(updateAndDraw, 1000 / 60);
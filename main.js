import { Renderer } from './renderer.js';
import { Circle } from './circle.js';

const canv = document.getElementById("canvas"); //find canvas elements on  webpage reference html doc, element name is one of the things in html, in this case canvas
const ctx = canv.getContext("2d");  //used for drawing shapes on canvas, ctx has all the methods for drawing

const renderer = new Renderer(canv, ctx);   //object from imported class Renderer

//Main Loop
function updateAndDraw() {
    //make objects
    const circle = new Circle({x: 50, y: 60}, 10);
    //draw objects
    renderer.clearFrame();
    renderer.drawCircle(circle, "black");
}
let renderInterval = setInterval(updateAndDraw, 1000 / 60);
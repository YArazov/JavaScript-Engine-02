import { Circle } from './circle.js';
import { Rectangle } from './rectangle.js';
import { Renderer } from './renderer.js';


const canv = document.getElementById("canvas"); //find canvas elements on  webpage reference html doc, element name is one of the things in html, in this case canvas
const ctx = canv.getContext("2d");  //used for drawing shapes on canvas, ctx has all the methods for drawing

const renderer = new Renderer(canv, ctx);   //object from imported class Renderer

//Main Loop
function updateAndDraw() {
    //make objects
    const circle = new Circle({ x: 200, y: 400 }, 10);
    //draw objects

    //make objects
    const rectangle = new Rectangle({ x: 80, y: 60 }, 300, 150);
    //draw objects
    renderer.clearFrame();
    renderer.drawCircle(circle, "black");
    renderer.drawRectangle(rectangle, "red", "black");
}
let renderInterval = setInterval(updateAndDraw, 1000 / 60);
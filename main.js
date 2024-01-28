import { Circle } from './circle.js';
import { Rectangle } from './rectangle.js';
import { Renderer } from './renderer.js';


const canv = document.getElementById("canvas"); //find canvas elements on  webpage reference html doc, element name is one of the things in html, in this case canvas
const ctx = canv.getContext("2d");  //used for drawing shapes on canvas, ctx has all the methods for drawing

const renderer = new Renderer(canv, ctx);   //object from imported class Renderer
const objects = [];

//Main Loop
function updateAndDraw() {
    //make objects
    const circle = new Circle({x: 50, y: 60}, 10);
    //draw objects
    renderer.clearFrame();  //first clear
    renderer.drawCircle(circle, "black");
    renderer.drawRect({position: {x: 50, y: 60}, width: 50, height: 20});
}
let renderInterval = setInterval(updateAndDraw, 1000 / 60);
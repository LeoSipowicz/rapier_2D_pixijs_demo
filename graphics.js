//import * as PIXI from "pixi.js";
import Two from 'https://cdn.skypack.dev/two.js@latest';

export default function render(world,position){
    var params = {
        fullscreen: true
      };
    var elem = document.body;
    var two = new Two(params).appendTo(elem);
      
    function update() {
        var rect = two.makeRectangle(position.x*100+1000, position.y*1000, 50, 50);
        }
    
    var rect = two.makeRectangle(position.x*100+1000, position.y*1000, 50, 50);
    rect.fill = 'rgb(0, 200, 255)';
    rect.opacity = 0.75;
    rect.noStroke(); 
      
    // Don’t forget to tell two to draw everything to the screen
    two.update();
    return(position.x.toString()+" "+position.y.toString())
}
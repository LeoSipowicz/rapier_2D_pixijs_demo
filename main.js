//import * as PIXI from "pixi.js";
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier2d-compat';
import render from './graphics';
import Two from 'https://cdn.skypack.dev/two.js@latest';




export default function run_simulation() {
  let gravity = new RAPIER.Vector2(0.0, -9.81);
  let world = new RAPIER.World(gravity);

  // Create the ground
  let groundRigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
  let groundRigidBody = world.createRigidBody(groundRigidBodyDesc);
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1);
  world.createCollider(groundColliderDesc, groundRigidBody);

  // Create a dynamic rigid-body.
  // Use "static" for a static rigid-body instead.
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 1.5);
  let rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5)
    .setDensity(2.0); // The default density is 1.0.
  let collider = world.createCollider(colliderDesc, rigidBody);
  // Game loop. Replace by your own game loop system.
  // graphics

  var params = {
    fullscreen: true
  };
  var elem = document.body;
  var two = new Two(params).appendTo(elem);
  var rect = two.makeRectangle(100, 100, 100, 100);
  rect.fill = 'rgb(255, 0, 0)';
  var group = two.makeGroup(rect);
  var cx = 100;
  var cy = 100;
  group.position.set(cx, cy);

  two.bind('update', update);
  // Finally, start the animation loop
  two.play();

  function update(frameCount) {
    // This code is called every time two.update() is called.
    world.step()
    let position = rigidBody.translation();
    group.position.set(position.x*1000, position.y*1000);

    console.log("Rigid-body position: ", position.x, position.y);

  }

}

RAPIER.init().then(run_simulation);
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier2d-compat';

function run_simulation() {
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
    .setTranslation(0.0, 1.0);
  let rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5)
    .setDensity(2.0); // The default density is 1.0.
  let collider = world.createCollider(colliderDesc, rigidBody);

  // Game loop. Replace by your own game loop system.
  let gameLoop = () => {
    world.step();

    // Get and print the rigid-body's position.
    let position = rigidBody.translation();
    console.log("Rigid-body position: ", position.x, position.y);

    setTimeout(gameLoop, 16);
  };

  gameLoop();
}

RAPIER.init().then(run_simulation);

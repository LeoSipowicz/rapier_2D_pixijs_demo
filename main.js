import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier2d-compat';


export default function run_simulation() {
    let gravity = new RAPIER.Vector2(0.0, -5.81);
    let world = new RAPIER.World(gravity);

    //ground block
    let bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
        -50,
        -200
    );
    let body = world.createRigidBody(bodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.cuboid(70, 10);
    world.createCollider(colliderDesc, body);

    // Dynamic cubes.
    let num = 50;
    let numy = 2;
    let rad = 1.0;

    let shift = rad * 2.0 + rad;
    let centerx = shift * (num / 2);
    let centery = shift / 2.0;

    let i, j;

    for (j = 0; j < numy; ++j) {
        for (i = 0; i < num; ++i) {
            let x = i * shift - centerx;
            let y = j * shift + centery + 3.0;

            // Create dynamic cube.
            let bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
            let body = world.createRigidBody(bodyDesc);
            let colliderDesc = RAPIER.ColliderDesc.cuboid(rad, rad);
            world.createCollider(colliderDesc, body);
        }
    }


    //PIXI GRAPHICS
    const app = new PIXI.Application({
        width: 640,
        height: 440
    });
    document.body.appendChild(app.view);

    const container = new PIXI.Container();

    app.stage.addChild(container);

    var objects = new PIXI.Graphics();


    function addCollider(RAPIER, world, collider) {
        let type = "UNKNOWN"
        let rad = 0
        let sizeX = 0
        let sizeY = 0

        switch (collider.shapeType()) {
            case RAPIER.ShapeType.Cuboid:
                type = "CUBE"
                let hext = collider.halfExtents();
                sizeX = hext.x;
                sizeY = hext.y;
                break;
            case RAPIER.ShapeType.Ball:
                type = "BALL"
                rad = collider.radius();
                break;
            default:
                console.log("Unknown shape to render.");
                break;
        }
        let t = collider.translation();
        let r = collider.rotation();

        const shape = {};
        shape.type = type;
        shape.xLoc = t.x;
        shape.yLoc = t.y;
        shape.rotation = -r.angle;
        shape.rSize = rad;
        shape.xSize = sizeX;
        shape.ySize = sizeY;
        gfx.set(collider.handle, shape)
    }


    function render(world, gfx) {
        gfx.forEach((gfx) => {
            if (gfx.type == "BALL") {
                objects.beginFill(0x0000ff)
                objects.drawCircle(gfx.xLoc, gfx.yLoc, gfx.rSize)
            } else if (gfx.type == "CUBE") {
                objects.beginFill(0xff0000);
                objects.drawRect(gfx.xLoc + 100, -gfx.yLoc + 100, gfx.xSize, gfx.ySize);
            }
            container.addChild(objects);
        })
        renderer.render(objects);
        updatePositions(world, gfx);
    }

    function updatePositions(world) {
        world.forEachCollider((elt) => {
            let gfxHandle = gfx.get(elt.handle);
            let translation = elt.translation();
            let rotation = elt.rotation();
            if (!!gfxHandle) {
                gfxHandle.xLoc = translation.x;
                gfxHandle.yLoc = translation.y;
                gfxHandle.rotation = -rotation;
            }
        });
    }


    const renderer = new PIXI.Renderer();

    const gfx = new Map();

    world.forEachCollider(coll => {
        addCollider(RAPIER, world, coll);
    });


    render(world, gfx)

    function update() {
        updatePositions(world, gfx);

        world.step()

        app.render(app.stage);

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

RAPIER.init().then(run_simulation);
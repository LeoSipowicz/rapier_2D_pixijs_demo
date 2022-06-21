import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier2d-compat';


export default function run_simulation() {
    //Rapier world settings
    let gravity = new RAPIER.Vector2(0.0, -5.81);
    let world = new RAPIER.World(gravity);

    //Rapier ground block (static)
    let bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
        -50,
        -200
    );
    let body = world.createRigidBody(bodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.cuboid(70, 10);
    world.createCollider(colliderDesc, body);

    let num = 50;
    let numy = 2;
    let rad = 3.0;

    let shift = rad * 2.0 + rad;
    let centerx = shift * (num / 2);
    let centery = shift / 2.0;

    let i, j;

    //Rapier falling cubes (dynamic)
    for (j = 0; j < numy; ++j) {
        for (i = 0; i < num; ++i) {
            let x = i * shift - centerx;
            let y = j * shift + centery + 3.0;
            let bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
            let body = world.createRigidBody(bodyDesc);
            let colliderDesc = RAPIER.ColliderDesc.cuboid(rad, rad);
            world.createCollider(colliderDesc, body);
        }
    }


    //PixiJs graphics below
    const app = new PIXI.Application({
        width: 440,
        height: 440
    });
    document.body.appendChild(app.view);

    let graphic = new PIXI.Graphics();
    app.stage.addChild(graphic)

    const ColliderMap = new Map();

    //Loop through rapier coliders and create set key value pair for each in ColliderMap
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
        ColliderMap.set(collider.handle, shape)
    }

    //Render each object in ColliderMap in PixiJS graphics
    function render(world, ColliderMap) {
        ColliderMap.forEach((ColliderMap) => {
            if (ColliderMap.type == "BALL") {
                graphic.beginFill(0x0000ff);
                graphic.drawCircle(ColliderMap.xLoc, ColliderMap.yLoc, ColliderMap.rSize);
            } else if (ColliderMap.type == "CUBE") {
                graphic.beginFill(0xff0000);
                graphic.drawRect(ColliderMap.xLoc + 100, -ColliderMap.yLoc + 100, ColliderMap.xSize, ColliderMap.ySize);
            }
        })
    }

    //Update ColliderMap positions called each step
    function updatePositions(world) {
        world.forEachCollider((elt) => {
            let CMapHandle = ColliderMap.get(elt.handle);
            let translation = elt.translation();
            let rotation = elt.rotation();
            if (!!CMapHandle) {
                CMapHandle.xLoc = translation.x;
                CMapHandle.yLoc = translation.y;
                CMapHandle.rotation = -rotation;
            }
        });
    }

    //Game loop
    function update() {
        graphic.clear()
        render(world, ColliderMap)
        updatePositions(world, ColliderMap);
        world.step()
        requestAnimationFrame(update);
    }

    world.forEachCollider(coll => {
        addCollider(RAPIER, world, coll);
    });
    requestAnimationFrame(update);
}

RAPIER.init().then(run_simulation);
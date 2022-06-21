import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier2d-compat';


export default function run_simulation() {
    //Rapier world settings
    let gravity = new RAPIER.Vector2(0.0, -9.81*20);
    let world = new RAPIER.World(gravity);

    const sprites = [];

    //Rapier ground block (static)
    let bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
        0,
        -250
    );
    let body = world.createRigidBody(bodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.cuboid(70, 10);
    world.createCollider(colliderDesc, body);

    let num = 50;
    let numy = 2;
    let rad = 3.0;

    let shift = rad * 5.0 + rad;
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

            let rand = (Math.floor(Math.random() * 3));
            let img = null;
            switch(rand){
                case 0: {
                    img = 'commit.png';
                    break;
                }

                case 1: {
                    img = 'pr.png';
                    break;
                }

                default: {
                    img = 'slack.png';
                    break;
                }
            }
            console.log(img);
            let curr = PIXI.Sprite.from(img);
            curr.anchor.x = 0;
            curr.anchor.y = 0;
            sprites.push(curr);
        }
    }

    console.log(sprites);


    //PixiJs graphics below
    const app = new PIXI.Application({
        width: 1024,
        height: 768
    });
    document.body.appendChild(app.view);

    let graphic = new PIXI.Graphics();
    app.stage.addChild(graphic);

    sprites.forEach((el) => {
        app.stage.addChild(el)
    });

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
        let cntr = 0;
        ColliderMap.forEach((el) => {
            if (el.type == "BALL") {
                graphic.beginFill(0x0000ff);
                graphic.drawCircle(el.xLoc, el.yLoc, el.rSize);
            } else if (el.type == "CUBE") {
                // need shape to be changed over to a sphere
                // so that the icons can also be rotated!
                // also collisions are still an issue
                graphic.beginFill(0xff0000);
                let curr = sprites[cntr];
                console.log(curr, cntr);
                cntr = (cntr+1)%100;
                curr.position.x = el.xLoc + 100;
                curr.position.y = -el.yLoc + 100;
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
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier2d-compat';


export default function run_simulation() {
    let app = new PIXI.Application({ width: 640, height: 360 });
    document.body.appendChild(app.view);
    
    let gravity = new RAPIER.Vector2(0.0, -9.81);
    let world = new RAPIER.World(gravity);
/**
    // Create Ground.
    let groundSize = 40.0;
    let grounds = [
        {x: 0.0, y: 0.0, hx: groundSize, hy: 0.1},
        {x: -groundSize, y: groundSize, hx: 0.1, hy: groundSize},
        {x: groundSize, y: groundSize, hx: 0.1, hy: groundSize},
    ];
    
    grounds.forEach((ground) => {
        let bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
            ground.x,
            ground.y,
        );
        let body = world.createRigidBody(bodyDesc);
        let colliderDesc = RAPIER.ColliderDesc.cuboid(ground.hx, ground.hy);
        world.createCollider(colliderDesc, body);
    });
     */
    // Dynamic cubes.
    let num = 20;
    let numy = 50;
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

    function addCollider(RAPIER, world, collider) {
        let instanceCount = 0;
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
                instanceCount += 1;
                break;
            case RAPIER.ShapeType.Ball:
                type = "BALL"
                rad = collider.radius();
                instanceCount += 1;
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
        shape.yLoc = -t.y;
        shape.rotation = -r.angle;
        shape.rSize = rad;
        shape.xSize = sizeX;
        shape.ySize = sizeY;

        gfx.set(collider.handle,shape)
    }
    

    function initShapes(world,gfx){
        const container = new PIXI.Container();
        app.stage.addChild(container);
        var objects = new PIXI.Graphics();
        //bjects.clear();

        gfx.forEach((gfx)=>{
            if (gfx.type == "BALL"){
                objects.beginFill(0x0000ff)
                shape.drawCircle(gfx.xLoc,gfx.yLoc,gfx.rSize)
            }
            else if (gfx.type == "CUBE"){
                //console.log(gfx.sizeY)
                objects.beginFill(0xff0000);
                //objects.drawRect(100,100,5,5);
                objects.drawRect(gfx.xLoc,-gfx.yLoc,1,1);
            }
            container.addChild(objects);
        })

        app.stage.addChild(objects);
        renderer.render(container);
    }


    const renderer = new PIXI.Renderer();

    const gfx = new Map();

    world.forEachCollider(coll => {
        addCollider(RAPIER, world, coll);
    });

    initShapes(world,gfx);

    let gameLoop = () => {
        console.log("in gameloop")
        // Ste the simulation forward.  
        world.step();
    
        setTimeout(gameLoop, 16);
    };
    console.log(world);
    gameLoop();
    
    
}

RAPIER.init().then(run_simulation);
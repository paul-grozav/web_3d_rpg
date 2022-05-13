// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
import * as BABYLON from "babylonjs";
import * as Cannon from "cannon";
// -------------------------------------------------------------------------- //
export namespace web_3d_rpg {
export class Environment {
// -------------------------------------------------------------------------- //
  // private _scene: Scene;
  // enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 };
// -------------------------------------------------------------------------- //
  constructor() {
    console.log("Environment::constructor(): Constructed");
  }
// -------------------------------------------------------------------------- //
  public run(): void {
    let canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    document.body.appendChild(canvas);

    let engine: BABYLON.Engine = new BABYLON.Engine(canvas, true);

    // This creates a basic Babylon Scene object (non-mesh)
    const scene: BABYLON.Scene = new BABYLON.Scene(engine);

    // enable debugger / inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });
    //resize if the screen is resized/rotated
    window.addEventListener('resize', () => {
      engine.resize();
    });
    // Enable physics
    scene.enablePhysics(new BABYLON.Vector3(0,-10,0),
      new BABYLON.CannonJSPlugin(true, 10, Cannon));

    // This creates and positions a free camera (non-mesh)
    // const camera: BABYLON.FreeCamera = new BABYLON.FreeCamera("camera1",
    //   new BABYLON.Vector3(0, 5, -10), scene);
    const camera: BABYLON.ArcRotateCamera =
      new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10,
      new BABYLON.Vector3(0, 0, 0));

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light: BABYLON.HemisphericLight = new BABYLON.HemisphericLight(
      "light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'ground' shape.
    const ground: BABYLON.Mesh = BABYLON.MeshBuilder.CreateGround("ground",
      {width: 6, height: 6}, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground,
      BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5,
      restitution: 0.7 }, scene);

    const ground_material: BABYLON.StandardMaterial =
      new BABYLON.StandardMaterial("ground_material", scene);
    ground_material.diffuseColor = BABYLON.Color3.Green();
    ground.material = ground_material;

    // this.add_sphere(scene);

    // this.add_gui_button();
    // this.add_sound(scene);
    // const house: BABYLON.Mesh = this.create_house(scene);

    // const cloned_house = house.clone("cloned_house");
    // cloned_house.position.x += 2;
    // const cloned_house_material = new BABYLON.StandardMaterial("roof_material",
    //   scene);
    // cloned_house_material.diffuseColor = BABYLON.Color3.Blue(); 
    // cloned_house.material = cloned_house_material;

    // const instance_house = house.createInstance("instance_house")
    // instance_house.position.x -= 2;

    // // Convert to physics object and position
    // var makePhysicsObject = (mesh:BABYLON.InstancedMesh, scene:Scene, scaling:float)=>{
    //     // Create physics root and position it to be the center of mass for the imported mesh
    //     var physicsRoot = new BABYLON.Mesh("physicsRoot", scene);
    //     physicsRoot.position.y -= 0.9;
    
    //     // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
    //     physicsRoot.addChild(mesh);
    
    //     // Add all root nodes within the loaded gltf to the physics root
    
    //     // Make every collider into a physics impostor
    //     physicsRoot.getChildMeshes().forEach((m)=>{
    //         // if(m.name.indexOf("box") != -1){
    //             m.scaling.x = Math.abs(m.scaling.x);
    //             m.scaling.y = Math.abs(m.scaling.y);
    //             m.scaling.z = Math.abs(m.scaling.z);
    //             m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1 }, scene);
    //         // }
    //     });
        
    //     // Scale the root object and turn it into a physics impsotor
    //     physicsRoot.scaling.scaleInPlace(scaling);
    //     physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.NoImpostor, { mass: 3 }, scene);
        
    //     return physicsRoot;
    // }
    // var physicsRoot = makePhysicsObject(house.createInstance("cloned_house_physics"), scene, 0.2);
    // physicsRoot.position.y += 3;
    // physicsRoot.position.z -= 1;
    // physicsRoot.position.x += 1;
    
    engine.runRenderLoop(function() {
      // stats_mb.begin();
      scene.render();
      // stats_mb.end();
    });
  }
// -------------------------------------------------------------------------- //
} // end class
} // end namespace
// -------------------------------------------------------------------------- //

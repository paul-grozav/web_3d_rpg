// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
// import { Engine, Scene } from "babylonjs";
import * as BABYLON from "babylonjs";
import * as BABYLON_GUI from "babylonjs-gui";
import { float, Mesh, Scene } from "babylonjs/index";
import * as Cannon from "cannon";
// -------------------------------------------------------------------------- //
export class Playground
{
// -------------------------------------------------------------------------- //
  public static create_scene(engine: BABYLON.Engine,
    canvas: HTMLCanvasElement): BABYLON.Scene
  {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene: BABYLON.Scene = new BABYLON.Scene(engine);

    console.log(Cannon);
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
    const house: BABYLON.Mesh = this.create_house(scene);

    const cloned_house = house.clone("cloned_house");
    cloned_house.position.x += 2;
    const cloned_house_material = new BABYLON.StandardMaterial("roof_material",
      scene);
    cloned_house_material.diffuseColor = BABYLON.Color3.Blue(); 
    cloned_house.material = cloned_house_material;

    const instance_house = house.createInstance("instance_house")
    instance_house.position.x -= 2;

    // Convert to physics object and position
    var makePhysicsObject = (mesh:BABYLON.InstancedMesh, scene:Scene, scaling:float)=>{
        // Create physics root and position it to be the center of mass for the imported mesh
        var physicsRoot = new BABYLON.Mesh("physicsRoot", scene);
        physicsRoot.position.y -= 0.9;
    
        // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
        physicsRoot.addChild(mesh);
    
        // Add all root nodes within the loaded gltf to the physics root
    
        // Make every collider into a physics impostor
        physicsRoot.getChildMeshes().forEach((m)=>{
            // if(m.name.indexOf("box") != -1){
                m.scaling.x = Math.abs(m.scaling.x);
                m.scaling.y = Math.abs(m.scaling.y);
                m.scaling.z = Math.abs(m.scaling.z);
                m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1 }, scene);
            // }
        });
        
        // Scale the root object and turn it into a physics impsotor
        physicsRoot.scaling.scaleInPlace(scaling);
        physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.NoImpostor, { mass: 3 }, scene);
        
        return physicsRoot;
    }
    var physicsRoot = makePhysicsObject(house.createInstance("cloned_house_physics"), scene, 0.2);
    physicsRoot.position.y += 3;
    physicsRoot.position.z -= 1;
    physicsRoot.position.x += 1;
    
    return scene;
  }
// -------------------------------------------------------------------------- //
  private static add_gui_button()
  {
    const advancedTexture: BABYLON_GUI.AdvancedDynamicTexture =
      BABYLON_GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const button1: BABYLON_GUI.Button = BABYLON_GUI.Button.CreateSimpleButton(
      "but1", "Click Me");
    button1.width = "150px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {
      alert("you did it!");
    });
    advancedTexture.addControl(button1);
  }
// -------------------------------------------------------------------------- //
  private static add_sound(scene: BABYLON.Scene)
  {
    const sound_url: string =
      "https://playground.babylonjs.com/sounds/bounce.wav";
    const sound = new BABYLON.Sound("background_sound", sound_url, scene, null,
      { loop: true, autoplay: true });
  }
// -------------------------------------------------------------------------- //
  private static add_sphere(scene: BABYLON.Scene)
  {
    // Our built-in 'sphere' shape.
    const sphere: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere",
      {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;
  }
// -------------------------------------------------------------------------- //
  private static create_house(scene: BABYLON.Scene): BABYLON.Mesh
  {
    //     ^ Y
    //     |
    //     |
    //     +-------> X
    //    /
    //   /
    //  v Z
    //
    // unit cube
    const house_box = BABYLON.MeshBuilder.CreateBox("house_box", {});
    house_box.scaling.x = 1;
    house_box.scaling.y = 1;
    house_box.scaling.z = 1;
    house_box.position.x = 0;
    house_box.position.y = 0.5;
    house_box.position.z = 0;
    // house_box.rotation.y = Math.PI / 4;
    // house_box.rotation.y = BABYLON.Tools.ToRadians(45);

    const house_box_material: BABYLON.StandardMaterial =
      new BABYLON.StandardMaterial("house_box_material", scene);
    house_box_material.diffuseColor = BABYLON.Color3.Gray();
    house_box.material = house_box_material;

    const roof: BABYLON.Mesh = BABYLON.MeshBuilder.CreateCylinder("roof",
      {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;

    const roof_material: BABYLON.StandardMaterial =
      new BABYLON.StandardMaterial("roof_material", scene);
    roof_material.diffuseColor = BABYLON.Color3.Red();
    roof.material = roof_material;

    // I'm using the "!" operator, which is called the
    // "Non-null assertion operator" because i'm sure this is not
    // null
    const house: BABYLON.Mesh = BABYLON.Mesh.MergeMeshes([house_box, roof],
      true, false, undefined, false, true)!;
    return house;
  }
// -------------------------------------------------------------------------- //
}
// -------------------------------------------------------------------------- //
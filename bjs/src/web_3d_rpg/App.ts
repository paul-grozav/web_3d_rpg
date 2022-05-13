// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
import {Engine, Scene, Vector3, CannonJSPlugin} from "babylonjs";
// import * as BABYLON_GUI from "babylonjs-gui";
import * as Cannon from "cannon";
import {Environment} from "./Environment"
import {player} from "./player"
// -------------------------------------------------------------------------- //
export class App {
// -------------------------------------------------------------------------- //
  private canvas:HTMLCanvasElement;
  private engine:Engine;
  private scene:Scene;
  // enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 };
// -------------------------------------------------------------------------- //
  constructor() {
    console.log("App::constructor(): Constructing ...");
    this.canvas = document.createElement("canvas");

    // This creates the rendering engine, which will render it's output on the
    // canvas
    this.engine = new Engine(this.canvas, true);

    // This creates a basic Babylon Scene object (non-mesh)
    this.scene = new Scene(this.engine);
    console.log("App::constructor(): Constructed.");
  }
// -------------------------------------------------------------------------- //
  public run(): void {
    this.setup_document_event_listeners();
    this.setup_canvas();

    // Enable physics
    this.scene.enablePhysics(new Vector3(0,-10,0),
      new CannonJSPlugin(true, 10, Cannon));

    let environment:Environment = new Environment(this.scene);
    environment.create();

    let p:player = new player(this.scene);
    p.create();

    // this.add_sphere(scene);

    // this.add_gui_button();
    // this.add_sound(scene);
    // const house: Mesh = this.create_house(scene);

    // const cloned_house = house.clone("cloned_house");
    // cloned_house.position.x += 2;
    // const cloned_house_material = new StandardMaterial("roof_material",
    //   scene);
    // cloned_house_material.diffuseColor = Color3.Blue(); 
    // cloned_house.material = cloned_house_material;

    // const instance_house = house.createInstance("instance_house")
    // instance_house.position.x -= 2;

    // // Convert to physics object and position
    // var makePhysicsObject = (mesh:InstancedMesh, scene:Scene, scaling:float)=>{
    //     // Create physics root and position it to be the center of mass for the imported mesh
    //     var physicsRoot = new Mesh("physicsRoot", scene);
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
    //             m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 0.1 }, scene);
    //         // }
    //     });
        
    //     // Scale the root object and turn it into a physics impsotor
    //     physicsRoot.scaling.scaleInPlace(scaling);
    //     physicsRoot.physicsImpostor = new PhysicsImpostor(physicsRoot, PhysicsImpostor.NoImpostor, { mass: 3 }, scene);
        
    //     return physicsRoot;
    // }
    // var physicsRoot = makePhysicsObject(house.createInstance("cloned_house_physics"), scene, 0.2);
    // physicsRoot.position.y += 3;
    // physicsRoot.position.z -= 1;
    // physicsRoot.position.x += 1;
    
    this.engine.runRenderLoop(() => {
      // stats_mb.begin();
      this.scene.render();
      // stats_mb.end();
    });
    this.async();
    // this.add_sound();
    // this.add_sphere();
  }
// -------------------------------------------------------------------------- //
  private setup_canvas(): void {
    console.log("App::create_canvas(): Setting up the document/body ...");
    document.documentElement.style["overflow"] = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";
    document.documentElement.style.margin = "0px";
    document.documentElement.style.padding = "0px";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0px";
    document.body.style.padding = "0px";

    console.log("App::create_canvas(): Setting up the canvas ...");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    document.body.appendChild(this.canvas);
    this.canvas.focus(); // focus it when added to the screen.
    // resize the engine, to update the resolution once the canvas was sized.
    this.engine.resize();

    // stop context menu showing on canvas right click
    this.canvas.addEventListener("contextmenu", (e) => { e.preventDefault();});

    console.log("App::create_canvas(): Done setting up the canvas.");
  }
// -------------------------------------------------------------------------- //
  private setup_document_event_listeners(): void {
    console.log("App::setup_document_event_listeners(): Setting up the document"
      + " event listeners ...");

    // enable debugger / inspector
    window.addEventListener("keydown", (ev) => {
      // Shift + Ctrl + Alt + I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (this.scene.debugLayer.isVisible()) {
          this.scene.debugLayer.hide();
        } else {
          this.scene.debugLayer.show();
        }
      }
    });

    //resize if the screen is resized/rotated
    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    console.log("App::setup_document_event_listeners(): Done setting up the document event"
      + " listeners.");
  }
// -------------------------------------------------------------------------- //
  private async async(): Promise<void> {
    console.log("App::async(): Running async code.");
  }
// -------------------------------------------------------------------------- //
  // private static add_gui_button()
  // {
  //   const advancedTexture: BABYLON_GUI.AdvancedDynamicTexture =
  //     BABYLON_GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  //   const button1: BABYLON_GUI.Button = BABYLON_GUI.Button.CreateSimpleButton(
  //     "but1", "Click Me");
  //   button1.width = "150px"
  //   button1.height = "40px";
  //   button1.color = "white";
  //   button1.cornerRadius = 20;
  //   button1.background = "green";
  //   button1.onPointerUpObservable.add(function() {
  //     alert("you did it!");
  //   });
  //   advancedTexture.addControl(button1);
  // }
// -------------------------------------------------------------------------- //
  // private add_sound(): void {
  //   const sound_url:string =
  //     "https://playground.babylonjs.com/sounds/bounce.wav";
  //   const sound:Sound = new Sound("background_sound", sound_url, this.scene,
  //     null, { loop: true, autoplay: true });
  // }
// -------------------------------------------------------------------------- //
  // private add_sphere(): void {
  //   // Our built-in 'sphere' shape.
  //   const sphere:Mesh = MeshBuilder.CreateSphere("sphere",
  //     {diameter: 2, segments: 32}, this.scene);

  //   // Move the sphere upward 1/2 its height
  //   sphere.position.y = 1;
  // }
// -------------------------------------------------------------------------- //
  // private static create_house(scene: Scene): Mesh
  // {
  //   //     ^ Y
  //   //     |
  //   //     |
  //   //     +-------> X
  //   //    /
  //   //   /
  //   //  v Z
  //   //
  //   // unit cube
  //   const house_box = MeshBuilder.CreateBox("house_box", {});
  //   house_box.scaling.x = 1;
  //   house_box.scaling.y = 1;
  //   house_box.scaling.z = 1;
  //   house_box.position.x = 0;
  //   house_box.position.y = 0.5;
  //   house_box.position.z = 0;
  //   // house_box.rotation.y = Math.PI / 4;
  //   // house_box.rotation.y = Tools.ToRadians(45);

  //   const house_box_material: StandardMaterial =
  //     new StandardMaterial("house_box_material", scene);
  //   house_box_material.diffuseColor = Color3.Gray();
  //   house_box.material = house_box_material;

  //   const roof: Mesh = MeshBuilder.CreateCylinder("roof",
  //     {diameter: 1.3, height: 1.2, tessellation: 3});
  //   roof.scaling.x = 0.75;
  //   roof.rotation.z = Math.PI / 2;
  //   roof.position.y = 1.22;

  //   const roof_material: StandardMaterial =
  //     new StandardMaterial("roof_material", scene);
  //   roof_material.diffuseColor = Color3.Red();
  //   roof.material = roof_material;

  //   // I'm using the "!" operator, which is called the
  //   // "Non-null assertion operator" because i'm sure this is not
  //   // null
  //   const house: Mesh = Mesh.MergeMeshes([house_box, roof],
  //     true, false, undefined, false, true)!;
  //   return house;
  // }
// -------------------------------------------------------------------------- //
} // end class
// -------------------------------------------------------------------------- //

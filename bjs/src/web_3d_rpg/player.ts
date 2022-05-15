// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
//     ^ Y
//     |
//     |
//     +-------> X
//    /
//   /
//  v Z
// -------------------------------------------------------------------------- //
import {Scene, Vector3, MeshBuilder, FreeCamera, ArcRotateCamera,
  UniversalCamera,float, StandardMaterial,
  PhysicsImpostor,
  Mesh,
  InstancedMesh,
  SceneLoader,
  Axis,
  Tools,
  Space, Color3}
  from "babylonjs";
import {input_controller} from "./input_controller"
// -------------------------------------------------------------------------- //
export class player {
// -------------------------------------------------------------------------- //
  private scene:Scene;
// -------------------------------------------------------------------------- //
  constructor(scene:Scene) {
    console.log("player::constructor(): Constructing...");
    this.scene = scene;
    console.log("player::constructor(): Constructed.");
  }
// -------------------------------------------------------------------------- //
  public create(): void {
    console.log("player::create(): Creating camera ...");
    // This creates and positions a free camera (non-mesh)

    // const camera: UniversalCamera = new UniversalCamera("player_camera",
    //   new Vector3(0, 2, -6), this.scene);

    // const camera: FreeCamera = new FreeCamera("camera1",
    //   new Vector3(0, 5, -10), this.scene);

    // const camera: ArcRotateCamera =
    //   new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10,
    //   new Vector3(0, 0, 0));

    const camera = new ArcRotateCamera("camera", 1/2 * Math.PI, Math.PI*3/10, 10, new Vector3(0, 0, 0));
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.position.z = 0;

    // This targets the camera to scene origin
    // camera.setTarget(Vector3.Zero());
    // This attaches the camera to the canvas
    // camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);

    console.log("player::create(): Creating player ...");
    // Our built-in 'sphere' shape.
    const sphere:Mesh = MeshBuilder.CreateSphere("sphere",
      {diameter: 2, segments: 32}, this.scene);
    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    //collision mesh
    // const wire_mat = new StandardMaterial("wire_material");
    // wire_mat.wireframe = true;
    const collision_box = MeshBuilder.CreateBox("collision_box", { width: 2,
      depth: 2, height: 2 }, this.scene);
    // collision_box.checkCollisions = true;
    // collision_box.material = wire_mat;
    // collision_box.position.y = 10;
    // const physics_root = this.make_physics_object(collision_box, this.scene,
    //   0.2);

    console.log("player::create(): Creating input controller.");
    let ic:input_controller = new input_controller(this.scene);
    ic.create();

    const player_mat = new StandardMaterial("player_material");
    player_mat.diffuseColor = Color3.Red();
    const player = MeshBuilder.CreateBox("player", { width: 2,
      depth: 2, height: 2 }, this.scene);
    player.position.x = 3;
    player.material = player_mat;
    camera.parent = player;
    this.scene.registerBeforeRender(() => {
      const step:number = 0.030;
      player.movePOV(0, 0, ic.vertical*step);
      player.rotation.y += ic.horizontal*0.01;
      camera.rotation.y += ic.horizontal*0.01;
    });

    // this.scene.registerBeforeRender(() => {
    //   physics_root.moveWithCollisions(new Vector3(ic.horizontal, 0,
    //     ic.vertical));
    //   // Set camera behind player and a bit above
    //   // camera.position = physics_root.position.clone();
    //   // camera.position.z -= 6;
    //   // camera.position.y += 3;
    // });




















    // SceneLoader.ImportMeshAsync("him", "https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/Dude/", "dude.babylon", this.scene).then((result) => {
    //   var dude = result.meshes[0];
    //   dude.scaling = new Vector3(0.008, 0.008, 0.008);
          
    //   dude.position = new Vector3(-6, 0, 0);
    //   dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
    //   const startRotation = dude.rotationQuaternion!.clone();    

    //   camera.parent = dude;
    //   this.scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

    //   let distance = 10;
    //   let step = 0.015;
    //   let p = 0;

    //   interface walk{
    //     turn:number,
    //     dist:number
    //   };
    //   function walk(turn:number, dist:number): walk {
    //     return {
    //       turn: turn,
    //       dist: dist
    //     };
    //   };
    //   const track:walk[] = [];
    //   track.push(walk(86, 7));
    //   track.push(walk(-85, 14.8));
    //   track.push(walk(-93, 16.5));
    //   track.push(walk(48, 25.5));
    //   track.push(walk(-112, 30.5));
    //   track.push(walk(-72, 33.2));
    //   track.push(walk(42, 37.5));
    //   track.push(walk(-98, 45.2));
    //   track.push(walk(0, 47))
    //   this.scene.onBeforeRenderObservable.add(() => {
    //     dude.movePOV(ic.horizontal*step, 0, ic.vertical*step);
    //     camera.position.z = 0;
    //     camera.beta = 1.5;
    //     // distance += step;
    //     // if (distance > track[p].dist) {
    //     //   dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
    //     //   p +=1;
    //     //   p %= track.length; 
    //     //   if (p === 0) {
    //     //     distance = 0;
    //     //     dude.position = new Vector3(-6, 0, 0);
    //     //     dude.rotationQuaternion = startRotation.clone();
    //     //   }
    //     // }
    //   })
    // });

    console.log("player::create(): Created.");
  }
// -------------------------------------------------------------------------- //
  private make_physics_object(mesh:Mesh, scene:Scene, scaling:float): Mesh {
    // Create physics root and position it to be the center of mass for the
    // imported mesh
    var physics_root = new Mesh("physicsRoot", scene);
    physics_root.position.y -= 0.9;

    // For all children labeled box (representing colliders), make them
    // invisible and add them as a child of the root object
    physics_root.addChild(mesh);

    // Make every collider into a physics impostor
    physics_root.getChildMeshes().forEach((m)=>{
      m.scaling.x = Math.abs(m.scaling.x);
      m.scaling.y = Math.abs(m.scaling.y);
      m.scaling.z = Math.abs(m.scaling.z);
      m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor,
        { mass: 0.1 }, scene);
    });
    
    // Scale the root object and turn it into a physics impsotor
    physics_root.scaling.scaleInPlace(scaling);
    physics_root.physicsImpostor = new PhysicsImpostor(physics_root,
      PhysicsImpostor.NoImpostor, { mass: 3 }, scene);
    
    return physics_root;
  }
// -------------------------------------------------------------------------- //
} // end class
// -------------------------------------------------------------------------- //

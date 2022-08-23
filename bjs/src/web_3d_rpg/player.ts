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
  Space, Color3, Scalar, AbstractMesh, TransformNode}
  from "babylonjs";
import {input_controller} from "./input_controller"
import {ui} from "./ui"
// -------------------------------------------------------------------------- //
export class player {
// -------------------------------------------------------------------------- //
  private scene:Scene;
  private game_ui:ui;
// -------------------------------------------------------------------------- //
  constructor(scene:Scene, game_ui:ui) {
    console.log("player::constructor(): Constructing...");
    this.scene = scene;
    this.game_ui = game_ui;
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
    // maximum zoom-in - the minimum distance from the camera to the object
    camera.lowerRadiusLimit = 5;
    // maximum zoom-out - the maximum distance from the camera to the object
    camera.upperRadiusLimit = 100;
    // by default look from radius 20
    camera.radius = 20;

    // How far away the camera can see
    camera.collisionRadius = new Vector3(10, 10, 10);
    camera.position.z = 0;

    // This targets the camera to scene origin
    // camera.setTarget(Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
    // Allow moving by mouse, and zooming, but disable keyboard camera rotation.
    // we'll use keyboard for character movement.
    camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");

    // console.log("player::create(): Creating some tmp object around the player"
    //   + " ...");
    // // Our built-in player'sphere' shape.
    // const sphere:Mesh = MeshBuilder.CreateSphere("sphere",
    //   {diameter: 2, segments: 32}, this.scene);
    // // Move the sphere upward 1/2 its height
    // sphere.position.y = 1;
    // sphere.position.x = 7;
    // sphere.checkCollisions = true;

    //collision mesh
    // const wire_mat = new StandardMaterial("wire_material");
    // wire_mat.wireframe = true;
    // const collision_box = MeshBuilder.CreateBox("collision_box", { width: 2,
    //   depth: 2, height: 1 }, this.scene);
    // collision_box.checkCollisions = true;
    // // collision_box.material = wire_mat;
    // collision_box.position.z = -5;
    // collision_box.position.y = 0.5;
    // const physics_root = this.make_physics_object(collision_box, this.scene,
    //   0.2);

    console.log("player::create(): Creating input controller.");
    let ic:input_controller = new input_controller(this.scene, this.game_ui);
    ic.create();

    console.log("player::create(): Creating player ...");
    let player:Mesh;
    SceneLoader.Append("", "human_body.glb", this.scene, function (scene) {
      player = (scene.getMeshByName("Human")!.parent! as Mesh);
      player.name = "player";
      player.scaling.z = 1;
      player.rotationQuaternion = null;
      scene.getMeshByName("Human")!.rotation.y=0;
      player.checkCollisions = true;
      camera.parent = player;

      let jump_force = 0;
      scene.registerBeforeRender(() => {
        // the amount of time in between frames (ms), so we divide by 1000 to get seconds
        // let delta_time = scene.getEngine().getDeltaTime() / 1000.0;
        // console.log("delta_time=" + delta_time);
        const position_step:number = 0.3;
        const rotation_step:number = 0.015;
        // Gravity direction points to -Y axis (thus, -1 *)
        const gravity_force:number = -1 * 9.80665/5;
        // player.movePOV(0, 0, ic.vertical*position_step); // moves without collision
        player.rotation.y += ic.horizontal*rotation_step;
        const move_x:number = -1 * Math.cos(player.rotation.y) * ic.vertical*position_step;
        const move_z:number = -1 * Math.sin(player.rotation.y) * ic.vertical*position_step;
        if(ic.is_jump_pressed && Math.round(player.position.y) == 1) {
          jump_force = -1 * gravity_force + 0.2;
        }
        jump_force -= 0.01;
        if(jump_force < 0){
          jump_force = 0;
        }
        let move_y:number = gravity_force + jump_force;
        // console.log("move_y=" + move_y);
        // console.log("player.position.y=" + player.position.y);
        // console.log("jump_force=" + jump_force);
        let move_vec:Vector3 = new Vector3(move_z, move_y, move_x);
        player.moveWithCollisions(move_vec);
        // player.position.x += move_x;
        // player.position.y += move_y;
        // player.position.z += move_z;
        if(player.position.y < 1){
          player.position.y = 1;
        }
      });
    });




















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

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
  Space, Color3, Scalar, AbstractMesh, TransformNode, Ray, Quaternion}
  from "babylonjs";
import {input_controller} from "./input_controller"
import {ui} from "./ui"
// -------------------------------------------------------------------------- //
export class player {
// -------------------------------------------------------------------------- //
  private scene:Scene;
  private game_ui:ui;
  private mesh:Mesh ;
  //player movement vars
  private _deltaTime: number = 0;
  private _h: number = 0;
  private _v: number = 0;

  private _moveDirection: Vector3 = new Vector3();
  private _inputAmt: number = 0;
  private static readonly PLAYER_SPEED: number = 0.45;
  private static readonly JUMP_FORCE: number = 0.80;
  private static readonly GRAVITY: number = -2.8;
  private _gravity: Vector3 = new Vector3();
  private _grounded: boolean = false;
  private _lastGroundPos: Vector3 = Vector3.Zero(); // keep track of the last grounded position
  private _jumpCount: number = 1;
  private _jumped: boolean = false;
  private _isFalling: boolean = false;
  private _canDash: boolean = true;
  public dashTime: number = 0;
  private _dashPressed: boolean = false;
// -------------------------------------------------------------------------- //
  constructor(scene:Scene, game_ui:ui) {
    console.log("player::constructor(): Constructing...");
    this.scene = scene;
    this.game_ui = game_ui;
    this.mesh = MeshBuilder.CreateSphere("player_character_default_mesh",
      {diameter: 2, segments: 32}, this.scene);
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

    const camera:ArcRotateCamera = new ArcRotateCamera("camera", 1/2 * Math.PI, Math.PI*3/10, 10, new Vector3(0, 0, 0));
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
    SceneLoader.Append("", "human_body.glb", this.scene, ()=>{
      this.mesh.dispose();
      this.mesh = (this.scene.getMeshByName("Human")!.parent! as Mesh);
      this.mesh.name = "player";
      this.mesh.scaling.z = 1;
      this.mesh.position.y = 0.1;
      // this.mesh.position.x = 145;
      // this.mesh.position.z = 145;
      this.mesh.rotationQuaternion = null;
      this.scene.getMeshByName("Human")!.rotation.y=0;
      this.mesh.checkCollisions = true;
      this.scene.getCameraById("camera")!.parent = this.mesh;
  
      let jump_force = 0;
      this.scene.registerBeforeRender(() => {
        this._beforeRenderUpdate(ic, camera);
        // return;
        // const position_step:number = 0.3;
        // const rotation_step:number = 0.015;
        // // Gravity direction points to -Y axis (thus, -1 *)
        // const gravity_force:number = -1 * 9.80665/5;
        // // player.movePOV(0, 0, ic.vertical*position_step); // moves without collision
        // player.rotation.y += ic.horizontal*rotation_step;
        // const move_x:number = -1 * Math.cos(player.rotation.y) * ic.vertical*position_step;
        // const move_z:number = -1 * Math.sin(player.rotation.y) * ic.vertical*position_step;
        // if(ic.is_jump_pressed && Math.round(player.position.y) == 1) {
        //   jump_force = -1 * gravity_force + 0.2;
        // }
        // jump_force -= 0.01;
        // if(jump_force < 0){
        //   jump_force = 0;
        // }
        // let move_y:number = gravity_force + jump_force;
        // // console.log("move_y=" + move_y);
        // // console.log("player.position.y=" + player.position.y);
        // // console.log("jump_force=" + jump_force);
        // let move_vec:Vector3 = new Vector3(move_z, move_y, move_x);
        // player.moveWithCollisions(move_vec);
        // // player.position.x += move_x;
        // // player.position.y += move_y;
        // // player.position.z += move_z;
        // if(player.position.y < 1){
        //   player.position.y = 1;
        // }
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
  private _beforeRenderUpdate(ic:input_controller, camera:ArcRotateCamera): void
  {
    this._updateFromControls(ic, camera);
    this._updateGroundDetection(ic);
    // this._animatePlayer();
  }
// -------------------------------------------------------------------------- //
  private _updateFromControls(ic:input_controller, camera:ArcRotateCamera): void
  {
    // https://github.com/BabylonJS/SummerFestival/blob/82eefc28fd34169860ea8e3f4a9e3b0c6c83935b/tutorial/characterMove1/characterController.ts
    // the amount of time in between frames (ms), so we divide by 1000 to get seconds
    // console.log("delta_time=" + delta_time);
    this._deltaTime = this.scene.getEngine().getDeltaTime();

    this._moveDirection = Vector3.Zero();
    this._h = ic.horizontal; //right, x
    this._v = ic.vertical; //fwd, z

    //tutorial, if the player moves for the first time
    // if((this._h != 0 || this._v != 0) && !this.tutorial_move){
    //     this.tutorial_move = true;
    // }

    //--DASHING--
    //limit dash to once per ground/platform touch
    //can only dash when in the air
    // if (this._input.dashing && !this._dashPressed && this._canDash && !this._grounded) {
    //     this._canDash = false;
    //     this._dashPressed = true;

    //     //sfx and animations
    //     this._currentAnim = this._dash;
    //     this._dashingSfx.play();

    //     //tutorial, if the player dashes for the first time
    //     if(!this.tutorial_dash){
    //         this.tutorial_dash = true;
    //     }
    // }

    let dashFactor = 1;
    // //if you're dashing, scale movement
    // if (this._dashPressed) {
    //     if (this.dashTime > Player.DASH_TIME) {
    //         this.dashTime = 0;
    //         this._dashPressed = false;
    //     } else {
    //         dashFactor = Player.DASH_FACTOR;
    //     }
    //     this.dashTime++;
    // }

    //--MOVEMENTS BASED ON CAMERA (as it rotates)--
    // let fwd = new Vector3(ic.horizontal, ic.vertical, 0);
    // console.log(fwd);
    // let right = camera.right;
    // let correctedVertical = fwd.scaleInPlace(this._v);
    // let correctedHorizontal = right.scaleInPlace(this._h);

    //movement based off of camera's view
    // let move = correctedHorizontal.addInPlace(correctedVertical);
    // let move = camera.getDirection(this._moveDirection);
    // let move = correctedVertical;

    const position_step:number = 0.3;
    // const rotation_step:number = 0.015;
    const move_x:number = -1 * Math.sin(this.mesh.rotation.y) * ic.vertical*position_step;
    const move_z:number = -1 * Math.cos(this.mesh.rotation.y) * ic.vertical*position_step;
    let move = new Vector3(move_x, 0, move_z);

    //clear y so that the character doesnt fly up, normalize for next step, taking into account whether we've DASHED or not
    this._moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z * dashFactor);

    //clamp the input value so that diagonal movement isn't twice as fast
    let inputMag = Math.abs(this._h) + Math.abs(this._v);
    if (inputMag < 0) {
      this._inputAmt = 0;
    } else if (inputMag > 1) {
      this._inputAmt = 1;
    } else {
      this._inputAmt = inputMag;
    }
    //final movement that takes into consideration the inputs
    this._moveDirection = this._moveDirection.scaleInPlace(
      this._inputAmt * player.PLAYER_SPEED);

    //check if there is movement to determine if rotation is needed
    let input = new Vector3(ic.horizontalAxis, 0, 0); //along which axis is the direction
    if (input.length() == 0) {
      //if there's no input detected, prevent rotation and keep player in same rotation
      return;
    }

    //rotation based on input & the camera angle
    let angle = Math.atan2(ic.horizontalAxis, 0);
    angle += this.mesh.rotation.y;
    // let targ = Quaternion.FromEulerAngles(0, angle, 0);
    // this.mesh.rotationQuaternion = Quaternion.Slerp(
    //   this.mesh.rotationQuaternion!, targ, this._deltaTime/100);
    this.mesh.rotation.y = Scalar.Lerp(
      this.mesh.rotation.y, angle, this._deltaTime/1000);
    }
// -------------------------------------------------------------------------- //
  private _updateGroundDetection(ic:input_controller): void {
    this._deltaTime = this.scene.getEngine().getDeltaTime();

    //if not grounded
    const is_grounded:boolean = this._isGrounded();
    if (!is_grounded) {
      // console.log("not grounded");
      //if the body isnt grounded, check if it's on a slope and was either falling or walking onto it
      if (this._checkSlope() && this._gravity.y <= 0) {
        console.log("slope")
        //if you are considered on a slope, you're able to jump and gravity wont affect you
        this._gravity.y = 0;
        this._jumpCount = 1;
        this._grounded = true;
      } else {
        //keep applying gravity
        this._gravity = this._gravity.addInPlace(Vector3.Up().scale(this._deltaTime/1000 * player.GRAVITY));
        this._grounded = false;
      }
    }else{
      // console.log("is grounded");
    }
    // console.log(this._gravity.y);

    //limit the speed of gravity to the negative of the jump power
    if (this._gravity.y < -player.JUMP_FORCE) {
      this._gravity.y = -player.JUMP_FORCE;
    }


    //cue falling animation once gravity starts pushing down
    if (this._gravity.y < 0 && this._jumped) { //todo: play a falling anim if not grounded BUT not on a slope
      this._isFalling = true;
    }

    //update our movement to account for jumping
    let movement_vector = this._moveDirection.addInPlace(this._gravity);
    console.log(this.mesh.position.y, is_grounded, this._gravity.y, this._moveDirection.y);
    // console.log(movement_vector.y, this.mesh.position.y);
    this.mesh.moveWithCollisions(movement_vector);
    // this.mesh.position.y = this._lastGroundPos.y;

    if (this._isGrounded()) {
      this._gravity.y = 0;
      this._grounded = true;
      //keep track of last known ground position
      this._lastGroundPos.copyFrom(this.mesh.position);

      this._jumpCount = 1;
      //dashing reset
      this._canDash = true;
      //reset sequence(needed if we collide with the ground BEFORE actually completing the dash duration)
      this.dashTime = 0;
      this._dashPressed = false;

      //jump & falling animation flags
      this._jumped = false;
      this._isFalling = false;
    }

    //Jump detection
    if (ic.is_jump_pressed && this._jumpCount > 0) {
      this._gravity.y = player.JUMP_FORCE;
      this._jumpCount--;

      //jumping and falling animation flags
      this._jumped = true;
      this._isFalling = false;
      // this._jumpingSfx.play();

      //tutorial, if the player jumps for the first time
      // if(!this.tutorial_jump){
      //   this.tutorial_jump = true;
      // }
    }
  }
// -------------------------------------------------------------------------- //
  //--GROUND DETECTION--
  //Send raycast to the floor to detect if there are any hits with meshes below the character
  private _floorRaycast(offsetx: number, offsetz: number, raycastlen: number): Vector3 {
    //position the raycast from bottom center of mesh
    let raycastFloorPos = new Vector3(this.mesh.position.x + offsetx,
      this.mesh.position.y, this.mesh.position.z + offsetz);
    let ray = new Ray(raycastFloorPos, Vector3.Down(), raycastlen);

    //defined which type of meshes should be pickable
    const pick = this.scene.pickWithRay(ray, (mesh:AbstractMesh) => {
      return mesh.isPickable && mesh.isEnabled();
    });

    if (pick!.hit) { //grounded
      return pick!.pickedPoint!;
    } else { //not grounded
      return Vector3.Zero();
    }
  }
// -------------------------------------------------------------------------- //
  private _isGrounded(): boolean {
    if (this._floorRaycast(0, 0, 1.5).length() == 0){//.equals(Vector3.Zero())) {
      return false;
    } else {
      return true;
    }
  }
// -------------------------------------------------------------------------- //
  //https://www.babylonjs-playground.com/#FUK3S#8
  //https://www.html5gamedevs.com/topic/7709-scenepick-a-mesh-that-is-enabled-but-not-visible/
  //check whether a mesh is sloping based on the normal
  private _checkSlope(): boolean
  {
    //only check meshes that are pickable and enabled (specific for collision meshes that are invisible)
    let predicate = function (mesh:AbstractMesh) {
        return mesh.isPickable && mesh.isEnabled();
    }

    //4 raycasts outward from center
    let raycast = new Vector3(this.mesh.position.x, this.mesh.position.y + 0.5, this.mesh.position.z + .25);
    let ray = new Ray(raycast, Vector3.Up().scale(-1), 1.5);
    let pick = this.scene.pickWithRay(ray, predicate);

    let raycast2 = new Vector3(this.mesh.position.x, this.mesh.position.y + 0.5, this.mesh.position.z - .25);
    let ray2 = new Ray(raycast2, Vector3.Up().scale(-1), 1.5);
    let pick2 = this.scene.pickWithRay(ray2, predicate);

    let raycast3 = new Vector3(this.mesh.position.x + .25, this.mesh.position.y + 0.5, this.mesh.position.z);
    let ray3 = new Ray(raycast3, Vector3.Up().scale(-1), 1.5);
    let pick3 = this.scene.pickWithRay(ray3, predicate);

    let raycast4 = new Vector3(this.mesh.position.x - .25, this.mesh.position.y + 0.5, this.mesh.position.z);
    let ray4 = new Ray(raycast4, Vector3.Up().scale(-1), 1.5);
    let pick4 = this.scene.pickWithRay(ray4, predicate);

    if (pick!.hit && !pick!.getNormal()!.equals(Vector3.Up())) {
        if(pick!.pickedMesh!.name.includes("stair")) { 
            return true; 
        }
    } else if (pick2!.hit && !pick2!.getNormal()!.equals(Vector3.Up())) {
        if(pick2!.pickedMesh!.name.includes("stair")) { 
            return true; 
        }
    }
    else if (pick3!.hit && !pick3!.getNormal()!.equals(Vector3.Up())) {
        if(pick3!.pickedMesh!.name.includes("stair")) { 
            return true; 
        }
    }
    else if (pick4!.hit && !pick4!.getNormal()!.equals(Vector3.Up())) {
        if(pick4!.pickedMesh!.name.includes("stair")) { 
            return true; 
        }
    }
    return false;
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

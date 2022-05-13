// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
import {Scene, Vector3, MeshBuilder, FreeCamera, ArcRotateCamera, UniversalCamera}
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
    const camera: UniversalCamera = new UniversalCamera("player_camera",
      new Vector3(0, 2, -6), this.scene);
    // const camera: FreeCamera = new FreeCamera("camera1",
    //   new Vector3(0, 5, -10), this.scene);
    // const camera: ArcRotateCamera =
    //   new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10,
    //   new Vector3(0, 0, 0));
    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);

    console.log("player::create(): Creating player ...");
    // Our built-in 'sphere' shape.
    // const sphere:Mesh = MeshBuilder.CreateSphere("sphere",
    //   {diameter: 2, segments: 32}, this.scene);
    // // Move the sphere upward 1/2 its height
    // sphere.position.y = 1;

    //collision mesh
    const collision_box = MeshBuilder.CreateBox("collision_box", { width: 2,
      depth: 2, height: 2 }, this.scene);
    collision_box.isVisible = true;
    collision_box.isPickable = false;
    collision_box.checkCollisions = true;
    collision_box.position.y = 1;

    console.log("player::create(): Creating input controller.");
    let ic:input_controller = new input_controller(this.scene);
    ic.create();

    this.scene.registerBeforeRender(() => {
      collision_box.moveWithCollisions(new Vector3(ic.horizontal, 0,
        ic.vertical));
      camera.position = collision_box.position.clone();
      camera.position.z -= 6;
      camera.position.y += 2;
    })

    console.log("player::create(): Created.");
  }
// -------------------------------------------------------------------------- //
} // end class
// -------------------------------------------------------------------------- //

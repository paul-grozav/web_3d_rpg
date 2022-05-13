// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
import {Scene, Vector3, CannonJSPlugin, ArcRotateCamera,
  HemisphericLight, Mesh, MeshBuilder, PhysicsImpostor, StandardMaterial,
  Color3}
  from "babylonjs";
// -------------------------------------------------------------------------- //
export class Player {
// -------------------------------------------------------------------------- //
  private scene:Scene;
// -------------------------------------------------------------------------- //
  constructor(scene:Scene) {
    console.log("Player::constructor(): Constructing...");
    this.scene = scene;
    console.log("Player::constructor(): Constructed.");
  }
// -------------------------------------------------------------------------- //
  public create(): void {
    console.log("Player::create(): Creating...");

    // This creates and positions a free camera (non-mesh)
    // const camera: FreeCamera = new FreeCamera("camera1",
    //   new Vector3(0, 5, -10), scene);
    const camera: ArcRotateCamera =
      new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10,
      new Vector3(0, 0, 0));

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);

    console.log("Player::create(): Created.");
  }
// -------------------------------------------------------------------------- //
} // end class
// -------------------------------------------------------------------------- //

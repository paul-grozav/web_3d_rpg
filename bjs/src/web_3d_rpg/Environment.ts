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
import {Scene, Vector3, HemisphericLight, Mesh, MeshBuilder, PhysicsImpostor,
  StandardMaterial, Color3}
  from "babylonjs";
// -------------------------------------------------------------------------- //
export class Environment {
// -------------------------------------------------------------------------- //
  private scene:Scene;
// -------------------------------------------------------------------------- //
  constructor(scene:Scene) {
    console.log("Environment::constructor(): Constructing...");
    this.scene = scene;
    console.log("Environment::constructor(): Constructed.");
  }
// -------------------------------------------------------------------------- //
  public create(): void {
    console.log("Environment::create(): Creating...");

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light: HemisphericLight = new HemisphericLight(
      "light", new Vector3(0, 1, 0), this.scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'ground' shape.
    const ground: Mesh = MeshBuilder.CreateGround("ground",
      {width: 50, height: 50}, this.scene);
    ground.physicsImpostor = new PhysicsImpostor(ground,
      PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5,
      restitution: 0.7 }, this.scene);

    const ground_material: StandardMaterial =
      new StandardMaterial("ground_material", this.scene);
    ground_material.diffuseColor = Color3.Green();
    ground.material = ground_material;

    console.log("Environment::create(): Created.");
  }
// -------------------------------------------------------------------------- //
} // end class
// -------------------------------------------------------------------------- //

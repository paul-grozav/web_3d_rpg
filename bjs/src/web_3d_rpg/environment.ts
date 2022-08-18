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
  StandardMaterial, Color3, Color4, AxesViewer, SceneLoader, AbstractMesh}
  from "babylonjs";
// import "@babylonjs/loaders/glTF";
import "babylonjs-loaders";
// -------------------------------------------------------------------------- //
export class environment {
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

    // Set sky color
    this.scene.clearColor = Color4.FromHexString("#00BCFF");

    // Our built-in 'ground' shape.
    // const ground_material: StandardMaterial =
    //   new StandardMaterial("ground_material", this.scene);
    // ground_material.diffuseColor = Color3.Green();

    // const ground: Mesh = MeshBuilder.CreateGround("ground",
    //   {width: 5000, height: 5000}, this.scene);
    // ground.physicsImpostor = new PhysicsImpostor(ground,
    //   PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5,
    //   restitution: 0.7 }, this.scene);
    // ground.material = ground_material;

    new AxesViewer(this.scene, 5);


    // Append glTF model to scene.
    // SceneLoader.Append("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DragonAttenuation/glTF-Binary/DragonAttenuation.glb", this.scene, function (scene) {});
    SceneLoader.Append("", "ground.glb", this.scene, function (scene) {
      const ground:AbstractMesh = scene.getMeshByName("Plane")!;
      ground.checkCollisions = true;
      ground.scaling.x = 0.15;
      ground.scaling.z = 0.15;
    });

    let add_tree = (position_x:number, position_z:number, name:string, color:Color3) => {
      SceneLoader.Append("", "tree.glb", this.scene, function (scene) {
        let obj:AbstractMesh = scene.getMeshByName("tree")!;
        obj.name = name + "_tree";
        obj.checkCollisions = true;
        obj.position.x = position_x;
        obj.position.z = position_z;
        // obj.c
        obj = scene.getMeshByName("leafs")!;
        obj.name = name + "_leafs";
        obj.checkCollisions = true;
        obj.position.x = position_x;
        obj.position.z = position_z;
        const mat = new StandardMaterial("player_material");
        mat.diffuseColor = color;
        obj.material = mat;
      });
    };
    const x:number = -10;
    const y:number = -20;
    add_tree(x + 0, y + 0, "1", Color3.Green());
    add_tree(x + 0, y + 10, "2", Color3.Magenta());
    add_tree(x + 10, y + 0, "3", Color3.Red());
    add_tree(x + 10, y + 10, "4", Color3.Yellow());

    console.log("Environment::create(): Created.");
  }
// -------------------------------------------------------------------------- //
} // end class
// -------------------------------------------------------------------------- //

// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //
// import { Engine, Scene } from 'babylonjs';
import * as BABYLON from 'babylonjs';
// import * as BABYLON from '@babylonjs/core/Legacy/legacy';

let canvas:HTMLCanvasElement = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
document.body.appendChild(canvas);
let engine:BABYLON.Engine = new BABYLON.Engine(canvas, true);
let create_scene = function(canvas:HTMLCanvasElement, engine:BABYLON.Engine):BABYLON.Scene {
  // This creates a basic Babylon Scene object (non-mesh)
  let scene:BABYLON.Scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  let camera:BABYLON.FreeCamera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  let light:BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'sphere' shape.
  let sphere:BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

  // Move the sphere upward 1/2 its height
  sphere.position.y = 1;

  // Our built-in 'ground' shape.
  let ground:BABYLON.Mesh = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

  return scene;
};
let scene:BABYLON.Scene = create_scene(canvas, engine);
engine.runRenderLoop(function() {
  scene.render();
});
// -------------------------------------------------------------------------- //
let message: string = 'Hello, World of TS!';
console.log(message);
// create a new heading 1 element
//let heading = document.createElement('h1');
//heading.textContent = message;
// add the heading the document
//document.body.appendChild(heading);
// -------------------------------------------------------------------------- //
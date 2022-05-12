// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
import * as BABYLON from "babylonjs";
import {Playground} from "./Playground";
import * as Stats from "stats.js";
// -------------------------------------------------------------------------- //
document.body.style.overflow = "hidden";
document.body.style.margin = "0px";
let canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
document.body.appendChild(canvas);
// -------------------------------------------------------------------------- //
var stats_mb = new Stats();
stats_mb.showPanel( 2 );
document.body.appendChild( stats_mb.dom );
// function animate() {
// 	stats_mb.begin();
// 	// monitored code goes here
// 	stats_mb.end();
// 	requestAnimationFrame( animate );
// }
// requestAnimationFrame( animate );
// -------------------------------------------------------------------------- //
let pg:Playground = new Playground();
pg.run();

let engine: BABYLON.Engine = new BABYLON.Engine(canvas, true);
let scene:BABYLON.Scene = Playground.create_scene(engine, canvas);
// enable debugger / inspector
// scene.debugLayer.show({
//   initialTab: 2
// });
engine.runRenderLoop(function() {
	stats_mb.begin();
  scene.render();
	stats_mb.end();
});
// -------------------------------------------------------------------------- //
let message: string = "Hello, from TypeScript!";
console.log(message);
// -------------------------------------------------------------------------- //

// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
// NPM dependecies:
// - typescript, ts-loader - for writing the project in typescript.
// - npm-run-all - for running multiple npm scripts in parallel, useful in
//   development, when watching and serving through the live server.
// - webpack, webpack-cli - the tool used to bundle the app and it's
//   dependencies and also calling the webpack code from CLI.
// - browserify - used to bundle the app with it's dependencies into one .js .
// - stats.js, @types/stats.js - show metrics about FPS, RAM, milliseconds of
//   code duration, etc.
// - babylonjs - The BabylonJS 3D rendering and gaming enging.
// - babylonjs-gui - showing buttons in the game interface.
// - babylonjs-loaders - load glTF models.
// - cannon, @types/cannon - JavaScript physics engine - usable with BabylonJS.
// - live-server - Serve the web app within a live server. Attracts 3 high
//   severity vulnerabilities.
// -------------------------------------------------------------------------- //
import {App} from "./web_3d_rpg/App";
import * as Stats from "stats.js";
// -------------------------------------------------------------------------- //
document.body.style.overflow = "hidden";
document.body.style.margin = "0px";
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
const a:App = new App();
a.run();
// -------------------------------------------------------------------------- //
let message:string = "Hello, from TypeScript!";
console.log(message);
// -------------------------------------------------------------------------- //
// Look into using TypeDoc as a documentation generator
// -------------------------------------------------------------------------- //
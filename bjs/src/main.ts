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
import {app} from "./web_3d_rpg/app";
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
const a:app = new app();
a.run();
// -------------------------------------------------------------------------- //
let message:string = "Hello, from TypeScript!";
console.log(message);
// -------------------------------------------------------------------------- //
// 1. Look into using TypeDoc as a documentation generator
// 2. Maybe use SVG textures?
// 3. See also:
//   3.1. Legend of Zelda (SimonDev)
//     3.1.1. https://github.com/simondevyoutube/Quick_3D_MMORPG
//     3.1.2. https://www.youtube.com/watch?v=SBfZAVzbhCg
//   3.2. Slavs Game
//     3.2.1. http://slavsgame.com/
//     3.2.2. https://github.com/furcatomasz/SlavsGame
//     3.2.3. https://www.youtube.com/watch?v=qVBpNhzhmsA
//     3.2.4. https://forum.babylonjs.com/t/slavs-slavian-mmorpg-game/717
//   3.3. MMORPG basic: https://www.youtube.com/watch?v=Z006PdLv-0M
// -------------------------------------------------------------------------- //
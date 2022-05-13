// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
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
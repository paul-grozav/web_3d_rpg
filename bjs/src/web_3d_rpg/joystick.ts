// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
import {Scene} from "babylonjs";
import * as BABYLON_GUI from "babylonjs-gui";
import { Vector2 } from "babylonjs/index";
// -------------------------------------------------------------------------- //
export class joystick {
// -------------------------------------------------------------------------- //
  private scene:Scene;
  private adt:BABYLON_GUI.AdvancedDynamicTexture | null = null;
  private thumb_container:BABYLON_GUI.Ellipse | null = null;
  // This puck thing shows up while you press and hold the joystick, and it will
  // follow your cursor/thumb in any direction (2D plane)
  private puck:BABYLON_GUI.Ellipse | null = null;
  private is_left_joystick_down:boolean = false;
  private side_joystick_offset:number = 150;
  private bottom_joystick_offset:number = -50;
  private position_x:number = 0;
  private position_y:number = 0;
// -------------------------------------------------------------------------- //
  constructor(scene:Scene) {
    console.log("joystick::constructor(): Constructing...");
    this.scene = scene;
    console.log("joystick::constructor(): Constructed.");
  }
// -------------------------------------------------------------------------- //
  public create(): void {
    console.log("joystick::create(): Creating...");
    this.adt = BABYLON_GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this.thumb_container = this.make_thumb_area("outer_ring", 2, "black", "");
    this.thumb_container.height = "200px";
    this.thumb_container.width = "200px";
    this.thumb_container.isPointerBlocker = true;
    this.thumb_container.horizontalAlignment =
      BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.thumb_container.verticalAlignment =
      BABYLON_GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.thumb_container.alpha = 0.4;
    this.thumb_container.left = this.side_joystick_offset;
    this.thumb_container.top = this.bottom_joystick_offset;

    let inner_thumb_container = this.make_thumb_area("inner_ring", 4,
      "black", "");
    inner_thumb_container.height = "80px";
    inner_thumb_container.width = "80px";
    inner_thumb_container.isPointerBlocker = true;
    inner_thumb_container.horizontalAlignment =
      BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    inner_thumb_container.verticalAlignment =
      BABYLON_GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    this.puck = this.make_thumb_area("puck", 0, "darkgray", "darkgray");
    this.puck.height = "60px";
    this.puck.width = "60px";
    this.puck.isPointerBlocker = true;
    this.puck.horizontalAlignment =
      BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.puck.verticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    this.thumb_container.onPointerDownObservable.add((coordinates) => {
      this.down_handler(coordinates);
    });
    this.thumb_container.onPointerUpObservable.add((coordinates) => {
      this.up_handler(coordinates);
    });
    this.thumb_container.onPointerMoveObservable.add((coordinates) => {
      this.move_handler(coordinates);
    });

    this.adt.addControl(this.thumb_container);
    this.thumb_container.addControl(inner_thumb_container);
    this.thumb_container.addControl(this.puck);
    this.puck.isVisible = false;
  
    // this.scene.registerBeforeRender(function(){
      // let translateTransform = Vector3.TransformCoordinates(
        // new Vector3(xAddPos/3000, 0, yAddPos/3000),
        // Matrix.RotationY(camera.rotation.y));
      // camera.cameraDirection.addInPlace(translateTransform);
      // camera.cameraRotation.y += xAddRot/15000*-1;
      // camera.cameraRotation.x += yAddRot/15000*-1;
    // });
    console.log("joystick::create(): Created.");
  }
// -------------------------------------------------------------------------- //
  // Used by custom joystick
  private make_thumb_area(name: string, thickness: number, color: string,
    background: string): BABYLON_GUI.Ellipse
  {
    let rect = new BABYLON_GUI.Ellipse();
    rect.name = name;
    rect.thickness = thickness;
    rect.color = color;
    if(background != "")
    {
      rect.background = background;
    }
    rect.paddingLeft = "0px";
    rect.paddingRight = "0px";
    rect.paddingTop = "0px";
    rect.paddingBottom = "0px";
    return rect;
  }
// -------------------------------------------------------------------------- //
  // Used by custom joystick
  public remove() : void {
    console.log("joystick::create(): Removing.");
    if(this.adt === null)
    {
      return;
    }
    if(this.thumb_container === null)
    {
      return;
    }
    this.adt.removeControl(this.thumb_container);
    console.log("joystick::create(): Removed.");
  }
// -------------------------------------------------------------------------- //
  private down_handler(coordinates:Vector2): void {
    console.log("onPointerDown");
    if(this.adt === null || this.thumb_container === null
      || this.puck === null || this.adt === undefined
      || this.thumb_container === undefined || this.puck === undefined)
    {
      return;
    }
    this.puck.isVisible = true;
    this.puck.left = coordinates.x -
      (this.thumb_container._currentMeasure.width * 0.5) -
      this.side_joystick_offset;
    // this.puck.floatLeft = this.puck.left;
    this.puck.top = (-1)*
      ( this.adt.getContext().canvas.height - coordinates.y -
      (this.thumb_container._currentMeasure.height * 0.5) +
      this.bottom_joystick_offset );
    // this.puck.floatTop = this.puck.top;
    this.is_left_joystick_down = true;
    this.thumb_container.alpha = 0.9;
  }
// -------------------------------------------------------------------------- //
  private up_handler(coordinates:Vector2): void {
    console.log("onPointerUp");
    if(this.adt === null || this.thumb_container === null
      || this.puck === null || this.adt === undefined
      || this.thumb_container === undefined || this.puck === undefined)
    {
      return;
    }

    this.position_x = 0;
    this.position_y = 0;
    this.is_left_joystick_down = false;
    this.puck.isVisible = false;
    this.thumb_container.alpha = 0.4;
  }
// -------------------------------------------------------------------------- //
  private move_handler(coordinates:Vector2): void {
    if (!this.is_left_joystick_down) {
      // can only move while pressed/down
      return;
    }

    if(this.adt === null || this.thumb_container === null
      || this.puck === null || this.adt === undefined
      || this.thumb_container === undefined || this.puck === undefined)
    {
      return;
    }

    this.position_x = coordinates.x - 
      (this.thumb_container._currentMeasure.width * 0.5) -
      this.side_joystick_offset;
    this.position_y = this.adt.getContext().canvas.height - coordinates.y -
      (this.thumb_container._currentMeasure.height * 0.5) +
      this.bottom_joystick_offset;
    // console.log("move - x = " + this.position_x +
    //   " - y = " + this.position_y);
    // leftPuck.floatLeft = xAddPos;
    // leftPuck.floatTop = yAddPos*-1;
    this.puck.left = this.position_x;
    this.puck.top = (-1) * this.position_y;
  }
// -------------------------------------------------------------------------- //
public get_position_x(): number {
  return this.position_x;
}
// -------------------------------------------------------------------------- //
public get_position_y(): number {
  return this.position_y;
}
// -------------------------------------------------------------------------- //
} // end class
// -------------------------------------------------------------------------- //

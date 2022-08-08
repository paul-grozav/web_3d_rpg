// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
import {Scene, VirtualJoystick} from "babylonjs";
import * as BABYLON_GUI from "babylonjs-gui";
import {joystick} from "./joystick"
// -------------------------------------------------------------------------- //
export class ui {
// -------------------------------------------------------------------------- //
  private scene:Scene;
  private joystick:joystick | null  = null;
  private is_joystick_active__checkbox:BABYLON_GUI.Checkbox | null = null;
// -------------------------------------------------------------------------- //
  constructor(scene:Scene) {
    console.log("ui::constructor(): Constructing...");
    this.scene = scene;
    console.log("ui::constructor(): Constructed.");
  }
// -------------------------------------------------------------------------- //
  public create(): void {
    console.log("ui::create(): Creating...");
    this.joystick = new joystick(this.scene);
    let advanced_texture = BABYLON_GUI.AdvancedDynamicTexture
      .CreateFullscreenUI("UI");

    let panel = new BABYLON_GUI.StackPanel("Game UI Panel");
    panel.height = "25px";
    panel.isVertical = false;
    panel.horizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.background = "gray";
    advanced_texture.addControl(panel);

    this.is_joystick_active__checkbox = new BABYLON_GUI.Checkbox();
    this.is_joystick_active__checkbox.width = "20px";
    this.is_joystick_active__checkbox.height = "20px";
    this.is_joystick_active__checkbox.isChecked = false;
    this.is_joystick_active__checkbox.color = "green";
    this.is_joystick_active__checkbox.onIsCheckedChangedObservable.add(
      (is_joystick_active) => {
        console.log("is_joystick_active=" + is_joystick_active);
        if(this.joystick === null || this.joystick === undefined){
          return;
        }
        if(!is_joystick_active)
        {
          this.joystick.remove();
        }
        else
        {
          this.joystick.create();
        }
    });
    panel.addControl(this.is_joystick_active__checkbox);

    let header = new BABYLON_GUI.TextBlock();
    header.text = "JoyStick";
    header.width = "80px";
    // header.marginLeft = "5px";
    header.textHorizontalAlignment =
      BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    header.color = "white";
    panel.addControl(header);

    console.log("ui::create(): Created.");
  }
// -------------------------------------------------------------------------- //
  public get__is_joystick_active(): boolean {
    if(this.is_joystick_active__checkbox === null) {
      return false;
    }
    return this.is_joystick_active__checkbox.isChecked;
  }
// -------------------------------------------------------------------------- //
  public get_joystick():joystick|null{
    return this.joystick;
  }
// -------------------------------------------------------------------------- //
} // end class
// -------------------------------------------------------------------------- //

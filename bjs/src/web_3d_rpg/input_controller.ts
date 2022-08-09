// -------------------------------------------------------------------------- //
// Author: Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
import {Scene, ActionManager, ExecuteCodeAction, Scalar} from "babylonjs";
import {ui} from "./ui"
// -------------------------------------------------------------------------- //
export class input_controller {
// -------------------------------------------------------------------------- //
  private scene:Scene;
  private game_ui:ui;
  public input_map:Record<string, boolean> = {};

  // simple movement - As we press the key, we want to lerp the value so that it
  // has a smoother transition. it gradually increases the value to 1 or -1.
  public horizontal:number = 0;
  public vertical:number = 0;
  // tracks whether or not there is movement in that axis
  public horizontalAxis:number = 0;
  public verticalAxis:number = 0;
  public is_jump_pressed:number = 0;
// -------------------------------------------------------------------------- //
  constructor(scene:Scene, game_ui:ui) {
    console.log("input_controller::constructor(): Constructing...");
    this.scene = scene;
    this.game_ui = game_ui;
    this.input_map = {};
    console.log("input_controller::constructor(): Constructed.");
  }
// -------------------------------------------------------------------------- //
  public create(): void {
    console.log("input_controller::create(): Creating action handlers ...");
    this.scene.actionManager = new ActionManager(this.scene);

    // key pressed => set key to true
    this.scene.actionManager.registerAction(new ExecuteCodeAction(
      ActionManager.OnKeyDownTrigger, (evt) => {
      this.input_map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      // console.log("KeyDown: " + evt.sourceEvent.type + " key: " + evt.sourceEvent.key);
    }));
    // key released => set key to false
    this.scene.actionManager.registerAction(new ExecuteCodeAction(
      ActionManager.OnKeyUpTrigger, (evt) => {
      this.input_map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      // console.log("KeyUp: " + evt.sourceEvent.type + " key: " + evt.sourceEvent.key);
    }));

    this.scene.onBeforeRenderObservable.add(() => {
      this.update_movement();
    });
    console.log("input_controller::create(): Created.");
  }
// -------------------------------------------------------------------------- //
  private update_movement(): void {
    // Move forward and backward
    if (this.input_map["ArrowUp"]) {
      this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
      this.verticalAxis = 1;
    } else if (this.input_map["ArrowDown"]) {
      this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
      this.verticalAxis = -1;
    } else {
      this.vertical = 0;
      this.verticalAxis = 0;
    }

    // Turn to the right or to the left
    if (this.input_map["ArrowLeft"]) {
      this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
      this.horizontalAxis = -1;
    } else if (this.input_map["ArrowRight"]) {
      this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
      this.horizontalAxis = 1;
    } else {
      this.horizontal = 0;
      this.horizontalAxis = 0;
    }

    // Jump (Space)
    if (this.input_map[" "]) {
      this.is_jump_pressed = 1;
    } else {
      this.is_jump_pressed = 0;
    }

    // Process JoyStick input
    // console.log("processing joystick...");
    // console.log("IC::game_ui=");
    // console.log(this.game_ui);
    if(this.game_ui.get__is_joystick_active()){
      let joystick = this.game_ui.get_joystick();
      if(joystick === null || joystick === undefined){}
      else{
        let joystick_x = joystick.get_position_x();
        let joystick_y = joystick.get_position_y();
        console.log("js.x=" + joystick_x + " - js.y=" + joystick_y);
        // moveX = leftJoystick.deltaPosition.x * (engine.getDeltaTime()/1000) * movespeed;
        // moveZ = leftJoystick.deltaPosition.y * (engine.getDeltaTime()/1000) * movespeed;
        // sphere.position.x+=moveX
        // sphere.position.z+=moveZ
        this.horizontal = Scalar.Lerp(this.horizontal, Math.sign(joystick_y)*joystick_x, 0.01);
        this.horizontalAxis = Math.sign(joystick_x);
  
        this.vertical = Scalar.Lerp(this.vertical, joystick_y, 0.01);
        this.verticalAxis = Math.sign(joystick_y);
      }
    }
  }
// -------------------------------------------------------------------------- //
} // end class
// -------------------------------------------------------------------------- //

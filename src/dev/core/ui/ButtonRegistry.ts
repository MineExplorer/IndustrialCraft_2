/// <reference path="ToolHUD.ts" />
/// <reference path="buttons/ButtonFly.ts" />
/// <reference path="buttons/ButtonHover.ts" />
/// <reference path="buttons/ButtonJump.ts" />
/// <reference path="buttons/ButtonNightvision.ts" />
/// <reference path="buttons/ButtonToolMode.ts" />

namespace ToolHUD {
	registerButton(new ButtonFly());
	registerButton(new ButtonHover());
	registerButton(new ButtonJump());
	registerButton(new ButtonNightvision());
	registerButton(new ButtonToolMode());
}
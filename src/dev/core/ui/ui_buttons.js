var currentUIscreen;
Callback.addCallback("NativeGuiChanged", function(screenName) {
	currentUIscreen = screenName;
	if (screenName != "in_game_play_screen" && UIbuttons.container) {
		UIbuttons.container.close();
	}
});

var button_scale = __config__.getNumber("button_scale");
var UIbuttons = {
	data: {},
	onSwitch: {},
	onUpdate: {},
	isEnabled: false,
	container: null,
	Window: new UI.Window({
		location: {
			x: 1000 - button_scale,
			y: UI.getScreenHeight()/2 - button_scale*2,
			width: button_scale,
			height: button_scale*5
		},
		drawing: [{type: "background", color: 0}],
		elements: {}
	}),
	
	setArmorButton: function(id, name) {
		var data = {type: 0, name: name};
		if (!this.data[id]) {
			this.data[id] = [data]
		} else {
			this.data[id].push(data);
		}
	},
	
	setToolButton: function(id, name, notHidden) {
		var data = {type: 1, name: name, hidden: !notHidden};
		if (!this.data[id]) {
			this.data[id] = [data]
		} else {
			this.data[id].push(data);
		}
	},
	
	getButtons: function(id) {
		return this.data[id];
	},
	
	registerButton: function(name, properties) {
		buttonContent[name] = properties;
		buttonMap[name] = false;
	},
	
	registerSwitchFunction: function(id, func) {
		this.onSwitch[id] = func;
	},
	
	onButtonUpdate: function(name, func) {
		this.onUpdate[name] = func;
	}
}

var buttonMap = {
	button_nightvision: false,
	button_fly: false,
	button_hover: false,
	button_jump: false,
}

var buttonContent = {
	button_nightvision: {
		y: 0,
		type: "button",
		bitmap: "button_nightvision_on",
		bitmap2: "button_nightvision_off",
		scale: 50,
		clicker: {
			onClick: function() {
				var armor = Player.getArmorSlot(0);
				var extra = armor.extra;
				if (extra) {
					var nightvision = extra.getBoolean("nv");
				}
				else {
					var nightvision = false;
					extra = new ItemExtraData();
				}
				if (nightvision) {
					extra.putBoolean("nv", false);
					Game.message("§4" + Translation.translate("Nightvision mode disabled"));
				}
				else {
					extra.putBoolean("nv", true);
					Game.message("§2" + Translation.translate("Nightvision mode enabled"));
				}
				Player.setArmorSlot(0, armor.id, 1, armor.data, extra);
			}
		}
	},
	button_fly: {
		y: 1000,
		type: "button",
		bitmap: "button_fly_on",
		bitmap2: "button_fly_off",
		scale: 50
	},
	button_hover: {
		y: 2000,
		type: "button",
		bitmap: "button_hover_off",
		scale: 50,
		clicker: {
			onClick: function() {
				var vel = Player.getVelocity();
				var armor = Player.getArmorSlot(1);
				if (!Utils.isOnGround(Player.get()) && ChargeItemRegistry.getEnergyStored(armor) >= 8) {
					var extra = armor.extra || new ItemExtraData();
					var hover = extra.getBoolean("hover");
					if (hover) {
						extra.putBoolean("hover", false);
						Game.message("§4" + Translation.translate("Hover mode disabled"));
					}
					else {
						extra.putBoolean("hover", true);
						Game.message("§2" + Translation.translate("Hover mode enabled"));
					}
					Player.setArmorSlot(1, armor.id, 1, armor.data, extra);
				}
			}
		}
	},
	button_jump: {
		y: 3000,
		type: "button",
		bitmap: "button_jump_on",
		bitmap2: "button_jump_off",
		scale: 50,
		clicker: {
			onClick: function() {
				var armor = Player.getArmorSlot(3);
				var energyStored = ChargeItemRegistry.getEnergyStored(armor);
				var vel = Player.getVelocity();
				if (energyStored >= 4000 && Math.abs(vel.y - fallVelocity) < 0.0001) {
					Player.setVelocity(vel.x*3.5, 1.3, vel.z*3.5);
					ChargeItemRegistry.setEnergyStored(armor, energyStored - 4000);
					Player.setArmorSlot(3, armor.id, 1, armor.data, armor.extra);
				}
			}
		}
	},
	button_switch: {
		y: 4000,
		type: "button",
		bitmap: "button_switch",
		bitmap2: "button_switch_touched",
		scale: 25,
		clicker: {
			onClick: function() {
				var item = Player.getCarriedItem();
				if (UIbuttons.onSwitch[item.id]) {
					UIbuttons.onSwitch[item.id](item, player);
				}
			}
		}
	}
}

UIbuttons.Window.setAsGameOverlay(true);

UIbuttons.onButtonUpdate("button_hover", function(element) {
	var armor = Player.getArmorSlot(1);
	var extra = armor.extra;
	if (extra && extra.getBoolean("hover")) {
		element.bitmap = "button_hover_on";
	} else {
		element.bitmap = "button_hover_off";
	}
});

function updateUIbuttons() {
	var elements = UIbuttons.Window.content.elements;
	for (var name in buttonMap) {
		if (buttonMap[name]) {
			if (!elements[name]) {
				elements[name] = buttonContent[name];
			}
			var element = elements[name];
			var func = UIbuttons.onUpdate[name];
			if (func) func(element);
			element.x = 0;
			buttonMap[name] = false;
		}
		else {
			elements[name] = null;
		}
	}
}


Callback.addCallback("LocalTick", function() {
	var armor = [Player.getArmorSlot(0), Player.getArmorSlot(1), Player.getArmorSlot(2), Player.getArmorSlot(3)];
	for (var i in armor) {
		var buttons = UIbuttons.getButtons(armor[i].id);
		for (var i in buttons) {
			var button = buttons[i];
			if (button.type == 0) {
				buttonMap[button.name] = true;
				UIbuttons.isEnabled = true;
			}
		}
	}
	var item = Player.getCarriedItem();
	var buttons = UIbuttons.getButtons(item.id);
	for (var i in buttons) {
		var button = buttons[i];
		if (button.type == 1 && (!button.hidden || Entity.getSneaking(Player.get()))) {
			buttonMap[button.name] = true;
			UIbuttons.isEnabled = true;
		}
	}
	if (UIbuttons.isEnabled && currentUIscreen == "in_game_play_screen") {
		updateUIbuttons();
		if (!UIbuttons.container || !UIbuttons.container.isOpened()) {
			UIbuttons.container = new UI.Container();
			UIbuttons.container.openAs(UIbuttons.Window);
		}
		var armor = armor[1];
		var hoverMode = armor.extra? armor.extra.getBoolean("hover") : false;
		var playSound = hoverMode;
		var energyStored = ChargeItemRegistry.getEnergyStored(armor);
		if (energyStored >= 8 && UIbuttons.container.isElementTouched("button_fly")) {
			var vel = Player.getVelocity();
			if (vel.y > -1.2) {
				Utils.resetFallHeight();
			}

			var y = Player.getPosition().y;
			if (y < 256) {
				var vy = Math.min(32, 265 - y) / 160; // max 0.2
				if (hoverMode) {
					ChargeItemRegistry.setEnergyStored(armor, energyStored - 2);
					Player.setArmorSlot(1, armor.id, 1, armor.data, armor.extra);
					if (vel.y < 0.2) {
						Player.addVelocity(0, Math.min(vy, 0.2 - vel.y), 0);
					}
				}
				else {
					ChargeItemRegistry.setEnergyStored(armor, energyStored - 8);
					Player.setArmorSlot(1, armor.id, 1, armor.data, armor.extra);
					if (vel.y < 0.67) {
						Player.addVelocity(0, Math.min(vy, 0.67 - vel.y), 0);
					}
				}
			}
			playSound = true;
		}
		if (playSound && ConfigIC.soundEnabled) {
			if (hoverMode) {
				SoundManager.startPlaySound(SourceType.PLAYER, "JetpackLoop.ogg", 0.8);
			} else {
				SoundManager.startPlaySound(SourceType.PLAYER, "JetpackLoop.ogg", 1);
			}
		}
		if (!playSound) {
			SoundManager.stopPlaySound(Player.get(), "JetpackLoop.ogg");
		}
	}
	else if (UIbuttons.container) {
		UIbuttons.container.close();
		UIbuttons.container = null;
	}
	UIbuttons.isEnabled = false;
});

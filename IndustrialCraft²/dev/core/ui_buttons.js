var currentUIscreen;
Callback.addCallback("NativeGuiChanged", function(screenName){
	currentUIscreen = screenName;
	if(screenName != "hud_screen" && screenName != "in_game_play_screen"){
		if(UIbuttons.container){
			UIbuttons.container.close();
			UIbuttons.container = null;
		}
	}
});

var button_scale = __config__.access("button_scale");
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
	
	setArmorButton: function(id, name){
		var data = {type: 0, name: name};
		if(!this.data[id]){
			this.data[id] = [data]
		}else{
			this.data[id].push(data);
		}
	},
	
	setToolButton: function(id, name, notHidden){
		var data = {type: 1, name: name, hidden: !notHidden};
		if(!this.data[id]){
			this.data[id] = [data]
		}else{
			this.data[id].push(data);
		}
	},
	
	getButtons: function(id){
		return this.data[id];
	},
	
	registerButton: function(name, properties){
		buttonContent[name] = properties;
		buttonMap[name] = false;
	},
	
	registerSwitchFunction: function(id, func){
		this.onSwitch[id] = func;
	},
	
	onButtonUpdate: function(name, func){
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
			onClick: function(){
				var armor = Player.getArmorSlot(0);
				var extra = armor.extra;
				if(extra){
					var nightvision = extra.getBoolean("nv");
				}
				else{
					var nightvision = false;
					extra = new ItemExtraData();
				}
				if(nightvision){
					extra.putBoolean("nv", false);
					Game.message("§4" + Translation.translate("Nightvision mode disabled"));
				}
				else{
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
			onClick: function(){
				var vel = Player.getVelocity();
				if(vel.y.toFixed(4) != fallVelocity){
					var armor = Player.getArmorSlot(1);
					var extra = armor.extra;
					if(extra){
						var hover = extra.getBoolean("hover");
					}
					else{
						var hover = false;
						extra = new ItemExtraData();
					}
					if(hover){
						extra.putBoolean("hover", false);
						Game.message("§4" + Translation.translate("Hover mode disabled"));
					}
					else{
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
			onClick: function(){
				var armor = Player.getArmorSlot(3);
				if(Item.getMaxDamage(armor.id) - armor.data >= 1000 && Player.getVelocity().y.toFixed(4) == fallVelocity){
					Player.addVelocity(0, 1.4, 0);
					Player.setArmorSlot(3, armor.id, 1, armor.data+1000);
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
			onClick: function(){
				var item = Player.getCarriedItem();
				if(UIbuttons.onSwitch[item.id]){
					UIbuttons.onSwitch[item.id](item);
				}
			}
		}
	}
}

UIbuttons.Window.setAsGameOverlay(true);

UIbuttons.onButtonUpdate("button_hover", function(element){
	var armor = Player.getArmorSlot(1);
	var extra = armor.extra;
	if(extra && extra.getBoolean("hover")){
		element.bitmap = "button_hover_on";
	}else{
		element.bitmap = "button_hover_off";
	}
});

function updateUIbuttons(){
	var elements = UIbuttons.Window.content.elements;
	for(var name in buttonMap){
		if(buttonMap[name]){
			if(!elements[name]){
				elements[name] = buttonContent[name];
			}
			var element = elements[name];
			var func = UIbuttons.onUpdate[name];
			if(func) func(element);
			element.x = 0;
			buttonMap[name] = false;
		}
		else{
			elements[name] = null;
		}
	}
}

let jetpackLoop = SoundAPI.addSoundPlayer("Tools/JetpackLoop.ogg", true, 1);
Callback.addCallback("tick", function(){
	var armor = [Player.getArmorSlot(0), Player.getArmorSlot(1), Player.getArmorSlot(2), Player.getArmorSlot(3)];
	for(var i in armor){
		var buttons = UIbuttons.getButtons(armor[i].id);
		for(var i in buttons){
			var button = buttons[i];
			if(button.type == 0){
				buttonMap[button.name] = true;
				UIbuttons.isEnabled = true;
			}
		}
	}
	var item = Player.getCarriedItem();
	var buttons = UIbuttons.getButtons(item.id);
	for(var i in buttons){
		var button = buttons[i];
		if(button.type == 1 && (!button.hidden || Entity.getSneaking(Player.get()))){
			buttonMap[button.name] = true;
			UIbuttons.isEnabled = true;
		}
	}
	if(UIbuttons.isEnabled && (currentUIscreen == "hud_screen" || currentUIscreen == "in_game_play_screen")){
		updateUIbuttons();
		if(!UIbuttons.container){
			UIbuttons.container = new UI.Container();
			UIbuttons.container.openAs(UIbuttons.Window);
		}
		var armor = armor[1];
		var extra = armor.extra;
		var hover = extra? extra.getBoolean("hover") : false;
		var playSound = false;
		if(UIbuttons.container.isElementTouched("button_fly")){
			var y = Player.getPosition().y;
			var maxDmg = Item.getMaxDamage(armor.id);
			if(armor.data < maxDmg && y < 256){
				var vel = Player.getVelocity();
				var vy = Math.min(32, 264-y) / 160;
				if(hover){
					if(World.getThreadTime() % 5 == 0){
						Player.setArmorSlot(1, armor.id, 1, Math.min(armor.data+10, maxDmg), extra);
					}
					if(vel.y < 0.2){
						Player.addVelocity(0, Math.min(vy, 0.2-vel.y), 0);
					}
				}
				else{
					if(World.getThreadTime() % 5 == 0){
						Player.setArmorSlot(1, armor.id, 1, Math.min(armor.data+35, maxDmg), extra);
					}
					if(vel.y < 0.67){
						Player.addVelocity(0, Math.min(vy, 0.67-vel.y), 0);
					}
				}
			}
			playSound = true;
		} else if(hover){
			playSound = true;
		}
		if(Config.soundEnabled && playSound && !jetpackLoop.isPlaying()){
			if(hover){
				jetpackLoop.setVolume(0.8);
			} else {
				jetpackLoop.setVolume(1);
			}
			jetpackLoop.start();
		}
		if(!playSound && jetpackLoop.isPlaying()){
			jetpackLoop.stop();
		}
	}
	else if(UIbuttons.container){
		UIbuttons.container.close();
		UIbuttons.container = null;
	}
	UIbuttons.isEnabled = false;
});

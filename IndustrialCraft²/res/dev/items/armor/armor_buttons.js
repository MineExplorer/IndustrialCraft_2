var currentUIscreen;
Callback.addCallback("NativeGuiChanged", function(screenName){
	currentUIscreen = screenName;
	Game.message(screenName);
});

var UIbuttons = {
	isEnabled: false,
	container: null,
	Window: new UI.Window({
		location: {
			x: 925,
			y: UI.getScreenHeight()/2-150,
			width: 75,
			height: 300
		},
		drawing: [{type: "background", color: 0}],
		elements: {}
	}),
	
	enableButton: function(name){
		this.isEnabled = true;
		buttonMap[name] = true;
	},
	registerButton: function(name, properties){
		buttonContent[name] = properties;
	}
}

var buttonMap = {
	button_nightvision: false,
	button_fly: false,
	button_run: false,
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
				if(nightVisionEnabled){
					nightVisionEnabled = false;
					Game.message("§4 Nightvision mode disabled");
				}
				else{
					nightVisionEnabled = true;
					Game.message("§2 Nightvision mode enabled");
				}
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
	button_jump: {
		y: 2000,
		type: "button",
		bitmap: "button_jump_on",
		bitmap2: "button_jump_off",
		scale: 50,
		clicker: {
			onClick: function(){
				var armor = {id: Player.getArmorSlot(3), data: Player.getArmorSlotDamage(3)};
				if(Item.getMaxDamage(armor.id) - armor.data >= 8 && Math.abs(Player.getVelocity().y + 0.078) < 0.01){
					Player.addVelocity(0, 1.4, 0);
					Player.setArmorSlot(3, armor.id, armor.data+8);
				}
			}
		}
	}
}

function updateUIbuttons(){
	var elements = UIbuttons.Window.content.elements;
	for(var name in buttonMap){
		if(buttonMap[name]){
			if(!elements[name]){
				elements[name] = buttonContent[name];
			}
			elements[name].x = 0;
		}
		else{
			elements[name] = null;
		}
	}
}

Callback.addCallback("tick", function(){
	if(UIbuttons.isEnabled && (currentUIscreen == "hud_screen" || currentUIscreen == "in_game_play_screen")){
		updateUIbuttons();
		if(!UIbuttons.container){
			UIbuttons.container = new UI.Container();
			UIbuttons.container.openAs(UIbuttons.Window);
		}
		if(UIbuttons.container.isElementTouched("button_fly")){
			var armor = {id: Player.getArmorSlot(1), data: Player.getArmorSlotDamage(1)};
			var perDamage = ChargeItemRegistry.chargeData[armor.id].perDamage
			var y = Player.getPosition().y
			if(armor.data < Item.getMaxDamage(armor.id)-4 && y < 256){ 
				if(World.getThreadTime() % (perDamage/5) == 0){
				Player.setArmorSlot(1, armor.id, armor.data+1);}
				var vel = Player.getVelocity();
				var vy = Math.min(32, 264-y) / 160;
				if(vel.y < 0.67){
					Player.addVelocity(0, Math.min(vy, 0.67-vel.y), 0);
				}
			}
		}
	}
	else{
		if(UIbuttons.container){
			UIbuttons.container.close();
			UIbuttons.container = null;
		}
	}
	UIbuttons.isEnabled = false;
	for(var name in buttonMap){
		buttonMap[name] = false;
	}
});

Callback.addCallback("LevelLeft", function(){
	if(UIbuttons.container){
		UIbuttons.container.close();
		UIbuttons.container = null;
	}
});
IDRegistry.genItemID("nanoSaber");
Item.createItem("nanoSaber", "Nano Saber", {name: "nano_saber", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.nanoSaber, "Eu", 1000000, 3, "tool", true);
ItemName.setRarity(ItemID.nanoSaber, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaber, ItemName.showItemStorage);

IDRegistry.genItemID("nanoSaberActive");
Item.createItem("nanoSaberActive", "Nano Saber", {name: "nano_saber_active", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.nanoSaberActive, "Eu", 1000000, 3, "tool");
ItemName.setRarity(ItemID.nanoSaberActive, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaberActive, ItemName.showItemStorage);

let NANO_SABER_DURABILITY = Item.getMaxDamage(ItemID.nanoSaber);

Item.registerIconOverrideFunction(ItemID.nanoSaberActive, function(item, name){
	return {name: "nano_saber_active", meta: World.getThreadTime()%2}
});

Recipes.addShaped({id: ItemID.nanoSaber, count: 1, data: NANO_SABER_DURABILITY}, [
	"ca ",
	"ca ",
	"bxb"
], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], ChargeItemRegistry.transportEnergy);

ToolAPI.registerSword(ItemID.nanoSaber, {level: 0, durability: NANO_SABER_DURABILITY, damage: 4}, {
	damage: 0,
	onBroke: function(item){
		return true;
	},
	onAttack: function(item, mob){
		return true;
	}
});

ToolAPI.registerSword(ItemID.nanoSaberActive, {level: 0, durability: NANO_SABER_DURABILITY, damage: 20}, {
	damage: 0,
	onBroke: function(item){
		return true;
	},
	onAttack: function(item, mob){
		return true;
	}
});

let nanoSaberActivationTime = 0;
let nanoSaberSound = null;
Item.registerNoTargetUseFunction("nanoSaber", function(item){
	if(item.data < NANO_SABER_DURABILITY){
		Player.setCarriedItem(ItemID.nanoSaberActive, 1, item.data);
		if(nanoSaberSound) nanoSaberSound.stop();
		nanoSaberSound = SoundAPI.playSound("Tools/Nanosaber/NanosaberPowerup.ogg");
		nanoSaberActivationTime = World.getThreadTime();
	}
});

Item.registerNoTargetUseFunction("nanoSaberActive", function(item){
	if(nanoSaberActivationTime > 0){
		let discharge = World.getThreadTime() - nanoSaberActivationTime;
		item.data = Math.min(item.data + discharge*64, NANO_SABER_DURABILITY);
		nanoSaberActivationTime = 0;
	}
	Player.setCarriedItem(ItemID.nanoSaber, 1, item.data);
});

Callback.addCallback("tick", function(){
	let item = Player.getCarriedItem();
	if(nanoSaberSound && nanoSaberSound.isPlaying()){
		if(item.id != ItemID.nanoSaberActive)
		nanoSaberSound.stop();
	}
	else if(item.id == ItemID.nanoSaberActive){
		nanoSaberSound = SoundAPI.playSound("Tools/Nanosaber/NanosaberIdle.ogg", true);
	}
	
	if(World.getThreadTime() % 20 == 0){
		for(let i = 9; i < 45; i++){
			let item = Player.getInventorySlot(i);
			if(item.id == ItemID.nanoSaberActive){
				if(nanoSaberActivationTime > 0){
					let discharge = World.getThreadTime() - nanoSaberActivationTime;
					item.data = Math.min(item.data + discharge*64, NANO_SABER_DURABILITY);
					nanoSaberActivationTime = 0;
				} else {
					item.data = Math.min(item.data + 1280, NANO_SABER_DURABILITY);
				}
				if(item.data == NANO_SABER_DURABILITY){
					item.id = ItemID.nanoSaber;
				}
				Player.setInventorySlot(i, item.id, 1, item.data);
			}
		}
	}
});

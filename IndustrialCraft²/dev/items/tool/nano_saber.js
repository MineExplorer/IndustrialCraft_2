IDRegistry.genItemID("nanoSaber");
Item.createItem("nanoSaber", "Nano Saber", {name: "nano_saber", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.nanoSaber, "Eu", 1000000, 2048, 3, "tool", true);
ItemName.setRarity(ItemID.nanoSaber, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaber, ItemName.showItemStorage);

IDRegistry.genItemID("nanoSaberActive");
Item.createItem("nanoSaberActive", "Nano Saber", {name: "nano_saber_active", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.nanoSaberActive, "Eu", 1000000, 2048, 3, "tool");
ItemName.setRarity(ItemID.nanoSaberActive, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaberActive, ItemName.showItemStorage);

const NANO_SABER_DURABILITY = Item.getMaxDamage(ItemID.nanoSaber);

Item.registerIconOverrideFunction(ItemID.nanoSaberActive, function(item, name){
	return {name: "nano_saber_active", meta: World.getThreadTime()%2}
});

Recipes.addShaped({id: ItemID.nanoSaber, count: 1, data: NANO_SABER_DURABILITY}, [
	"ca ",
	"ca ",
	"bxb"
], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], ChargeItemRegistry.transferEnergy);

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

let NanoSaber = {
	activationTime: 0,
	startSound: null,
	idleSound: null,
	
	noTargetUse: function(item){
		if(NANO_SABER_DURABILITY - item.data >= 64){
			Player.setCarriedItem(ItemID.nanoSaberActive, 1, item.data);
			this.startSound = SoundAPI.playSound("Tools/Nanosaber/NanosaberPowerup.ogg");
			this.activationTime = World.getThreadTime();
		}
	},
	
	noTargetUseActive: function(item){
		if(this.activationTime > 0){
			let energyStored = ChargeItemRegistry.getEnergyStored(item);
			item.data = Math.min(item.data + discharge*64, NANO_SABER_DURABILITY);
			this.activationTime = 0;
		}
		if(this.idleSound){
			this.idleSound.stop();
			this.idleSound = null;
		}
		Player.setCarriedItem(ItemID.nanoSaber, 1, item.data);
	},
	
	tick: function(){
		let item = Player.getCarriedItem();
		if(Config.soundEnabled){
			if(item.id == ItemID.nanoSaberActive){
				if(!this.idleSound && (!this.startSound || !this.startSound.isPlaying())){
					this.idleSound = SoundAPI.playSound("Tools/Nanosaber/NanosaberIdle.ogg", true, true);
					this.startSound = null;
				}
			}
			else if(this.idleSound){
				this.idleSound.stop();
				this.idleSound = null;
			}
		}
		
		if(World.getThreadTime() % 20 == 0){
			for(let i = 9; i < 45; i++){
				let item = Player.getInventorySlot(i);
				if(item.id == ItemID.nanoSaberActive){
					if(this.activationTime > 0){
						let discharge = World.getThreadTime() - this.activationTime;
						item.data = Math.min(item.data + discharge*64, NANO_SABER_DURABILITY);
						this.activationTime = 0;
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
	}
}

Item.registerNoTargetUseFunction("nanoSaber", function(item){
	NanoSaber.noTargetUse(item);
});

Item.registerNoTargetUseFunction("nanoSaberActive", function(item){
	NanoSaber.noTargetUseActive(item);
});

Callback.addCallback("LevelLeft", function(){
	NanoSaber.startSound = null;
	NanoSaber.idleSound = null;
});

Callback.addCallback("tick", function(){
	NanoSaber.tick();
});
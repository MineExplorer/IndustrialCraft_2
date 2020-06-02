IDRegistry.genItemID("nanoSaber");
Item.createItem("nanoSaber", "Nano Saber", {name: "nano_saber", meta: 0}, {stack: 1, isTech: true});
Item.setToolRender(ItemID.nanoSaber, true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoSaber, "Eu", 1000000, 2048, 3, "tool", true, true);
ItemName.setRarity(ItemID.nanoSaber, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaber, ItemName.showItemStorage);

IDRegistry.genItemID("nanoSaberActive");
Item.createItem("nanoSaberActive", "Nano Saber", {name: "nano_saber_active", meta: 0}, {stack: 1, isTech: true});
Item.setToolRender(ItemID.nanoSaberActive, true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoSaberActive, "Eu", 1000000, 2048, 3, "tool", true);
ItemName.setRarity(ItemID.nanoSaberActive, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaberActive, ItemName.showItemStorage);

Item.registerIconOverrideFunction(ItemID.nanoSaberActive, function(item, name){
	return {name: "nano_saber_active", meta: World.getThreadTime()%2}
});

Recipes.addShaped({id: ItemID.nanoSaber, count: 1, data: 27}, [
	"ca ",
	"ca ",
	"bxb"
], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], ChargeItemRegistry.transferEnergy);

ToolAPI.registerSword(ItemID.nanoSaber, {level: 0, durability: 27, damage: 4}, {
	damage: 0,
	onBroke: function(item){
		return true;
	},
	onAttack: function(item, mob){
		return true;
	}
});

ToolAPI.registerSword(ItemID.nanoSaberActive, {level: 0, durability: 27, damage: 20}, {
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
	idleSound: null,
	
	noTargetUse: function(item){
		if(ChargeItemRegistry.getEnergyStored(item) >= 64){
			Player.setCarriedItem(ItemID.nanoSaberActive, 1, item.data, item.extra);
			ICAudioManager.playSound("NanosaberPowerup.ogg");
			this.activationTime = World.getThreadTime();
		}
	},
	
	noTargetUseActive: function(item){
		if(this.activationTime > 0){
			let energyStored = ChargeItemRegistry.getEnergyStored(item);
			let discharge = World.getThreadTime() - this.activationTime;
			ChargeItemRegistry.setEnergyStored(Math.max(energyStored - discharge*64, 0));
			this.activationTime = 0;
		}
		/*if(this.idleSound){
			this.idleSound.stop();
			this.idleSound = null;
		}*/
		Player.setCarriedItem(ItemID.nanoSaber, 1, item.data, item.extra);
	},
	
	tick: function(){
		let item = Player.getCarriedItem();
		/*if(Config.soundEnabled){
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
		}*/
		
		if(World.getThreadTime() % 20 == 0){
			for(let i = 0; i < 36; i++){
				let item = Player.getInventorySlot(i);
				if(item.id == ItemID.nanoSaberActive){
					let energyStored = ChargeItemRegistry.getEnergyStored(item);
					if(this.activationTime > 0){
						let discharge = World.getThreadTime() - this.activationTime;
						energyStored = Math.max(energyStored - discharge*64, 0);
						this.activationTime = 0;
					} else {
						energyStored = Math.max(energyStored - 1280, 0);
					}
					if(energyStored < 64){
						item.id = ItemID.nanoSaber;
					}
					ChargeItemRegistry.setEnergyStored(item, energyStored);
					Player.setInventorySlot(i, item.id, 1, item.data, item.extra);
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

Callback.addCallback("tick", function(){
	NanoSaber.tick();
});

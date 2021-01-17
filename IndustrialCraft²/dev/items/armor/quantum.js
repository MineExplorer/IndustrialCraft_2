IDRegistry.genItemID("quantumHelmet");
IDRegistry.genItemID("quantumChestplate");
IDRegistry.genItemID("quantumLeggings");
IDRegistry.genItemID("quantumBoots");

Item.createArmorItem("quantumHelmet", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 5, durability: 1e7, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplate", "Quantum Bodyarmor", {name: "quantum_chestplate"}, {type: "chestplate", armor: 9, durability: 1e7, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggings", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 7, durability: 1e7, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBoots", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 4, durability: 1e7, texture: "armor/quantum_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.quantumHelmet, "Eu", 1e7, 8192, 4, "armor", true);
ChargeItemRegistry.registerItem(ItemID.quantumChestplate, "Eu", 1e7, 8192, 4, "armor", true);
ChargeItemRegistry.registerItem(ItemID.quantumLeggings, "Eu", 1e7, 8192, 4, "armor", true);
ChargeItemRegistry.registerItem(ItemID.quantumBoots, "Eu", 1e7, 8192, 4, "armor", true);

ItemName.setRarity(ItemID.quantumHelmet, 2);
ItemName.setRarity(ItemID.quantumChestplate, 2);
ItemName.setRarity(ItemID.quantumLeggings, 2);
ItemName.setRarity(ItemID.quantumBoots, 2);

Item.registerNameOverrideFunction(ItemID.quantumHelmet, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumChestplate, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumLeggings, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumBoots, ItemName.showItemStorage);

IDRegistry.genItemID("quantumHelmetUncharged");
IDRegistry.genItemID("quantumChestplateUncharged");
IDRegistry.genItemID("quantumLeggingsUncharged");
IDRegistry.genItemID("quantumBootsUncharged");

Item.createArmorItem("quantumHelmetUncharged", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 2, durability: 1e7, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplateUncharged", "Quantum Bodyarmor", {name: "quantum_chestplate"}, {type: "chestplate", armor: 6, durability: 1e7, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggingsUncharged", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 3, durability: 1e7, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBootsUncharged", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 2, durability: 1e7, texture: "armor/quantum_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.quantumHelmetUncharged, 1e7, 8192, 4, "armor");
ChargeItemRegistry.registerItem(ItemID.quantumChestplateUncharged, 1e7, 8192, 4, "armor");
ChargeItemRegistry.registerItem(ItemID.quantumLeggingsUncharged, 1e7, 8192, 4, "armor");
ChargeItemRegistry.registerItem(ItemID.quantumBootsUncharged, 1e7, 8192, 4, "armor");

ItemName.setRarity(ItemID.quantumHelmetUncharged, 2);
ItemName.setRarity(ItemID.quantumChestplateUncharged, 2);
ItemName.setRarity(ItemID.quantumLeggingsUncharged, 2);
ItemName.setRarity(ItemID.quantumBootsUncharged, 2);

Item.registerNameOverrideFunction(ItemID.quantumHelmetUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumChestplateUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumLeggingsUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumBootsUncharged, ItemName.showItemStorage);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: ItemID.quantumHelmet, count: 1, data: Item.getMaxDamage(ItemID.quantumHelmet)}, [
		"a#a",
		"bxb",
		"cqc"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoHelmet, -1, 'q', ItemID.hazmatHelmet, 0, 'a', ItemID.plateReinforcedIridium, 0, 'b', BlockID.reinforcedGlass, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
	
	Recipes.addShaped({id: ItemID.quantumChestplate, count: 1, data: Item.getMaxDamage(ItemID.quantumChestplate)}, [
		"bxb",
		"a#a",
		"aca"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoChestplate, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0, 'c', ItemID.jetpack, -1], ChargeItemRegistry.transferEnergy);
	
	Recipes.addShaped({id: ItemID.quantumLeggings, count: 1, data: Item.getMaxDamage(ItemID.quantumLeggings)}, [
		"m#m",
		"axa",
		"c c"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoLeggings, -1, 'a', ItemID.plateReinforcedIridium, 0, 'm', BlockID.machineBlockBasic, 0, 'c', 348, 0], ChargeItemRegistry.transferEnergy);
	
	Recipes.addShaped({id: ItemID.quantumBoots, count: 1, data: Item.getMaxDamage(ItemID.quantumBoots)}, [
		"axa",
		"b#b"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoBoots, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.rubberBoots, 0], ChargeItemRegistry.transferEnergy);
});


MachineRecipeRegistry.registerRecipesFor("quantum-armor-charge", {
	"ItemID.quantumHelmet": {charged: ItemID.quantumHelmet, uncharged: ItemID.quantumHelmetUncharged},
	"ItemID.quantumHelmetUncharged": {charged: ItemID.quantumHelmet, uncharged: ItemID.quantumHelmetUncharged},
	"ItemID.quantumChestplate": {charged: ItemID.quantumChestplate, uncharged: ItemID.quantumChestplateUncharged},
	"ItemID.quantumChestplateUncharged": {charged: ItemID.quantumChestplate, uncharged: ItemID.quantumChestplateUncharged},
	"ItemID.quantumLeggings": {charged: ItemID.quantumLeggings, uncharged: ItemID.quantumLeggingsUncharged},
	"ItemID.quantumLeggingsUncharged": {charged: ItemID.quantumLeggings, uncharged: ItemID.quantumLeggingsUncharged},
	"ItemID.quantumBoots": {charged: ItemID.quantumBoots, uncharged: ItemID.quantumBootsUncharged},
	"ItemID.quantumBootsUncharged": {charged: ItemID.quantumBoots, uncharged: ItemID.quantumBootsUncharged},
}, true);

UIbuttons.setArmorButton(ItemID.quantumHelmet, "button_nightvision");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_fly");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_hover");
UIbuttons.setArmorButton(ItemID.quantumBoots, "button_jump");

var runTime = 0;

var QUANTUM_ARMOR_FUNCS = {
	hurt: function(params, slot, index, maxDamage){
		var type = params.type;
		if(type==2 || type==3 || type==11){
			var energy = params.damage * 2500;
			slot.data = Math.min(slot.data + energy, maxDamage);
		}
		if(type==5 && (index==1 || index==3)){
			var damage = 0;
			var vel = Player.getVelocity().y;
			var time = vel / -0.06;
			var height = 0.06 * time*time / 2;
			if(height < 22){
				if(height < 17){
					var damage = Math.floor(height) - 3;
				} else {
					var damage = Math.ceil(height)- 3;
				}
			}
			if(index==1){
				if(damage <= 0 && height < 22){
					Game.prevent();
				}
				else if(params.damage > damage){
					Entity.setHealth(player, Entity.getHealth(player) + params.damage - damage);
				}
			}
			if(index==3 && slot.data + 2500 <= maxDamage && (damage > 0 || height >= 22)){
				params.damage = damage;
				damage = Math.min(params.damage, Math.floor((maxDamage - slot.data)/2500));
				if(params.damage > damage){
					Entity.setHealth(player, Entity.getHealth(player) + damage);
				} else {
					Game.prevent();
				}
				slot.data = slot.data + damage*2500;
			}
		}
		if(type==9 && index==0 && slot.data + 500 <= maxDamage){
			Game.prevent();
			Entity.addEffect(player, MobEffect.waterBreathing, 1, 2);
			slot.data += 500;
		}
		Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
		return false;
	},
	
	tick: function(slot, index, maxDamage){
		var armor = MachineRecipeRegistry.getRecipeResult("quantum-armor-charge", slot.id);
		if(slot.data >= maxDamage){
			slot.id = armor.uncharged;
			Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
		}
		else{
			switch (index){
			case 0:
				if(RadiationAPI.playerRad > 0){
					if(maxDamage - slot.data >= 100000){
						RadiationAPI.playerRad = 0;
						Entity.clearEffect(player, MobEffect.poison);
						slot.data += 100000;
						Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
					}
				} else {
					Entity.clearEffect(player, MobEffect.poison);
				}
				Entity.clearEffect(player, MobEffect.wither);
				
				var hunger = Player.getHunger();
				if(hunger < 20){
					var i = World.getThreadTime%36+9;
					var item = Player.getInventorySlot(i);
					if(item.id == ItemID.tinCanFull){
						var count = Math.min(20 - hunger, item.count);
						Player.setHunger(hunger + count);
						item.count -= count;
						Player.setInventorySlot(i, item.count ? item.id : 0, item.count, item.data);
						Player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
						break;
					}
				}
				
				var extra = slot.extra;
				var nightvision = extra? extra.getBoolean("nv") : false;
				if(nightvision){
					var coords = Player.getPosition();
					var time = World.getWorldTime()%24000;
					if(World.getLightLevel(coords.x, coords.y, coords.z)==15 && time <= 12000){
						Entity.addEffect(player, MobEffect.blindness, 1, 25);
					}
					Entity.addEffect(player, MobEffect.nightVision, 1, 225);
					if(World.getThreadTime()%20==0){
						slot.data = Math.min(slot.data+20, maxDamage);
						Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
					}
				}
			break;
			case 1:
				var extra = slot.extra;
				var hover = extra? extra.getBoolean("hover") : false;
				if(hover && slot.data < maxDamage){
					var vel = Player.getVelocity();
					if(vel.y.toFixed(4) == fallVelocity){
						extra.putBoolean("hover", false);
						Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
						Game.message("§4" + Translation.translate("Hover mode disabled"));
					}
					else if(vel.y < -0.1){
						Player.setVelocity(vel.x, -0.1, vel.z);
						if(World.getThreadTime() % 5 == 0){
							slot.data = Math.min(slot.data+20, maxDamage);
							Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
						}
					}
				}
				Entity.setFire(player, 0, true);
			break;
			case 2:
				var vel = Player.getVelocity();
				var horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z)
				if(horizontalVel > 0.15){
					if(vel.y.toFixed(4) == fallVelocity){runTime++;}
				}
				else{runTime = 0;}
				if(runTime > 2 && !Player.getFlying()){
					Entity.addEffect(player, MobEffect.movementSpeed, 6, 5);
					if(World.getThreadTime()%5==0){
						slot.data = Math.min(slot.data + Math.floor(horizontalVel*600), maxDamage);
						Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
					}
				}
			break;
			}
			if(slot.id != armor.charged){
				slot.id = armor.charged;
				Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
			}
		}
		return false;
	}
};

Armor.registerFuncs("quantumHelmet", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumHelmetUncharged", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumChestplate", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumChestplateUncharged", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumLeggings", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumLeggingsUncharged", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumBoots", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumBootsUncharged", QUANTUM_ARMOR_FUNCS);

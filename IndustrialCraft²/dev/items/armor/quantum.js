IDRegistry.genItemID("quantumHelmet");
IDRegistry.genItemID("quantumChestplate");
IDRegistry.genItemID("quantumLeggings");
IDRegistry.genItemID("quantumBoots");

Item.createArmorItem("quantumHelmet", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 5, durability: 8333, texture: "armor/quantum_1.png", isTech: false});
Item.createArmorItem("quantumChestplate", "Quantum Chestplate", {name: "quantum_chestplate"}, {type: "chestplate", armor: 9, durability: 8333, texture: "armor/quantum_1.png", isTech: false});
Item.createArmorItem("quantumLeggings", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 7, durability: 8333, texture: "armor/quantum_2.png", isTech: false});
Item.createArmorItem("quantumBoots", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 4, durability: 8333, texture: "armor/quantum_1.png", isTech: false});

ChargeItemRegistry.registerItem(ItemID.quantumHelmet, "Eu", 10000000, 3);
ChargeItemRegistry.registerItem(ItemID.quantumChestplate, "Eu", 10000000, 3);
ChargeItemRegistry.registerItem(ItemID.quantumLeggings, "Eu", 10000000, 3);
ChargeItemRegistry.registerItem(ItemID.quantumBoots, "Eu", 10000000, 3);

Item.registerNameOverrideFunction(ItemID.quantumHelmet, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumChestplate, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumLeggings, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumBoots, RARE_ENERGY_ITEM_NAME);

IDRegistry.genItemID("quantumHelmetUncharged");
IDRegistry.genItemID("quantumChestplateUncharged");
IDRegistry.genItemID("quantumLeggingsUncharged");
IDRegistry.genItemID("quantumBootsUncharged");

Item.createArmorItem("quantumHelmetUncharged", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 2, durability: 8333, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplateUncharged", "Quantum Chestplate", {name: "quantum_chestplate"}, {type: "chestplate", armor: 6, durability: 8333, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggingsUncharged", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 3, durability: 8333, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBootsUncharged", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 2, durability: 8333, texture: "armor/quantum_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.quantumHelmetUncharged, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumChestplateUncharged, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumLeggingsUncharged, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumBootsUncharged, 10000000, 3, true);

Item.registerNameOverrideFunction(ItemID.quantumHelmetUncharged, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumChestplateUncharged, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumLeggingsUncharged, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumBootsUncharged, RARE_ENERGY_ITEM_NAME);


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

UIbuttons.setButton(ItemID.quantumHelmet, "button_nightvision");
UIbuttons.setButton(ItemID.quantumChestplate, "button_fly");
UIbuttons.setButton(ItemID.quantumChestplate, "button_hover");
UIbuttons.setButton(ItemID.quantumBoots, "button_jump");

var runTime = 0;

var QUANTUM_ARMOR_FUNCS_CHARGED = {
	hurt: function(params, item, index, maxDamage){
		var type = params.type;
		if(type==2 || type==3 || type==11){
			var energy = params.damage * 900;
			item.data = Math.min(item.data + energy, maxDamage);
		}
		if(type==5 && (index==1 || index==3)){
			var damage = 0;
			var vel = Player.getVelocity().y;
			var time = vel / -0.06;
			var height = 0.06 * time*time / 2;
			if(height < 22){
				if(height < 17){
					var damage = Math.floor(height) - 3;
				}else{
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
			if(index==3 && item.data + 900 <= maxDamage && (damage > 0 || height >= 22)){
				params.damage = damage;
				damage = Math.min(params.damage, Math.floor((maxDamage - item.data)/900));
				if(params.damage > damage){
					Entity.setHealth(player, Entity.getHealth(player) + damage);
				}
				else{
					Game.prevent();
				}
				item.data = Math.min(item.data + damage*900, maxDamage);
			}
		}
		Player.setArmorSlot(index, item.id, 1, item.data, item.extra);
		return false;
	},
	
	tick: function(slot, index, maxDamage){
		var armor = MachineRecipeRegistry.getRecipeResult("quantum-armor-charge", slot.id);
		if(slot.data >= maxDamage){
			slot.id = armor.uncharged;
			return true;
		}
		else{
			switch (index){
			case 0:
				Entity.clearEffect(player, MobEffect.poison);
				Entity.clearEffect(player, MobEffect.wither);
				
				var extra = slot.extra;
				if(extra){
					var nightvision = extra.getBoolean("nv");
				}
				if(nightvision){
					var coords = Player.getPosition();
					var time = World.getWorldTime()%24000;
					if(World.getLightLevel(coords.x, coords.y, coords.z)==15 && time >= 0 && time <= 12000){
						Entity.addEffect(player, MobEffect.blindness, 1, 25);
					}
					Entity.addEffect(player, MobEffect.nightVision, 1, 225);
					if(World.getThreadTime()%20==0){
						slot.data = Math.min(slot.data+20, maxDamage);
						return true;
					}
				}
			break;
			case 1:
				var extra = slot.extra;
				if(extra){
					var hover = extra.getBoolean("hover");
				}
				if(hover && slot.data < maxDamage){
					var vel = Player.getVelocity();
					if(vel.y < -0.1){
						Player.setVelocity(vel.x, -0.1, vel.z);
						if(World.getThreadTime() % 5 == 0){
							slot.data = Math.min(slot.data+20, maxDamage);
							return true;
						}
					}
				}
				var hunger = Player.getHunger();
				if(hunger < 20){
					for(var i = 0; i < 36; i++){
						var slot = Player.getInventorySlot(i);
						if(slot.id == ItemID.tinCanFull){
							Player.setInventorySlot(i, slot.id, slot.count - 1, 0);
							Player.setHunger(hunger + 1);
							Player.addItemToInventory(ItemID.tinCanEmpty, 1, 0);
							break;
						}
					}
				}
				//Entity.addEffect(player, MobEffect.fireResistance, 1, 2);
			break;
			case 2:
				var vel = Player.getVelocity();
				var horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z)
				if(horizontalVel > 0.15){
					if(Math.abs(vel.y - fallVelocity) < 0.001){runTime++;}
				}
				else{runTime = 0;}
				if(runTime > 2 && !Player.getFlying()){
					Entity.addEffect(player, MobEffect.movementSpeed, 6, 5);
					if(World.getThreadTime()%5==0){
						slot.data = Math.min(slot.data + Math.floor(horizontalVel*600), maxDamage);
						return true;
					}
				}
			break;
			}
			if(slot.id != armor.charged){
				slot.id = armor.charged;
				return true;
			}
		}
		return false;
	}
};

Armor.registerFuncs("quantumHelmet", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumHelmetUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumChestplate", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumChestplateUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumLeggings", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumLeggingsUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumBoots", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumBootsUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.quantumHelmet, count: 1, data: Item.getMaxDamage(ItemID.quantumHelmet)}, [
		"a#a",
		"bxb"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoHelmet, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', BlockID.reinforcedGlass, 0], ChargeItemRegistry.transportEnergy);
	
	Recipes.addShaped({id: ItemID.quantumChestplate, count: 1, data: Item.getMaxDamage(ItemID.quantumChestplate)}, [
		"bxb",
		"a#a",
		"aca"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoChestplate, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0, 'c', ItemID.jetpack, -1], ChargeItemRegistry.transportEnergy);
	
	Recipes.addShaped({id: ItemID.quantumLeggings, count: 1, data: Item.getMaxDamage(ItemID.quantumLeggings)}, [
		"m#m",
		"axa",
		"c c"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoLeggings, -1, 'a', ItemID.plateReinforcedIridium, 0, 'm', BlockID.machineBlockBasic, 0, 'c', 348, 0], ChargeItemRegistry.transportEnergy);
	
	Recipes.addShaped({id: ItemID.quantumBoots, count: 1, data: Item.getMaxDamage(ItemID.quantumBoots)}, [
		"axa",
		"b#b"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoBoots, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0], ChargeItemRegistry.transportEnergy);
});

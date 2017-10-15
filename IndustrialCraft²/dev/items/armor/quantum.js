IDRegistry.genItemID("quantumHelmet");
IDRegistry.genItemID("quantumChestplate");
IDRegistry.genItemID("quantumLeggings");
IDRegistry.genItemID("quantumBoots");

Item.createArmorItem("quantumHelmet", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 5, durability: 8333, texture: "armor/quantum_1.png", isTech: false});
Item.createArmorItem("quantumChestplate", "Quantum Chestplate", {name: "quantum_chestplate"}, {type: "chestplate", armor: 9, durability: 8333, texture: "armor/quantum_1.png", isTech: false});
Item.createArmorItem("quantumLeggings", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 7, durability: 8333, texture: "armor/quantum_2.png", isTech: false});
Item.createArmorItem("quantumBoots", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 4, durability: 8333, texture: "armor/quantum_1.png", isTech: false});

ChargeItemRegistry.registerItem(ItemID.quantumHelmet, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumChestplate, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumLeggings, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumBoots, 10000000, 3, true);

Item.registerNameOverrideFunction(ItemID.quantumHelmet, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumChestplate, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumLeggings, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumBoots, RARE_ENERGY_ITEM_NAME);

IDRegistry.genItemID("quantumHelmetUncharged");
IDRegistry.genItemID("quantumChestplateUncharged");
IDRegistry.genItemID("quantumLeggingsUncharged");
IDRegistry.genItemID("quantumBootsUncharged");

Item.createArmorItem("quantumHelmetUncharged", "Quantum Helmet", {name: "armor_quantum_helmet"}, {type: "helmet", armor: 2, durability: 8333, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplateUncharged", "Quantum Chestplate", {name: "armor_quantum_chestplate"}, {type: "chestplate", armor: 6, durability: 8333, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggingsUncharged", "Quantum Leggings", {name: "armor_quantum_leggings"}, {type: "leggings", armor: 3, durability: 8333, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBootsUncharged", "Quantum Boots", {name: "armor_quantum_boots"}, {type: "boots", armor: 2, durability: 8333, texture: "armor/quantum_1.png", isTech: true});

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
UIbuttons.setButton(ItemID.quantumBoots, "button_jump");

var runTime = 0;

var QUANTUM_ARMOR_FUNCS_CHARGED = {
	hurt: function(params, item, index, maxDamage){
		var type = params.type;
		if(type==2 || type==3 || type==11){
			var energy = params.damage * 900;
			item.data = Math.min(item.data + energy, maxDamage);
		}
		if(type==5 && index==3 && item.data + 900 <= maxDamage){
			var damage = Math.min(params.damage, Math.floor((maxDamage - item.data)/900));
			if(params.damage > damage){
				Entity.setHealth(player, Entity.getHealth(player) + damage);
			}
			else{
				Game.prevent();
			}
			item.data = Math.min(item.data + damage*900, maxDamage);
		}
		return true;
	},
	
	tick: function(slot, index, maxDamage){
		var armor = MachineRecipeRegistry.getRecipeResult("quantum-armor-charge", slot.id);
		if(slot.data >= maxDamage){
			slot.id = armor.uncharged;
		}
		else{
			if(slot.id != armor.charged){
				slot.id = armor.charged;
			}
			switch (index){
			case 0:
				Entity.clearEffect(player, MobEffect.poison);
				Entity.clearEffect(player, MobEffect.wither);
				if(UIbuttons.nightvision){
					var coords = Player.getPosition();
					if(World.getLightLevel(coords.x, coords.y, coords.z)==15){
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
				Entity.addEffect(player, MobEffect.fireResistance, 1, 2);
			break;
			case 2:
				var vel = Player.getVelocity();
				var horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z)
				if(horizontalVel > 0.15){
					if(Math.abs(vel.y+0.078) < 0.001){runTime++;}
				}
				else{runTime = 0;}
				if(runTime > 2 && !Player.getFlying()){
					if(World.getThreadTime()%10==0){
						slot.data = Math.min(slot.data + Math.floor(horizontalVel*1200), maxDamage);
						return true;
					}
					Entity.addEffect(player, MobEffect.movementSpeed, 5, 3);
				}
			break;
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
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoHelmet, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', BlockID.reinforcedGlass, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.quantumChestplate, count: 1, data: Item.getMaxDamage(ItemID.quantumChestplate)}, [
		"bxb",
		"a#a",
		"aca"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoChestplate, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0, 'c', ItemID.jetpack, -1], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.quantumLeggings, count: 1, data: Item.getMaxDamage(ItemID.quantumLeggings)}, [
		"m#m",
		"axa",
		"c c"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoLeggings, -1, 'a', ItemID.plateReinforcedIridium, 0, 'm', BlockID.machineBlockBasic, 0, 'c', 348, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.quantumBoots, count: 1, data: Item.getMaxDamage(ItemID.quantumBoots)}, [
		"axa",
		"b#b"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoBoots, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
});

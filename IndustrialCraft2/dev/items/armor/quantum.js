IDRegistry.genItemID("quantumHelmet");
IDRegistry.genItemID("quantumChestplate");
IDRegistry.genItemID("quantumLeggings");
IDRegistry.genItemID("quantumBoots");

Item.createArmorItem("quantumHelmet", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 5, durability: 27, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplate", "Quantum Bodyarmor", {name: "quantum_chestplate"}, {type: "chestplate", armor: 9, durability: 27, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggings", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 7, durability: 27, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBoots", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 4, durability: 27, texture: "armor/quantum_1.png", isTech: true});

ChargeItemRegistry.registerExtraItem(ItemID.quantumHelmet, "Eu", 10000000, 8192, 4, "armor", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumChestplate, "Eu", 10000000, 8192, 4, "armor", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumLeggings, "Eu", 10000000, 8192, 4, "armor", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumBoots, "Eu", 10000000, 8192, 4, "armor", true, true);

ItemName.setRarity(ItemID.quantumHelmet, 2);
ItemName.setRarity(ItemID.quantumChestplate, 2);
ItemName.setRarity(ItemID.quantumLeggings, 2);
ItemName.setRarity(ItemID.quantumBoots, 2);

Item.registerNameOverrideFunction(ItemID.quantumHelmet, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumChestplate, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumLeggings, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumBoots, ItemName.showItemStorage);

RadiationAPI.registerHazmatArmor(ItemID.quantumHelmet);
RadiationAPI.registerHazmatArmor(ItemID.quantumChestplate);
RadiationAPI.registerHazmatArmor(ItemID.quantumLeggings);
RadiationAPI.registerHazmatArmor(ItemID.quantumBoots);


IDRegistry.genItemID("quantumHelmetUncharged");
IDRegistry.genItemID("quantumChestplateUncharged");
IDRegistry.genItemID("quantumLeggingsUncharged");
IDRegistry.genItemID("quantumBootsUncharged");

Item.createArmorItem("quantumHelmetUncharged", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 2, durability: 27, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplateUncharged", "Quantum Bodyarmor", {name: "quantum_chestplate"}, {type: "chestplate", armor: 6, durability: 27, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggingsUncharged", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 3, durability: 27, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBootsUncharged", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 2, durability: 27, texture: "armor/quantum_1.png", isTech: true});

ChargeItemRegistry.registerExtraItem(ItemID.quantumHelmetUncharged, 10000000, 8192, 4, "armor", true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumChestplateUncharged, 10000000, 8192, 4, "armor", true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumLeggingsUncharged, 10000000, 8192, 4, "armor", true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumBootsUncharged, 10000000, 8192, 4, "armor", true);

ItemName.setRarity(ItemID.quantumHelmetUncharged, 2);
ItemName.setRarity(ItemID.quantumChestplateUncharged, 2);
ItemName.setRarity(ItemID.quantumLeggingsUncharged, 2);
ItemName.setRarity(ItemID.quantumBootsUncharged, 2);

Item.registerNameOverrideFunction(ItemID.quantumHelmetUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumChestplateUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumLeggingsUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumBootsUncharged, ItemName.showItemStorage);


Callback.addCallback("PreLoaded", function() {
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


var QuantumArmor = {
	runTime: 0,
	chargedIDs: [ItemID.quantumHelmet, ItemID.quantumChestplate, ItemID.quantumLeggings, ItemID.quantumBoots],
	getCharged: function(index) {
		return this.chargedIDs[index];
	},
	canAbsorbDamage: function(damage) {
		for (var i = 0; i < 4; i++) {
			var slot = Player.getArmorSlot(i);
			if (this.getCharged(i) != slot.id || damage && ChargeItemRegistry.getEnergyStored(slot) < 2500 * damage)
				return false;
		}
		return true;
	}
}

Callback.addCallback("EntityHurt", function(attacker, victim, damage, type) {
	if (victim == player && Game.getGameMode() != 1 && damage > 0 && (type == 2 || type == 3 || type == 11) && QuantumArmor.canAbsorbDamage(damage)) {
		Game.prevent();
		if (type == 2) {	
			runOnMainThread(function() {
				Entity.damageEntity(player, 0, type, {attacker: attacker, bool1: true});
			});
		}
		if (type == 3) {	
			runOnMainThread(function() {
				Entity.damageEntity(player, 0, type, {attacker: -1, bool1: true});
			});
			var vel = Entity.getVelocity(attacker);
			var hs = Math.sqrt(vel.x * vel.x + vel.z * vel.z)
			Player.addVelocity(vel.x * 0.3 / hs, 0.25, vel.z * 0.3 / hs);
			Entity.remove(attacker);
		}
	}
});

Callback.addCallback("Explosion", function(coords, params) {
	var pos = Player.getPosition();
	var distance = Entity.getDistanceBetweenCoords(coords, pos);
	if (distance <= params.power && QuantumArmor.canAbsorbDamage()) {
		Entity.damageEntity(Player.get(), 0, 11, {attacker: params.entity, bool1: true});
	}
});

var QUANTUM_ARMOR_FUNCS = {
	hurt: function(params, slot, index, maxDamage) {
		var type = params.type;
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		if (energyStored >= 2500 && (type == 2 || type == 3 || type == 11) && params.damage > 0) {
			var energy = params.damage * 2500;
			ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - energy, 0));
			return true;
		}
		if (index == 0 && type == 9 && energyStored >= 500) {
			Game.prevent();
			Entity.addEffect(player, MobEffect.waterBreathing, 1, 60);
			ChargeItemRegistry.setEnergyStored(slot, energyStored - 500);
			return true;
		}
		if (index == 1 && type == 5) {
			Utils.fixFallDamage(params.damage);
		}
		if (index == 3) {
			if (type == 5 && energyStored >= 2500) {
				var damage = Math.min(Utils.getFallDamage(), params.damage);
				if (damage > 0) {
					var damageReduce = Math.min(damage, parseInt(energyStored / 2500));
					var damageTaken = damage - damageReduce;
					if (damageTaken > 0) {
						Entity.setHealth(player, Entity.getHealth(player) + params.damage - damageTaken);
					} else {
						Game.prevent();
					}
					ChargeItemRegistry.setEnergyStored(slot, energyStored - damageReduce * 2500);
					return true;
				}
			}
			if (type == 22 && energyStored >= 2500) {
				Game.prevent();
				ChargeItemRegistry.setEnergyStored(slot, energyStored - 2500);
				return true;
			}
		}
		return false;
	},
	
	tick: function(slot, index, maxDamage) {
		var armor = MachineRecipeRegistry.getRecipeResult("quantum-armor-charge", slot.id);
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		var newId = energyStored < 2500 ? armor.uncharged : armor.charged;
		if(slot.id != newId){
			slot.id = newId;
			Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
		}
		if (energyStored > 0) {
			switch (index) {
			case 0:
				var newEnergyStored = energyStored;
				if (RadiationAPI.playerRad > 0) {
					if (energyStored >= 100000) {
						RadiationAPI.playerRad = 0;
						Entity.clearEffect(player, MobEffect.poison);
						newEnergyStored -= 100000;
					}
				} else {
					Entity.clearEffect(player, MobEffect.poison);
				}
				Entity.clearEffect(player, MobEffect.wither);
				
				var hunger = Player.getHunger();
				if (hunger < 20 && newEnergyStored >= 500) {
					var i = World.getThreadTime%36;
					var item = Player.getInventorySlot(i);
					if (item.id == ItemID.tinCanFull) {
						var count = Math.min(20 - hunger, item.count);
						Player.setHunger(hunger + count);
						item.count -= count;
						Player.setInventorySlot(i, item.count ? item.id : 0, item.count, item.data);
						Player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
						newEnergyStored -= 500;
						break;
					}
				}
				// night vision
				if (newEnergyStored > 0 && slot.extra && slot.extra.getBoolean("nv")) {
					var coords = Player.getPosition();
					var time = World.getWorldTime()%24000;
					if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
						Entity.addEffect(Player.get(), MobEffect.blindness, 1, 25);
						Entity.clearEffect(Player.get(), MobEffect.nightVision);
					} else {
						Entity.addEffect(Player.get(), MobEffect.nightVision, 1, 225);
					}
					if (World.getThreadTime()%20 == 0) {
						newEnergyStored = Math.max(newEnergyStored - 20, 0);
					}
				}
				
				if (energyStored != newEnergyStored) {
					ChargeItemRegistry.setEnergyStored(slot, newEnergyStored);
					Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
				}
			break;
			case 1:
				if (slot.extra && slot.extra.getBoolean("hover")) {
					Utils.resetFallHeight();
					var vel = Player.getVelocity();
					if (vel.y.toFixed(4) == fallVelocity || energyStored < 8) {
						slot.extra.putBoolean("hover", false);
						Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
						Game.message("§4" + Translation.translate("Hover mode disabled"));
					}
					else if (vel.y < -0.1) {
						Player.addVelocity(0, Math.min(0.25, -0.1 - vel.y), 0);
						if (World.getThreadTime()%5 == 0) {
							ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
							Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
						}
					}
				}
				Entity.setFire(player, 0, true);
			break;
			case 2:
				var vel = Player.getVelocity();
				var horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z);
				// Game.tipMessage(horizontalVel);
				if (horizontalVel <= 0.15) {
					QuantumArmor.runTime = 0;
				}
				else if (vel.y.toFixed(4) == fallVelocity) {
					QuantumArmor.runTime++;
				}
				if (QuantumArmor.runTime > 2 && !Player.getFlying()) {
					Entity.addEffect(player, MobEffect.movementSpeed, 6, 5);
					if (World.getThreadTime()%5 == 0) {
						ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - Math.floor(horizontalVel*600)));
						Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
					}
				}
			break;
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

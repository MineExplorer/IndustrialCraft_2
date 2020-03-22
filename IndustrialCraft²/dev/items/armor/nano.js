IDRegistry.genItemID("nanoHelmet");
IDRegistry.genItemID("nanoChestplate");
IDRegistry.genItemID("nanoLeggings");
IDRegistry.genItemID("nanoBoots");

Item.createArmorItem("nanoHelmet", "Nano Helmet", {name: "nano_helmet"}, {type: "helmet", armor: 4, durability: 1000000, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplate", "Nano Bodyarmor", {name: "nano_chestplate"}, {type: "chestplate", armor: 8, durability: 1000000, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggings", "Nano Leggings", {name: "nano_leggings"}, {type: "leggings", armor: 6, durability: 1000000, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBoots", "Nano Boots", {name: "nano_boots"}, {type: "boots", armor: 4, durability: 1000000, texture: "armor/nano_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.nanoHelmet, "Eu",1000000, 2048, 3, "armor", true);
ChargeItemRegistry.registerItem(ItemID.nanoChestplate, "Eu", 1000000, 2048, 3, "armor", true);
ChargeItemRegistry.registerItem(ItemID.nanoLeggings, "Eu", 1000000, 2048, 3, "armor", true);
ChargeItemRegistry.registerItem(ItemID.nanoBoots, "Eu", 1000000, 2048, 3, "armor", true);

ItemName.setRarity(ItemID.nanoHelmet, 1);
ItemName.setRarity(ItemID.nanoChestplate, 1);
ItemName.setRarity(ItemID.nanoLeggings, 1);
ItemName.setRarity(ItemID.nanoBoots, 1);

Item.registerNameOverrideFunction(ItemID.nanoHelmet, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoChestplate, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoLeggings, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoBoots, ItemName.showItemStorage);

IDRegistry.genItemID("nanoHelmetUncharged");
IDRegistry.genItemID("nanoChestplateUncharged");
IDRegistry.genItemID("nanoLeggingsUncharged");
IDRegistry.genItemID("nanoBootsUncharged");

Item.createArmorItem("nanoHelmetUncharged", "Nano Helmet", {name: "nano_helmet"}, {type: "helmet", armor: 2, durability: 1000000, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplateUncharged", "Nano Bodyarmor", {name: "nano_chestplate"}, {type: "chestplate", armor: 6, durability: 1000000, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggingsUncharged", "Nano Leggings", {name: "nano_leggings"}, {type: "leggings", armor: 3, durability: 1000000, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBootsUncharged", "Nano Boots", {name: "nano_boots"}, {type: "boots", armor: 2, durability: 1000000, texture: "armor/nano_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.nanoHelmetUncharged, "Eu", 1000000, 2048, 3, "armor");
ChargeItemRegistry.registerItem(ItemID.nanoChestplateUncharged, "Eu", 1000000, 2048, 3, "armor");
ChargeItemRegistry.registerItem(ItemID.nanoLeggingsUncharged, "Eu", 1000000, 2048, 3, "armor");
ChargeItemRegistry.registerItem(ItemID.nanoBootsUncharged, "Eu", 1000000, 2048, 3, "armor");

ItemName.setRarity(ItemID.nanoHelmetUncharged, 1);
ItemName.setRarity(ItemID.nanoChestplateUncharged, 1);
ItemName.setRarity(ItemID.nanoLeggingsUncharged, 1);
ItemName.setRarity(ItemID.nanoBootsUncharged, 1);

Item.registerNameOverrideFunction(ItemID.nanoHelmetUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoChestplateUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoLeggingsUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoBootsUncharged, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.nanoHelmet, count: 1, data: Item.getMaxDamage(ItemID.nanoHelmet)}, [
	"x#x",
	"xax"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0, 'a', ItemID.nightvisionGoggles, -1], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.nanoChestplate, count: 1, data: Item.getMaxDamage(ItemID.nanoChestplate)}, [
	"x x",
	"x#x",
	"xxx"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.nanoLeggings, count: 1, data: Item.getMaxDamage(ItemID.nanoLeggings)}, [
	"x#x",
	"x x",
	"x x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.nanoBoots, count: 1, data: Item.getMaxDamage(ItemID.nanoBoots)}, [
	"x x",
	"x#x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);


MachineRecipeRegistry.registerRecipesFor("nano-armor-charge", {
	"ItemID.nanoHelmet": {charged: ItemID.nanoHelmet, uncharged: ItemID.nanoHelmetUncharged},
	"ItemID.nanoHelmetUncharged": {charged: ItemID.nanoHelmet, uncharged: ItemID.nanoHelmetUncharged},
	"ItemID.nanoChestplate": {charged: ItemID.nanoChestplate, uncharged: ItemID.nanoChestplateUncharged},
	"ItemID.nanoChestplateUncharged": {charged: ItemID.nanoChestplate, uncharged: ItemID.nanoChestplateUncharged},
	"ItemID.nanoLeggings": {charged: ItemID.nanoLeggings, uncharged: ItemID.nanoLeggingsUncharged},
	"ItemID.nanoLeggingsUncharged": {charged: ItemID.nanoLeggings, uncharged: ItemID.nanoLeggingsUncharged},
	"ItemID.nanoBoots": {charged: ItemID.nanoBoots, uncharged: ItemID.nanoBootsUncharged},
	"ItemID.nanoBootsUncharged": {charged: ItemID.nanoBoots, uncharged: ItemID.nanoBootsUncharged},
}, true);

UIbuttons.setArmorButton(ItemID.nanoHelmet, "button_nightvision");

var NANO_ARMOR_FUNCS = {
	hurt: function(params, slot, index, maxDamage){
		var type = params.type;
		if(type==2 || type==3 || type==11){
			var energy = params.damage * 2000;
			slot.data = Math.min(slot.data + energy, maxDamage);
		}
		if(type==5 && index==3 && slot.data + 2000 <= maxDamage){
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
			if(damage > 0 || height >= 22){
				params.damage = damage;
				damage = Math.min(Math.min(params.damage, 9), Math.floor((maxDamage - slot.data)/2000));
				if(params.damage > damage){
					Entity.setHealth(player, Entity.getHealth(player) + damage);
				} else {
					Game.prevent();
				}
				slot.data = Math.min(slot.data + damage * 2000, maxDamage);
			}
		}
		Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
		return false;
	},
	
	tick: function(slot, index, maxDamage){
		var armor = MachineRecipeRegistry.getRecipeResult("nano-armor-charge", slot.id);
		if(slot.data >= maxDamage){
			slot.id = armor.uncharged;
			Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
		}
		else{
			if(index==0){
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
			}
			if(slot.id != armor.charged){
				slot.id = armor.charged;
				Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
			}
		}
		return false;
	}
};

Armor.registerFuncs("nanoHelmet", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoHelmetUncharged", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoChestplate", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoChestplateUncharged", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoLeggings", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoLeggingsUncharged", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoBoots", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoBootsUncharged", NANO_ARMOR_FUNCS);

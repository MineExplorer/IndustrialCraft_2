IDRegistry.genItemID("nanoHelmet");
IDRegistry.genItemID("nanoChestplate");
IDRegistry.genItemID("nanoLeggings");
IDRegistry.genItemID("nanoBoots");

Item.createArmorItem("nanoHelmet", "Nano Helmet", {name: "nano_helmet"}, {type: "helmet", armor: 4, durability: 625, texture: "armor/nano_1.png", isTech: false});
Item.createArmorItem("nanoChestplate", "Nano Chestplate", {name: "nano_chestplate"}, {type: "chestplate", armor: 8, durability: 625, texture: "armor/nano_1.png", isTech: false});
Item.createArmorItem("nanoLeggings", "Nano Leggings", {name: "nano_leggings"}, {type: "leggings", armor: 6, durability: 625, texture: "armor/nano_2.png", isTech: false});
Item.createArmorItem("nanoBoots", "Nano Boots", {name: "nano_boots"}, {type: "boots", armor: 4, durability: 625, texture: "armor/nano_1.png", isTech: false});

ChargeItemRegistry.registerItem(ItemID.nanoHelmet, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.nanoChestplate, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.nanoLeggings, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.nanoBoots, 1000000, 1, true);

Item.registerNameOverrideFunction(ItemID.nanoHelmet, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoChestplate, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoLeggings, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoBoots, ENERGY_ITEM_NAME);

IDRegistry.genItemID("nanoHelmetUncharged");
IDRegistry.genItemID("nanoChestplateUncharged");
IDRegistry.genItemID("nanoLeggingsUncharged");
IDRegistry.genItemID("nanoBootsUncharged");

Item.createArmorItem("nanoHelmetUncharged", "Nano Helmet", {name: "nano_helmet"}, {type: "helmet", armor: 2, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplateUncharged", "Nano Chestplate", {name: "nano_chestplate"}, {type: "chestplate", armor: 6, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggingsUncharged", "Nano Leggings", {name: "nano_leggings"}, {type: "leggings", armor: 3, durability: 625, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBootsUncharged", "Nano Boots", {name: "nano_boots"}, {type: "boots", armor: 2, durability: 625, texture: "armor/nano_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.nanoHelmetUncharged, 1000000, 2, true);
ChargeItemRegistry.registerItem(ItemID.nanoChestplateUncharged, 1000000, 2, true);
ChargeItemRegistry.registerItem(ItemID.nanoLeggingsUncharged, 1000000, 2, true);
ChargeItemRegistry.registerItem(ItemID.nanoBootsUncharged, 1000000, 2, true);

Item.registerNameOverrideFunction(ItemID.nanoHelmetUncharged, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoChestplateUncharged, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoLeggingsUncharged, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoBootsUncharged, ENERGY_ITEM_NAME);


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

UIbuttons.setButton(ItemID.nanoHelmet, "button_nightvision");

var NANO_ARMOR_FUNCS_CHARGED = {
	maxDamage: Item.getMaxDamage(ItemID.nanoHelmet),
	
	hurt: function(params, item, index, maxDamage){
		var type = params.type;
		if(type==2 || type==3 || type==11){
			var energy = params.damage * 30;
			item.data = Math.min(item.data + energy, maxDamage);
		}
		if(type==5 && index==3 && item.data +500 <= maxDamage){
			var damage = Math.min(9, Math.floor((maxDamage - item.data)/500));
			if(params.damage > damage){
				Entity.setHealth(player, Entity.getHealth(player) + damage);
			}
			else{
				Game.prevent();
			}
			item.data = Math.min(item.data + damage * 500, maxDamage);
		}
		return true;
	},
	
	tick: function(slot, index, maxDamage){
		var armor = MachineRecipeRegistry.getRecipeResult("nano-armor-charge", slot.id);
		if(slot.data >= maxDamage){
			slot.id = armor.uncharged;
		}
		else{
			if(index==0 && UIbuttons.nightvision){
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
			if(slot.id != armor.charged){
				slot.id = armor.charged;
				return true;
			}
		}
		return false;
	}
};

Armor.registerFuncs("nanoHelmet", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoHelmetUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoChestplate", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoChestplateUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoLeggings", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoLeggingsUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoBoots", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoBootsUncharged", NANO_ARMOR_FUNCS_CHARGED);


Recipes.addShaped({id: ItemID.nanoHelmet, count: 1, data: Item.getMaxDamage(ItemID.nanoHelmet)}, [
	"x#x",
	"xax"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0, 'a', ItemID.nightvisionGoggles, -1], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoChestplate, count: 1, data: Item.getMaxDamage(ItemID.nanoChestplate)}, [
	"x x",
	"x#x",
	"xxx"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoLeggings, count: 1, data: Item.getMaxDamage(ItemID.nanoLeggings)}, [
	"x#x",
	"x x",
	"x x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoBoots, count: 1, data: Item.getMaxDamage(ItemID.nanoBoots)}, [
	"x x",
	"x#x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

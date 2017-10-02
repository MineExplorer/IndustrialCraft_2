IDRegistry.genItemID("nightvisionGoggles");
Item.createArmorItem("nightvisionGoggles", "Nightvision Goggles", {name: "armor_nightvision"}, {type: "helmet", armor: 1, durability: 30000, texture: "armor/nightvision_1.png", isTech: false});
Armor.preventDamaging(ItemID.nightvisionGoggles);
ChargeItemRegistry.registerItem(ItemID.nightvisionGoggles, 30000, 0, true);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.nightvisionGoggles, count: 1, data: Item.getMaxDamage(ItemID.nightvisionGoggles)}, [
		"bbb",
		"aca",
		"i i"
	], ['a', 102, 0, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitAdvanced, 0, "i", ItemID.casingIron, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
});

var nightVisionEnabled = false;

Armor.registerFuncs("nightvisionGoggles", {
	maxDamage: Item.getMaxDamage(ItemID.nightvisionGoggles),
	tick: function(slot, inventory){
		UIbuttons.enableButton("button_nightvision");
		if(UIbuttons.nightvision && slot.data < this.maxDamage){
			var coords = Player.getPosition();
			if(World.getLightLevel(coords.x, coords.y, coords.z)==15){
				Entity.addEffect(player, MobEffect.blindness, 25, 1);
			}
			Entity.addEffect(player, MobEffect.nightVision, 225, 1);
			if(World.getThreadTime()%4==0){
				slot.data++;
				return true;
			}
		}
		return false;
	}
});

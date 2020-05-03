IDRegistry.genItemID("jetpack");
Item.createArmorItem("jetpack", "Jetpack", {name: "electric_jetpack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/jetpack_1.png", isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.jetpack, "Eu", 30000, 100, 1, "armor", true, true);
Item.registerNameOverrideFunction(ItemID.jetpack, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.jetpack, count: 1, data: 27}, [
	"bcb",
	"bab",
	"d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, 'd', 348, 0]);

UIbuttons.setArmorButton(ItemID.jetpack, "button_fly");
UIbuttons.setArmorButton(ItemID.jetpack, "button_hover");

Armor.registerFuncs("jetpack", {
	hurt: function(params, slot, index, maxDamage){
		if(params.type == 5){
			Utils.fixFallDamage(params.damage);
		}
		return false;
	},
	tick: function(slot, index, maxDamage){
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		var hover = slot.extra? slot.extra.getBoolean("hover") : false;
		if(hover){
			Utils.resetFallHeight();
			var vel = Player.getVelocity();
			if(vel.y.toFixed(4) == fallVelocity || energyStored < 8){
				slot.extra.putBoolean("hover", false);
				Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
				Game.message("§4" + Translation.translate("Hover mode disabled"));
			}
			else if(vel.y < -0.1){
				Player.addVelocity(0, Math.min(0.25, -0.1 - vel.y), 0);
				if(World.getThreadTime()%5 == 0){
					ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
					Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
				}
			}
		}
		return false;
	},
});

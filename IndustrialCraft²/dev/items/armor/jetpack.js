IDRegistry.genItemID("jetpack");
Item.createArmorItem("jetpack", "Jetpack", {name: "jetpack"}, {type: "chestplate", armor: 3, durability: 30000, texture: "armor/jetpack_1.png", isTech: false});
ChargeItemRegistry.registerItem(ItemID.jetpack, "Eu", 30000, 0);
Item.registerNameOverrideFunction(ItemID.jetpack, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.jetpack, count: 1, data: Item.getMaxDamage(ItemID.jetpack)}, [
	"bcb",
	"bab",
	"d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, "d", 348, 0]);

UIbuttons.setButton(ItemID.jetpack, "button_fly");
UIbuttons.setButton(ItemID.jetpack, "button_hover");

Armor.registerFuncs("jetpack", {
	hurt: function(params, item, index, maxDamage){
		if(params.type==5){
			var vel = Player.getVelocity();
			if(vel.y < -0.226 && vel.y > -0.9){
				Game.prevent();
			}
		}
		return false;
	},
	tick: function(slot, index, maxDamage){
		var extra = slot.extra;
		if(extra){
			var hover = extra.getBoolean("hover");
		}
		if(hover && slot.data < maxDamage){
			var vel = Player.getVelocity();
			if(vel.y < -0.1){
				Player.setVelocity(vel.x, -0.1, vel.z);
				if(World.getThreadTime() % 5 == 0){
					Player.setArmorSlot(1, slot.id, 1, Math.min(slot.data+20, maxDamage), extra);
				}
			}
		}
		return false;
	},
});

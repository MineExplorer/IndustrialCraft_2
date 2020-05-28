IDRegistry.genItemID("chainsaw");
Item.createItem("chainsaw", "Chainsaw", {name: "chainsaw", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.chainsaw, "Eu", 30000, 100, 1, "tool", true, true);

Item.registerNameOverrideFunction(ItemID.chainsaw, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.chainsaw, count: 1, data: 27}, [
	" pp",
	"ppp",
	"xp "
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");

ToolType.chainsaw = {
	damage: 4,
	toolDamage: 0,
	blockTypes: ["wood", "wool", "fibre", "plant"],
	onDestroy: function(item, coords, block) {
		if (Block.getDestroyTime(block.id) > 0) {
			if (ICTool.dischargeItem(item, this.toolMaterial.energyPerUse) && (block.id == 18 || block.id == 161)) {
				World.destroyBlock(coords.x, coords.y, coords.z);
				World.drop(coords.x + .5, coords.y + .5, coords.z + .5, block.id, 1, block.data%4);
			}
		}
		return true;
	},
	onBroke: function(item) {return true;},
	onAttack: function(item, mob) {
		var material = this.toolMaterial;
		if (!this.toolDamage) this.toolDamage = material.damage;
		if (ICTool.dischargeItem(item, this.toolMaterial.energyPerUse)) {
			material.damage = this.toolDamage;
		}
		else {
			material.damage = 0;
		}
		return true;
	},
	calcDestroyTime: function(item, coords, block, params, destroyTime, enchant) {
		if (ChargeItemRegistry.getEnergyStored(item) >= this.toolMaterial.energyPerUse) {
			return destroyTime;
		}
		else {
			return params.base;
		}
	},
}

ToolLib.setTool(ItemID.chainsaw, {energyPerUse: 60, level: 3, efficiency: 16, damage: 6}, ToolType.chainsaw);

Callback.addCallback("LocalTick", function() {
	if (!Config.soundEnabled) {return;}
	let item = Player.getCarriedItem();
	let tool = ToolAPI.getToolData(item.id);
	if (item.id == ItemID.chainsaw && ChargeItemRegistry.getEnergyStored(item) >= tool.toolMaterial.energyPerUse) {
		if (!ICAudioManager.isPlaying("ChainsawIdle.ogg")) {
			ICAudioManager.createSource(Player.get(), "ChainsawIdle.ogg", true);
		}
	}
	else if (ICAudioManager.isPlaying("ChainsawIdle.ogg")) {
		ICAudioManager.removeSourceAt(Player.get(), "ChainsawIdle.ogg");
		ICAudioManager.playSound("ChainsawStop.ogg");
	}
});
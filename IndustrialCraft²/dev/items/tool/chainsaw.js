IDRegistry.genItemID("chainsaw");
Item.createItem("chainsaw", "Chainsaw", {name: "chainsaw", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.chainsaw, "Eu", 30000, 1, "tool");

Item.registerNameOverrideFunction(ItemID.chainsaw, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.chainsaw, count: 1, data: Item.getMaxDamage(ItemID.chainsaw)}, [
	" pp",
	"ppp",
	"xp "
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");

ToolType.chainsaw = {
	damage: 4,
	baseDamage: 0,
	blockTypes: ["wood", "wool", "fibre", "plant"],
	onDestroy: function(item){
		ICTool.dischargeItem(item, this.toolMaterial.energyConsumption);
		item.data--;
	},
	onBroke: function(item){return true;},
	onAttack: function(item, mob){
		var material = this.toolMaterial;
		if(!this.baseDamage) this.baseDamage = material.damage;
		if(ICTool.dischargeItem(item, this.toolMaterial.energyConsumption)){
			material.damage = this.baseDamage;
		}
		else{
			material.damage = 0;
		}
		return true;
	},
	calcDestroyTime: function(item, coords, block, params, destroyTime, enchant){
		if(item.data + this.toolMaterial.energyConsumption <= Item.getMaxDamage(item.id)){
			return destroyTime;
		}
		else{
			return params.base;
		}
	}
}

ToolAPI.setTool(ItemID.chainsaw, {energyConsumption: 60, level: 3, efficiency: 16, damage: 6},  ToolType.chainsaw);
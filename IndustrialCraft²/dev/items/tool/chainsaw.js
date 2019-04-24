IDRegistry.genItemID("chainsaw");
Item.createItem("chainsaw", "Chainsaw", {name: "chainsaw", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.chainsaw, "Eu", 30000, 1);

Item.registerNameOverrideFunction(ItemID.chainsaw, NameOverrides.showItemStorage);

Recipes.addShaped({id: ItemID.chainsaw, count: 1, data: Item.getMaxDamage(ItemID.chainsaw)}, [
	" pp",
	"ppp",
	"xp "
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");

ToolType.chainsaw = {
	isWeapon: true,
	damage: 4,
	baseDamage: 0,
	blockTypes: ["wood", "wool", "fibre", "plant"],
	onDestroy: function(item){
		item.data = Math.min(item.data + this.toolMaterial.energyConsumption - 1, Item.getMaxDamage(item.id));
	},
	onBroke: function(item){return true;},
	onAttack: function(item, mob){
		var material = this.toolMaterial;
		if(!this.baseDamage) this.baseDamage = material.damage;
		if(item.data + material.energyConsumption <= Item.getMaxDamage(item.id)){
			item.data += material.energyConsumption - 1;
			material.damage = this.baseDamage;
		}
		else{
			material.damage = 0;
		}
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

ToolAPI.setTool(ItemID.chainsaw, {energyConsumption: 50, level: 3, efficiency: 16, damage: 6},  ToolType.chainsaw);
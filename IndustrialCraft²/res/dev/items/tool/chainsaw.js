IDRegistry.genItemID("chainsaw");
Item.createItem("chainsaw", "Chainsaw", {name: "chainsaw", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.chainsaw, 30000, 0, true, true);

Recipes.addShaped({id: ItemID.chainsaw, count: 1, data: Item.getMaxDamage(ItemID.chainsaw)}, [
	" pp",
	"ppp",
	"xp "
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");

ToolType.chainsaw = {
	damage: 0,
	blockTypes: ["wood", "wool", "fibre", "plant"],
	onBroke: function(item){
		item.data = Math.min(item.data+1, Item.getMaxDamage(item.id));
		return true;
	},
	onAttack: function(item, mob){
		if(item.data < Item.getMaxDamage(item.id)){
			item.data++;
			this.damage = 6;
		}
		else{
			this.damage = 0;
		}
		
	},
	calcDestroyTime: function(item, block, params, destroyTime, enchant){
		if(item.data < Item.getMaxDamage(item.id)){
			return destroyTime;
		}
		else{
			return params.base;
		}
	}
}

ToolAPI.setTool(ItemID.chainsaw, {durability: 600, level: 3, efficiency: 16, damage: 3},  ToolType.chainsaw);
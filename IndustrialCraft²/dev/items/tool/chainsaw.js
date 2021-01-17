IDRegistry.genItemID("chainsaw");
Item.createItem("chainsaw", "Chainsaw", {name: "chainsaw", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.chainsaw, "Eu", 30000, 100, 1, "tool", true);

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
	toolDamage: 0,
	blockTypes: ["wood", "wool", "fibre", "plant"],
	soundType: "chainsaw",
	onDestroy: function(item, coords, block){
		if(Block.getDestroyTime(block.id) > 0){
			if(ICTool.dischargeItem(item, this.toolMaterial.energyPerUse) && (block.id == 18 || block.id == 161)){
				World.destroyBlock(coords.x, coords.y, coords.z);
				World.drop(coords.x + .5, coords.y + .5, coords.z + .5, block.id, 1, block.data%4);
			}
		}
		return true;
	},
	onBroke: function(item){return true;},
	onAttack: function(item, mob){
		var material = this.toolMaterial;
		if(!this.toolDamage) this.toolDamage = material.damage;
		if(ICTool.dischargeItem(item, this.toolMaterial.energyPerUse)){
			material.damage = this.toolDamage;
		}
		else{
			material.damage = 0;
		}
		return true;
	},
	calcDestroyTime: function(item, coords, block, params, destroyTime, enchant){
		if(item.data + this.toolMaterial.energyPerUse <= Item.getMaxDamage(item.id)){
			return destroyTime;
		}
		else{
			return params.base;
		}
	},
}

ToolLib.setTool(ItemID.chainsaw, {energyPerUse: 100, level: 3, efficiency: 12, damage: 6}, ToolType.chainsaw);

let chainsawLoop = SoundAPI.addSoundPlayer("Tools/Chainsaw/ChainsawIdle.ogg", true, 1);
SoundAPI.addSoundPlayer("Tools/Chainsaw/ChainsawStop.ogg", false, 1);
Callback.addCallback("tick", function(){
	if(!Config.soundEnabled) {return;}
	let item = Player.getCarriedItem();
	let tool = ToolAPI.getToolData(item.id);
	let energyStored = Item.getMaxDamage(item.id) - item.data;
	if(tool && tool.soundType == "chainsaw" && energyStored >= tool.toolMaterial.energyPerUse){
		if(!chainsawLoop.isPlaying()){
			chainsawLoop.start();
		}
	}
	else if(chainsawLoop.isPlaying()){
		chainsawLoop.stop();
		SoundAPI.playSound("Tools/Chainsaw/ChainsawStop.ogg", false, true);
	}
});
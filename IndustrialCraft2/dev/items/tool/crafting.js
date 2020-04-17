IDRegistry.genItemID("craftingHammer");
Item.createItem("craftingHammer", "Forge Hammer", {name: "crafting_hammer"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingHammer, 80);

IDRegistry.genItemID("cutter");
Item.createItem("cutter", "Cutter", {name: "cutter"}, {stack: 1});
Item.setMaxDamage(ItemID.cutter, 60);

Recipes.addShaped({id: ItemID.craftingHammer, count: 1, data: 0}, [
	"xx ",
	"x##",
	"xx "
], ['x', 265, 0, '#', 280, 0]);

Recipes.addShaped({id: ItemID.cutter, count: 1, data: 0}, [
	"x x",
	" x ",
	"a a"
], ['a', 265, 0, 'x', ItemID.plateIron, 0]);

Callback.addCallback("DestroyBlockStart", function(coords, block){
	var item = Player.getCarriedItem();
	var cableData = CableRegistry.getCableData(block.id);
	if(item.id == ItemID.cutter && cableData && cableData.insulation > 0){
		Game.prevent();
		ToolAPI.breakCarriedTool(1);
		SoundAPI.playSound("Tools/InsulationCutters.ogg");
		var blockID = BlockID[cableData.name + (cableData.insulation - 1)]
		World.setBlock(coords.x, coords.y, coords.z, blockID, 0);
		World.drop(coords.x + 0.5, coords.y + 1, coords.z + 0.5, ItemID.rubber, 1);
	}
});

Item.registerUseFunction("cutter", function(coords, item, block){
	var cableData = CableRegistry.getCableData(block.id);
	if(cableData && cableData.insulation < cableData.maxInsulation){
		for(var i = 9; i < 45; i++){
			var slot = Player.getInventorySlot(i);
			if(slot.id == ItemID.rubber){
				var blockID = BlockID[cableData.name + (cableData.insulation + 1)]
				World.setBlock(coords.x, coords.y, coords.z, blockID, 0);
				slot.count--;
				Player.setInventorySlot(i, slot.count ? slot.id : 0, slot.count, slot.data);
				break;
			}
		}
	}
});
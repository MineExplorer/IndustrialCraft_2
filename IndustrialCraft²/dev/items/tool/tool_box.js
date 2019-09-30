IDRegistry.genItemID("toolbox");
Item.createItem("toolbox", "Tool Box", {name: "tool_box", meta: 0}, {stack: 1});

Recipes.addShaped({id: ItemID.toolbox, count: 1, data: 0}, [
	"axa",
	"aaa",
], ['x', 54, 0, 'a', ItemID.casingBronze, 0]);

let toolbox_items = [
	ItemID.treetap, ItemID.craftingHammer, ItemID.cutter, ItemID.electricHoe, ItemID.electricTreetap, ItemID.EUMeter,
	ItemID.cableTin0, ItemID.cableTin1, ItemID.cableCopper0, ItemID.cableCopper1,
	ItemID.cableGold0, ItemID.cableGold1, ItemID.cableGold2,
	ItemID.cableIron0, ItemID.cableIron1, ItemID.cableIron2, ItemID.cableIron3, ItemID.cableOptic
];

BackpackRegistry.register(ItemID.toolbox, {
	title: "Tool Box",
	slots: 10,
	inRow: 5,
	slotsCenter: true,
	isValidItem: function(id, count, data){
		if(toolbox_items.indexOf(id) != -1) return true;
		if(ToolAPI.getToolData(id) || ICTool.getWrenchData(id)) return true;
		return false;
	}
});

Callback.addCallback("ItemUse", function(coords, item, block){
	if(block.id == 58){
		for(let i = 9; i < 45; i++){
			let slot = Player.getInventorySlot(i);
			if(item.id == ItemID.toolbox){
				let container = BackpackRegistry.containers["d" + slot.data];
				if(container){
					let isEmpty = true;
					for(let i = 1; i <= 10; i++){
						if(container.getSlot("slot"+i).id != 0){
							isEmpty = false;
						}
					}
					if(isEmpty){
						delete BackpackRegistry.containers["d" + slot.data];
						Player.setInventorySlot(i, slot.id, 1, 0);
					}
				}
			}
		}
	}
});


ItemRegistry.createItem("toolbox", {name: "tool_box", icon: "tool_box", stack: 1, category: ItemCategory.EQUIPMENT});

const toolboxItems = [
	ItemID.treetap, ItemID.craftingHammer, ItemID.cutter,
	ItemID.electricHoe, ItemID.electricTreetap, ItemID.windMeter, ItemID.EUMeter,
	ItemID.cableTin0, ItemID.cableTin1, ItemID.cableCopper0, ItemID.cableCopper1,
	ItemID.cableGold0, ItemID.cableGold1, ItemID.cableGold2,
	ItemID.cableIron0, ItemID.cableIron1, ItemID.cableIron2, ItemID.cableIron3,
	ItemID.cableOptic
];

BackpackRegistry.register(ItemID.toolbox, {
	title: "Tool Box",
	slots: 10,
	inRow: 5,
	slotsCenter: true,
	isValidItem: function(id, count, data) {
		if (toolboxItems.indexOf(id) != -1) return true;
		if (ToolAPI.getToolData(id) || ICTool.getWrenchData(id)) return true;
		return false;
	}
});
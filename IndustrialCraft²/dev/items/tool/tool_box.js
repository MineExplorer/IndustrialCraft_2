IDRegistry.genItemID("toolbox");
Item.createItem("toolbox", "Tool Box", {name: "tool_box", meta: 0});

Recipes.addShaped({id: ItemID.toolbox, count: 1, data: 0}, [
	"axa",
	"aaa",
], ['x', 54, 0, 'a', ItemID.casingBronze, 0]);

var tool_box_items = [
	ItemID.cableTin0, ItemID.cableTin1,
	ItemID.cableCopper0, ItemID.cableCopper1,
	ItemID.cableGold0, ItemID.cableGold1, ItemID.cableGold2,
	ItemID.cableIron0, ItemID.cableIron1, ItemID.cableIron2, ItemID.cableIron3,
	ItemID.cableOptic
];

let guiToolBox = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Tool Box")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	drawing: [],
	elements: {}
});

function isValidToolBoxItem(id){
	if(tool_box_items.indexOf(id) != -1) return true;
	if(Item.getMaxStack(id) == 1) return true;
	return false;
}

BackpackRegistry.addSlotsToGui(guiToolBox, 10, isValidToolBoxItem, 5, true);

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiToolBox, "Tool Box");
});

BackpackRegistry.register(ItemID.toolbox, {
    gui: guiToolBox
});

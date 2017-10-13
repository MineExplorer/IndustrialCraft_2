IDRegistry.genItemID("toolbox");
Item.createItem("toolbox", "Tool Box", {name: "tool_box", meta: 0});

Recipes.addShaped({id: ItemID.toolbox, count: 1, data: 0}, [
	"axa",
	"aaa",
], ['x', 54, 0, 'a', ItemID.casingBronze, 0]);
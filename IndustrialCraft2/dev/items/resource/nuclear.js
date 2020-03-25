IDRegistry.genItemID("uranium");
Item.createItem("uranium", "Enriched Uranium", {name: "uranium"});
RadiationAPI.regRadioactiveItem(ItemID.uranium, 60);

IDRegistry.genItemID("uranium235");
Item.createItem("uranium235", "Uranium 235", {name: "uranium235"});
RadiationAPI.regRadioactiveItem(ItemID.uranium235, 150);

IDRegistry.genItemID("smallUranium235");
Item.createItem("smallUranium235", "Piece of Uranium 235", {name: "small_uranium235"});
RadiationAPI.regRadioactiveItem(ItemID.smallUranium235, 150);

IDRegistry.genItemID("uranium238");
Item.createItem("uranium238", "Uranium 238", {name: "uranium238"});
RadiationAPI.regRadioactiveItem(ItemID.uranium238, 10, true);

IDRegistry.genItemID("smallUranium238");
Item.createItem("smallUranium238", "Piece of Uranium 238", {name: "small_uranium238"});
RadiationAPI.regRadioactiveItem(ItemID.smallUranium238, 10, true);

IDRegistry.genItemID("plutonium");
Item.createItem("plutonium", "Plutonium", {name: "plutonium"});
RadiationAPI.regRadioactiveItem(ItemID.plutonium, 150);

IDRegistry.genItemID("smallPlutonium");
Item.createItem("smallPlutonium", "Piece of Plutonium", {name: "small_plutonium"});
RadiationAPI.regRadioactiveItem(ItemID.smallPlutonium, 150);

IDRegistry.genItemID("mox");
Item.createItem("mox", "MOX Nuclear Fuel", {name: "mox"});
RadiationAPI.regRadioactiveItem(ItemID.mox, 300);

IDRegistry.genItemID("rtgPellet");
Item.createItem("rtgPellet", "Pellets of RTG Fuel", {name: "rtg_pellet"}, {stack: 1});
RadiationAPI.regRadioactiveItem(ItemID.rtgPellet, 1, true);

Recipes.addShaped({id: ItemID.uranium, count: 1, data: 0}, [
	"xxx",
	"aaa",
	"xxx"
], ['x', ItemID.uranium238, 0, 'a', ItemID.smallUranium235, 0]);

Recipes.addShaped({id: ItemID.uranium235, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx"
], ['x', ItemID.smallUranium235, 0]);

Recipes.addShaped({id: ItemID.plutonium, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx"
], ['x', ItemID.smallPlutonium, 0]);

Recipes.addShaped({id: ItemID.mox, count: 1, data: 0}, [
	"xxx",
	"aaa",
	"xxx"
], ['x', ItemID.smallPlutonium, 0, 'a', ItemID.uranium238, 0]);

Recipes.addShaped({id: ItemID.rtgPellet, count: 1, data: 0}, [
	"xxx",
	"aaa",
	"xxx"
], ['x', ItemID.densePlateIron, 0, 'a', ItemID.plutonium, 0]);

Recipes.addShapeless({id: ItemID.smallUranium235, count: 9, data: 0}, [{id: ItemID.uranium235, data: 0}]);
Recipes.addShapeless({id: ItemID.smallPlutonium, count: 9, data: 0}, [{id: ItemID.plutonium, data: 0}]);

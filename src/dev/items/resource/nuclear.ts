ItemRegistry.createItem("uranium", {name: "enriched_uranium", icon: "uranium"});
RadiationAPI.registerRadioactiveItem(ItemID.uranium, 60);

ItemRegistry.createItem("uranium235", {name: "uranium_235", icon: "uranium235"});
RadiationAPI.registerRadioactiveItem(ItemID.uranium235, 150);

ItemRegistry.createItem("smallUranium235", {name: "small_uranium_235", icon: "small_uranium235"});
RadiationAPI.registerRadioactiveItem(ItemID.smallUranium235, 150);

ItemRegistry.createItem("uranium238", {name: "uranium_238", icon: "uranium238"});
RadiationAPI.registerRadioactiveItem(ItemID.uranium238, 10, true);

ItemRegistry.createItem("smallUranium238", {name: "small_uranium_238", icon: "small_uranium238"});
RadiationAPI.registerRadioactiveItem(ItemID.smallUranium238, 10, true);

ItemRegistry.createItem("plutonium", {name: "plutonium", icon: "plutonium"});
RadiationAPI.registerRadioactiveItem(ItemID.plutonium, 150);

ItemRegistry.createItem("smallPlutonium", {name: "small_plutonium", icon: "small_plutonium"});
RadiationAPI.registerRadioactiveItem(ItemID.smallPlutonium, 150);

ItemRegistry.createItem("mox", {name: "mox_fuel", icon: "mox"});
RadiationAPI.registerRadioactiveItem(ItemID.mox, 300);

ItemRegistry.createItem("rtgPellet", {name: "rtg_pellet", icon: "rtg_pellet", stack: 1});
RadiationAPI.registerRadioactiveItem(ItemID.rtgPellet, 1, true);

Item.addCreativeGroup("nuclear", Translation.translate("Nuclear"), [
	ItemID.uranium,
	ItemID.uranium235,
	ItemID.smallUranium235,
	ItemID.uranium238,
	ItemID.smallUranium238,
	ItemID.plutonium,
	ItemID.smallPlutonium,
	ItemID.mox,
	ItemID.rtgPellet
]);

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

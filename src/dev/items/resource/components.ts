ItemRegistry.createItem("circuitBasic", {name: "electronic_circuit", icon: "circuit_basic"});
ItemRegistry.createItem("circuitAdvanced", {name: "advanced_circuit", icon: "circuit_advanced", rarity: EnumRarity.UNCOMMON});

ItemRegistry.createItem("coil", {name: "coil", icon: "coil"});
ItemRegistry.createItem("electricMotor", {name: "electric_motor", icon: "electric_motor"});
ItemRegistry.createItem("powerUnit", {name: "power_unit", icon: "power_unit"});
ItemRegistry.createItem("powerUnitSmall", {name: "small_power_unit", icon: "power_unit_small"});

ItemRegistry.createItem("heatConductor", {name: "heat_conductor", icon: "heat_conductor"});

ItemRegistry.createItem("cuttingBladeIron", {name: "cutting_blade_iron", icon: "cutting_blade_iron", stack: 1});
ItemRegistry.createItem("cuttingBladeSteel", {name: "cutting_blade_steel", icon: "cutting_blade_steel", stack: 1});
ItemRegistry.createItem("cuttingBladeDiamond", {name: "cutting_blade_diamond", icon: "cutting_blade_diamond", stack: 1});

ItemName.addTooltip(ItemID.cuttingBladeIron, "tooltip.blade.hardness", 2);
ItemName.addTooltip(ItemID.cuttingBladeSteel, "tooltip.blade.hardness", 3);
ItemName.addTooltip(ItemID.cuttingBladeDiamond, "tooltip.blade.hardness", 4);

Item.addCreativeGroup("ic2_component", Translation.translate("Crafting Components"), [
	ItemID.circuitBasic,
	ItemID.circuitAdvanced,
	ItemID.coil,
	ItemID.electricMotor,
	ItemID.powerUnit,
	ItemID.powerUnitSmall,
	ItemID.heatConductor,
	ItemID.cuttingBladeIron,
	ItemID.cuttingBladeSteel,
	ItemID.cuttingBladeDiamond
]);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.circuitBasic, count: 1, data: 0}, [
		"xxx",
		"a#a",
		"xxx"
	], ['x', ItemID.cableCopper1, 0, 'a', 331, 0, '#', ItemID.plateIron, 0]);

	Recipes.addShaped({id: ItemID.circuitBasic, count: 1, data: 0}, [
		"xax",
		"x#x",
		"xax"
	], ['x', ItemID.cableCopper1, 0, 'a', 331, 0, '#', ItemID.plateIron, 0]);

	Recipes.addShaped({id: ItemID.circuitAdvanced, count: 1, data: 0}, [
		"xbx",
		"a#a",
		"xbx"
	], ['x', 331, 0, 'a', 348, 0, 'b', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0]);

	Recipes.addShaped({id: ItemID.circuitAdvanced, count: 1, data: 0}, [
		"xax",
		"b#b",
		"xax"
	], ['x', 331, 0, 'a', 348, 0, 'b', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0]);

	Recipes.addShaped({id: ItemID.coil, count: 1, data: 0}, [
		"aaa",
		"axa",
		"aaa"
	], ['x', 265, 0, 'a', ItemID.cableCopper0, 0]);

	Recipes.addShaped({id: ItemID.electricMotor, count: 1, data: 0}, [
		" b ",
		"axa",
		" b "
	], ['x', 265, 0, 'a', ItemID.coil, 0, 'b', ItemID.casingTin, 0]);

	Recipes.addShaped({id: ItemID.powerUnit, count: 1, data: 0}, [
		"acs",
		"axe",
		"acs"
	], ['x', ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0, 'a', ItemID.storageBattery, -1, 's', ItemID.casingIron, 0, 'c', ItemID.cableCopper0, 0]);

	Recipes.addShaped({id: ItemID.powerUnitSmall, count: 1, data: 0}, [
		" cs",
		"axe",
		" cs"
	], ['x', ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0, 'a', ItemID.storageBattery, -1, 's', ItemID.casingIron, 0, 'c', ItemID.cableCopper0, 0]);

	Recipes.addShaped({id: ItemID.heatConductor, count: 1, data: 0}, [
		"aсa",
		"aсa",
		"aсa"
	], ['с', ItemID.plateCopper, 0, 'a', ItemID.rubber, 0]);

	Recipes.addShaped({id: ItemID.cuttingBladeIron, count: 1, data: 0}, [
		"bbb",
		"bab",
		"bbb"
	], ['a', ItemID.ingotBronze, 0, 'b', ItemID.plateIron, 0]);

	Recipes.addShaped({id: ItemID.cuttingBladeSteel, count: 1, data: 0}, [
		"bbb",
		"bab",
		"bbb"
	], ['a', VanillaItemID.iron_ingot, 0, 'b', ItemID.plateSteel, 0]);

	Recipes.addShaped({id: ItemID.cuttingBladeDiamond, count: 1, data: 0}, [
		"cbc",
		"bab",
		"cbc"
	], ['a', ItemID.ingotSteel, 0, 'b', ItemID.plateSteel, 0, 'c', VanillaItemID.diamond, 0]);
});

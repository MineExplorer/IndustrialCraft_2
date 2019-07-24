IDRegistry.genItemID("circuitBasic");
IDRegistry.genItemID("circuitAdvanced");
Item.createItem("circuitBasic", "Electronic Circuit", {name: "circuit_basic", meta: 0});
Item.createItem("circuitAdvanced", "Advanced Circuit", {name: "circuit_advanced", meta: 0});

IDRegistry.genItemID("coil");
IDRegistry.genItemID("electricMotor");
IDRegistry.genItemID("powerUnit");
IDRegistry.genItemID("powerUnitSmall");
Item.createItem("coil", "Coil", {name: "coil", meta: 0});
Item.createItem("electricMotor", "Electric Motor", {name: "electric_motor", meta: 0});
Item.createItem("powerUnit", "Power Unit", {name: "power_unit", meta: 0});
Item.createItem("powerUnitSmall", "Small Power Unit", {name: "power_unit_small", meta: 0});

IDRegistry.genItemID("heatConductor");
Item.createItem("heatConductor", "Heat Conductor", {name: "heat_conductor", meta: 0});

Callback.addCallback("PreLoaded", function(){
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
	], ['x', ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0,  'a', ItemID.storageBattery, -1, 's', ItemID.casingIron, 0, 'c', ItemID.cableCopper0, 0]);

	Recipes.addShaped({id: ItemID.powerUnitSmall, count: 1, data: 0}, [
		" cs",
		"axe",
		" cs"
	], ['x', ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0,  'a', ItemID.storageBattery, -1, 's', ItemID.casingIron, 0, 'c', ItemID.cableCopper0, 0]);
	
	Recipes.addShaped({id: ItemID.heatConductor, count: 1, data: 0}, [
		"aсa",
		"aсa",
		"aсa"
	], ['с', ItemID.plateCopper, 0, 'a', ItemID.rubber, 0]);
});

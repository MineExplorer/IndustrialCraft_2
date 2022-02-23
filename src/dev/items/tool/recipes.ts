/// <reference path="init.ts" />

Callback.addCallback("PreLoaded", function() {
	// Tool Box
	Recipes.addShaped({id: ItemID.toolbox, count: 1, data: 0}, [
		"axa",
		"aaa",
	], ['x', 54, -1, 'a', ItemID.casingBronze, 0]);

	// Containment Box
	Recipes.addShaped({id: ItemID.containmentBox, count: 1, data: 0}, [
		"aaa",
		"axa",
		"aaa",
	], ['x', 54, -1, 'a', ItemID.casingLead, 0]);

	// Crafting tools
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

	// Bronze tools
	Recipes.addShaped({id: ItemID.bronzeSword, count: 1, data: 0}, [
		"a",
		"a",
		"b"
	], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

	Recipes.addShaped({id: ItemID.bronzeShovel, count: 1, data: 0}, [
		"a",
		"b",
		"b"
	], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

	Recipes.addShaped({id: ItemID.bronzePickaxe, count: 1, data: 0}, [
		"aaa",
		" b ",
		" b "
	], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

	Recipes.addShaped({id: ItemID.bronzeAxe, count: 1, data: 0}, [
		"aa",
		"ab",
		" b"
	], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

	Recipes.addShaped({id: ItemID.bronzeHoe, count: 1, data: 0}, [
		"aa",
		" b",
		" b"
	], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

	// EU Meter
	Recipes.addShaped({id: ItemID.EUMeter, count: 1, data: 0}, [
		" g ",
		"xcx",
		"x x"
	], ['c', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'g', 348, -1]);

	// Frequency Transmitter
	Recipes.addShaped({id: ItemID.freqTransmitter, count: 1, data: 0}, [
		"x",
		"#",
		"b"
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.casingIron, 0]);

	// Scanners
	Recipes.addShaped({id: ItemID.scanner, count: 1, data: 27}, [
		"gdg",
		"cbc",
		"xxx"
	], ['x', ItemID.cableCopper1, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);

	Recipes.addShaped({id: ItemID.scannerAdvanced, count: 1, data: 27}, [
		"gbg",
		"dcd",
		"xsx"
	], ['x', ItemID.cableGold2, -1, 's', ItemID.scanner, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);

	// Windmeter
	Recipes.addShaped({id: ItemID.windMeter, count: 1, data: 27}, [
		" c",
		"cbc",
		" cx"
	], ['x', ItemID.powerUnitSmall, 0, 'b', ItemID.casingBronze, 0, 'c', ItemID.casingTin, 0]);

	// Treetap
	Recipes.addShaped({id: ItemID.treetap, count: 1, data: 0}, [
		" x ",
		"xxx",
		"x  "
	], ['x', 5, -1]);

	// Wrenches
	Recipes.addShaped({id: ItemID.bronzeWrench, count: 1, data: 0}, [
		"a a",
		"aaa",
		" a "
	], ['a', ItemID.ingotBronze, 0]);

	Recipes.addShapeless({id: ItemID.electricWrench, count: 1, data: 27}, [
		{id: ItemID.bronzeWrench, data: 0}, {id: ItemID.powerUnitSmall, data: 0}
	]);

	// Electric Treetap
	Recipes.addShapeless({id: ItemID.electricTreetap, count: 1, data: 27}, [
		{id: ItemID.powerUnitSmall, data: 0}, {id: ItemID.treetap, data: 0}
	]);

	const ironPlate = IC2Config.hardRecipes ? ItemID.plateSteel : ItemID.plateIron;

	// Electric Hoe
	Recipes.addShaped({id: ItemID.electricHoe, count: 1, data: 27}, [
		"pp",
		" p",
		" x"
	], ['x', ItemID.powerUnitSmall, 0, 'p', ironPlate, 0]);

	// Chainsaw
	Recipes.addShaped({id: ItemID.chainsaw, count: 1, data: 27}, [
		" pp",
		"ppp",
		"xp "
	], ['x', ItemID.powerUnit, 0, 'p', ironPlate, 0]);

	// Drills
	Recipes.addShaped({id: ItemID.drill, count: 1, data: 27}, [
		" p ",
		"ppp",
		"pxp"
	], ['x', ItemID.powerUnit, 0, 'p', ironPlate, 0]);

	Recipes.addShaped({id: ItemID.diamondDrill, count: 1, data: 27}, [
		" a ",
		"ada"
	], ['d', ItemID.drill, -1, 'a', 264, 0], ChargeItemRegistry.transferEnergy);

	Recipes.addShaped({id: ItemID.iridiumDrill, count: 1, data: 27}, [
		" a ",
		"ada",
		" e "
	], ['d', ItemID.diamondDrill, -1, 'e', ItemID.storageCrystal, -1, 'a', ItemID.plateReinforcedIridium, 0], ChargeItemRegistry.transferEnergy);

	// Nano Saber
	Recipes.addShaped({id: ItemID.nanoSaber, count: 1, data: 27}, [
		"ca ",
		"ca ",
		"bxb"
	], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], ChargeItemRegistry.transferEnergy);

	// Mining Laser
	Recipes.addShaped({id: ItemID.miningLaser, count: 1, data: 27}, [
		"ccx",
		"aa#",
		" aa"
	], ['#', ItemID.circuitAdvanced, 0, 'x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, "c", 331, 0], ChargeItemRegistry.transferEnergy);

	// Crop Analyzer
	Recipes.addShaped({id: ItemID.agriculturalAnalyzer, count: 1, data: 0}, [
		"xx ",
		"rgr",
		"rcr"
	], ['x', ItemID.cableCopper1, 0, 'r', 331, 0, 'g', 20, 0, "c", ItemID.circuitBasic, 0]);

	// Weeding Trovel
	Recipes.addShaped({id: ItemID.weedingTrowel, count: 1, data: 0}, [
		"c c",
		" c ",
		"zcz"
	], ['c', 265, 0, 'z', ItemID.rubber, 0]);

	// Painters
	Recipes.addShaped({id: ItemID.icPainter, count: 1, data: 0}, [
		" aa",
		" xa",
		"x  "
	], ['x', 265, -1, 'a', 35, 0]);

	for (let i = 1; i <= 16; i++) {
		const color = INDEX_TO_COLOR[i-1];
		const dye = IDConverter.getIDData(color + "_dye");
		Recipes.addShapeless({id: ItemID["icPainter"+i], count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: dye.id, data: dye.data}]);
	}

	// MFSU Upgrade Kit
	Recipes.addShaped({id: ItemID.upgradeMFSU, count: 1, data: 0}, [
        "aca",
        "axa",
        "aba"
    ], ['b', ItemID.bronzeWrench, 0, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, -1]);
});

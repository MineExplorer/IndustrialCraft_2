/// <reference path="init.ts" />

// Bronze
Recipes.addShaped({id: ItemID.bronzeHelmet, count: 1, data: 0}, [
	"xxx",
	"x x"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeChestplate, count: 1, data: 0}, [
	"x x",
	"xxx",
	"xxx"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeLeggings, count: 1, data: 0}, [
	"xxx",
	"x x",
	"x x"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeBoots, count: 1, data: 0}, [
	"x x",
	"x x"
], ['x', ItemID.ingotBronze, 0]);

// Composite
Recipes.addShaped({id: ItemID.compositeHelmet, count: 1, data: 0}, [
	"xax",
	"x x"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_helmet, 0]);

Recipes.addShaped({id: ItemID.compositeChestplate, count: 1, data: 0}, [
	"x x",
	"xax",
	"xxx"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_chestplate, 0]);

Recipes.addShaped({id: ItemID.compositeLeggings, count: 1, data: 0}, [
	"xax",
	"x x",
	"x x"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_leggings, 0]);

Recipes.addShaped({id: ItemID.compositeBoots, count: 1, data: 0}, [
	"x x",
	"xax"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_boots, 0]);

// Hazmat
Recipes.addShaped({id: ItemID.hazmatHelmet, count: 1, data: 0}, [
	" d ",
	"xax",
	"x#x"
], ['x', ItemID.rubber, 0, 'a', 20, -1, 'd', IDConverter.getID("orange_dye"), IDConverter.getData("orange_dye"), '#', 101, -1]);

Recipes.addShaped({id: ItemID.hazmatChestplate, count: 1, data: 0}, [
	"x x",
	"xdx",
	"xdx"
], ['x', ItemID.rubber, 0, 'd', IDConverter.getID("orange_dye"), IDConverter.getData("orange_dye")]);

Recipes.addShaped({id: ItemID.hazmatLeggings, count: 1, data: 0}, [
	"xdx",
	"x x",
	"x x"
], ['x', ItemID.rubber, 0, 'd', IDConverter.getID("orange_dye"), IDConverter.getData("orange_dye")]);

Recipes.addShaped({id: ItemID.rubberBoots, count: 1, data: 0}, [
	"x x",
	"x x",
	"xwx"
], ['x', ItemID.rubber, 0, 'w', 35, -1]);

// Jetpack
Recipes.addShaped({id: ItemID.jetpack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"bcb",
	"bab",
	"d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, 'd', 348, 0]);

// Batpacks
Recipes.addShaped({id: ItemID.batpack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"bcb",
	"bab",
	"b b"
], ['a', 5, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.advBatpack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"bcb",
	"bab",
	"b b"
], ['a', ItemID.plateBronze, 0, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.energypack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"cbc",
	"aba",
	"b b"
], ['a', ItemID.storageCrystal, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.lappack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"e",
	"c",
	"a"
], ['e', ItemID.energypack, -1, 'a', ItemID.storageLapotronCrystal, -1, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);

// Nightvision Goggles
Recipes.addShaped({id: ItemID.nightvisionGoggles, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"xbx",
	"aga",
	"rcr"
], ['a', BlockID.luminator, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, 0, 'x', ItemID.heatExchangerAdv, 1, 'g', 20, 0, 'r', ItemID.rubber, 0], ChargeItemRegistry.transferEnergy);

// Nano Suit
Recipes.addShaped({id: ItemID.nanoHelmet, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"x#x",
	"xax"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0, 'a', ItemID.nightvisionGoggles, -1], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.nanoChestplate, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"x x",
	"x#x",
	"xxx"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.nanoLeggings, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"x#x",
	"x x",
	"x x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.nanoBoots, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"x x",
	"x#x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);

// Quantum Suit
Recipes.addShaped({id: ItemID.quantumHelmet, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"a#a",
	"bxb",
	"cqc"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoHelmet, -1, 'q', ItemID.hazmatHelmet, 0, 'a', ItemID.plateReinforcedIridium, 0, 'b', BlockID.reinforcedGlass, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.quantumChestplate, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"bxb",
	"a#a",
	"aca"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoChestplate, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0, 'c', ItemID.jetpack, -1], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.quantumLeggings, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"m#m",
	"axa",
	"c c"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoLeggings, -1, 'a', ItemID.plateReinforcedIridium, 0, 'm', BlockID.machineBlockBasic, 0, 'c', 348, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.quantumBoots, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE}, [
	"axa",
	"b#b"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoBoots, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.rubberBoots, 0], ChargeItemRegistry.transferEnergy);

// Solar Helmet
Recipes.addShaped({id: ItemID.solarHelmet, count: 1, data: 0}, [
	"aaa",
	"axa",
	"ccc"
], ['x', BlockID.solarPanel, -1, 'a', VanillaItemID.iron_ingot, 0, 'c', ItemID.cableCopper1, 0]);

Recipes.addShaped({id: ItemID.solarHelmet, count: 1, data: 0}, [
	" a ",
	" x ",
	"ccc"
], ['x', BlockID.solarPanel, -1, 'a', VanillaItemID.iron_helmet, 0, 'c', ItemID.cableCopper1, 0]);
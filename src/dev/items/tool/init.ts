/// <reference path="DebugItem.ts" />
/// <reference path="eu-meter.js" />
/// <reference path="Transmitter.ts" />
/// <reference path="Scanner.ts" />
/// <reference path="Treetap.ts" />
/// <reference path="crafting.ts" />
/// <reference path="Wrench.ts" />
/// <reference path="ElectricWrench.ts" />
/// <reference path="ElectricTreetap.ts" />
/// <reference path="ElectricHoe.ts" />
/// <reference path="Chainsaw.ts" />
/// <reference path="Drill.ts" />
/// <reference path="DrillIridium.ts" />
/// <reference path="NanoSaber.ts" />
/// <reference path="MiningLaser.ts" />
/// <reference path="crop_analyzer.js" />
/// <reference path="WeedingTrovel.ts" />
/// <reference path="Painter.ts" />

ItemRegistry.addToolMaterial("bronze", {
	durability: 225,
	level: 3,
	efficiency: 6,
	damage: 2,
	enchantability: 15,
	repairMaterial: ItemID.ingotBronze
});

ItemRegistry.createTool("bronzeSword", {name: "bronze_sword", icon: "bronze_sword", material: "bronze"}, ToolType.SWORD);
ItemRegistry.createTool("bronzeShovel", {name: "bronze_shovel", icon: "bronze_shovel", material: "bronze"}, ToolType.SHOVEL);
ItemRegistry.createTool("bronzePickaxe", {name: "bronze_pickaxe", icon: "bronze_pickaxe", material: "bronze"}, ToolType.PICKAXE);
ItemRegistry.createTool("bronzeAxe", {name: "bronze_axe", icon: "bronze_axe", material: "bronze"}, ToolType.AXE);
ItemRegistry.createTool("bronzeHoe", {name: "bronze_hoe", icon: "bronze_hoe", material: "bronze"}, ToolType.HOE);

ItemRegistry.registerItem(new DebugItem());
ItemRegistry.registerItem(new ItemTransmitter());
ItemRegistry.registerItem(new ItemScanner("scanner", "scanner", 10000, 100, 1));
ItemRegistry.registerItem(new ItemScanner("scannerAdvanced", "scanner_advanced", 100000, 256, 2));

ItemRegistry.registerItem(new ItemTreetap());
ItemRegistry.registerItem(new ToolWrench("bronzeWrench", "wrench", "bronze_wrench", 0.8));
ItemRegistry.registerItem(new ElectricWrench());
ItemRegistry.registerItem(new ElectricTreetap());
ItemRegistry.registerItem(new ElectricHoe());

ItemRegistry.registerItem(new ElectricChainsaw("chainsaw", "chainsaw", {energyPerUse: 100, level: 3, efficiency: 12, damage: 6}, 30000, 100, 1));

ItemRegistry.registerItem(new ToolDrill("drill", "drill", {energyPerUse: 50, level: 3, efficiency: 8, damage: 3}, 30000, 100, 1));
ItemRegistry.registerItem(new ToolDrill("diamondDrill", "diamond_drill", {energyPerUse: 80, level: 4, efficiency: 16, damage: 4}, 30000, 100, 1));
ItemRegistry.registerItem(new ToolDrillIridium());

Item.addCreativeGroup("ic2_drills", Translation.translate("Mining Drills"), [
	ItemID.drill,
	ItemID.diamondDrill,
	ItemID.iridiumDrill
]);

ItemRegistry.registerItem(new ItemNanoSaber());
ItemRegistry.registerItem(new ItemMiningLaser());
ItemRegistry.registerItem(new ItemWeedingTrowel());

// Painters
ItemRegistry.createItem("icPainter", {name: "painter", icon: "ic_painter", stack: 1, category: ItemCategory.EQUIPMENT});

const painterCreativeGroup = [ItemID.icPainter];
for (let i = 0; i < 16; i++) {
	let item = ItemRegistry.registerItem(new ItemPainter(i));
	painterCreativeGroup.push(item.id);
}
Item.addCreativeGroup("ic2_painter", Translation.translate("Painters"), painterCreativeGroup);
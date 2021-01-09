IDRegistry.genItemID("cellEmpty");
Item.createItem("cellEmpty", "Cell", {name: "cell_empty"});
Item.setLiquidClip(ItemID.cellEmpty, true);

IDRegistry.genItemID("cellWater");
IDRegistry.genItemID("cellLava");
IDRegistry.genItemID("cellBiomass");
IDRegistry.genItemID("cellBiogas");
IDRegistry.genItemID("cellCoolant");
IDRegistry.genItemID("cellMatter");
IDRegistry.genItemID("cellAir");
Item.createItem("cellWater", "Water Cell", {name: "cell_water"});
Item.createItem("cellLava", "Lava Cell", {name: "cell_lava"});
Item.createItem("cellBiomass", "Biomass Cell", {name: "cell_biomass"});
Item.createItem("cellBiogas", "Biogas Cell", {name: "cell_biogas"});
Item.createItem("cellCoolant", "Coolant Cell", {name: "cell_coolant"});
//Item.createItem("cellMatter", "UU-Matter Cell", {name: "cell_uu_matter"});
Item.createItem("cellAir", "Compressed Air Cell", {name: "cell_air"});

LiquidLib.registerItem("water", ItemID.cellEmpty, ItemID.cellWater, 1000);
LiquidLib.registerItem("lava", ItemID.cellEmpty, ItemID.cellLava, 1000);
LiquidLib.registerItem("biomass", ItemID.cellEmpty, ItemID.cellBiomass, 1000);
LiquidLib.registerItem("biogas", ItemID.cellEmpty, ItemID.cellBiogas, 1000);
LiquidLib.registerItem("coolant", ItemID.cellEmpty, ItemID.cellCoolant, 1000);

ItemName.addStoredLiquidTooltip(ItemID.cellWater);
ItemName.addStoredLiquidTooltip(ItemID.cellLava);
ItemName.addStoredLiquidTooltip(ItemID.cellBiomass);
ItemName.addStoredLiquidTooltip(ItemID.cellBiogas);
ItemName.addStoredLiquidTooltip(ItemID.cellCoolant);

Item.addCreativeGroup("cells", Translation.translate("Cells"), [
	ItemID.cellEmpty,
	ItemID.cellWater,
	ItemID.cellLava,
	ItemID.cellBiomass,
	ItemID.cellBiogas,
	ItemID.cellCoolant,
	ItemID.cellMatter,
	ItemID.cellAir
]);

Recipes.addShaped({id: ItemID.cellEmpty, count: 1, data: 0}, [
	" x ",
	"xgx",
	" x "
], ['x', ItemID.casingTin, 0, 'g', 102, 0]);

Recipes.addShaped({id: 49, count: 1, data: 0}, [
	"aa",
	"bb"
], ['a', ItemID.cellLava, 0, 'b', ItemID.cellWater, 0]);

Item.registerUseFunction("cellEmpty",function(coords, item, block, playerUid) {
	if (block.id > 7 && block.id < 12 && block.data == 0) {
		let player = new PlayerManager(playerUid);
		let region = WorldRegion.getForActor(playerUid);
		region.setBlock(coords, 0, 0);
		if (block.id == 8 || block.id == 9) {
			player.addItemToInventory(ItemID.cellWater, 1, 0);
		} else {
			player.addItemToInventory(ItemID.cellLava, 1, 0);
		}
		player.decreaseCarriedItem();
	}
});

Item.registerUseFunction("cellWater", function(coords, item, block, playerUid) {
	if (item.data > 0 || block.id == BlockID.crop) return;
	let player = new PlayerManager(playerUid);
	let region = WorldRegion.getForActor(playerUid);
	let blockID = region.getBlockId(coords.relative);
	if (blockID == 0 || blockID > 7 && blockID < 12) {
		region.setBlock(coords.relative, 8, 0);
		player.addItemToInventory(ItemID.cellEmpty, 1, 0);
		player.decreaseCarriedItem();
	}
});

Item.registerUseFunction("cellLava", function(coords, item, block, playerUid) {
	if (item.data > 0) return;
	let player = new PlayerManager(playerUid);
	let region = WorldRegion.getForActor(playerUid);
	let blockID = region.getBlockId(coords.relative);
	if (blockID == 0 || blockID > 7 && blockID < 12) {
		region.setBlock(coords.relative, 10, 0);
		player.addItemToInventory(ItemID.cellEmpty, 1, 0);
		player.decreaseCarriedItem();
	}
});

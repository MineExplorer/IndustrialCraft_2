/// <reference path="../ItemIC2.ts" />

class ItemLiquidCell
extends ItemIC2
implements ItemFuncs {
	constructor(stringID: string, liquid: string) {
		super(stringID, `${liquid}_cell`, `cell_${liquid}`);
		LiquidLib.registerItem(liquid, ItemID.cellEmpty, this.id, 1000);
	}

	onNameOverride(item: ItemInstance, name: string) {
		return name + "\n§7" + (1000 - item.data) + " mB";
	}
}

ItemRegistry.createItem("cellEmpty", {name: "empty_cell", icon: "cell_empty"});
Item.setLiquidClip(ItemID.cellEmpty, true);

new ItemLiquidCell("cellWater", "water");
new ItemLiquidCell("cellLava", "lava");
new ItemLiquidCell("cellBiomass", "biomass");
new ItemLiquidCell("cellBiogas", "biogas");
new ItemLiquidCell("cellCoolant", "coolant");
//new ItemLiquidCell("cellMatter", "uu_matter");

ItemRegistry.createItem("cellAir", {name: "air_cell", icon: "cell_air"});

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

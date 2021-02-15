class ItemEmptyCell
extends ItemCommon
implements ItemBehavior {
	constructor() {
		super("cellEmpty", "empty_cell", "cell_empty");
		this.setLiquidClip();
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, playerUid: number): void {
		if (block.id > 7 && block.id < 12 && block.data == 0) {
			let player = new PlayerEntity(playerUid);
			let region = WorldRegion.getForActor(playerUid);
			region.setBlock(coords, 0, 0);
			if (block.id == 8 || block.id == 9) {
				player.addItemToInventory(ItemID.cellWater, 1, 0);
			} else {
				player.addItemToInventory(ItemID.cellLava, 1, 0);
			}
			player.decreaseCarriedItem();
		}
	}
}

class ItemLiquidCell
extends ItemCommon
implements ItemBehavior {
	constructor(stringID: string, liquid: string) {
		super(stringID, `${liquid}_cell`, `cell_${liquid}`);
		LiquidLib.registerItem(liquid, ItemID.cellEmpty, this.id, 1000);
	}

	onNameOverride(item: ItemInstance, name: string): string {
		return name + "\n§7" + (1000 - item.data) + " mB";
	}
}

ItemRegistry.registerItem(new ItemEmptyCell());
ItemRegistry.registerItem(new ItemLiquidCell("cellWater", "water"));
ItemRegistry.registerItem(new ItemLiquidCell("cellLava", "lava"));
ItemRegistry.registerItem(new ItemLiquidCell("cellBiomass", "biomass"));
ItemRegistry.registerItem(new ItemLiquidCell("cellBiogas", "biogas"));
ItemRegistry.registerItem(new ItemLiquidCell("cellCoolant", "coolant"));
//ItemRegistry.registerItem(new ItemLiquidCell("cellMatter", "uu_matter"));

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

Item.registerUseFunction("cellWater", function(coords, item, block, playerUid) {
	if (item.data > 0 || block.id == BlockID.crop) return;
	let player = new PlayerEntity(playerUid);
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
	let player = new PlayerEntity(playerUid);
	let region = WorldRegion.getForActor(playerUid);
	let blockID = region.getBlockId(coords.relative);
	if (blockID == 0 || blockID > 7 && blockID < 12) {
		region.setBlock(coords.relative, 10, 0);
		player.addItemToInventory(ItemID.cellEmpty, 1, 0);
		player.decreaseCarriedItem();
	}
});

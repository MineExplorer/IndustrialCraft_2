class ItemCable extends ItemCommon
implements ItemBehavior {
	maxVoltage: number;

	constructor(stringID: string, name: string, texture: string | Item.TextureData, maxVoltage: number) {
		super(stringID, name, texture);
		this.maxVoltage = maxVoltage;
	}

	onNameOverride(item: ItemInstance, name: string): string {
		name += "\n§7" + ItemName.getTranslatedTextWithParams("tooltip.max_voltage", this.maxVoltage);
		return name;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		const region = BlockSource.getDefaultForActor(player);
		let place: Vector = coords;
		if (!World.canTileBeReplaced(block.id, block.data)) {
			place = coords.relative;
			block = region.getBlock(place.x, place.y, place.z);
			if (!World.canTileBeReplaced(block.id, block.data)) return;
		}
		region.setBlock(place.x, place.y, place.z, Block.getNumericId(this.stringID), 0);
		if (Game.isItemSpendingAllowed(player)) {
			Entity.setCarriedItem(player, item.id, item.count - 1, item.data);
		}
		EnergyGridBuilder.onWirePlaced(region, place.x, place.y, place.z);
	}

	static createItem(stringID: string, name: string, texture: string | Item.TextureData, maxVoltage: number) {
		return ItemRegistry.registerItem(new this(stringID, name, texture, maxVoltage));
	}
}

ItemCable.createItem("cableTin0", "tin_cable_0", {name: "cable_tin", meta: 0}, 32);
ItemCable.createItem("cableTin1", "tin_cable_1", {name: "cable_tin", meta: 1}, 32);

ItemCable.createItem("cableCopper0", "copper_cable_0", {name: "cable_copper", meta: 0}, 128);
ItemCable.createItem("cableCopper1", "copper_cable_1", {name: "cable_copper", meta: 1}, 128);

ItemCable.createItem("cableGold0", "gold_cable_0", {name: "cable_gold", meta: 0}, 512);
ItemCable.createItem("cableGold1", "gold_cable_1", {name: "cable_gold", meta: 1}, 512);
ItemCable.createItem("cableGold2", "gold_cable_2", {name: "cable_gold", meta: 2}, 512);

ItemCable.createItem("cableIron0", "iron_cable_0", {name: "cable_iron", meta: 0}, 2048);
ItemCable.createItem("cableIron1", "iron_cable_1", {name: "cable_iron", meta: 1}, 2048);
ItemCable.createItem("cableIron2", "iron_cable_2", {name: "cable_iron", meta: 2}, 2048);
ItemCable.createItem("cableIron3", "iron_cable_3", {name: "cable_iron", meta: 3}, 2048);

ItemCable.createItem("cableOptic", "glass_cable", "cable_optic", 8192);

Item.addCreativeGroup("cableEU", Translation.translate("Cables"), [
	ItemID.cableTin0,
	ItemID.cableTin1,
	ItemID.cableCopper0,
	ItemID.cableCopper1,
	ItemID.cableGold0,
	ItemID.cableGold1,
	ItemID.cableGold2,
	ItemID.cableIron0,
	ItemID.cableIron1,
	ItemID.cableIron2,
	ItemID.cableIron3,
	ItemID.cableOptic
]);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.cableOptic, count: 6, data: 0}, [
		"aaa",
		"x#x",
		"aaa"
	], ['#', ItemID.dustSilver, 0, 'x', ItemID.dustEnergium, 0, 'a', 20, -1]);

	// cutting recipes
	ICTool.addRecipe({id: ItemID.cableTin0, count: 2, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.cutter);
	ICTool.addRecipe({id: ItemID.cableCopper0, count: 2, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.cutter);
	ICTool.addRecipe({id: ItemID.cableGold0, count: 3, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.cutter);

	// insulation recipes
	Recipes.addShapeless({id: ItemID.cableTin1, count: 1, data: 0}, [
		{id: ItemID.cableTin0, data: 0},
		{id: ItemID.rubber, data: 0}
	]);
	Recipes.addShapeless({id: ItemID.cableCopper1, count: 1, data: 0}, [
		{id: ItemID.cableCopper0, data: 0},
		{id: ItemID.rubber, data: 0}
	]);

	// gold cables
	Recipes.addShapeless({id: ItemID.cableGold1, count: 1, data: 0}, [
		{id: ItemID.cableGold0, data: 0},
		{id: ItemID.rubber, data: 0}
	]);
	Recipes.addShapeless({id: ItemID.cableGold2, count: 1, data: 0}, [
		{id: ItemID.cableGold1, data: 0},
		{id: ItemID.rubber, data: 0}
	]);
	Recipes.addShapeless({id: ItemID.cableGold2, count: 1, data: 0}, [
		{id: ItemID.cableGold0, data: 0},
		{id: ItemID.rubber, data: 0},
		{id: ItemID.rubber, data: 0}
	]);

	// high voltage cables
	Recipes.addShapeless({id: ItemID.cableIron1, count: 1, data: 0}, [
		{id: ItemID.cableIron0, data: 0},
		{id: ItemID.rubber, data: 0}
	]);
	Recipes.addShapeless({id: ItemID.cableIron2, count: 1, data: 0}, [
		{id: ItemID.cableIron1, data: 0},
		{id: ItemID.rubber, data: 0}
	]);
	Recipes.addShapeless({id: ItemID.cableIron2, count: 1, data: 0}, [
		{id: ItemID.cableIron0, data: 0},
		{id: ItemID.rubber, data: 0},
		{id: ItemID.rubber, data: 0}
	]);
	Recipes.addShapeless({id: ItemID.cableIron3, count: 1, data: 0}, [
		{id: ItemID.cableIron2, data: 0},
		{id: ItemID.rubber, data: 0}
	]);
	Recipes.addShapeless({id: ItemID.cableIron3, count: 1, data: 0}, [
		{id: ItemID.cableIron1, data: 0},
		{id: ItemID.rubber, data: 0},
		{id: ItemID.rubber, data: 0}
	]);
	Recipes.addShapeless({id: ItemID.cableIron3, count: 1, data: 0}, [
		{id: ItemID.cableIron0, data: 0},
		{id: ItemID.rubber, data: 0},
		{id: ItemID.rubber, data: 0},
		{id: ItemID.rubber, data: 0}
	]);
});

class ItemCable
extends ItemCommon
implements ItemFuncs {
	maxVoltage: number;

	constructor(stringID: string, name: string, texture: string | Item.TextureData, maxVoltage: number) {
		super(stringID, name, texture);
		this.maxVoltage = maxVoltage;
	}

	onNameOverride(item: ItemInstance, name: string): string {
		return name + "\n§7" + Translation.translate("Max voltage: ") + this.maxVoltage + " EU/t";
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void {
		let region = BlockSource.getDefaultForActor(player);
		let place: Vector = coords;
		if (!World.canTileBeReplaced(block.id, block.data)) {
			place = coords.relative;
			block = region.getBlock(place.x, place.y, place.z);
			if (!World.canTileBeReplaced(block.id, block.data)) return;
		}
		region.setBlock(place.x, place.y, place.z, BlockID[this.stringID], 0);
		if (Game.isItemSpendingAllowed(player)) {
			Entity.setCarriedItem(player, item.id, item.count - 1, item.data);
		}
		EnergyTypeRegistry.onWirePlaced(place.x, place.y, place.z);
	}

	static createItem(stringID: string, name: string, texture: string | Item.TextureData, maxVoltage: number) {
		return new this(stringID, name, texture, maxVoltage);
	}
}

ItemCable.createItem("cableTin0", "tin_cable", {name: "cable_tin", meta: 0}, 32);
ItemCable.createItem("cableTin1", "tin_cable_insulated", {name: "cable_tin", meta: 1}, 32);

ItemCable.createItem("cableCopper0", "copper_cable", {name: "cable_copper", meta: 0}, 128);
ItemCable.createItem("cableCopper1", "copper_cable_insulated", {name: "cable_copper", meta: 1}, 128);

ItemCable.createItem("cableGold0", "gold_cable", {name: "cable_gold", meta: 0}, 512);
ItemCable.createItem("cableGold1", "gold_cable_insulated", {name: "cable_gold", meta: 1}, 512);
ItemCable.createItem("cableGold2", "gold_cable_insulated_2x", {name: "cable_gold", meta: 2}, 512);

ItemCable.createItem("cableIron0", "iron_cable", {name: "cable_iron", meta: 0}, 2048);
ItemCable.createItem("cableIron1", "iron_cable_insulated", {name: "cable_iron", meta: 1}, 2048);
ItemCable.createItem("cableIron2", "iron_cable_insulated_2x", {name: "cable_iron", meta: 2}, 2048);
ItemCable.createItem("cableIron3", "iron_cable_insulated_3x", {name: "cable_iron", meta: 3}, 2048);

ItemCable.createItem("cableOptic", "optic_cable", "cable_optic", 8192);

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
	Recipes.addShapeless({id: ItemID.cableTin1, count: 1, data: 0}, [{id: ItemID.cableTin0, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableCopper1, count: 1, data: 0}, [{id: ItemID.cableCopper0, data: 0}, {id: ItemID.rubber, data: 0}]);

	Recipes.addShapeless({id: ItemID.cableGold1, count: 1, data: 0}, [{id: ItemID.cableGold0, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableGold2, count: 1, data: 0}, [{id: ItemID.cableGold1, data: 0}, {id: ItemID.rubber, data: 0}]);
	addShapelessRecipe({id: ItemID.cableGold2, count: 1, data: 0}, [{id: ItemID.cableGold0, count: 1, data: 0}, {id: ItemID.rubber, count: 2, data: 0}]);

	Recipes.addShapeless({id: ItemID.cableIron1, count: 1, data: 0}, [{id: ItemID.cableIron0, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableIron2, count: 1, data: 0}, [{id: ItemID.cableIron1, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron2, data: 0}, {id: ItemID.rubber, data: 0}]);
	addShapelessRecipe({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron1, count: 1, data: 0}, {id: ItemID.rubber, count: 2, data: 0}]);
	addShapelessRecipe({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron0, count: 1, data: 0}, {id: ItemID.rubber, count: 3, data: 0}]);
});

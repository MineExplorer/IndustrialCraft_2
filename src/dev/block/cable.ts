BlockRegistry.createBlockType("cable", {
	destroyTime: 0.05,
	explosionResistance: 0.5,
	renderLayer: 1,
});

BlockRegistry.createBlock("cableTin0", [
	{name: "tile.cableTin.name", texture: [["cable_tin", 0]], inCreative: false}
], "cable");
CableRegistry.createBlock("cableTin1", {name: "tile.cableTin.name", texture: "cable_tin1"}, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableTin0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableTin1, "stone");

BlockRegistry.createBlock("cableCopper0", [
	{name: "tile.cableCopper.name", texture: [["cable_copper", 0]], inCreative: false},
], "cable");
CableRegistry.createBlock("cableCopper1", {name: "tile.cableCopper.name", texture: "cable_copper1"}, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableCopper0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableCopper1, "stone");

BlockRegistry.createBlock("cableGold0", [
	{name: "tile.cableGold.name", texture: [["cable_gold", 0]], inCreative: false},
], "cable");
CableRegistry.createBlock("cableGold1", {name: "tile.cableGold.name", texture: "cable_gold1"}, "cable");
CableRegistry.createBlock("cableGold2", {name: "tile.cableGold.name", texture: "cable_gold2"}, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableGold0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableGold1, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableGold2, "stone");

BlockRegistry.createBlock("cableIron0", [
	{name: "tile.cableIron.name", texture: [["cable_iron", 0]], inCreative: false},
], "cable");
CableRegistry.createBlock("cableIron1", {name: "tile.cableIron.name", texture: "cable_iron1"}, "cable");
CableRegistry.createBlock("cableIron2", {name: "tile.cableIron.name", texture: "cable_iron2"}, "cable");
CableRegistry.createBlock("cableIron3", {name: "tile.cableIron.name", texture: "cable_iron3"}, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableIron0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableIron1, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableIron2, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableIron3, "stone");

CableRegistry.createBlock("cableOptic", {name: "tile.cableOptic.name", texture: "cable_glass"}, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableOptic, "stone");

// energy net
CableRegistry.registerCable("cableTin", 32, 1);
CableRegistry.registerCable("cableCopper", 128, 1);
CableRegistry.registerCable("cableGold", 512, 2);
CableRegistry.registerCable("cableIron", 2048, 3);
CableRegistry.registerCable("cableOptic", 8192);

// block model
TileRenderer.setupWireModel(BlockID.cableTin0, -1, 4/16, "ic-wire");
CableRegistry.setupModel(BlockID.cableTin1, 6/16);

TileRenderer.setupWireModel(BlockID.cableCopper0, -1, 4/16, "ic-wire");
CableRegistry.setupModel(BlockID.cableCopper1, 6/16);

TileRenderer.setupWireModel(BlockID.cableGold0, -1, 3/16, "ic-wire");
CableRegistry.setupModel(BlockID.cableGold1, 5/16);
CableRegistry.setupModel(BlockID.cableGold2, 7/16);

TileRenderer.setupWireModel(BlockID.cableIron0, -1, 6/16, "ic-wire");
CableRegistry.setupModel(BlockID.cableIron1, 8/16);
CableRegistry.setupModel(BlockID.cableIron2, 10/16);
CableRegistry.setupModel(BlockID.cableIron3, 12/16);

CableRegistry.setupModel(BlockID.cableOptic, 1/4);

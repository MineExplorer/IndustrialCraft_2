BlockRegistry.createBlockType("cable", {
	destroyTime: 0.05,
	explosionResistance: 0.5,
	renderLayer: 1,
});

BlockRegistry.createBlock("cableTin0", [
	{name: "tin_cable_0", texture: [["cable_tin", 0]], inCreative: false}
], "cable");
CableRegistry.createBlock("cableTin1", {name: "tin_cable_1", texture: "cable_tin1"}, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableTin0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableTin1, "stone");

BlockRegistry.createBlock("cableCopper0", [
	{name: "copper_cable_0", texture: [["cable_copper", 0]], inCreative: false},
], "cable");
CableRegistry.createBlock("cableCopper1", {name: "copper_cable_1", texture: "cable_copper1"}, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableCopper0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableCopper1, "stone");

BlockRegistry.createBlock("cableGold0", [
	{name: "gold_cable_0", texture: [["cable_gold", 0]], inCreative: false},
], "cable");
CableRegistry.createBlock("cableGold1", {name: "gold_cable_1", texture: "cable_gold1"}, "cable");
CableRegistry.createBlock("cableGold2", {name: "gold_cable_2", texture: "cable_gold2"}, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableGold0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableGold1, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableGold2, "stone");

BlockRegistry.createBlock("cableIron0", [
	{name: "iron_cable_0", texture: [["cable_iron", 0]], inCreative: false},
], "cable");
CableRegistry.createBlock("cableIron1", {name: "iron_cable_1", texture: "cable_iron1"}, "cable");
CableRegistry.createBlock("cableIron2", {name: "iron_cable_2", texture: "cable_iron2"}, "cable");
CableRegistry.createBlock("cableIron3", {name: "iron_cable_3", texture: "cable_iron3"}, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableIron0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableIron1, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableIron2, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableIron3, "stone");

CableRegistry.createBlock("cableOptic", {name: "glass_cable", texture: "cable_glass"}, "cable");
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

Block.createSpecialType({
    destroytime: 0.05,
    explosionres: 0.5,
    renderlayer: 1,
}, "cable");
IDRegistry.genBlockID("cableTin0");
IDRegistry.genBlockID("cableTin1");
Block.createBlock("cableTin0", [
    { name: "tile.cableTin.name", texture: [["cable_tin", 0]], inCreative: false }
], "cable");
CableRegistry.createBlock("cableTin1", { name: "tile.cableTin.name", texture: "cable_tin1" }, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableTin0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableTin1, "stone");
IDRegistry.genBlockID("cableCopper0");
IDRegistry.genBlockID("cableCopper1");
Block.createBlock("cableCopper0", [
    { name: "tile.cableCopper.name", texture: [["cable_copper", 0]], inCreative: false },
], "cable");
CableRegistry.createBlock("cableCopper1", { name: "tile.cableCopper.name", texture: "cable_copper1" }, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableCopper0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableCopper1, "stone");
IDRegistry.genBlockID("cableGold0");
IDRegistry.genBlockID("cableGold1");
IDRegistry.genBlockID("cableGold2");
Block.createBlock("cableGold0", [
    { name: "tile.cableGold.name", texture: [["cable_gold", 0]], inCreative: false },
], "cable");
CableRegistry.createBlock("cableGold1", { name: "tile.cableGold.name", texture: "cable_gold1" }, "cable");
CableRegistry.createBlock("cableGold2", { name: "tile.cableGold.name", texture: "cable_gold2" }, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableGold0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableGold1, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableGold2, "stone");
IDRegistry.genBlockID("cableIron0");
IDRegistry.genBlockID("cableIron1");
IDRegistry.genBlockID("cableIron2");
IDRegistry.genBlockID("cableIron3");
Block.createBlock("cableIron0", [
    { name: "tile.cableIron.name", texture: [["cable_iron", 0]], inCreative: false },
], "cable");
CableRegistry.createBlock("cableIron1", { name: "tile.cableIron.name", texture: "cable_iron1" }, "cable");
CableRegistry.createBlock("cableIron2", { name: "tile.cableIron.name", texture: "cable_iron2" }, "cable");
CableRegistry.createBlock("cableIron3", { name: "tile.cableIron.name", texture: "cable_iron3" }, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableIron0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron1, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron2, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron3, "stone");
IDRegistry.genBlockID("cableOptic");
CableRegistry.createBlock("cableOptic", { name: "tile.cableOptic.name", texture: "cable_glass" }, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableOptic, "stone");
// energy net
CableRegistry.registerCable("cableTin", 32, 1);
CableRegistry.registerCable("cableCopper", 128, 1);
CableRegistry.registerCable("cableGold", 512, 2);
CableRegistry.registerCable("cableIron", 2048, 3);
CableRegistry.registerCable("cableOptic", 8192);
// block model
TileRenderer.setupWireModel(BlockID.cableTin0, -1, 4 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableTin1, 6 / 16);
TileRenderer.setupWireModel(BlockID.cableCopper0, -1, 4 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableCopper1, 6 / 16);
TileRenderer.setupWireModel(BlockID.cableGold0, -1, 3 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableGold1, 5 / 16);
CableRegistry.setupModel(BlockID.cableGold2, 7 / 16);
TileRenderer.setupWireModel(BlockID.cableIron0, -1, 6 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableIron1, 8 / 16);
CableRegistry.setupModel(BlockID.cableIron2, 10 / 16);
CableRegistry.setupModel(BlockID.cableIron3, 12 / 16);
CableRegistry.setupModel(BlockID.cableOptic, 1 / 4);

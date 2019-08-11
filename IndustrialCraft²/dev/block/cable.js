Block.createSpecialType({
	destroytime: 0.5,
	explosionres: 0.5,
	opaque: false,
	lightopacity: 0,
	renderlayer: 3,
}, "part");

IDRegistry.genBlockID("cableTin");
Block.createBlock("cableTin", [
	{name: "tile.cableTin.name", texture: [["tin_cable", 0]], inCreative: false},
	{name: "tile.cableTin.name", texture: [["tin_cable", 1]], inCreative: false}
], "part");
ToolAPI.registerBlockMaterial(BlockID.cableTin, "stone");
Block.setDestroyTime(BlockID.cableTin, 0.05);

IDRegistry.genBlockID("cableCopper");
Block.createBlock("cableCopper", [
	{name: "tile.cableCopper.name", texture: [["copper_cable", 0]], inCreative: false},
	{name: "tile.cableCopper.name", texture: [["copper_cable", 1]], inCreative: false}
], "part");
ToolAPI.registerBlockMaterial(BlockID.cableCopper, "stone");
Block.setDestroyTime(BlockID.cableCopper, 0.05);

IDRegistry.genBlockID("cableGold");
Block.createBlock("cableGold", [
	{name: "tile.cableGold.name", texture: [["gold_cable", 0]], inCreative: false},
	{name: "tile.cableGold.name", texture: [["gold_cable", 1]], inCreative: false},
	{name: "tile.cableGold.name", texture: [["gold_cable", 2]], inCreative: false}
], "part");
ToolAPI.registerBlockMaterial(BlockID.cableGold, "stone");
Block.setDestroyTime(BlockID.cableGold, 0.05);

IDRegistry.genBlockID("cableIron");
Block.createBlock("cableIron", [
	{name: "tile.cableIron.name", texture: [["iron_cable", 0]], inCreative: false},
	{name: "tile.cableIron.name", texture: [["iron_cable", 1]], inCreative: false},
	{name: "tile.cableIron.name", texture: [["iron_cable", 2]], inCreative: false},
	{name: "tile.cableIron.name", texture: [["iron_cable", 3]], inCreative: false}
], "part");
ToolAPI.registerBlockMaterial(BlockID.cableIron, "stone");
Block.setDestroyTime(BlockID.cableIron, 0.05);

IDRegistry.genBlockID("cableOptic");
Block.createBlock("cableOptic", [
	{name: "tile.cableOptic.name", texture: [["glass_cable", 0]], inCreative: false}
]);
ToolAPI.registerBlockMaterial(BlockID.cableOptic, "stone");
Block.setDestroyTime(BlockID.cableOptic, 0.05);

var IC_WIRES = {};
function setupBlockAsWire(id, maxVoltage, insulationLevels){
	EU.registerWire(id, maxVoltage, wireBurnoutFunc);
	IC_WIRES[id] = insulationLevels || 0;
}

// energy net
setupBlockAsWire(BlockID.cableTin, 32, 1);
setupBlockAsWire(BlockID.cableCopper, 128, 1);
setupBlockAsWire(BlockID.cableGold, 512, 2);
setupBlockAsWire(BlockID.cableIron, 2048, 3);
setupBlockAsWire(BlockID.cableOptic, 8192);

// block model
TileRenderer.setupWireModel(BlockID.cableTin, 0, 4/16, "ic-wire");
TileRenderer.setupWireModel(BlockID.cableTin, 1, 6/16, "ic-wire");

TileRenderer.setupWireModel(BlockID.cableCopper, 0, 4/16, "ic-wire");
TileRenderer.setupWireModel(BlockID.cableCopper, 1, 6/16, "ic-wire");

TileRenderer.setupWireModel(BlockID.cableGold, 0, 3/16, "ic-wire");
TileRenderer.setupWireModel(BlockID.cableGold, 1, 5/16, "ic-wire");
TileRenderer.setupWireModel(BlockID.cableGold, 2, 7/16, "ic-wire");

TileRenderer.setupWireModel(BlockID.cableIron, 0, 6/16, "ic-wire");
TileRenderer.setupWireModel(BlockID.cableIron, 1, 8/16, "ic-wire");
TileRenderer.setupWireModel(BlockID.cableIron, 2, 10/16, "ic-wire");
TileRenderer.setupWireModel(BlockID.cableIron, 3, 12/16, "ic-wire");

TileRenderer.setupWireModel(BlockID.cableOptic, 0, 1/4, "ic-wire");

// drop 
Block.registerDropFunction("cableTin", function(coords, id, data){
	return [[ItemID["cableTin" + data], 1, 0]];
});

Block.registerDropFunction("cableCopper", function(coords, id, data){
	return [[ItemID["cableCopper" + data], 1, 0]];
});

Block.registerDropFunction("cableGold", function(coords, id, data){
	return [[ItemID["cableGold" + data], 1, 0]];
});

Block.registerDropFunction("cableIron", function(coords, id, data){
	return [[ItemID["cableIron" + data], 1, 0]];
});

Block.registerDropFunction("cableOptic", function(coords, id, data){
	return [[ItemID.cableOptic, 1, 0]];;
});

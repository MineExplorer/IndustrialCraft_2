Block.createSpecialType({
	destroytime: 0.05,
	explosionres: 0.5,
	renderlayer: 1,
}, "cable");

IDRegistry.genBlockID("cableTin0");
IDRegistry.genBlockID("cableTin1");
Block.createBlock("cableTin0", [
	{name: "tile.cableTin.name", texture: [["cable_tin", 0]], inCreative: false}
], "cable");
ElectricCable.createBlock("cableTin1", {name: "tile.cableTin.name", texture: "cable_tin1"}, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableTin0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableTin1, "stone");


IDRegistry.genBlockID("cableCopper0");
IDRegistry.genBlockID("cableCopper1");
Block.createBlock("cableCopper0", [
	{name: "tile.cableCopper.name", texture: [["cable_copper", 0]], inCreative: false},
], "cable");
ElectricCable.createBlock("cableCopper1", {name: "tile.cableCopper.name", texture: "cable_copper1"}, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableCopper0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableCopper1, "stone");


IDRegistry.genBlockID("cableGold0");
IDRegistry.genBlockID("cableGold1");
IDRegistry.genBlockID("cableGold2");
Block.createBlock("cableGold0", [
	{name: "tile.cableGold.name", texture: [["cable_gold", 0]], inCreative: false},
], "cable");
ElectricCable.createBlock("cableGold1", {name: "tile.cableGold.name", texture: "cable_gold1"}, "cable");
ElectricCable.createBlock("cableGold2", {name: "tile.cableGold.name", texture: "cable_gold2"}, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableGold0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableGold1, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableGold2, "stone");


IDRegistry.genBlockID("cableIron0");
IDRegistry.genBlockID("cableIron1");
IDRegistry.genBlockID("cableIron2");
IDRegistry.genBlockID("cableIron3");
Block.createBlock("cableIron0", [
	{name: "tile.cableIron.name", texture: [["cable_iron", 0]], inCreative: false},
], "cable");
ElectricCable.createBlock("cableIron1", {name: "tile.cableIron.name", texture: "cable_iron1"}, "cable");
ElectricCable.createBlock("cableIron2", {name: "tile.cableIron.name", texture: "cable_iron2"}, "cable");
ElectricCable.createBlock("cableIron3", {name: "tile.cableIron.name", texture: "cable_iron3"}, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableIron0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron1, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron2, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron3, "stone");


IDRegistry.genBlockID("cableOptic");
ElectricCable.createBlock("cableOptic", {name: "tile.cableOptic.name", texture: "cable_glass"}, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableOptic, "stone");

// energy net
ElectricCable.registerCable("cableTin", 32, 1);
ElectricCable.registerCable("cableCopper", 128, 1);
ElectricCable.registerCable("cableGold", 512, 2);
ElectricCable.registerCable("cableIron", 2048, 3);
ElectricCable.registerCable("cableOptic", 8192, 1);

// block model
TileRenderer.setupWireModel(BlockID.cableTin0, -1, 4/16, "ic-wire");
for(let i = 0; i < 16; i++){
	TileRenderer.setupWireModel(BlockID.cableTin1, i, 6/16, "ic-wire");
}

TileRenderer.setupWireModel(BlockID.cableCopper0, -1, 4/16, "ic-wire");
for(let i = 0; i < 16; i++){
	TileRenderer.setupWireModel(BlockID.cableCopper1, i, 6/16, "ic-wire");
}

TileRenderer.setupWireModel(BlockID.cableGold0, -1, 3/16, "ic-wire");
for(let i = 0; i < 16; i++){
	TileRenderer.setupWireModel(BlockID.cableGold1, i, 5/16, "ic-wire");
	TileRenderer.setupWireModel(BlockID.cableGold2, i, 7/16, "ic-wire");
}

TileRenderer.setupWireModel(BlockID.cableIron0, -1, 6/16, "ic-wire");
for(let i = 0; i < 16; i++){
	TileRenderer.setupWireModel(BlockID.cableIron1, i, 8/16, "ic-wire");
	TileRenderer.setupWireModel(BlockID.cableIron2, i, 10/16, "ic-wire");
	TileRenderer.setupWireModel(BlockID.cableIron3, i, 12/16, "ic-wire");
}

TileRenderer.setupWireModel(BlockID.cableOptic, -1, 1/4, "ic-wire");

// drop 
Block.registerDropFunction("cableTin0", function(coords, id, data){
	return [[ItemID.cableTin0, 1, 0]];
});
Block.registerDropFunction("cableTin1", function(coords, id, data){
	return [[ItemID.cableTin1, 1, 0]];
});

Block.registerDropFunction("cableCopper0", function(coords, id, data){
	return [[ItemID.cableCopper0, 1, 0]];
});
Block.registerDropFunction("cableCopper1", function(coords, id, data){
	return [[ItemID.cableCopper1, 1, 0]];
});

for(var i = 0; i <= 2; i++){
	Block.registerDropFunction("cableGold" + i, function(coords, id, data){
		return [[ItemID["cableGold" + i], 1, 0]];
	});
}

for(var i = 0; i <= 3; i++){
	Block.registerDropFunction("cableIron" + i, function(coords, id, data){
		return [[ItemID["cableIron" + i], 1, 0]];
	});
}

Block.registerDropFunction("cableOptic", function(coords, id, data){
	return [[ItemID.cableOptic, 1, 0]];;
});

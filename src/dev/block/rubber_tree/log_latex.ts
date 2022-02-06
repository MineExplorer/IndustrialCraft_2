IDRegistry.genBlockID("rubberTreeLogLatex");
Block.createBlockWithRotation("rubberTreeLogLatex", [
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 0], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 1], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: false},
], "wood");
BlockRegistry.setBlockMaterial(BlockID.rubberTreeLogLatex, "wood");

BlockRegistry.registerDrop("rubberTreeLogLatex", function(coords, blockID) {
	return [[BlockID.rubberTreeLog, 1, 0], [ItemID.latex, 1, 0]];
});

Block.setRandomTickCallback(BlockID.rubberTreeLogLatex, function(x, y, z, id, data, region) {
	if (data < 4 && Math.random() < 1/7) {
		region.setBlock(x, y, z, id, data + 4);
	}
});

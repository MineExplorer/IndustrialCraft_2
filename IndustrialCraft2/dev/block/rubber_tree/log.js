Block.createSpecialType({
	base: 17,
	solid: true,
	destroytime: 2,
	explosionres: 10,
	lightopacity: 15,
	renderlayer: 2,
	translucency: 0,
	sound: "wood"
}, "wood");

IDRegistry.genBlockID("rubberTreeLog");
Block.createBlock("rubberTreeLog", [
	{name: "Rubber Tree Log", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: true},
	{name: "Rubber Tree Log", texture: [["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood", 2], ["rubber_wood", 2]], inCreative: false},
	{name: "Rubber Tree Log", texture: [["rubber_wood", 2], ["rubber_wood", 2], ["rubber_wood", 2], ["rubber_wood", 2], ["rubber_wood", 1], ["rubber_wood", 1]], inCreative: false}
], "wood");
Block.registerDropFunction("rubberTreeLogLatex", function(coords, blockID) {
	return [[blockID, 1, 0]];
});
ToolLib.addBlockDropOnExplosion("rubberTreeLog");
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLog, "wood");
Block.registerPlaceFunction("rubberTreeLog", function(coords, item, block) {
	if (World.canTileBeReplaced(block.id, block.data)) {
		var place = coords;
		var rotation = 0;
	} else {
		var place = coords.relative;
		var rotation = parseInt(coords.side / 2);
	}
	World.setBlock(place.x, place.y, place.z, item.id, rotation);
	World.playSound(place.x + .5, place.y + .5, place.z + .5, "dig.wood", 1, 0.8)
});

IDRegistry.genBlockID("rubberTreeLogLatex");
Block.createBlockWithRotation("rubberTreeLogLatex", [
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 0], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 1], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: false},
], "wood");
Block.registerDropFunction("rubberTreeLogLatex", function(coords, blockID) {
	return [[BlockID.rubberTreeLog, 1, 0], [ItemID.latex, 1, 0]];
});
ToolLib.addBlockDropOnExplosion("rubberTreeLogLatex");
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLogLatex, "wood");
Block.setRandomTickCallback(BlockID.rubberTreeLogLatex, function(x, y, z, id, data) {
	if (data < 4 && Math.random() < 1/7) {
		World.setBlock(x, y, z, id, data + 4);
	}
});

Recipes.addFurnace(BlockID.rubberTreeLog, 17, 3);
Recipes.addShapeless({id: 5, count: 3, data: 3}, [{id: BlockID.rubberTreeLog, data: -1}]);
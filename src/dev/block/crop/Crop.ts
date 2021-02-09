/// <reference path="CropTile.ts"/>
IDRegistry.genBlockID("crop");
Block.createBlock("crop", [
	{ name: "crop", texture: [["stick", 0]], inCreative: false }
], { base: 59, rendertype: 6, explosionres: 0 });
ToolAPI.registerBlockMaterial(BlockID.crop, "wood");
TileRenderer.setEmptyCollisionShape(BlockID.crop);
BlockRenderer.enableCoordMapping(BlockID.crop, 0, TileRenderer.getCropModel(["stick", 0]));

Block.registerDropFunctionForID(BlockID.crop, function (coords, id, data, diggingLevel, toolLevel) {
	return [];
});

TileEntity.registerPrototype(BlockID.crop, new Agriculture.CropTile());
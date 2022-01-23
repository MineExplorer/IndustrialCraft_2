class OreBlock extends BlockBase {
	constructor(id: string, oreName: string, miningLevel: number) {
		super(id, "ore");
		const name = oreName + "_ore";
		const textureName = "ore_" + oreName;
		this.addVariation(name, [[textureName, 0]], true);
		this.setBlockMaterial("stone", miningLevel);
	}
}

BlockRegistry.registerBlock(new OreBlock("oreCopper", "copper", 2));
BlockRegistry.registerBlock(new OreBlock("oreTin", "tin", 2));
BlockRegistry.registerBlock(new OreBlock("oreLead", "lead", 2));
BlockRegistry.registerBlock(new OreBlock("oreUranium", "uranium", 3));
BlockRegistry.registerBlock(new OreBlock("oreIridium", "iridium", 4));
BlockRegistry.registerDrop("oreIridium", function(coords, blockID, blockData, level, enchant) {
	if (level > 3) {
		if (enchant.silk) {
			return [[blockID, 1, 0]];
		}
		let drop: ItemInstanceArray[] = [[ItemID.iridiumChunk, 1, 0]];
		if (Math.random() < enchant.fortune/6) drop.push(drop[0]);
		ToolAPI.dropOreExp(coords, 12, 28, enchant.experience);
		return drop;
	}
	return [];
});

Item.addCreativeGroup("ores", Translation.translate("Ores"), [
	BlockID.oreCopper,
	BlockID.oreTin,
	BlockID.oreLead,
	BlockID.oreUranium,
	BlockID.oreIridium
]);

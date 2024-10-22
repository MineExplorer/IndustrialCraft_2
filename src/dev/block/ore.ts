/// <reference path="./types/BlockOre.ts" />
/// <reference path="./types/BlockOreIridium.ts" />

BlockRegistry.registerBlock(new BlockOre("oreCopper", "copper", 2));
BlockRegistry.registerBlock(new BlockOre("oreTin", "tin", 2));
BlockRegistry.registerBlock(new BlockOre("oreLead", "lead", 2));
BlockRegistry.registerBlock(new BlockOre("oreUranium", "uranium", 3));
BlockRegistry.registerBlock(new BlockOreIridium("oreIridium", "iridium", 4));

Item.addCreativeGroup("ores", Translation.translate("Ores"), [
	BlockID.oreCopper,
	BlockID.oreTin,
	BlockID.oreLead,
	BlockID.oreUranium,
	BlockID.oreIridium
]);

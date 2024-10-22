class BlockOre extends BlockBase {
	constructor(id: string, oreName: string, miningLevel: number) {
		super(id, "ore");
		const name = oreName + "_ore";
		const textureName = "ore_" + oreName;
		this.addVariation(name, [[textureName, 0]], true);
		this.setBlockMaterial("stone", miningLevel);
	}
}
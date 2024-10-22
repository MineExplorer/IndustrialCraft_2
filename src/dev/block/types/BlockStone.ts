class BlockStone extends BlockBase {
	constructor(id: string, name: string, texture: [string, number] | [string, number][], miningLevel: number, blockType: string | BlockType = "stone") {
		super(id, blockType);
		this.addVariation(name, texture, true);
		this.setBlockMaterial("stone", miningLevel);
	}
}
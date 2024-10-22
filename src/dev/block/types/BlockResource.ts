class BlockResource extends BlockBase {
	constructor(id: string, resourceName: string, miningLevel: number) {
		super(id, "stone");
		const name = resourceName + "_block";
		const textureName = "block_" + resourceName;
		this.addVariation(name, [[textureName, 0]], true);
		this.setBlockMaterial("stone", miningLevel);
		this.setDestroyTime(5);
	}
}

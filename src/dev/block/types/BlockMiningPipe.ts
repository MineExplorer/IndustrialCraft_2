class BlockMiningPipe extends BlockBase {
	constructor(id: string, name: string, textureName: string = name) {
		super(id, {
            baseBlock: 1,
            destroyTime: 2,
            renderLayer: 3,
            sound: "stone"
        });
		this.addVariation(name, [[textureName, 0]], true);
		this.addVariation(`tile.${name}.name`, [[textureName, 1]], false);
		this.setBlockMaterial("stone", 1);
		this.setShape({x: 5/16, y: 0, z: 5/16}, {x: 11/16, y: 1, z: 11/16}, 0);
	}
}
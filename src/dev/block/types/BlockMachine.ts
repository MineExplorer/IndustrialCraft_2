/// <reference path="./BlockStone.ts" />

class BlockMachine extends BlockStone {
	constructor(id: string, name: string, texture: [string, number] | [string, number][], miningLevel: number = 1) {
		super(id, name, texture, miningLevel);
		this.setDestroyTime(3);
	}
}

// legacy
BlockRegistry.createBlockType("machine", {
	extends: "stone",
	destroyTime: 3
});
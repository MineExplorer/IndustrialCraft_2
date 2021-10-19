IDRegistry.genBlockID("luminator");
Block.createBlock("luminator", [
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 0]], inCreative: true},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false}
], {renderlayer: 7});

Block.setBlockShape(BlockID.luminator, {x: 0, y: 15/16, z: 0}, {x: 1, y: 1, z: 1}, 0);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1, y: 1/16, z: 1}, 1);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 15/16}, {x: 1, y: 1, z: 1}, 2);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1/16}, 3);
Block.setBlockShape(BlockID.luminator, {x: 15/16, y: 0, z: 0}, {x: 1, y: 1, z: 1}, 4);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1/16, y: 1, z: 1}, 5);

BlockRegistry.registerDrop("luminator", function(coords, blockID, blockData, level, enchant) {
	return [[blockID, 1, 1]];
});


IDRegistry.genBlockID("luminator_on");
Block.createBlock("luminator_on", [
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false}
], {
	destroytime: 2,
	explosionres: 0.5,
	lightlevel: 15,
	renderlayer: 7
});

Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 15/16, z: 0}, {x: 1, y: 1, z: 1}, 0);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1, y: 1/16, z: 1}, 1);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 15/16}, {x: 1, y: 1, z: 1}, 2);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1/16}, 3);
Block.setBlockShape(BlockID.luminator_on, {x: 15/16, y: 0, z: 0}, {x: 1, y: 1, z: 1}, 4);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1/16, y: 1, z: 1}, 5);

BlockRegistry.registerDrop("luminator_on", function(coords, blockID, blockData, level, enchant) {
	return [[BlockID.luminator, 1, 1]];
});


Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.luminator, count: 8, data: 1}, [
		"cxc",
		"aba",
		"aaa",
	], ['a', 20, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.cableTin0, 0, 'c', ItemID.casingIron, 0]);
});

namespace Machine {
	class Lamp extends ElectricMachine {
		defaultValues = {
			isActive: false,
			energy: 0
		}

		getEnergyStorage(): number {
			return 100;
		}

		onItemUse(): boolean {
			this.data.isActive = true;
			return true;
		}

		setBlock(blockID: number): void {
			this.selfDestroy();
			let blockData = this.region.getBlockData(this);
			this.region.setBlock(this, blockID, blockData);
			let tile = this.region.addTileEntity(this);
			tile.data = this.data;
		}

		onTick(): void {
			if (this.data.isActive && this.data.energy >= 0.25) {
				this.setBlock(BlockID.luminator_on)
			}
		}
	}

	class LampOn
	extends Lamp {
		onItemUse(): boolean {
			this.data.isActive = false;
			this.setBlock(BlockID.luminator);
			return true;
		}

		onTick(): void {
			if (this.data.energy < 0.25) {
				this.setBlock(BlockID.luminator);
			} else {
				this.data.energy -= 0.25;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.luminator, new Lamp());
	MachineRegistry.registerPrototype(BlockID.luminator_on, new LampOn());
}

Block.registerPlaceFunction("luminator", function(coords, item, block, player, region) {
	let x = coords.relative.x;
	let y = coords.relative.y;
	let z = coords.relative.z;
	let blockID = region.getBlockId(x, y, z)
	if (GenerationUtils.isTransparentBlock(blockID)) {
		region.setBlock(x, y, z, item.id, coords.side);
		//World.playSound(x, y, z, "dig.stone", 1, 0.8)
		World.addTileEntity(x, y, z, region);
	}
});
BlockRegistry.createBlock("luminator", [
	{name: "Luminator", texture: [["luminator", 0]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 0]], inCreative: true},
	{name: "Luminator", texture: [["luminator", 0]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 0]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 0]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 0]], inCreative: false}
], {destroyTime: 2, explosionResistance: 0.5, renderLayer: 7});
Block.setBlockMaterial(BlockID.luminator, "stone", 1);

Block.setBlockShape(BlockID.luminator, {x: 0, y: 15/16, z: 0}, {x: 1, y: 1, z: 1}, 0);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1, y: 1/16, z: 1}, 1);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 15/16}, {x: 1, y: 1, z: 1}, 2);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1/16}, 3);
Block.setBlockShape(BlockID.luminator, {x: 15/16, y: 0, z: 0}, {x: 1, y: 1, z: 1}, 4);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1/16, y: 1, z: 1}, 5);

BlockRegistry.createBlock("luminator_on", [
	{name: "Luminator", texture: [["luminator", 1]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 1]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 1]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 1]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 1]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 1]], inCreative: false}
], {
	destroyTime: 2,
	explosionResistance: 0.5,
	renderLayer: 7,
	lightLevel: 15
});
Block.setBlockMaterial(BlockID.luminator_on, "stone", 1);

Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 15/16, z: 0}, {x: 1, y: 1, z: 1}, 0);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1, y: 1/16, z: 1}, 1);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 15/16}, {x: 1, y: 1, z: 1}, 2);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1/16}, 3);
Block.setBlockShape(BlockID.luminator_on, {x: 15/16, y: 0, z: 0}, {x: 1, y: 1, z: 1}, 4);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1/16, y: 1, z: 1}, 5);

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
			if (this.blockID == BlockID.luminator_on) {
				this.data.isActive = false;
				this.setBlock(BlockID.luminator);
			} else {
				this.data.isActive = true;
			}
			return true;
		}

		setBlock(blockID: number): void {
			/* @ts-ignore */
			this.blockID = blockID;
			const blockData = this.region.getBlockData(this);
			this.region.setBlock(this, blockID, blockData);
		}

		onTick(): void {
			if (this.data.isActive) {
				if (this.data.energy >= 0.25) {
					this.data.energy -= 0.25;
					if (this.blockID == BlockID.luminator) {
						this.setBlock(BlockID.luminator_on);
					}
				}
				else if (this.blockID == BlockID.luminator_on) {
					this.setBlock(BlockID.luminator);
				}
			}
		}

		getDefaultDrop(): ItemInstance {
			return new ItemStack(BlockID.luminator, 1, 1);
		}

		getDemontaged(): ItemInstance {
			return new ItemStack(BlockID.luminator, 1, 1);
		}
	}

	MachineRegistry.registerPrototype(BlockID.luminator, new Lamp());
	MachineRegistry.registerPrototype(BlockID.luminator_on, new Lamp());
}

Block.registerPlaceFunction("luminator", function(coords, item, block, player, blockSource) {
	const place = coords.relative;
	const tile = blockSource.getBlock(place.x, place.y, place.z);
	if (World.canTileBeReplaced(tile.id, tile.data)) {
		blockSource.setBlock(place.x, place.y, place.z, item.id, coords.side);
		return place;
	}
});
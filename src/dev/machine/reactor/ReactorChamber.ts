BlockRegistry.createBlock("reactorChamber", [
	{name: "Reactor Chamber", texture: [["machine_bottom", 0], ["machine_top", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.reactorChamber, "stone", 1);
ItemRegistry.setRarity(BlockID.reactorChamber, EnumRarity.UNCOMMON);

Block.registerPlaceFunction(BlockID.reactorChamber, function(coords, item, block, player, region) {
	const {x, y, z} = coords.relative;
	let reactorConnect = 0;
	for (let i = 0; i < 6; i++) {
		const c = World.getRelativeCoords(x, y, z, i);
		if (region.getBlockId(c.x, c.y, c.z) == BlockID.nuclearReactor) {
			reactorConnect++;
			if (reactorConnect > 1) break;
		}
	}
	if (reactorConnect == 1) {
		region.setBlock(x, y, z, item.id, 0);
		//World.playSound(x, y, z, "dig.stone", 1, 0.8)
		World.addTileEntity(x, y, z, region);
	} else {
		item.count++;
	}
});

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.reactorChamber, count: 1, data: 0}, [
		" x ",
		"x#x",
		" x "
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.plateLead, 0]);
});


namespace Machine {
	export class ReactorChamber extends Generator {
		data: {
			energy: number,
			corePos: Vector,
			signal: number
		}

		defaultValues = {
			energy: 0,
			corePos: null,
			signal: 0
		}

		core: NuclearReactor = null;

		getTier() {
			return 5;
		}

		onItemClick(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean {
			if (this.core) {
				return this.core.onItemClick(id, count, data, coords, player, extra);
			}
			return false;
		}

		onInit(): void {
			if (this.data.corePos && this.region.getBlockId(this.data.corePos) == BlockID.nuclearReactor) {
				const tileEntity = this.region.getTileEntity(this.data.corePos);
				if (tileEntity) {
					tileEntity.addChamber(this);
				}
			}
			else for (let i = 0; i < 6; i++) {
				const coords = StorageInterface.getRelativeCoords(this, i);
				if (this.region.getBlockId(coords) == BlockID.nuclearReactor) {
					const tileEntity = this.region.getTileEntity(coords);
					if (tileEntity) {
						tileEntity.addChamber(this);
						break;
					}
				}
			}
		}

		onRedstoneUpdate(signal: number): void {
			this.data.signal = signal;
			if (this.core) {
				this.core.updateSignal();
			}
		}

		destroy(): boolean {
			if (this.core) {
				this.core.removeChamber(this);
			}
			return false;
		}

		isConductor(): boolean {
			return true;
		}
	}

	MachineRegistry.registerPrototype(BlockID.reactorChamber, new ReactorChamber());
}
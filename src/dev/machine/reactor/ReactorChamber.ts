BlockRegistry.createBlock("reactorChamber", [
	{name: "Reactor Chamber", texture: [["machine_bottom", 0], ["machine_top", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.reactorChamber, "stone", 1);
ItemRegistry.setRarity(BlockID.reactorChamber, EnumRarity.UNCOMMON);

Block.registerPlaceFunction(BlockID.reactorChamber, function(coords, item, block, player, blockSource) {
	const region = new WorldRegion(blockSource);
	const place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
	let connectedReactors = 0;
	for (let i = 0; i < 6; i++) {
		const c = World.getRelativeCoords(place.x, place.y, place.z, i);
		if (region.getBlockId(c.x, c.y, c.z) == BlockID.nuclearReactor) {
			connectedReactors++;
			if (connectedReactors > 1) break;
		}
	}
	if (connectedReactors == 1) {
		region.setBlock(place, item.id, 0);
		return place;
	}
	item.count++; // prevent item consumption if not placed
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
			super.onInit();
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
IDRegistry.genBlockID("reactorChamber");
Block.createBlock("reactorChamber", [
	{name: "Reactor Chamber", texture: [["machine_bottom", 0], ["machine_top", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.reactorChamber, "stone", 1, true);
ItemRegistry.setRarity(BlockID.reactorChamber, EnumRarity.UNCOMMON);

MachineRegistry.setMachineDrop("reactorChamber");

Block.registerPlaceFunction(BlockID.reactorChamber, function(coords, item, block, player, region) {
	let x = coords.relative.x;
	let y = coords.relative.y;
	let z = coords.relative.z;
	let reactorConnect = 0;
	for (let i = 0; i < 6; i++) {
		let c = World.getRelativeCoords(x, y, z, i);
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
	export class ReactorChamber
	extends Generator {
		__energyNets: any;

		defaultValues = {
			energy: 0,
			x: 0,
			y: -1,
			z: 0
		}

		core: NuclearReactor = null;

		onItemClick(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData) {
			if (this.core) {
				return this.core.onItemClick(id, count, data, coords, player, extra);
			}
			return false;
		}

		init() {
			super.init();
			if (this.data.y >= 0 && this.region.getBlockId(this.data as Vector) == BlockID.nuclearReactor) {
				let tileEnt = this.region.getTileEntity(this.data as Vector);
				if (tileEnt) {
					tileEnt.addChamber(this);
				}
			}
			else for (let i = 0; i < 6; i++) {
				let coords = StorageInterface.getRelativeCoords(this, i);
				if (this.region.getBlockId(coords) == BlockID.nuclearReactor) {
					let tileEnt = this.region.getTileEntity(coords);
					if (tileEnt) {
						tileEnt.addChamber(this);
						break;
					}
				}
			}
		}

		destroy(): boolean {
			if (this.core) {
				this.core.removeChamber(this);
			}
			return false;
		}
	}

	MachineRegistry.registerGenerator(BlockID.reactorChamber, new ReactorChamber());
}
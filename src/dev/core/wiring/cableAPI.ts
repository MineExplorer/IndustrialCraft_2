namespace CableRegistry {
	type CableData = {name: string, insulation: number, maxInsulation: number};

	let insulation_data = {};
	let paint_data: number[] = [];

	export function getCableData(id: number): CableData {
		return insulation_data[id];
	}

	export function canBePainted(id: number): boolean {
		return paint_data.indexOf(id) != -1;
	}

	export function createBlock(nameID: string, properties: {name: string, texture: string}, blockType?: string | Block.SpecialType): void {
		let variations = [];
		for (let i = 0; i < 16; i++) {
			variations.push({name: properties.name, texture: [[properties.texture, i]]});
		}
		Block.createBlock(nameID, variations, blockType);
		paint_data.push(BlockID[nameID]);
	}

	export function registerCable(nameID: string, maxVoltage: number, maxInsulationLevel?: number): void {
		if (maxInsulationLevel) {
			for (let index = 0; index <= maxInsulationLevel; index++) {
				let blockID = BlockID[nameID + index];
				insulation_data[blockID] = {name: nameID, insulation: index, maxInsulation: maxInsulationLevel};
				EU.registerWire(blockID, maxVoltage, cableBurnoutFunc, cableConnectFunc);

				let itemID = ItemID[nameID + index];
				Block.registerDropFunction(nameID + index, function(coords, id, data) {
					return [[itemID, 1, 0]];
				});

				Block.registerPopResourcesFunction(nameID + index, function(coords, block) {
					if (Math.random() < 0.25) {
						World.drop(coords.x + .5, coords.y + .5, coords.z + .5, itemID, 1, 0);
					}
					EnergyTypeRegistry.onWireDestroyed(coords.x, coords.y, coords.z, block.id);
				});
			}
		} else {
			EU.registerWire(BlockID[nameID], maxVoltage, cableBurnoutFunc, cableConnectFunc);
			Block.registerDropFunction(nameID, function(coords, id, data) {
				return [[ItemID[nameID], 1, 0]];
			});
			Block.registerPopResourcesFunction(nameID, function(coords, block) {
				if (Math.random() < 0.25) {
					World.drop(coords.x + .5, coords.y + .5, coords.z + .5, ItemID[nameID], 1, 0);
				}
				EnergyTypeRegistry.onWireDestroyed(coords.x, coords.y, coords.z, block.id);
			});
		}
	}

	export function setupModel(id: number, width: number): void {
		TileRenderer.setupWireModel(id, 0, width, "ic-wire");

		let group = ICRender.getGroup("ic-wire");
		let groupPainted = ICRender.getGroup("ic-wire-painted");
		group.add(id, -1);

		// painted cables
		width /= 2;
		let boxes = [
			{side: [1, 0, 0], box: [0.5 + width, 0.5 - width, 0.5 - width, 1, 0.5 + width, 0.5 + width]},
			{side: [-1, 0, 0], box: [0, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width]},
			{side: [0, 1, 0], box: [0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width, 1, 0.5 + width]},
			{side: [0, -1, 0], box: [0.5 - width, 0, 0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width]},
			{side: [0, 0, 1], box: [0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, 1]},
			{side: [0, 0, -1], box: [0.5 - width, 0.5 - width, 0, 0.5 + width, 0.5 + width, 0.5 - width]},
		]

		for (let data = 1; data < 16; data++) {
			let groupColor = ICRender.getGroup("ic-wire" + data);
			groupColor.add(id, data);
			groupPainted.add(id, data);

			let render = new ICRender.Model();
			let shape = new ICRender.CollisionShape();
			for (let i in boxes) {
				let box = boxes[i];
				// render
				let model = BlockRenderer.createModel();
				model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data);
				let condition1 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false);
				let condition2 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], groupPainted, true);
				let condition3 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], groupColor, false);
				let condition = ICRender.AND(condition1, ICRender.OR(condition2, condition3));
				render.addEntry(model).setCondition(condition);
				// collision shape
				let entry = shape.addEntry();
				entry.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5]);
				entry.setCondition(condition);
			}

			// central box
			let model = BlockRenderer.createModel();
			model.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, id, data);
			render.addEntry(model);

			let entry = shape.addEntry();
			entry.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width);

			let swidth = Math.max(width, 0.25);
			Block.setShape(id, 0.5 - swidth, 0.5 - swidth, 0.5 - swidth, 0.5 + swidth, 0.5 + swidth, 0.5 + swidth, data);

			BlockRenderer.setStaticICRender(id, data, render);
			BlockRenderer.setCustomCollisionShape(id, data, shape);
		}
	}

	function cableBurnoutFunc(voltage: number): void {
		if (ConfigIC.voltageEnabled) {
			for (let key in this.wireMap) {
				let coords = key.split(':');
				// @ts-ignore
				let x = Math.floor(coords[0]), y = Math.floor(coords[1]), z = Math.floor(coords[2]);
				World.setBlock(x, y, z, 0, 0);
				addBurnParticles(x, y, z);
			}
			EnergyNetBuilder.removeNet(this);
		}
	}

	function addBurnParticles(x: number, y: number, z: number): void {
		for (let i = 0; i < 32; i++) {
			let px = x + Math.random();
			let pz = z + Math.random();
			let py = y + Math.random();
			Particles.addParticle(ParticleType.smoke, px, py, pz, 0, 0.01, 0);
		}
	}

	function cableConnectFunc(block: Tile, coord1: Vector, coord2: Vector, side: number): boolean {
		let block2 = World.getBlock(coord2.x, coord2.y, coord2.z);
		if (!CableRegistry.canBePainted(block2.id) || block2.data == 0 || block2.data == block.data) {
			return true;
		}
		return false;
	}
}
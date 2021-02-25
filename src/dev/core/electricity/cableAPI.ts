/// <reference path="EUCableGrid.ts" />

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

	export function createBlock(stringID: string, properties: {name: string, texture: string}, blockType?: string | Block.SpecialType): void {
		let variations = [];
		for (let i = 0; i < 16; i++) {
			variations.push({name: properties.name, texture: [[properties.texture, i]]});
		}
		Block.createBlock(stringID, variations, blockType);
		paint_data.push(BlockID[stringID]);
	}

	export function registerCable(stringID: string, maxVoltage: number, maxInsulationLevel?: number): void {
		if (maxInsulationLevel) {
			for (let index = 0; index <= maxInsulationLevel; index++) {
				let blockID = BlockID[stringID + index];
				insulation_data[blockID] = {name: stringID, insulation: index, maxInsulation: maxInsulationLevel};
				EU.registerWire(blockID, maxVoltage, EUCableGrid);

				let itemID = ItemID[stringID + index];
				Block.registerDropFunction(stringID + index, function(coords, id, data) {
					return [[itemID, 1, 0]];
				});

				Block.registerPopResourcesFunction(stringID + index, function(coords, block, region) {
					if (Math.random() < 0.25) {
						region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, itemID, 1, 0);
					}
					EnergyGridBuilder.onWireDestroyed(region, coords.x, coords.y, coords.z, block.id);
				});
			}
		} else {
			EU.registerWire(BlockID[stringID], maxVoltage, EUCableGrid);
			Block.registerDropFunction(stringID, function(coords, id, data) {
				return [[ItemID[stringID], 1, 0]];
			});
			Block.registerPopResourcesFunction(stringID, function(coords, block, region) {
				if (Math.random() < 0.25) {
					region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, ItemID[stringID], 1, 0);
				}
				EnergyGridBuilder.onWireDestroyed(region, coords.x, coords.y, coords.z, block.id);
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
}
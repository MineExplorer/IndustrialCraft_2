/// <reference path="EUCableGrid.ts" />

namespace CableRegistry {
	type CableData = {name: string, insulation: number, maxInsulation: number};

	const insulationData = {};
	const paintableBlocks: number[] = [];

	export const maxSafetyVoltage = {
		0: 5,
		1: 128,
		2: 512
	}

	export function getCableData(id: number): CableData {
		return insulationData[id];
	}

	export function canBePainted(id: number): boolean {
		return paintableBlocks.indexOf(id) != -1;
	}

	export function getBlockID(stringID: string, insulation: number): number {
		return Block.getNumericId(stringID + insulation);
	}

	export function createBlock(stringID: string, properties: {name: string, texture: string}, blockType?: string | Block.SpecialType): void {
		const variations = [];
		for (let i = 0; i < 16; i++) {
			variations.push({name: properties.name, texture: [[properties.texture, i]]});
		}
		BlockRegistry.createBlock(stringID, variations, blockType);
		paintableBlocks.push(Block.getNumericId(stringID));
	}

	export function registerCable(stringID: string, maxVoltage: number, maxInsulationLevel?: number): void {
		if (maxInsulationLevel) {
			for (let index = 0; index <= maxInsulationLevel; index++) {
				const blockID = Block.getNumericId(stringID + index);
				insulationData[blockID] = {name: stringID, insulation: index, maxInsulation: maxInsulationLevel};
				EU.registerWire(blockID, maxVoltage, EUCableGrid);
				setupDrop(stringID + index);
			}
		} else {
			EU.registerWire(Block.getNumericId(stringID), maxVoltage, EUCableGrid);
			setupDrop(stringID);
		}
	}

	export function setupDrop(blockID: string): void {
		BlockRegistry.registerDrop(blockID, function(coords, id, data) {
			return [[Item.getNumericId(blockID), 1, 0]];
		});
	}

	export function setupModel(id: number, width: number): void {
		TileRenderer.setupWireModel(id, 0, width, "ic-wire");

		const group = ICRender.getGroup("ic-wire");
		const groupPainted = ICRender.getGroup("ic-wire-painted");
		group.add(id, -1);

		// painted cables
		width /= 2;
		const boxes = [
			{side: [1, 0, 0], box: [0.5 + width, 0.5 - width, 0.5 - width, 1, 0.5 + width, 0.5 + width]},
			{side: [-1, 0, 0], box: [0, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width]},
			{side: [0, 1, 0], box: [0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width, 1, 0.5 + width]},
			{side: [0, -1, 0], box: [0.5 - width, 0, 0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width]},
			{side: [0, 0, 1], box: [0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, 1]},
			{side: [0, 0, -1], box: [0.5 - width, 0.5 - width, 0, 0.5 + width, 0.5 + width, 0.5 - width]},
		]

		for (let data = 1; data < 16; data++) {
			const groupColor = ICRender.getGroup("ic-wire" + data);
			groupColor.add(id, data);
			groupPainted.add(id, data);

			const render = new ICRender.Model();
			const shape = new ICRender.CollisionShape();
			for (let box of boxes) {
				// render
				const model = BlockRenderer.createModel();
				model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data);
				const condition1 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false);
				const condition2 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], groupPainted, true);
				const condition3 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], groupColor, false);
				const condition = ICRender.AND(condition1, ICRender.OR(condition2, condition3));
				render.addEntry(model).setCondition(condition);
				// collision shape
				const entry = shape.addEntry();
				entry.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5]);
				entry.setCondition(condition);
			}

			// central box
			const model = BlockRenderer.createModel();
			model.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, id, data);
			render.addEntry(model);

			const entry = shape.addEntry();
			entry.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width);

			BlockRenderer.setStaticICRender(id, data, render);
			BlockRenderer.setCustomCollisionShape(id, data, shape);
			BlockRenderer.setCustomRaycastShape(id, data, shape);
		}
	}
}
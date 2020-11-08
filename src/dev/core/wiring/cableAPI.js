let CableRegistry = {
	insulation_data: {},
	paint_data: [],
	
	getCableData: function(id) {
		return this.insulation_data[id];
	},

	canBePainted: function(id) {
		return this.paint_data.indexOf(id) != -1;
	},
	
	createBlock: function(nameID, properties, blockType) {
		var variations = [];
		for (let i = 0; i < 16; i++) {
			variations.push({name: properties.name, texture: [[properties.texture, i]]});
		}
		Block.createBlock(nameID, variations, blockType);
		this.paint_data.push(BlockID[nameID]);
	},
	
	registerCable: function(nameID, maxVoltage, maxInsulationLevel) {
		if (maxInsulationLevel) {
			for (let index = 0; index <= maxInsulationLevel; index++) {
				let blockID = BlockID[nameID + index];
				this.insulation_data[blockID] = {name: nameID, insulation: index, maxInsulation: maxInsulationLevel};
				EU.registerWire(blockID, maxVoltage, this.cableBurnoutFunc, this.cableConnectFunc);
				
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
			EU.registerWire(BlockID[nameID], maxVoltage, this.cableBurnoutFunc, this.cableConnectFunc);
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
	},

	setupModel: function(id, width) {
		TileRenderer.setupWireModel(id, 0, width, "ic-wire");
		
		var group = ICRender.getGroup("ic-wire");
		var groupPainted = ICRender.getGroup("ic-wire-painted");
		group.add(id, -1);
		
		// painted cables
		width /= 2;
		var boxes = [
			{side: [1, 0, 0], box: [0.5 + width, 0.5 - width, 0.5 - width, 1, 0.5 + width, 0.5 + width]},
			{side: [-1, 0, 0], box: [0, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width]},
			{side: [0, 1, 0], box: [0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width, 1, 0.5 + width]},
			{side: [0, -1, 0], box: [0.5 - width, 0, 0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width]},
			{side: [0, 0, 1], box: [0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, 1]},
			{side: [0, 0, -1], box: [0.5 - width, 0.5 - width, 0, 0.5 + width, 0.5 + width, 0.5 - width]},
		]
		
		for (var data = 1; data < 16; data++) {
			var groupColor = ICRender.getGroup("ic-wire" + data);
			groupColor.add(id, data);
			groupPainted.add(id, data);
			
			var render = new ICRender.Model();
			var shape = new ICRender.CollisionShape();
			for (var i in boxes) {
				var box = boxes[i];
				// render
				var model = BlockRenderer.createModel();
				model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data);
				var condition1 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false);
				var condition2 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], groupPainted, true);
				var condition3 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], groupColor, false);
				var condition = ICRender.AND(condition1, ICRender.OR(condition2, condition3));
				render.addEntry(model).setCondition(condition);
				// collision shape
				var entry = shape.addEntry();
				entry.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5]);
				entry.setCondition(condition);
			}
		
			// central box
			var model = BlockRenderer.createModel();
			model.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, id, data);
			render.addEntry(model);
			
			var entry = shape.addEntry();
			entry.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width);
		
			var swidth = Math.max(width, 0.25);
			Block.setShape(id, 0.5 - swidth, 0.5 - swidth, 0.5 - swidth, 0.5 + swidth, 0.5 + swidth, 0.5 + swidth, data);
			
			BlockRenderer.setStaticICRender(id, data, render);
			BlockRenderer.setCustomCollisionShape(id, data, shape);
		}
	},

	cableBurnoutFunc: function(voltage) {
		if (ConfigIC.voltageEnabled) {
			for (var key in this.wireMap) {
				var coords = key.split(':');
				var x = Math.floor(coords[0]), y = Math.floor(coords[1]), z = Math.floor(coords[2]);
				World.setBlock(x, y, z, 0);
				CableRegistry.addBurnParticles(x, y, z);
			}
			EnergyNetBuilder.removeNet(this);
		}
	},
	
	addBurnParticles: function(x, y, z) {
		for (var i = 0; i < 32; i++) {
			var px = x + Math.random();
			var pz = z + Math.random();
			var py = y + Math.random();
			Particles.addParticle(ParticleType.smoke, px, py, pz, 0, 0.01, 0);
		}
	},

	cableConnectFunc: function(block, coord1, coord2, side) {
		var block2 = World.getBlock(coord2.x, coord2.y, coord2.z);
		if (!CableRegistry.canBePainted(block2.id) || block2.data == 0 || block2.data == block.data) {
			return true;
		}
		return false;
	}
}
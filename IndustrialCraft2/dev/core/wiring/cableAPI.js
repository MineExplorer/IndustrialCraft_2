let CableRegistry = {
	insulation_data: {},
	paint_data: [],
	
	createBlock: function(nameID, properties, blockType){
		var variations = [];
		for(let i = 0; i < 16; i++){
			variations.push({name: properties.name, texture: [[properties.texture, i]]});
		}
		Block.createBlock(nameID, variations, blockType);
		this.paint_data.push(BlockID[nameID]);
	},
	
	registerCable: function(nameID, maxVoltage, maxInsulationLevel){
		if(maxInsulationLevel){
			for(let i = 0; i <= maxInsulationLevel; i++){
				let id = BlockID[nameID+i];
				this.insulation_data[id] = {name: nameID, insulation: i, maxInsulation: maxInsulationLevel};
				EU.registerWire(id, maxVoltage, this.cableBurnoutFunc);

				Block.registerDropFunction(nameID + i, function(coords, id, data){
					return [[ItemID[nameID+i], 1, 0]];
				});

				Block.registerPopResourcesFunction(nameID + i, function(coords, block){
					if(Math.random() < 0.25){
						World.drop(coords.x + .5, coords.y + .5, coords.z + .5, ItemID[nameID+i], 1, 0);
					}
					EnergyTypeRegistry.onWireDestroyed(coords.x, coords.y, coords.z, block.id);
				});
			}
		} else {
			EU.registerWire(BlockID[nameID], maxVoltage, this.cableBurnoutFunc);
			Block.registerDropFunction(nameID, function(coords, id, data){
				return [[ItemID[nameID], 1, 0]];
			});
			Block.registerPopResourcesFunction(nameID, function(coords, block){
				if(Math.random() < 0.25){
					World.drop(coords.x + .5, coords.y + .5, coords.z + .5, ItemID[nameID], 1, 0);
				}
				EnergyTypeRegistry.onWireDestroyed(coords.x, coords.y, coords.z, block.id);
			});
		}
	},

	getCableData: function(id){
		return this.insulation_data[id];
	},

	canBePainted: function(id){
		return this.paint_data.indexOf(id) != -1;
	},

	cableBurnoutFunc: function(voltage){
		if(Config.voltageEnabled){
			for(var key in this.wireMap){
				var coords = key.split(':');
				var x = Math.floor(coords[0]), y = Math.floor(coords[1]), z = Math.floor(coords[2]);
				World.setBlock(x, y, z, 0);
				CableRegistry.addBurnParticles(x, y, z);
			}
			EnergyNetBuilder.removeNet(this);
		}
	},
	
	addBurnParticles: function(x, y, z){
		for(var i = 0; i < 32; i++){
			var px = x + Math.random();
			var pz = z + Math.random();
			var py = y + Math.random();
			Particles.addFarParticle(ParticleType.smoke, px, py, pz, 0, 0.01, 0);
		}
	}
}
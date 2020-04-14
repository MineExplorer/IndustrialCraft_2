let ElectricCable = {
	data: {},
	
	createBlock: function(ID, properties, specialType){
		var variations = [];
		for(let i = 0; i < 16; i++){
			variations.push({name: properties.name, texture: [[properties.texture, i]]});
		}
		Block.createBlock(ID, variations, specialType);
	},
	
	registerCable: function(name, maxVoltage, maxInsulationLevel){
		if(maxInsulationLevel){
			for(let i = 0; i <= maxInsulationLevel; i++){
				let id = BlockID[name + i];
				this.data[id] = {name: name, insulation: i, maxInsulation: maxInsulationLevel};
				EU.registerWire(id, maxVoltage, wireBurnoutFunc);
			}
		} else {
			EU.registerWire(BlockID[name], maxVoltage, wireBurnoutFunc);
		}
	},

	getCableData: function(id){
		return this.data[id];
	}
}
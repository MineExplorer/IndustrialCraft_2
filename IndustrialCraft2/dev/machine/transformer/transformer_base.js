MachineRegistry.registerTransformer = function(id, tier){
	var Prototype = {
		defaultValues: {
			increaseMode: false,
			meta: 0
		},
		
		getEnergyStorage: function(){
			return this.getMaxPacketSize();
		},
		
		getTier: function(){
			return tier;
		},
		
		energyReceive: MachineRegistry.basicEnergyReceiveFunc,
		
		energyTick: function(type, src){
			this.data.last_energy_receive = this.data.energy_receive;
			this.data.energy_receive = 0;
			this.data.last_voltage = this.data.voltage;
			this.data.voltage = 0;
		
			var maxVoltage = this.getMaxPacketSize();
			if(this.data.increaseMode){
				if(this.data.energy >= maxVoltage){
					this.data.energy += src.add(maxVoltage, maxVoltage) - maxVoltage;
				}
			}
			else{
				if(this.data.energy >= maxVoltage/4){
					var output = this.data.energy;
					this.data.energy += src.add(output, maxVoltage/4) - output;
				}
			}
		},
		
		redstone: function(signal){
			var newMode = signal.power > 0;
			if(newMode != this.data.increaseMode){
				this.data.increaseMode = newMode;
				EnergyNetBuilder.rebuildTileNet(this);
			}
		},
		
		isEnergySource: function(){
			return true;
		},
		
		canReceiveEnergy: function(side){
			if(side == this.data.meta){
				return !this.data.increaseMode;
			}
			return this.data.increaseMode;
		},
		
		canExtractEnergy: function(side){
			if(side == this.data.meta){
				return this.data.increaseMode;
			}
			return !this.data.increaseMode;
		},
		
		wrenchClick: function(id, count, data, coords){
			if(this.setFacing(coords)){
				EnergyNetBuilder.rebuildTileNet(this);
				return true;
			}
			return false;
		},
		
		setFacing: MachineRegistry.setFacing,
		
		renderModel: function(){
			TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta);
		},
		
		destroy: function(){
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
		}
	};
	
	this.registerElectricMachine(id, Prototype);
	TileRenderer.setRotationPlaceFunction(id, true);
}

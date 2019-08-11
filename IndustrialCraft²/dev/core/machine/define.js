var MachineRegistry = {
	machineIDs: {},

	isMachine: function(id){
		return this.machineIDs[id];
	},
	
	// Machine Base
	registerPrototype: function(id, Prototype){
		// register ID
		this.machineIDs[id] = true;
		Prototype.id = id;
		
		// click fix
		Prototype.onItemClick = function(id, count, data, coords){
			if (id == ItemID.debugItem || id == ItemID.EUMeter) return false;
			if (this.click(id, count, data, coords)) return true;
			if (Entity.getSneaking(player)) return false;
			var gui = this.getGuiScreen();
			if (gui){
				this.container.openAs(gui);
				return true;
			}
		};
		
		if(Prototype.wrenchClick){
			Prototype.click = function(id, count, data, coords){
				if(ICTool.isValidWrench(id, data, 10)){
					if(this.wrenchClick(id, count, data, coords))
					ICTool.useWrench(id, data, 10);
					return true;
				}
				return false;
			};
		}
		
		if(!Prototype.initModel){
			Prototype.initModel = this.initModel;
		}
		
		if(Prototype.defaultValues && Prototype.defaultValues.isActive !== undefined){
			if(!Prototype.init){
				Prototype.init = Prototype.initModel;
			}
			if(!Prototype.activate){
				Prototype.activate = this.activateMachine;
			}
			if(!Prototype.deactivate){
				Prototype.deactivate = this.deactivateMachine;
			}
			if(!Prototype.destroy){
				Prototype.destroy = function(){
					BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
				}
			}
		}
		
		ToolAPI.registerBlockMaterial(id, "stone", 1);
		Block.setDestroyTime(id, 3);
		TileEntity.registerPrototype(id, Prototype);
	},
	
	// EU machines
	registerElectricMachine: function(id, Prototype){
		// wire connection
		ICRender.getGroup("ic-wire").add(id, -1);
		// setup energy values
		if (Prototype.defaultValues){
			Prototype.defaultValues.energy = 0;
			Prototype.defaultValues.energy_receive = 0;
			Prototype.defaultValues.last_energy_receive = 0;
			Prototype.defaultValues.voltage = 0;
			Prototype.defaultValues.last_voltage = 0;
		}
		else{
			Prototype.defaultValues = {
				energy: 0,
				energy_receive: 0,
				last_energy_receive: 0,
				voltage: 0,
				last_voltage: 0
			};
		}
		
		Prototype.getTier = Prototype.getTier || function(){
			return 1;
		}
		
		if(!Prototype.getEnergyStorage){
			Prototype.getEnergyStorage = function(){
				return 0;
			};
		}
		
		if(!Prototype.energyTick){
			Prototype.energyTick = function(){
				this.data.last_energy_receive = this.data.energy_receive;
				this.data.energy_receive = 0;
				this.data.last_voltage = this.data.voltage;
				this.data.voltage = 0;
			};
		}
		
		if (!Prototype.getMaxPacketSize) {
			Prototype.getMaxPacketSize = function(tier){
				return Math.pow(2, 3 + this.getTier()*2);
			}
		}
		
		this.registerPrototype(id, Prototype);
		// register for energy net
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	},
	
	registerGenerator(id, Prototype){
		Prototype.canReceiveEnergy = function(){
			return false;
		},
	
		Prototype.isEnergySource = function(){
			return true;
		},
		
		Prototype.energyTick = Prototype.energyTick || this.basicEnergyOutFunc;
		
		this.registerElectricMachine(id, Prototype);
	},
	
	registerEUStorage(id, Prototype){
		Prototype.isEnergySource = function(){
			return true;
		},
		
		Prototype.energyReceive = Prototype.energyReceive || this.basicEnergyReceiveFunc;
		
		Prototype.energyTick = Prototype.energyTick || this.basicEnergyOutFunc;
		
		Prototype.isTeleporterCompatible = true;
		
		this.registerElectricMachine(id, Prototype);
	},
	
	// standart functions
	setStoragePlaceFunction: function(id, fullRotation){
		Block.registerPlaceFunction(BlockID[id], function(coords, item, block){
			Game.prevent();
			var x = coords.relative.x
			var y = coords.relative.y
			var z = coords.relative.z
			block = World.getBlockID(x, y, z)
			if(GenerationUtils.isTransparentBlock(block)){
				World.setBlock(x, y, z, item.id, 0);
				var rotation = TileRenderer.getBlockRotation(fullRotation);
				var tile = World.addTileEntity(x, y, z);
				tile.data.meta = rotation;
				TileRenderer.mapAtCoords(x, y, z, item.id, rotation);
				if(item.extra){
					tile.data.energy = item.extra.getInt("Eu");
				}
			}
		});
	},
	
	getMachineDrop: function(coords, blockID, level, basicDrop){
		BlockRenderer.unmapAtCoords(coords.x, coords.y, coords.z);
		var item = Player.getCarriedItem();
		if(ICTool.isValidWrench(item.id, item.data, 10)){
			ICTool.useWrench(item.id, item.data, 10);
			World.setBlock(coords.x, coords.y, coords.z, 0);
			var chance = ICTool.getWrenchData(item.id).chance;
			if(Math.random() < chance){return [[blockID, 1, 0]];}
			return [[basicDrop || blockID, 1, 0]];
		}
		if(level >= ToolAPI.getBlockDestroyLevel(blockID)){
			return [[basicDrop || blockID, 1, 0]];
		}
		return [];
	},
	
	setFacing: function(coords){
		if(Entity.getSneaking(player)){
			var facing = coords.side + Math.pow(-1, coords.side);
		}else{
			var facing = coords.side;
		}
		if(facing != this.data.meta){
			this.data.meta = facing;
			this.initModel();
			return true;
		}
		return false;
	},
	
	initModel: function(){
		var index = this.hasFullRotation? 6 : 4;
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta + (this.data.isActive? index : 0));
	},
	
	activateMachine: function(){
		var index = this.hasFullRotation? 6 : 4;
		if(!this.data.isActive){
			this.data.isActive = true;
			TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta + index);
		}
	},
	
	deactivateMachine: function(){
		if(this.data.isActive){
			this.data.isActive = false;
			TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta);
		}
	},
	
	updateMachine: function(){
		var block = World.getBlock(this.x, this.y, this.z);
		if(block.id != this.id && block.id > 0){
			Game.message("§2Update tile ID: " + this.id);
			World.setBlock(this.x, this.y, this.z, this.id, 0);
			this.data.meta = 0;
		}
		this.initModel();
	},
	
	basicEnergyOutFunc: function(type, src){
		this.data.last_energy_receive = this.data.energy_receive;
		this.data.energy_receive = 0;
		this.data.last_voltage = this.data.voltage;
		this.data.voltage = 0;
		var output = this.getMaxPacketSize();
		if(this.data.energy >= output){
			this.data.energy += src.add(output) - output;
		}
	},
	
	basicEnergyReceiveFunc: function(type, amount, voltage) {
		var maxVoltage = this.getMaxPacketSize();
		if(voltage > maxVoltage){
			if(voltageEnabled){
				World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, 0.5, true);
				this.selfDestroy();
				return 1;
			}
			var add = Math.min(maxVoltage, this.getEnergyStorage() - this.data.energy);
		}else{
			var add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
		}
		this.data.energy += add;
		this.data.energy_receive += add;
		this.data.voltage = Math.max(this.data.voltage, voltage);
		return add;
	},
	
	isValidEUItem: function(id, count, data, container){
		var level = container.tileEntity.getTier();
		return ChargeItemRegistry.isValidItem(id, "Eu",  level);
	},
	
	isValidEUStorage: function(id, count, data, container){
		var level = container.tileEntity.getTier();
		return ChargeItemRegistry.isValidStorage(id, "Eu",  level);
	},
	
	updateGuiHeader: function(gui, text){
		var header = gui.getWindow("header");
		header.contentProvider.drawing[1].text = Translation.translate(text);
	}
}

var transferByTier = {
	1: 32,
	2: 256,
	3: 2048,
	4: 8192
}
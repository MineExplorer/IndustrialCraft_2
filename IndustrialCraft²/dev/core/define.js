var MachineRegistry = {
	machineIDs: {},

	isMachine: function(id){
		return this.machineIDs[id];
	},

	registerPrototype: function(id, Prototype, notUseEU){
		// register ID
		this.machineIDs[id] = true;
		Prototype.id = id;
		
		// click fix
		Prototype.onItemClick = function(id, count, data, coords){
			if (id == ItemID.debugItem) return false;
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
				if(id == ItemID.wrenchBronze){
					this.wrenchClick(id, count, data, coords);
					ToolAPI.breakCarriedTool(1);
					return true;
				}
				if(id == ItemID.electricWrench && data + 50 <= Item.getMaxDamage(id)){
					this.wrenchClick(id, count, data, coords);
					Player.setCarriedItem(id, 1, data + 50);
					return true;
				}
				return false;
			};
		}
		
		if(Prototype.defaultValues && Prototype.defaultValues.isActive !== undefined){
			if(!Prototype.init){
				Prototype.init = this.initModel;
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
		
		if(!notUseEU){
			// wire connection
			ICRender.getGroup("ic-wire").add(id, -1);
			// setup energy value
			if(Prototype.defaultValues){
				Prototype.defaultValues.energy = 0;
			}
			else{
				Prototype.defaultValues = {
					energy: 0
				};
			}
			// copy functions
			if(!Prototype.getEnergyStorage){
				Prototype.getEnergyStorage = function(){
					return 0;
				};
			}
		}
		ToolAPI.registerBlockMaterial(id, "stone", 1);
		Block.setDestroyTime(id, 3);
		TileEntity.registerPrototype(id, Prototype);
		
		if(!notUseEU){
			// register for energy net
			EnergyTileRegistry.addEnergyTypeForId(id, EU);
		}
	},
	
	// standart functions
	setStoragePlaceFunction: function(id){
		Block.registerPlaceFunction(BlockID[id], function(coords, item, block){
			Game.prevent();
			var x = coords.relative.x
			var y = coords.relative.y
			var z = coords.relative.z
			block = World.getBlockID(x, y, z)
			if(GenerationUtils.isTransparentBlock(block)){
				World.setBlock(x, y, z, item.id, 0);
				var rotation = TileRenderer.getBlockRotation(true);
				var tile = World.addTileEntity(x, y, z);
				tile.data.meta = rotation;
				TileRenderer.mapAtCoords(x, y, z, item.id, rotation);
				if(item.extra){
					tile.data.energy = item.extra.getInt("Eu") + 16;
				}
			}
		});
	},
	
	getMachineDrop: function(coords, blockID, level, standartDrop){
		BlockRenderer.unmapAtCoords(coords.x, coords.y, coords.z);
		var item = Player.getCarriedItem();
		if(item.id==ItemID.wrenchBronze){
			World.setBlock(coords.x, coords.y, coords.z, 0);
			ToolAPI.breakCarriedTool(10);
			if(Math.random() < 0.8){return [[blockID, 1, 0]];}
			return [[standartDrop || blockID, 1, 0]];
		}
		if(item.id==ItemID.electricWrench && item.data + 500 <= Item.getMaxDamage(item.id)){
			World.setBlock(coords.x, coords.y, coords.z, 0);
			Player.setCarriedItem(item.id, 1, item.data + 500);
			return [[blockID, 1, 0]];
		}
		if(level >= ToolAPI.getBlockDestroyLevel(blockID)){
			return [[standartDrop || blockID, 1, 0]];
		}
		return [];
	},
	
	initModel: function(){
		var index = this.hasFullRotation? 6 : 4;
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta + index*this.data.isActive);
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
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta + (4*this.data.isActive || 0));
	},
	
	basicEnergyReceiveFunc: function(type, src){
		var energyNeed = this.getEnergyStorage() - this.data.energy;
		this.data.energy += src.getAll(energyNeed);
	},
	
	isValidEUItem: function(id, count, data, container){
		var level = container.tileEntity.data.power_tier || 0;
		return ChargeItemRegistry.isValidItem(id, "Eu",  level);
	},
	
	isValidEUStorage: function(id, count, data, container){
		var level = container.tileEntity.data.power_tier || 0;
		return ChargeItemRegistry.isValidStorage(id, "Eu",  level);
	},
}

var transferByTier = {
	0: 32,
	1: 256,
	2: 2048,
	3: 8192
}
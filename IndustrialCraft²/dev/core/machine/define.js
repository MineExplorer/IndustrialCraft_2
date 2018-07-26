var MachineRegistry = {
	machineIDs: {},

	isMachine: function(id){
		return this.machineIDs[id];
	},

	registerPrototype: function(id, Prototype, notUseEU){
		// register ID
		this.machineIDs[id] = true;
		/*
		Prototype.click = function(id, count, data, coords){
			if(id==ItemID.wrench || id==ItemID.electricWrench){
				return true;
			}
		}
		*/
		if(!notUseEU){
			// wire connection
			ICRender.getGroup("ic-wire").add(id, -1);
			// setup energy value
			if (Prototype.defaultValues){
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
	getMachineDrop: function(coords, blockID, level, standartDrop){
		BlockRenderer.unmapAtCoords(coords.x, coords.y, coords.z);
		var item = Player.getCarriedItem();
		if(item.id==ItemID.wrenchBronze){
			ToolAPI.breakCarriedTool(10);
			World.setBlock(coords.x, coords.y, coords.z, 0);
			if(Math.random() < 0.8){return [[blockID, 1, 0]];}
			return [[standartDrop || blockID, 1, 0]];
		}
		if(item.id==ItemID.electricWrench && item.data + 500 <= Item.getMaxDamage(item.id)){
			Player.setCarriedItem(item.id, 1, item.data + 500);
			World.setBlock(coords.x, coords.y, coords.z, 0);
			return [[blockID, 1, 0]];
		}
		if(level >= ToolAPI.getBlockDestroyLevel(blockID)){
			return [[standartDrop || blockID, 1, 0]];
		}
		return [];
	},
	
	create6sidesRender: function(id, texture){
		if(texture.length == 2){
			var textures = [
				[texture[1], texture[0], texture[0], texture[0], texture[0], texture[0]],
				[texture[0], texture[1], texture[0], texture[0], texture[0], texture[0]],
				[texture[0], texture[0], texture[1], texture[0], texture[0], texture[0]],
				[texture[0], texture[0], texture[0], texture[1], texture[0], texture[0]],
				[texture[0], texture[0], texture[0], texture[0], texture[1], texture[0]],
				[texture[0], texture[0], texture[0], texture[0], texture[0], texture[1]]
			]
		}
		for(var i = 0; i < 5; i++){
			MachineRenderer.registerRenderModel(id, i, textures[i])
		}
	},
	
	initModel: function(){
		if(this.data.isActive){
			var block = World.getBlock(this.x, this.y, this.z);
			MachineRenderer.mapAtCoords(this.x, this.y, this.z, block.id, block.data);
		}
	},
	
	activateMachine: function(){
		if(!this.data.isActive){
			this.data.isActive = true;
			var block = World.getBlock(this.x, this.y, this.z);
			MachineRenderer.mapAtCoords(this.x, this.y, this.z, block.id, block.data);
		}
	},
	
	deactivateMachine: function(){
		if(this.data.isActive){
			this.data.isActive = false;
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
		}
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
	1:  256,
	2: 2048,
	3: 8192
}
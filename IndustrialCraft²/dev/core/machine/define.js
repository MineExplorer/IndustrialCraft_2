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
		
		// audio
		if(Prototype.getStartSoundFile){
			if(!Prototype.getStartingSoundFile){
				Prototype.getStartingSoundFile = function(){return null;}
			}
			if(!Prototype.getInterruptSoundFile){
				Prototype.getInterruptSoundFile = function(){return null;}
			}
			Prototype.startPlaySound = Prototype.startPlaySound || function(){
				if(!Config.machineSoundEnabled){return;}
				let audio = this.audioSource;
				if(audio && audio.isFinishing){
					audio.stop();
					audio.media = audio.startingSound || audio.startSound;
					audio.start();
					audio.isFinishing = false;
				}
				else if(!this.remove && (!audio || !audio.isPlaying()) && this.dimension == Player.getDimension()){
					this.audioSource = SoundAPI.createSource([this.getStartingSoundFile(), this.getStartSoundFile(), this.getInterruptSoundFile()], this, 16);
				}
			}
			Prototype.stopPlaySound = Prototype.stopPlaySound || function(playInterruptSound){
				let audio = this.audioSource;
				if(audio){
					if(!audio.isPlaying()){
						this.audioSource = null;
					}
					else if(!audio.isFinishing){
						audio.stop();
						if(playInterruptSound){
							audio.playFinishingSound();
						}
					}
				}
			}
		} 
		else {
			Prototype.startPlaySound = Prototype.startPlaySound || function(name){
				if(!Config.machineSoundEnabled){return;}
				let audio = this.audioSource;
				if(!this.remove && (!audio || !audio.isPlaying()) && this.dimension == Player.getDimension()){
					let sound = SoundAPI.playSoundAt(this, name, true, 16);
					this.audioSource = sound;
				}
			}
			Prototype.stopPlaySound = Prototype.stopPlaySound || function(){
				if(this.audioSource && this.audioSource.isPlaying()){
					this.audioSource.stop();
					this.audioSource = null;
				}
			}
		}
		
		
		// machine activation
		if(Prototype.defaultValues && Prototype.defaultValues.isActive !== undefined){
			if(!Prototype.renderModel){
				Prototype.renderModel = this.renderModelWithRotation;
			}
			
			Prototype.setActive = Prototype.setActive || this.setActive;
			
			Prototype.activate = Prototype.activate || function(){
				this.setActive(true);
			}
			Prototype.deactivate = Prototype.deactivate || function(){
				this.setActive(false);
			}
			Prototype.destroy = Prototype.destroy || function(){
				BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
				this.stopPlaySound();
			}
		}
		
		if(!Prototype.init && Prototype.renderModel){
			Prototype.init = Prototype.renderModel;
		}
		
		ToolAPI.registerBlockMaterial(id, "stone", 1, true);
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
				return 8 << this.getTier()*2;
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
	
	// standard functions
	setStoragePlaceFunction: function(id, fullRotation){
		Block.registerPlaceFunction(BlockID[id], function(coords, item, block){
			var place = canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
			World.setBlock(place.x, place.y, place.z, item.id, 0);
			var rotation = TileRenderer.getBlockRotation(fullRotation);
			var tile = World.addTileEntity(place.x, place.y, place.z);
			tile.data.meta = rotation;
			TileRenderer.mapAtCoords(place.x, place.y, place.z, item.id, rotation);
			if(item.extra){
				tile.data.energy = item.extra.getInt("Eu");
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
			this.renderModel();
			return true;
		}
		return false;
	},
	
	renderModel: function(){
		if(this.data.isActive){
			TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, 0);
		} else {
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
		}
	},
	
	renderModelWithRotation: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta + (this.data.isActive? 4 : 0));
	},
	
	renderModelWith6Sides: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta + (this.data.isActive? 6 : 0));
	},
	
	setActive: function(isActive){
		if(this.data.isActive != isActive){
			this.data.isActive = isActive;
			this.renderModel();
		}
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
			if(Config.voltageEnabled){
				World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, 0.5, true);
				var sound = SoundAPI.playSound("Machines/MachineOverload.ogg", false, true);
				if(sound && !sound.source){
					sound.setSource(this, 32);
				}
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
	
	getLiquidFromItem: function(liquid, inputItem, outputItem, hand){
		if(hand) outputItem = {id: 0, count: 0, data: 0};
		var empty = LiquidLib.getEmptyItem(inputItem.id, inputItem.data);
		if(empty && (!liquid && this.interface.canReceiveLiquid(empty.liquid) || empty.liquid == liquid) && !this.liquidStorage.isFull(empty.liquid)){
			if(outputItem.id == empty.id && outputItem.data == empty.data && outputItem.count < Item.getMaxStack(empty.id) || outputItem.id == 0){
				var liquidLimit = this.liquidStorage.getLimit(empty.liquid);
				var storedAmount = this.liquidStorage.getAmount(liquid).toFixed(3);
				var count = Math.min(hand? inputItem.count : 1, parseInt((liquidLimit - storedAmount) / empty.amount));
				if(count > 0){
					this.liquidStorage.addLiquid(empty.liquid, empty.amount * count);
					inputItem.count -= count;
					outputItem.id = empty.id;
					outputItem.data = empty.data;
					outputItem.count += count;
					if(!hand) this.container.validateAll();
				}
				else if(inputItem.count == 1 && empty.storage){
					var amount = Math.min(liquidLimit - storedAmount, empty.amount);
					this.liquidStorage.addLiquid(empty.liquid, amount);
					inputItem.data += amount * 1000;
				}
				if(hand){
					if(outputItem.id){
						Player.addItemToInventory(outputItem.id, outputItem.count, outputItem.data);
					}
					if(inputItem.count == 0) inputItem.id = inputItem.data = 0;
					Player.setCarriedItem(inputItem.id, inputItem.count, inputItem.data);
					return true;
				}
			}
		}
	},
	
	addLiquidToItem: function(liquid, inputItem, outputItem){
		var amount = this.liquidStorage.getAmount(liquid).toFixed(3);
		if(amount > 0){
			var full = LiquidLib.getFullItem(inputItem.id, inputItem.data, liquid);
			if(full && (outputItem.id == full.id && outputItem.data == full.data && outputItem.count < Item.getMaxStack(full.id) || outputItem.id == 0)){
				if(amount >= full.amount){
					this.liquidStorage.getLiquid(liquid, full.amount);
					inputItem.count--;
					outputItem.id = full.id;
					outputItem.data = full.data;
					outputItem.count++;
					this.container.validateAll();
				}
				else if(inputItem.count == 1 && full.storage){
					if(inputItem.id == full.id){
						amount = this.liquidStorage.getLiquid(liquid, full.amount);
						inputItem.data -= amount * 1000;
					} else {
						amount = this.liquidStorage.getLiquid(liquid, full.storage);
						inputItem.id = full.id;
						inputItem.data = (full.storage - amount)*1000;
					}
				}
			}
		}
	},
	
	isValidEUItem: function(id, count, data, container){
		var level = container.tileEntity.getTier();
		return ChargeItemRegistry.isValidItem(id, "Eu", level);
	},
	
	isValidEUStorage: function(id, count, data, container){
		var level = container.tileEntity.getTier();
		return ChargeItemRegistry.isValidStorage(id, "Eu", level);
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

// lever placing fix
Item.registerUseFunctionForID(69, function(coords, item, block){
	if(block.id >= 8192 && MachineRegistry.isMachine(block.id)){
		Game.prevent();
		var side  = coords.side;
		var coord = coords.relative;
		block = World.getBlockID(coord.x, coord.y, coord.z);
		if(canTileBeReplaced(block)){
			Player.decreaseCarriedItem(1);
			World.setBlock(coord.x, coord.y, coord.z, item.id, (6 - side)%6);
		}
	}
});
// buttons placing fix
function BUTTON_PLACE_FUNC(coords, item, block){
	if(block.id >= 8192 && MachineRegistry.isMachine(block.id)){
		Game.prevent();
		var side  = coords.side;
		var coord = coords.relative;
		block = World.getBlockID(coord.x, coord.y, coord.z);
		if(canTileBeReplaced(block)){
			Player.decreaseCarriedItem(1);
			World.setBlock(coord.x, coord.y, coord.z, item.id, side);
		}
	}
}
Item.registerUseFunctionForID(77, BUTTON_PLACE_FUNC);
Item.registerUseFunctionForID(143, BUTTON_PLACE_FUNC);
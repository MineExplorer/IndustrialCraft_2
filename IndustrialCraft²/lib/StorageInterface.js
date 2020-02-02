LIBRARY({
	name: "StorageInterface",
	version: 3,
	shared: true,
	api: "CoreEngine"
});

let StorageInterface = {
	data: {},
	
	directionsBySide: [
		{x: 0, y: -1, z: 0}, // down
		{x: 0, y: 1, z: 0}, // up
		{x: 0, y: 0, z: -1}, // north
		{x: 0, y: 0, z: 1}, // south
		{x: -1, y: 0, z: 0}, // east
		{x: 1, y: 0, z: 0} // west
	],
	
	getRelativeCoords: function(coords, side){
		let dir = this.directionsBySide[side];
		return {x: coords.x + dir.x, y: coords.y + dir.y, z: coords.z + dir.z};
	},
	
	newInstance: function(id, tileEntity){
		let instance = {};
		let obj = this.data[id];
		for(let i in obj){
			instance[i] = obj[i];
		}
		instance.tileEntity = tileEntity;
		instance.container = tileEntity.container;
		return instance;
	},
	
	createInterface: function(id, interface){
		tilePrototype = TileEntity.getPrototype(id);
		if(tilePrototype){
			tilePrototype._init = tilePrototype.init;
			tilePrototype.init = function(){
				this.interface = StorageInterface.newInstance(id, this);
				this._init();
			}
			
			if(!tilePrototype.getTransportSlots){
				let inputSlots = [], outputSlots = [];
				for(let i in interface.slots){
					let slot = interface.slots[i];
					if(slot.input) inputSlots.push(i);
					if(slot.output) outputSlots.push(i);
				}
				tilePrototype.getTransportSlots = function(){
					return {input: inputSlots, output: outputSlots};
				}
			}
			
			tilePrototype.addTransportedItem = function(obj, item, side){
				this.interface.addItem(item, side);
			}
			
			interface.isValidInput = interface.isValidInput || function(){
				return true;
			}
			
			interface.addItem = interface.addItem || function(item, side, maxCount){
				if(!this.isValidInput(item)) return 0;
				let count = 0;
				for(let name in this.slots){
					let slotData = this.slots[name];
					if(slotData.input && (!slotData.isValid || slotData.isValid(item, side, this.tileEntity))){
						let slot = this.container.getSlot(name);
						count += StorageInterface.addItemToSlot(item, slot, maxCount - count);
						if(item.count == 0 || count >= maxCount){break;}
					}
				}
				return count;
			}
			
			interface.getOutputSlots = interface.getItems || function(side){
				let slots = [];
				for(let name in this.slots){
					let slotData = this.slots[name];
					if(slotData.output){
						let item = this.container.getSlot(name);
						if(item.id > 0 && (!slotData.canOutput || slotData.canOutput(item, side, this.tileEntity))){
							slots.push(name);
						}
					}
				}
				return slots;
			}
			
			interface.canReceiveLiquid = interface.canReceiveLiquid || function(luquid, side){
				return false;
			}
			interface.canTransportLiquid = interface.canTransportLiquid || function(luquid, side){
				return false;
			}
			interface.addLiquid = interface.addLiquid || function(luquid, amount){
				return this.tileEntity.liquidStorage.addLiquid(luquid, amount);
			}
			interface.getLiquid = interface.getLiquid || function(luquid, amount){
				return this.tileEntity.liquidStorage.getLiquid(luquid, amount);
			}
			
			this.data[id] = interface;			
		} else {
			Logger.Log("failed to create storage interface: no tile entity for id "+id, "ERROR");
		}
	},
	/* WARNING */
	// if you use this function on native container (furnace, chest, etc)
	// you should set its slot by using container.setSlot(...) after function execution
	addItemToSlot: function(item, slot, count){
		if(slot.id == 0 || slot.id == item.id && slot.data == item.data){
			let maxStack = Item.getMaxStack(item.id);
			let add = Math.min(maxStack - slot.count, item.count);
			if(count) add = Math.min(add, count);
			if(add > 0){
				slot.id = item.id;
				slot.count += add;
				slot.data = item.data;
				if(item.extra) slot.extra = item.extra;
				item.count -= add;
				if(item.count == 0){
					item.id = item.data = 0;
				}
				return add;
			}
		}
		return 0;
	},
	
	getNearestContainers: function(coords, side, sideExcluded){
		let containers = {};
		if(side >= 0 && !sideExcluded){
			let dir = this.getRelativeCoords(coords, side);
			let container = World.getContainer(dir.x, dir.y, dir.z);
			if(container){
				containers[side] = container;
			}
		}
		else for(let s = 0; s < 6; s++){
			if(sideExcluded && s == side) continue;
			let dir = this.getRelativeCoords(coords, s);
			let container = World.getContainer(dir.x, dir.y, dir.z);
			if(container){
				containers[s] = container;
			}
		}
		return containers;
	},
	
	getNearestLiquidStorages: function(coords, side, sideExcluded){
		let storages = {};
		if(side >= 0 && !sideExcluded){
			let dir = this.getRelativeCoords(coords, side);
			let tileEntity = World.getTileEntity(dir.x, dir.y, dir.z);
			if(tileEntity && tileEntity.liquidStorage){
				storages[side] = tileEntity;
			}
		}
		else for(let s = 0; s < 6; s++){
			if(sideExcluded && s == side) continue;
			let dir = this.getRelativeCoords(coords, s);
			let tileEntity = World.getTileEntity(dir.x, dir.y, dir.z);
			if(tileEntity && tileEntity.liquidStorage){
				storages[s] = tileEntity;
			}
		}
		return storages;
	},
	
	putItems: function(items, containers, tile){
		for(let i in items){
			let item = items[i];
			for(let side in containers){
				if(item.count == 0) break;
				let container = containers[side];
				this.putItemToContainer(item, container, parseInt(side));
			}
		}
	},
	
	putItemToContainer: function(item, container, side, maxCount){
		let tileEntity = container.tileEntity;
		let count = 0;
		let slots = [];
		let slotsInitialized = false;
		
		if(tileEntity){
			if(tileEntity.interface){
				return tileEntity.interface.addItem(item, side, maxCount);
			}
			if(tileEntity.getTransportSlots){
				slots = tileEntity.getTransportSlots().input || [];
				slotsInitialized = true;
			}
		}
		if(!slotsInitialized){
			slots = this.getContainerSlots(container);
		}
		for(let i in slots){
			let slot = container.getSlot(slots[i]);
			let added = this.addItemToSlot(item, slot, maxCount - count)
			if(added > 0){
				count += added;
				if(!container.slots){
					container.setSlot(i, slot.id, slot.count, slot.data);
				}
				if(item.count == 0 || count >= maxCount){break;}
			}
		}
		return count;
	},
	
	extractItemsFromContainer: function(inputTile, container, side, maxCount, oneStack){
		let outputTile = container.tileEntity;
		let count = 0;
		let slots = [];
		let slotsInitialized = false;
		
		if(outputTile){
			if(outputTile.interface){
				slots = outputTile.interface.getOutputSlots(side);
				slotsInitialized = true;
			}
			else if(outputTile.getTransportSlots){
				slots = outputTile.getTransportSlots().output || [];
				slotsInitialized = true;
			}
		}
		if(!slotsInitialized){
			slots = this.getContainerSlots(container);
		}
		for(let i in slots){
			let slot = container.getSlot(slots[i]);
			if(slot.id > 0){
				let added = inputTile.interface.addItem(slot, side, maxCount - count);
				if(added > 0){
					count += added;
					if(!container.slots){
						container.setSlot(i, slot.id, slot.count, slot.data);
					}
					if(oneStack || count >= maxCount){break;}
				}
			}
		}
		return count;
	},
	
	extractLiquid: function(liquid, maxAmount, input, output, inputSide){
		if(!liquid){
			liquid = output.liquidStorage.getLiquidStored();
		}
		if(!output.interface || output.interface.canTransportLiquid(liquid, outputSide)){
			this.transportLiquid(liquid, maxAmount, output, input, inputSide + Math.pow(-1, inputSide));
		}
	},
	
	transportLiquid: function(liquid, maxAmount, output, input, outputSide){
		if(liquid){
			let inputSide = outputSide + Math.pow(-1, outputSide);
			let amount = Math.min(output.liquidStorage.getAmount(liquid), maxAmount);
			if(amount > 0 && (!input.interface || input.interface.canReceiveLiquid(liquid, inputSide))){
				let liquidStored = input.liquidStorage.getLiquidStored();
				if(!liquidStored && input.liquidStorage.getLimit(liquid) < 99999999 || liquidStored == liquid){
					output.liquidStorage.getLiquid(liquid, amount - input.liquidStorage.addLiquid(liquid, amount));
				}
			}
		}
	},
	
	getContainerSlots: function(container){
		let slots = [];
		if(container.slots){
			for(let name in container.slots){
				slots.push(name);
			}
		} else {
			for(let i = 0; i < container.getSize(); i++){
				slots.push(i);
			}
		}
		return slots;
	},
	
	// use it in tick function of tile entity
	// require storage interface for tile entity
	checkHoppers: function(tile){
		if(World.getThreadTime()%8 > 0) return;
		for(let side = 1; side < 6; side++){
			let dir = this.getRelativeCoords(tile, side);
			let block = World.getBlock(dir.x, dir.y, dir.z);
			if(block.id == 154 && block.data == side + Math.pow(-1, side)){
				let container = World.getContainer(dir.x, dir.y, dir.z);
				for(let i = 0; i < container.getSize(); i++){
					let slot = container.getSlot(i);
					if(slot.id > 0 && tile.interface.addItem(slot, side, 1)){
						container.setSlot(i, slot.id, slot.count, slot.data);
						break;
					}
				}
			}
		}

		if(World.getBlockID(tile.x, tile.y-1, tile.z) == 154){
			let container = World.getContainer(tile.x, tile.y-1, tile.z);
			let slots = tile.interface.getOutputSlots(0);
			for(let i in slots){
				let item = tile.container.getSlot(slots[i]);
				if(item.id > 0){
					for(let j = 0; j < container.getSize(); j++){
						var slot = container.getSlot(j);
						if(this.addItemToSlot(item, slot, 1)){
							container.setSlot(j, slot.id, slot.count, slot.data);
							return;
						}
					}
				}
			}
		}
	},
	
	// deprecated
	extractItems: function(items, containers, tile){
		for(let i in items){
			let item = items[i];
			let maxStack = Item.getMaxStack(item.id);
			for(let side in containers){
				let container = containers[side];
				let tileEntity = container.tileEntity;
				let slots = [];
				let slotsInitialized = false;
				
				if(tileEntity){
					if(tileEntity.interface){
						slots = tileEntity.interface.getOutputSlots(parseInt(side));
						slotsInitialized = true;
					}
					else if(tileEntity.getTransportSlots){
						slots = tileEntity.getTransportSlots().output || [];
						slotsInitialized = true;
					}
				}
				if(!slotsInitialized){
					slots = this.getContainerSlots(container);
				}
				for(let s in slots){
					let slot = container.getSlot(slots[s]);
					if(slot.id > 0){
						if(tile.interface){
							if(tile.interface.addItem(slot, parseInt(side)) && !container.slots){
								container.setSlot(s, slot.id, slot.count, slot.data);
							}
						}
						else if(this.addItemToSlot(slot, item) && !container.slots){
							container.setSlot(s, slot.id, slot.count, slot.data);
						}
						if(item.count == maxStack){break;}
					}
				}
				if(item.count == maxStack){break;}
			}
			if(tile.interface){return;}
		}
	}
}

EXPORT("StorageInterface", StorageInterface);
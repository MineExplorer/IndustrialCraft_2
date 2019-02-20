LIBRARY({
	name: "StorageInterface",
	version: 1,
	shared: true,
	api: "CoreEngine"
});

var StorageInterface = {
	data: {},
	
	directionsBySide: [
		{x: 0, y: -1, z: 0}, // down
		{x: 0, y: 1, z: 0}, // up
		{x: 0, y: 0, z: -1}, // east
		{x: 0, y: 0, z: 1}, // west
		{x: -1, y: 0, z: 0}, // south
		{x: 1, y: 0, z: 0} // north
	],
	
	getRelativeCoords: function(coords, side){
		var dir = this.directionsBySide[side];
		return {x: coords.x + dir.x, y: coords.y + dir.y, z: coords.z + dir.z};
	},
	
	/* create: function(id, obj){
		tilePrototype = TileEntity.getPrototype(id);
		if(tilePrototype){
			tilePrototype._init = tilePrototype.init;
			tilePrototype.init = function(){
				this.interface.tileEntity = this;
				this.init();
			}
			
			var interface = {
				transportLiquid: this.transportLiquid
			}
			
			for(var i in obj){
				interface[i] = obj[i];
			}
			
			tilePrototype.interface = interface;
			this.data[id] = interface;
			
		}else{
			Logger.log("failed to create storage interface: no tile entity for id "+id, "ERROR");
		}
	}, */
	
	
	getNearestContainers: function(coords, side, sideExcluded){
		var containers = [];
		if(side >= 0 && !sideExcluded){
			var dir = this.getRelativeCoords(coords, side);
			var container = World.getContainer(dir.x, dir.y, dir.z);
			if(container){containers.push(container);}
		}
		else{
			for(var i = 0; i < 6; i++){
				if(sideExcluded && i == side) continue;
				var dir = this.getRelativeCoords(coords, i);
				var container = World.getContainer(dir.x, dir.y, dir.z);
				if(container){containers.push(container);}
			}
		}
		return containers;
	},
	
	getNearestLiquidStorages: function(coords, side, sideExcluded){
		var storages = [];
		if(side >= 0 && !sideExcluded){
			var dir = this.getRelativeCoords(coords, side);
			var tileEntity = World.getTileEntity(dir.x, dir.y, dir.z);
			if(tileEntity && tileEntity.liquidStorage){
				storages.push(tileEntity.liquidStorage);
			}
		}
		else{
			for(var i = 0; i < 6; i++){
				if(sideExcluded && i == side) continue;
				var dir = this.getRelativeCoords(coords, i);
				var tileEntity = World.getTileEntity(dir.x, dir.y, dir.z);
				if(tileEntity && tileEntity.liquidStorage){
					storages.push(tileEntity.liquidStorage);
				}
			}
		}
		return storages;
	},
	
	putItems: function(items, containers, tile){
		for(var i in items){
			var item = items[i];
			for(var c in containers){
				if(item.count == 0) break;
				
				var container = containers[c];
				var tileEntity = container.tileEntity;
				var slots = [];
				var slotsInitialized = false;
				
				if(tileEntity){
					if(tileEntity.addTransportedItem){
						tileEntity.addTransportedItem({}, item, {x: tile.x, y: tile.y, z: tile.z});
						continue;
					}
					if(tileEntity.getTransportSlots){
						slots = tileEntity.getTransportSlots().input || [];
						slotsInitialized = true;
					}
				}
				if(!slotsInitialized){
					slots = this.getContainerSlots(container);
				}
				for(var s in slots){
					var slot = container.getSlot(slots[s]);
					if(item.count == 0){
						break;
					}
					/* if(tileEntity){
						if(isValid && !isValid(item.id, item.count, item.data, container)){
							continue;
						}
					} */
					if(slot.id == 0 || slot.id == item.id && slot.data == item.data){
						var maxstack = slot.id > 0 ? Item.getMaxStack(slot.id) : 64;
						var add = Math.min(maxstack - slot.count, item.count);
						item.count -= add;
						slot.count += add;
						slot.id = item.id;
						slot.data = item.data;
						if(item.extra) slot.extra = item.extra;
						if(!container.slots){
							container.setSlot(s, slot.id, slot.count, slot.data);
						}
					}
				}
			}
			if(item.count == 0){
				item.id = 0;
				item.data = 0;
			}
		}
	},
	
	extractItems: function(items, containers, tile){
		for(var i in items){
			var item = items[i];
			var maxStack = 64;
			for(var c in containers){
				var container = containers[c];
				var tileEntity = container.tileEntity;
				var slots = [];
				var slotsInitialized = false;
				
				if(tileEntity && tileEntity.getTransportSlots){
					slots = tileEntity.getTransportSlots().output || [];
					slotsInitialized = true;
				}
				if(!slotsInitialized){
					slots = this.getContainerSlots(container);
				}
				for(var s in slots){
					var slot = container.getSlot(slots[s]);
					if(slot.id > 0){
						/*
						if(isValid && !isValid(slot.id, slot.count, slot.data, container)){
							continue;
						} */
						if(tile.addTransportedItem){
							tile.addTransportedItem({}, slot, {});
							if(!container.slots){
								container.setSlot(s, slot.id, slot.count, slot.data);
							}
						}
						else if(item.id == slot.id && item.data == slot.data || item.id == 0){
							maxStack = Item.getMaxStack(slot.id);
							var add = Math.min(maxStack - item.count, slot.count);
							slot.count -= add;
							item.count += add;
							item.id = slot.id;
							item.data = slot.data;
							if(slot.extra) item.extra = slot.extra;
							if(slot.count==0) slot.id = slot.data = 0;
							if(!container.slots){
								container.setSlot(s, slot.id, slot.count, slot.data);
							}
							if(item.count == maxStack){break;}
						}
					}
				}
				if(item.count == maxStack){break;}
			}
			if(tile.addTransportedItem){return;}
		}
	},
	
	extractLiquid: function(liquid, maxAmount, input, output){
		for(var i in output){
			var storage = output[i];
			if(!liquid){
				liquid = storage.getLiquidStored();
			}
			if(liquid){
				var limit = input.getLimit(liquid);
				if(limit < 99999999){
					var amount = Math.min(limit - input.getAmount(liquid), maxAmount);
					amount = storage.getLiquid(liquid, amount);
					input.addLiquid(liquid, amount);
					if(input.isFull(liquid)) return;
				}
				else{
					liquid = null;
				}
			}
		}
	},
	
	transportLiquid: function(liquid, maxAmount, output, input){
		for(var i in input){
			var amount = Math.min(output.getAmount(liquid), maxAmount);
			if(amount == 0) return;
			var storage = input[i];
			if(storage.getLimit(liquid) < 99999999){
				output.getLiquid(liquid, amount - storage.addLiquid(liquid, amount));
			}
		}
	},
	
	getContainerSlots: function(container){
		var slots = [];
		if(container.slots){
			for(var name in container.slots){
				slots.push(name);
			}
		}else{
			for(var i = 0; i < container.getSize(); i++){
				slots.push(i);
			}
		}
		return slots;
	}
}

EXPORT("StorageInterface", StorageInterface);
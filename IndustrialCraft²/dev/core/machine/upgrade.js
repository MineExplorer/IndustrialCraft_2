var UpgradeAPI = {
	upgrades: {},
	data: {},

	isUpgrade: function(id){
		return UpgradeAPI.upgrades[id];
	},

	registerUpgrade: function(id, func){
		this.upgrades[id] = true;
		this.data[id] = func;
	},

	callUpgrade: function(item, machine, container, data, coords){
		var callback = this.data[item.id];
		if(callback){
			callback(item, machine, container, data, coords);
		}
	},

	executeUpgrades: function(machine){
		var container = machine.container;
		var data = machine.data;
		var coords = {x: machine.x, y: machine.y, z: machine.z};
		
		var upgrades = [];
		for(var slotName in container.slots){
			if(slotName.match(/Upgrade/)){
				var slot = container.getSlot(slotName);
				if(slot.id){
					var find = false;
					for(var i in upgrades){
						var item = upgrades[i];
						if(item.id == slot.id && item.data == slot.data){
							find = true;
							item.count += slot.count;
						}
					}
					if(!find){
						item = {id: slot.id, count: slot.count, data: slot.data};
						upgrades.push(item);
					}
				}
			}
		}
		for(var i in upgrades){
			this.callUpgrade(upgrades[i], machine, container, data, coords);
		}
	},
	
	findNearestContainers: function(coords, direction){
		var directions = {
			up: {x: 0, y: 1, z: 0},
			down: {x: 0, y: -1, z: 0},
			east: {x: 1, y: 0, z: 0},
			west: {x: -1, y: 0, z: 0},
			south: {x: 0, y: 0, z: 1},
			north: {x: 0, y: 0, z: -1},
		}
		var containers = [];
		if(direction){
			dir = directions[direction]
			var container = World.getContainer(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
			if(container){containers.push(container);}
		}
		else{
			for(var i in directions){
				var dir = directions[i];
				var container = World.getContainer(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
				if(container){containers.push(container);}
			}
		}
		return containers;
	},
	
	findNearestLiquidStorages: function(coords, direction){
		var directions = {
			up: {x: 0, y: 1, z: 0},
			down: {x: 0, y: -1, z: 0},
			east: {x: 1, y: 0, z: 0},
			west: {x: -1, y: 0, z: 0},
			south: {x: 0, y: 0, z: 1},
			north: {x: 0, y: 0, z: -1},
		}
		var storages = [];
		if(direction){
			dir = directions[direction]
			var tileEntity = World.getTileEntity(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
			if(tileEntity && tileEntity.liquidStorage){
				storages.push(tileEntity.liquidStorage);
			}
		}
		else{
			for(var i in directions){
				var dir = directions[i];
				var tileEntity = World.getTileEntity(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
				if(tileEntity && tileEntity.liquidStorage){
					storages.push(tileEntity.liquidStorage);
				}
			}
		}
		return storages;
	},
}


function addItemsToContainers(items, containers, tile){
	for(var i in items){
		var item = items[i];
		for(var c in containers){
			if(item.count==0){
				item.id = 0;
				item.data = 0;
				break;
			}
			
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
				if(container.slots){
					for(var name in container.slots){
						slots.push(name);
					}
				}else{
					for(var s = 0; s < container.getSize(); s++){
						slots.push(s);
					}
				}
			}
			for(var s in slots){
				var slot = container.getSlot(slots[s]);
				if(item.count <= 0){
					break;
				}
				if(slot.id == 0 || slot.id == item.id && slot.data == item.data){
					var maxstack = slot.id > 0 ? Item.getMaxStack(slot.id) : 64;
					var add = Math.min(maxstack - slot.count, item.count);
					item.count -= add;
					slot.count += add;
					slot.id = item.id;
					slot.data = item.data;
					if(!container.slots){
						container.setSlot(s, slot.id, slot.count, slot.data);
					}
				}
			}
		}
		if(item.count==0){
			item.id = 0;
			item.data = 0;
		}
	}
}

function getItemsFrom(items, containers, tile){
	for(var i in items){
		var item = items[i];
		var maxStack = 64;
		var stop = false;
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
				if(container.slots){
					for(var name in container.slots){
						slots.push(name);
					}
				}else{
					for(var s = 0; s < container.getSize(); s++){
						slots.push(s);
					}
				}
			}
			for(var s in slots){
				var slot = container.getSlot(slots[s]);
				if(slot.id > 0){
					if(tile.addTransportedItem){
						stop = tile.addTransportedItem({}, slot, {});
						if(!container.slots){
							container.setSlot(s, slot.id, slot.count, slot.data);
						}
						if(stop) break;
					}
					else if(item.id == slot.id && item.data == slot.data || item.id == 0){
						maxStack = Item.getMaxStack(slot.id);
						var add = Math.min(maxStack - item.count, slot.count);
						slot.count -= add;
						item.count += add;
						item.id = slot.id;
						item.data = slot.data;
						if(slot.count==0) slot.id = slot.data = 0;
						if(!container.slots){
							container.setSlot(s, slot.id, slot.count, slot.data);
						}
						if(item.count == maxStack){break;}
					}
				}
			}
			if(stop || !tile.addTransportedItem &&  item.count == maxStack){break;}
		}
		if(tile.addTransportedItem){return;}
	}
}


function addLiquidToStorages(liquid, output, input){
	var amount = output.getLiquid(liquid, 1);
	if(amount){
		for(var i in input){
			var storage = input[i];
			if(storage.getLimit(liquid) < 99999999){
			amount = storage.addLiquid(liquid, amount);}
		}
		output.addLiquid(liquid, amount);
	}
}

function getLiquidFromStorages(liquid, input, output){
	var amount;
	for(var i in output){
		var storage = output[i];
		if(!liquid){
			liquid = storage.getLiquidStored();
		}
		if(liquid){
			var limit = input.getLimit(liquid);
			if(limit < 99999999){
				if(!amount) amount = Math.min(limit - input.getAmount(liquid), 1);
				amount = storage.getLiquid(liquid, amount);
				input.addLiquid(liquid, amount);
				if(input.isFull(liquid)) return;
			}
			else{
				liquid = null;
			}
		}
	}
}
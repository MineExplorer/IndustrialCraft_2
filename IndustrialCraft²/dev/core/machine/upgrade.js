var UpgradeAPI = {
	_elements: {},

	registerUpgrade: function(id, upgrade){
		UpgradeAPI._elements[id] = upgrade;
	},

	executeUpgrade: function(item, machine, container, data, coords){
		if(UpgradeAPI._elements[item.id]){
			UpgradeAPI._elements[item.id](item.count, machine, container, data, coords);
		}
	},

	executeAll: function(machine){
		var container = machine.container;
		var data = machine.data;
		var coords = {x: machine.x, y: machine.y, z: machine.z};
		
		var upgrades = {};
		for(var slotName in container.slots){
			if(slotName.match(/Upgrade/)){
				var slot = container.getSlot(slotName);
				if(!upgrades[slot.id]){upgrades[slot.id] = slot.count;}
				else{upgrades[slot.id] += slot.count;}
			}
		}
		for(var upgrade in upgrades){
			UpgradeAPI.executeUpgrade({id: upgrade, count: upgrades[upgrade]}, machine, container, data, coords);
		}
		return upgrades;
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
	}
}

function addItemsToContainers(items, containers){
	for(var i in items){
		for(var c in containers){
			var container = containers[c];
			var item = items[i];
			var tileEntity = container.tileEntity;
			var slots = [];
			var slotsInitialized = false;
			
			if(tileEntity){
				if(tileEntity.addTransportedItem){
					tileEntity.addTransportedItem({}, item, {});
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
					for(var i = 0; i < container.getSize(); i++){
						slots.push(i);
					}
				}
			}
			for(var i in slots){
				var slot = container.getSlot(slots[i]);
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
						container.setSlot(i, slot.id, slot.count, slot.data);
					}
				}
			}
			
			if(item.count==0){
				item.id = 0;
				item.data = 0;
				break;
			}
		}
	}
}

function getItemsFrom(items, containers){
	for(var i in items){
		var item = items[i];
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
					for(var i = 0; i < container.getSize(); i++){
						slots.push(i);
					}
				}
			}
			for(var i in slots){
				var slot = container.getSlot(slots[i]);
				if(slot.id > 0 && (item.id == 0 || item.id == slot.id && item.data == slot.data)){
					var add = Math.min(64 - item.count, slot.count);
					slot.count -= add;
					item.count += add;
					item.id = slot.id;
					item.data = slot.data;
					if(slot.count==0) slot.id = slot.data = 0;
					if(!container.slots){
						container.setSlot(i, slot.id, slot.count, slot.data);
					}
				}
			}
			if(item.count==64){break;}
		}
	}
}
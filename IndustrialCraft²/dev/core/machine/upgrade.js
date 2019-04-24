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
	
	getUpgrades: function(machine, container){
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
		return upgrades;
	},

	executeUpgrades: function(machine){
		var container = machine.container;
		var data = machine.data;
		var coords = {x: machine.x, y: machine.y, z: machine.z};
		var upgrades = this.getUpgrades(machine, container);
		for(var i in upgrades){
			this.callUpgrade(upgrades[i], machine, container, data, coords);
		}
	},
}

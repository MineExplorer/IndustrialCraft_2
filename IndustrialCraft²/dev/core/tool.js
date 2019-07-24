var ICTool = {
	wrenchData: {},
	registerWrench: function(id, chance, energyOnUse){
		this.wrenchData[id] = {chance: chance, energy: energyOnUse}
	},
	getWrenchData: function(id){
		return this.wrenchData[id];
	},
	
	isValidWrench: function(id, data, damage){
		var wrench = this.getWrenchData(id);
		if(wrench && (!wrench.energy || data + wrench.energy * damage < Item.getMaxDamage(id))){
			return true;
		}
		return false;
	},
	
	useWrench: function(id, data, damage){
		var wrench = this.getWrenchData(id);
		if(!wrench.energy){
			ToolAPI.breakCarriedTool(damage);
		}else{
			Player.setCarriedItem(id, 1, data + wrench.energy * damage);
		}
	},
	
	addRecipe: function(result, data, tool){
		data.push({id: tool, data: -1});
		Recipes.addShapeless(result, data, function(api, field, result){
			for (var i in field){
				if (field[i].id == tool){
					field[i].data++;
					if (field[i].data >= Item.getMaxDamage(tool)){
						field[i].id = field[i].count = field[i].data = 0;
					}
				}
				else {
					api.decreaseFieldSlot(i);
				}
			}
		});
	}
}

Callback.addCallback("DestroyBlockStart", function(coords, block){
	if(MachineRegistry.machineIDs[block.id]){
		var item = Player.getCarriedItem();
		if(ICTool.isValidWrench(item.id, item.data, 10)){
			Block.setTempDestroyTime(block.id, 0);
		}
	}
});

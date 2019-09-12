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
		if(wrench && (!wrench.energy || data + wrench.energy * damage <= Item.getMaxDamage(id))){
			return true;
		}
		return false;
	},
	
	useWrench: function(id, data, damage){
		var wrench = this.getWrenchData(id);
		if(!wrench.energy){
			ToolAPI.breakCarriedTool(damage);
		}else{
			this.useElectricItem({id: id, data: data}, wrench.energy * damage);
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
	},
	dischargeItem: function(item, consume){
		var energy = 0;
		var armor = Player.getArmorSlot(1);
		var armorChargeData = ChargeItemRegistry.getItemData(armor.id);
		var itemChargeLevel = ChargeItemRegistry.getItemData(item.id).level;
		if(armorChargeData && armorChargeData.level >= itemChargeLevel){
			energy = ChargeItemRegistry.getEnergyFrom(armor, "Eu", consume, consume, 100);
			consume -= energy;
		}
		if(item.data + consume <= Item.getMaxDamage(item.id)){
			if(energy > 0){
				Player.setArmorSlot(1, armor.id, 1, armor.data, armor.extra);
			}
			item.data += consume;
			return true;
		}
		return false;
	},
	useElectricItem: function(item, consume){
		if(this.dischargeItem(item, consume)){
			Player.setCarriedItem(item.id, 1, item.data, item.extra);
			return true;
		}
		return false;
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

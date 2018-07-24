LIBRARY({
	name: "ChargeItem",
	version: 3,
	shared: true,
	api: "CoreEngine"
});

var ChargeItemRegistry = {
	chargeData: {},
	
	registerItem: function(item, energyType, capacity, level, isEnergyStorage){
		Item.setMaxDamage(item, capacity + 1);
		this.chargeData[item] = {
			type: "normal",
			energy: energyType,
			id: item,
			level: level || 0,
			maxCharge: capacity,
			maxDamage: capacity + 1,
			isEnergyStorage: isEnergyStorage
		};
	},
	
	registerFlashItem: function(item, energyType, amount, level){
		this.chargeData[item] = {
			type: "flash",
			id: item,
			level: level || 0,
			energy: energyType,
			amount: amount,
			isEnergyStorage: true
		};
	},
	
	registerChargeFunction: function(id, func){
		this.chargeData[id].chargeFunction = func;
	},
	
	registerDischargeFunction: function(id, func){
		this.chargeData[id].dischargeFunction = func;
	},
	
	getItemData: function(id){
		return this.chargeData[id];
	},
	
	isFlashStorage: function(id){
		var data = this.getItemData(id);
		return (data && data.type == "flash");
	},
	
	isValidItem: function(id, energyType, level){
		var data = this.getItemData(id);
		return (data && data.type == "normal" && data.energy == energyType && data.level <= level);
	},
	
	isValidStorage: function(id, energyType, level){
		var data = this.getItemData(id);
		return (data && data.isEnergyStorage && data.energy == energyType && data.level <= level);
	},
	
	getEnergyStored: function(item, energyType){
		var data = this.getItemData(item.id);
		if(!data || energyType && data.energy != energyType){
			return 0;
		}
		return Math.min(data.maxDamage - item.data, data.maxCharge);
	},
	
	getEnergyFrom: function(item, energyType, amount, transf, level, getFromAll){
		level = level || 0;
		var data = this.getItemData(item.id);
		if(!data || data.energy != energyType || data.level > level || !getFromAll && !data.isEnergyStorage){
			return 0;
		}
		if(data.type == "flash"){
			if(amount < 1){
				return 0;
			}
			item.count--;
			if(item.count < 1){
				item.id = item.data = 0;
			}
			return data.amount;
		}
		
		if(data.dischargeFunction){
			return data.dischargeFunction(item, amount, transf, level);
		}
		else{
			if(item.data < 1){
				item.data = 1;
			}
			
			var energyGot = Math.min(amount, Math.min(data.maxDamage - item.data, transf));
			item.data += energyGot;
			return energyGot;
		}
	},
	
	addEnergyTo: function(item, energyType, amount, transf, level){
		level = level || 0;
		if(!this.isValidItem(item.id, energyType, level)){
			return 0;
		}
		
		var data = this.getItemData(item.id);
		if(data.chargeFunction){
			return data.chargeFunction(item, amount, transf, level);
		}
		else{
			var energyAdd = Math.min(amount, Math.min(item.data - 1, transf));
			item.data -= energyAdd;
			return energyAdd;
		}
	},
	
	transportEnergy: function(api, field, result){
		var data = ChargeItemRegistry.getItemData(result.id);
		var amount = 0;
		for(var i in field){
			if(!ChargeItemRegistry.isFlashStorage(field[i].id)){
				amount += ChargeItemRegistry.getEnergyFrom(field[i], data.energy, data.maxCharge, data.maxCharge, 100, true);
			}
			api.decreaseFieldSlot(i);
		}
		ChargeItemRegistry.addEnergyTo(result, data.energy, amount, amount, 100);
	}
}

EXPORT("ChargeItemRegistry", ChargeItemRegistry);

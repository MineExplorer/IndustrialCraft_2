LIBRARY({
	name: "ChargeItem",
	version: 7,
	shared: true,
	api: "CoreEngine"
});

var ChargeItemRegistry = {
	chargeData: {},
	
	registerItem: function(id, energyType, capacity, transferLimit, level, itemType, inCreativeCharged, inCreativeDischarged){
		if(typeof level != "number"){ // function overload
			inCreativeDischarged = inCreativeCharged;
			inCreativeCharged = itemType;
			itemType = level;
			level = transferLimit;
			transferLimit = capacity;
		}
		Item.setMaxDamage(id, capacity + 1);
		if(inCreativeDischarged){
			Item.addToCreative(id, 1, capacity + 1);
		}
		if(inCreativeCharged){
			Item.addToCreative(id, 1, 1);
		}
		this.chargeData[id] = {
			type: "normal",
			itemType: itemType,
			energy: energyType,
			id: id,
			level: level || 0,
			maxCharge: capacity,
			maxDamage: capacity + 1,
			transferLimit: transferLimit
		};
	},
	
	registerFlashItem: function(id, energyType, amount, level){
		this.chargeData[id] = {
			type: "flash",
			itemType: "storage",
			id: id,
			level: level || 0,
			energy: energyType,
			amount: amount
		};
	},
	
	registerExtraItem: function(id, energyType, capacity, transferLimit, level, itemType, addScale, addToCreative){
		if(addScale){
			Item.setMaxDamage(id, 27);
		}
		if(addToCreative){
			Item.addToCreative(id, addScale? 1 : 0, 1, (new ItemExtraData()).putInt("energy", capacity));
		}
		this.chargeData[id] = {
			type: "extra",
			itemType: itemType,
			energy: energyType,
			id: id,
			level: level || 0,
			maxCharge: capacity,
			transferLimit: transferLimit,
			showScale: addScale || false
		}
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
	
	isValidItem: function(id, energyType, level, itemType){
		var data = this.getItemData(id);
		return (data && data.type != "flash" && (!itemType || data.itemType == itemType) && data.energy == energyType && data.level <= level);
	},
	
	isValidStorage: function(id, energyType, level){
		var data = this.getItemData(id);
		return (data && data.itemType == "storage" && data.energy == energyType && data.level <= level);
	},
	
	getEnergyStored: function(item, energyType){
		var data = this.getItemData(item.id);
		if(!data || energyType && data.energy != energyType){
			return 0;
		}
		if(data.type == "extra"){
			if(item.extra){
				return item.extra.getInt("energy");
			}
			return Math.round((27 - (item.data || 1)) / 26 * data.maxCharge);
		}
		return Math.min(data.maxDamage - item.data, data.maxCharge);
	},
	
	getMaxCharge: function(itemID, energyType){
		var data = this.getItemData(itemID);
		if(!data || energyType && data.energy != energyType){
			return 0;
		}
		return data.maxCharge;
	},
	
	setEnergyStored: function(item, amount){
		var data = this.getItemData(item.id);
		if(!data) return;
		if(!item.extra){
			item.extra = new ItemExtraData();
		}
		item.extra.putInt("energy", amount);
		if(data.showScale){
			item.data = Math.round((data.maxCharge - amount)/data.maxCharge*26 + 1);
		}
	},
	
	getEnergyFrom: function(item, energyType, amount, transf, level, getFromAll){
		var data = this.getItemData(item.id);
		if(!data){return 0;}
		
		if(typeof level != "number"){ // function overload
			getFromAll = level;
			level = transf;
			transf = data.transferLimit;
		}
		
		if(data.energy != energyType || data.level > level || !(getFromAll || data.itemType == "storage")){
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
		if(data.type == "extra"){
			var energyStored = this.getEnergyStored(item);
			var energyGot = Math.min(amount, Math.min(energyStored, transf));
			this.setEnergyStored(item, energyStored - energyGot);
			return energyGot;
		}
		
		if(item.data < 1){
			item.data = 1;
		}
		
		var energyGot = Math.min(amount, Math.min(data.maxDamage - item.data, transf));
		item.data += energyGot;
		return energyGot;
	},
	
	addEnergyTo: function(item, energyType, amount, transf, level){
		var data = this.getItemData(item.id);
		if(!data){return 0;}
		
		if(level == undefined){ // function overload
			level = transf;
			transf = data.transferLimit;
		}
		
		if(!this.isValidItem(item.id, energyType, level)){
			return 0;
		}
		
		if(data.chargeFunction){
			return data.chargeFunction(item, amount, transf, level);
		}
		if(data.type == "extra"){
			var energyStored = this.getEnergyStored(item);
			var energyAdd = Math.min(amount, Math.min(data.maxCharge - energyStored, transf));
			this.setEnergyStored(item, energyStored + energyAdd);
			return energyAdd;
		}
		var energyAdd = Math.min(amount, Math.min(item.data - 1, transf));
		item.data -= energyAdd;
		return energyAdd;
	},
	
	transferEnergy: function(api, field, result){
		var data = ChargeItemRegistry.getItemData(result.id);
		var amount = 0;
		for(var i in field){
			if(!ChargeItemRegistry.isFlashStorage(field[i].id)){
				amount += ChargeItemRegistry.getEnergyStored(field[i], data.energy);
			}
			api.decreaseFieldSlot(i);
		}
		ChargeItemRegistry.addEnergyTo(result, data.energy, amount, amount, data.level);
	}
}

ChargeItemRegistry.transportEnergy = ChargeItemRegistry.transferEnergy; // legacy

EXPORT("ChargeItemRegistry", ChargeItemRegistry);

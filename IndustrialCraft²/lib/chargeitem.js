LIBRARY({
	name: "ChargeItem",
	version: 6,
	shared: true,
	api: "CoreEngine"
});

var ChargeItemRegistry = {
	chargeData: {},
	
	registerItem: function(item, energyType, capacity, transferLimit, level, prefix, inCreativeCharged, inCreativeDischarged){
		if(typeof level != "number"){ // function overload
			inCreativeDischarged = inCreativeCharged;
			inCreativeCharged = prefix;
			prefix = level;
			level = transferLimit;
			transferLimit = capacity;
		}
		if(prefix === true) prefix = "storage"; // legacy
		Item.setMaxDamage(item, capacity + 1);
		if(inCreativeDischarged){
			Item.addToCreative(item, 1, capacity + 1);
		}
		if(inCreativeCharged){
			Item.addToCreative(item, 1, 1);
		}
		this.chargeData[item] = {
			type: "normal",
			prefix: prefix,
			energy: energyType,
			id: item,
			level: level || 0,
			maxCharge: capacity,
			maxDamage: capacity + 1,
			transferLimit: transferLimit
		};
	},
	
	registerFlashItem: function(item, energyType, amount, level){
		this.chargeData[item] = {
			type: "flash",
			prefix: "storage",
			id: item,
			level: level || 0,
			energy: energyType,
			amount: amount
		};
	},
	
	registerExtraItem: function(item, energyType, capacity, transferLimit, level, prefix){
		this.chargeData[item] = {
			type: "extra",
			prefix: prefix,
			energy: energyType,
			id: item,
			level: level || 0,
			maxCharge: capacity,
			extra: energyType,
			transferLimit: transferLimit
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
	
	isValidItem: function(id, energyType, level, prefix){
		var data = this.getItemData(id);
		return (data && data.type != "flash" && (!prefix || data.prefix == prefix) && data.energy == energyType && data.level <= level);
	},
	
	isValidStorage: function(id, energyType, level){
		var data = this.getItemData(id);
		return (data && data.prefix == "storage" && data.energy == energyType && data.level <= level);
	},
	
	getEnergyStored: function(item, energyType){
		var data = this.getItemData(item.id);
		if(!data || energyType && data.energy != energyType){
			return 0;
		}
		if(data.type == "extra"){
			if(item.extra){
				return item.extra.getInt(data.extra);
			}
			return 0;
		}
		return Math.min(data.maxDamage - item.data, data.maxCharge);
	},
	
	getEnergyFrom: function(item, energyType, amount, transf, level, getFromAll){
		var data = this.getItemData(item.id);
		if(!data){return 0;}
		
		if(typeof level != "number"){ // function overload
			getFromAll = level;
			level = transf;
			transf = data.transferLimit;
		}
		
		if(data.energy != energyType || data.level > level || !(getFromAll || data.prefix == "storage")){
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
		if(data.type != "extra"){
			if(item.data < 1){
				item.data = 1;
			}
			
			var energyGot = Math.min(amount, Math.min(data.maxDamage - item.data, transf));
			item.data += energyGot;
			return energyGot;
		}
		if(item.extra){
			var energyStored = item.extra.getInt(data.extra);
			var energyGot = Math.min(amount, Math.min(energyStored, transf));
			item.extra.putInt(data.extra, energyStored - energyGot);
			return energyGot;
		}
		return 0;
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
		if(data.type != "extra"){
			var energyAdd = Math.min(amount, Math.min(item.data - 1, transf));
			item.data -= energyAdd;
			return energyAdd;
		}
		if(!item.extra){
			item.extra = new ItemExtraData();
		}
		var energyStored = item.extra.getInt(data.extra);
		var energyAdd = Math.min(amount, Math.min(data.maxCharge - energyStored, transf));
		item.extra.putInt(data.extra, energyStored + energyAdd);
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
		ChargeItemRegistry.addEnergyTo(result, data.energy, amount, amount, 100);
	}
}

ChargeItemRegistry.transportEnergy = ChargeItemRegistry.transferEnergy; // legacy

EXPORT("ChargeItemRegistry", ChargeItemRegistry);

LIBRARY({
	name: "LiquidLib",
	version: 2,
	shared: true,
	api: "CoreEngine"
});

var LiquidLib = {
	itemData: {},
	
	registerItem: function(liquid, emptyId, fullId, storage){
		this.itemData[fullId] = {id: emptyId, data: 0, liquid: liquid, storage: storage};
		Item.setMaxDamage(fullId, storage);
		if(storage == 1000) LiquidRegistry.registerItem(liquid, {id: emptyId, data: 0}, {id: fullId, data: -1});
	},
	
	getItemLiquid: function(id, data){
		var empty = this.itemData[id];
		if(empty){
			return empty.liquid;
		}
		return LiquidRegistry.getItemLiquid(id, data);
	},
	
	getEmptyItem: function(id, data){
		var empty = LiquidRegistry.getEmptyItem(id, data);
		var emptyData = this.itemData[id];
		if(empty){
			var itemData = {id: empty.id, data: empty.data, liquid: empty.liquid};
			if(emptyData){
				itemData.storage = emptyData.storage;
				itemData.amount = (emptyData.storage - data) / 1000;
			} else {
				itemData.amount = 1;
			}
			return itemData;
		}
		return null;
	},
	
	getFullItem: function (id, data, liquid) {
		for(var i in this.itemData){
			var emptyData = this.itemData[i];
			if(emptyData.liquid == liquid && (id == parseInt(i) && data > 0 || emptyData.id == id)){
				var fullData = {id: parseInt(i), data: 0, amount: (data || emptyData.storage) / 1000, storage: emptyData.storage / 1000};
				return fullData;
			}
		}
		var full = LiquidRegistry.getFullItem(id, data, liquid);
		if(full){
			var fullData = {id: full.id, data: full.data, amount: 1};
			return fullData;
		}
		return null;
	}
}

function LiquidTank(tileEntity, name, limit){
	this.tileEntity = tileEntity;
	this.limit = limit;
	this.data = {
		liquid: null,
		amount: 0
	}
	
	this.getLiquidStored = function(){
		return this.data.liquid;
	}
	
	this.getLimit = function(){
		return this.limit;
	}
	
	this.getAmount = function(liquid){
		if(!liquid || this.data.liquid == liquid){
			return this.data.amount;
		}
		return 0;
	}
	
	this.setAmount = function(liquid, amount){
		this.data.liquid = liquid;
		this.data.amount = amount;
	}
	
	this.getRelativeAmount = function() {
		return this.data.amount / this.limit;
	}
	
	this.addLiquid = function(liquid, amount){
		if(!this.data.liquid || this.data.liquid == liquid){
			this.data.liquid = liquid;
			var add = Math.min(amount, this.limit - this.data.amount);
			this.data.amount += add;
			return amount - add;
		}
		return 0;
	}
	
	this.getLiquid = function(liquid, amount){
		if(amount == undefined){ // function overload
			amount = liquid;
			liquid = null;
		}
		if(!liquid || this.data.liquid == liquid){
			var got = Math.min(amount, this.data.amount);
			this.data.amount -= got;
			if(this.data.amount == 0){
				this.data.liquid = null;
			}
			return got;
		}
		return 0;
	}
	
	this.isFull = function(){
		return this.data.amount < this.limit;
	}
	
	this.isEmpty = function(){
		return this.data.amount == 0;
	}
	
	this.updateUiScale = function(scale, container){
		container = container || this.tileEntity.container;
		this.tileEntity.liquidStorage._setContainerScale(container, scale, this.data.liquid, this.getRelativeAmount());
	}
	
	var tileData = tileEntity.data;
	if(tileData.__liquid_tanks){
		if(tileData.__liquid_tanks[name]){
			this.data = tileData.__liquid_tanks[name];
		} else {
			tileData.__liquid_tanks[name] = this.data;
		}
	}
	else {
		tileData.__liquid_tanks = {};
		tileData.__liquid_tanks[name] = this.data;
	}
}

EXPORT("LiquidLib", LiquidLib);
EXPORT("LiquidTank", LiquidTank);

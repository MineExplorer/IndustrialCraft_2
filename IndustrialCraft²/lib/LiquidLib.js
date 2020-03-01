LIBRARY({
	name: "LiquidLib",
	version: 1,
	shared: true,
	api: "CoreEngine"
});

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

EXPORT("LiquidTank", LiquidTank);
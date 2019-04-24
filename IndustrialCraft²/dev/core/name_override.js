var RARE_ITEM_NAME = function(item, name){
	return "§b" + name;
}

NameOverrides = {
	addTierTooltip: function(id, tier){
		Item.registerNameOverrideFunction(BlockID[id], function(item, name){
			var tooltip = Translation.translate("Power Tier: ") + tier;
			return name + NameOverrides.getTooltip(name, tooltip);
		});
	},
	
	addStorageBlockTooltip: function(id, tier, capacity){
		Item.registerNameOverrideFunction(BlockID[id], function(item, name){
			return NameOverrides.showBlockStorage(name, tier, capacity);
		});
	},
	
	showBlockStorage: function(name, tier, capacity){
		var tierTooltip = Translation.translate("Power Tier: ") + tier;
		tierTooltip = this.getTooltip(name, tierTooltip);
		
		var energy = 0;
		var item = Player.getCarriedItem();
		if(item.extra){
			energy = item.extra.getInt("Eu");
		}
		var energyTooltip = this.displayEnergy(energy) + "/" + capacity + " EU";
		energyTooltip = this.getTooltip(name, energyTooltip);
		
		return name + tierTooltip + energyTooltip;
	},
	
	getTooltip: function(name, tooltip){
		var n = name.length, space = "";
		while(n > tooltip.length){
			space += " ";
			n -= 2;
		}
		return "\n§7" + space + tooltip;
	},
	
	showItemStorage: function(item, name){
		var capacity = Item.getMaxDamage(item.id) - 1;
		var energy = ChargeItemRegistry.getEnergyStored(item);
		return name + "\n§7" + NameOverrides.displayEnergy(energy) + "/" + NameOverrides.displayEnergy(capacity) + " EU";
	},
	
	showRareItemStorage: function(item, name){
		var capacity = Item.getMaxDamage(item.id) - 1;
		var energy = ChargeItemRegistry.getEnergyStored(item);
		if(energy > 0){
			name = "§b" + name;
		}
		return name + "\n§7" + NameOverrides.displayEnergy(energy) + "/" + NameOverrides.displayEnergy(capacity) + " EU";
	},
	
	displayEnergy: function(energy){
		if(energy >= 1e6){
			return Math.floor(energy / 1e5) / 10 + "M";
		}
		if(energy >= 1000){
			return Math.floor(energy / 100) / 10 + "K";
		}
		return energy;
	}
}

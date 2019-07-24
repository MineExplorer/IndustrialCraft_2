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
		var tierText = "§7" + Translation.translate("Power Tier: ") + tier;
		tierText = this.getTooltip(name, tierText);
		
		var energy = 0;
		var item = Player.getCarriedItem();
		if(item.extra){
			energy = item.extra.getInt("Eu");
		}
		var energyText = this.displayEnergy(energy) + "/" + capacity + " EU";
		energyText = this.getTooltip(name, energyText);
		
		return name + tierText + energyText;
	},
	
	getTooltip: function(name, tooltip){
		var n = name.length, l = tooltip.length;
		var space = "";
		if(name[0]=='§') n -= 2;
		if(tooltip[0]=='§') l -= 2;
		while(n > l){
			space += " ";
			n -= 2;
		}
		return "\n" + space + tooltip;
	},
	
	getItemStorageText: function(item, name){
		var capacity = Item.getMaxDamage(item.id) - 1;
		var energy = ChargeItemRegistry.getEnergyStored(item);
		var tooltip = "§7" + NameOverrides.displayEnergy(energy) + "/" + NameOverrides.displayEnergy(capacity) + " EU";
		return NameOverrides.getTooltip(name, tooltip);
	},
	
	showItemStorage: function(item, name){
		var tooltip = NameOverrides.getItemStorageText(item, name);
		return name + tooltip;
	},
	
	showRareItemStorage: function(item, name){
		var capacity = Item.getMaxDamage(item.id) - 1;
		var energy = ChargeItemRegistry.getEnergyStored(item);
		var tooltip = "§7" + NameOverrides.displayEnergy(energy) + "/" + NameOverrides.displayEnergy(capacity) + " EU"
		tooltip = NameOverrides.getTooltip(name, tooltip);
		if(energy > 0){
			name = "§b" + name;
		}
		return name + tooltip;
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

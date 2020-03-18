var RARE_ITEM_NAME = function(item, name){
	return "§b" + name;
}

ItemName = {
	itemRarity: {},
	
	setRarity: function(id, lvl){
		this.itemRarity[id] = lvl;
	},
	
	getRarity: function(id){
		return this.itemRarity[id] || 0;
	},
	
	getRarityCode: function(lvl){
		if(lvl == 1) return "§e";
		if(lvl == 2) return "§b";
		if(lvl == 3) return "§d";
		return "";
	},
	
	addTierTooltip: function(id, tier){
		Item.registerNameOverrideFunction(BlockID[id], function(item, name){
			var tooltip = "§7" + Translation.translate("Power Tier: ") + tier;
			return name + ItemName.getTooltip(name, tooltip);
		});
	},
	
	addStorageBlockTooltip: function(id, tier, capacity){
		Item.registerNameOverrideFunction(BlockID[id], function(item, name){
			return ItemName.showBlockStorage(name, tier, capacity);
		});
	},
	
	addStoredLiquidTooltip: function(id){
		Item.registerNameOverrideFunction(id, function(item, name){
			return name += "\n§7Stored: " + (1000 - item.data) + " mB";
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
		var tooltip = "§7" + this.displayEnergy(energy) + "/" + this.displayEnergy(capacity) + " EU";
		return this.getTooltip(name, tooltip);
	},
	
	showItemStorage: function(item, name){
		var tooltip = ItemName.getItemStorageText(item, name);
		var rarity = ItemName.getRarity(item.id);
		if(rarity > 0 && ChargeItemRegistry.getEnergyStored(item) > 0){
			name = ItemName.getRarityCode(rarity) + name;
		}
		return name + tooltip;
	},
	
	showRareItemStorage: function(item, name){
		ItemName.setRarity(item.id, 2);
		return ItemName.showItemStorage(item, name);
	},
	
	displayEnergy: function(energy){
		if(!Config.debugMode){
			if(energy >= 1e6){
				return Math.floor(energy / 1e5) / 10 + "M";
			}
			if(energy >= 1000){
				return Math.floor(energy / 100) / 10 + "K";
			}
		}
		return energy;
	},
	
	getSideName: function(side){
		var sideNames = {
			en: [
				"first valid",
				"bottom",
				"top",
				"north",
				"south",
				"east",
				"west"
			],
			ru: [
				"первой подходящей",
				"нижней",
				"верхней",
				"северной",
				"южной",
				"восточной",
				"западной"
			],
			zh: [
				"初次生效",
				"底部",
				"顶部",
				"北边",
				"南边",
				"东边",
				"西边"
			],
			es: [
				"Primera vez efectivo",
				"abajo",
				"arriba",
				"norte",
				"sur",
				"este",
				"oeste"
			],
			pt: [
				"Primeira vez eficaz",
				"o lado de baixo",
				"o lado de cima",
				"o norte",
				"o sul",
				"o leste",
				"o oeste"
			]
		}
		if(sideNames[Config.language]){
			return sideNames[Config.language][side+1];
		} else {
			return sideNames["en"][side+1];
		}
	}
}

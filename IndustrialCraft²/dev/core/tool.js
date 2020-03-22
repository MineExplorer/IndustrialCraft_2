let ICTool = {
	wrenchData: {},
	
	registerWrench: function(id, chance, energyOnUse){
		this.wrenchData[id] = {chance: chance, energy: energyOnUse}
	},
	
	getWrenchData: function(id){
		return this.wrenchData[id];
	},
	
	isValidWrench: function(id, data, damage){
		let wrench = this.getWrenchData(id);
		if(wrench && (!wrench.energy || data + wrench.energy * damage <= Item.getMaxDamage(id))){
			return true;
		}
		return false;
	},
	
	useWrench: function(id, data, damage){
		let wrench = this.getWrenchData(id);
		if(!wrench.energy){
			ToolAPI.breakCarriedTool(damage);
		}else{
			this.useElectricItem({id: id, data: data}, wrench.energy * damage);
		}
		SoundAPI.playSound("Tools/Wrench.ogg");
	},
	
	addRecipe: function(result, data, tool){
		data.push({id: tool, data: -1});
		Recipes.addShapeless(result, data, function(api, field, result){
			for (let i in field){
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
		let energy = 0;
		let armor = Player.getArmorSlot(1);
		let armorChargeData = ChargeItemRegistry.getItemData(armor.id);
		if(armorChargeData){
			let itemChargeLevel = ChargeItemRegistry.getItemData(item.id).level;
			energy = ChargeItemRegistry.getEnergyFrom(armor, "Eu", consume, consume, itemChargeLevel);
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
	},
	
	registerElectricHoe: function(nameID){
		Item.registerUseFunction(nameID, function(coords, item, block){
			if((block.id==2 || block.id==3 || block.id==110 || block.id==243) && coords.side==1 && ICTool.useElectricItem(item, 50)){ 
				World.setBlock(coords.x, coords.y, coords.z, 60);
				World.playSoundAtEntity(Player.get(), "step.gravel", 1, 0.8);
			}
		});
	},
	
	registerElectricTreerap: function(nameID){
		Item.registerUseFunction(nameID, function(coords, item, block){
			if(block.id == BlockID.rubberTreeLogLatex && block.data - 2 == coords.side && ICTool.useElectricItem(item, 50)){
				SoundAPI.playSound("Tools/Treetap.ogg");
				World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLogLatex, block.data - 4);
				Entity.setVelocity(
					World.drop(
						coords.relative.x + 0.5,
						coords.relative.y + 0.5,
						coords.relative.z + 0.5,
						ItemID.latex, 1 + parseInt(Math.random() * 3), 0
					),
					(coords.relative.x - coords.x) * 0.25,
					(coords.relative.y - coords.y) * 0.25,
					(coords.relative.z - coords.z) * 0.25
				);
			}
		});
	}
}

Callback.addCallback("DestroyBlockStart", function(coords, block){
	if(MachineRegistry.machineIDs[block.id]){
		let item = Player.getCarriedItem();
		if(ICTool.isValidWrench(item.id, item.data, 10)){
			Block.setTempDestroyTime(block.id, 0);
		}
	}
});

namespace ICTool {
	let wrenchData = {}

	export function registerWrench(id: number, chance: number, energyPerUse: number) {
		wrenchData[id] = {chance: chance, energy: energyPerUse}
	}

	export function getWrenchData(id: number) {
		return wrenchData[id];
	}

	export function isWrench(id: number) {
		return this.getWrenchData(id)? true : false;
	}

	export function isValidWrench(item: ItemInstance, damage: number = 1) {
		let wrench = this.getWrenchData(item.id);
		if (wrench) {
			let energyStored = ChargeItemRegistry.getEnergyStored(item);
			if (!wrench.energy || energyStored >= wrench.energy * damage) {
				return true;
			}
		}
		return false;
	}

	export function useWrench(item: ItemInstance, player: number, damage: number) {
		let wrench = this.getWrenchData(item.id);
		if (!wrench.energy) {
			ToolLib.breakCarriedTool(damage, player);
			return true;
		}
		return this.useElectricItem(item, wrench.energy * damage);
	}

	export function rotateMachine(tileEntity: TileEntity, side: number, item: ItemInstance, player: number) {
		if (Entity.getSneaking(player)) {
			side ^= 1;
		}
		if (tileEntity.setFacing(side)) {
			this.useWrench(item, player, 1);
			SoundManager.playSoundAtBlock(tileEntity, "Wrench.ogg", 1);
		}
	}

	export function addRecipe(result: ItemInstance, data: {id: number, data: number}[], tool: number) {
		data.push({id: tool, data: -1});
		Recipes.addShapeless(result, data, function(api, field, result) {
			for (let i = 0; i < field.length; i++) {
				if (field[i].id == tool) {
					field[i].data++;
					if (field[i].data >= Item.getMaxDamage(tool)) {
						field[i].id = field[i].count = field[i].data = 0;
					}
				}
				else {
					api.decreaseFieldSlot(i);
				}
			}
		});
	}

	export function dischargeItem(item: ItemInstance, consume: number) {
		let energy = 0;
		let armor = Player.getArmorSlot(1);
		let itemChargeLevel = ChargeItemRegistry.getItemData(item.id).tier;
		let armorChargeData = ChargeItemRegistry.getItemData(armor.id);
		if (armorChargeData && armorChargeData.tier >= itemChargeLevel) {
			energy = ChargeItemRegistry.getEnergyFrom(armor, "Eu", consume, 100, true);
			consume -= energy;
		}
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (energyStored >= consume) {
			if (energy > 0) {
				Player.setArmorSlot(1, armor.id, 1, armor.data, armor.extra);
			}
			ChargeItemRegistry.setEnergyStored(item, energyStored - consume);
			return true;
		}
		return false;
	}

	export function useElectricItem(item: ItemInstance, consume: number) {
		if (this.dischargeItem(item, consume)) {
			Player.setCarriedItem(item.id, 1, item.data, item.extra);
			return true;
		}
		return false;
	}

	export function registerElectricHoe(nameID: string) {
		Item.registerUseFunction(nameID, function(coords, item, block) {
			if ((block.id == 2 || block.id == 3 || block.id == 110 || block.id == 243) && coords.side == 1 && ICTool.useElectricItem(item, 50)) { 
				World.setBlock(coords.x, coords.y, coords.z, 60, 0);
				World.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.gravel", 1, 0.8);
			}
		});
	}

	export function registerElectricTreetap(nameID) {
		Item.registerUseFunction(nameID, function(coords, item, block) {
			if (block.id == BlockID.rubberTreeLogLatex && block.data >= 4 && block.data == coords.side + 2 && ICTool.useElectricItem(item, 50)) {
				SoundManager.playSoundAt(coords.vec.x, coords.vec.y, coords.vec.z, "Treetap.ogg");
				World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLogLatex, block.data - 4);
				Entity.setVelocity(
					World.drop(
						coords.relative.x + 0.5,
						coords.relative.y + 0.5,
						coords.relative.z + 0.5,
						ItemID.latex, randomInt(1, 3), 0
					),
					(coords.relative.x - coords.x) * 0.25,
					(coords.relative.y - coords.y) * 0.25,
					(coords.relative.z - coords.z) * 0.25
				);
			}
		});
	}

	export function setOnHandSound(itemID: number, idleSound: string, stopSound: string) {
		Callback.addCallback("LocalTick", function() {
			if (!ConfigIC.soundEnabled) {return;}
			let item = Player.getCarriedItem();
			let tool = ToolAPI.getToolData(item.id) as any;
			if (item.id == itemID && (!tool || !tool.toolMaterial.energyPerUse || ChargeItemRegistry.getEnergyStored(item) >= tool.toolMaterial.energyPerUse)) {
				SoundManager.startPlaySound(SourceType.PLAYER, item.id, idleSound);
			}
			else if (SoundManager.stopPlaySound(itemID) && stopSound) {
				SoundManager.playSound(stopSound);
			}
		});
	}
}

Callback.addCallback("DestroyBlockStart", function(coords: Callback.ItemUseCoordinates, block: Tile) {
	if (MachineRegistry.isMachine(block.id)) {
		let item = Player.getCarriedItem();
		if (ICTool.isValidWrench(item, 10)) {
			Block.setTempDestroyTime(block.id, 0);
		}
	}
});

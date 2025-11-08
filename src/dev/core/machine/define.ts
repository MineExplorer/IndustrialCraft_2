/// <reference path="../../machine/MachineBase.ts" />
/// <reference path="../../machine/ElectricMachine.ts" />
/// <reference path="../../machine/Generator.ts" />

namespace MachineRegistry {
	const machineIDs = {}

	export function isMachine(id: number) {
		return machineIDs[id];
	}

	// register IC2 Machine
	export function registerPrototype(id: number, Prototype: TileEntity.TileEntityPrototype) {
		// setup legacy prototypes
		if (!(Prototype instanceof Machine.MachineBase)) {
			const BasePrototype = Machine.MachineBase.prototype;
			Prototype.id = id;
			Prototype.getDefaultDrop ??= BasePrototype.getDefaultDrop;
			Prototype.adjustDrop ??= BasePrototype.adjustDrop;
			Prototype.startPlaySound ??= BasePrototype.startPlaySound;
			Prototype.stopPlaySound ??= BasePrototype.stopPlaySound;
			Prototype.setActive ??= function(isActive: boolean) {
				if (this.data.isActive != isActive) {
					this.data.isActive = isActive;
					TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (isActive? 4 : 0));
				}
			}
			Prototype.activate ??= function() {
				this.setActive(true);
			}
			Prototype.deactivate ??= function() {
				this.setActive(false);
			}
		}

		// register prototype
		machineIDs[id] = true;
		TileEntity.registerPrototype(id, Prototype);
		setMachineDrop(id, Prototype.defaultDrop);

		if (Prototype instanceof Machine.ElectricMachine) {
			// wire connection
			ICRender.getGroup("ic-wire").add(id, -1);
			// register for energy net
			EnergyTileRegistry.addEnergyTypeForId(id, EU);
		}
	}

	// for reverse compatibility
	export function registerElectricMachine(id: number, Prototype: TileEntity.TileEntityPrototype) {
		// wire connection
		ICRender.getGroup("ic-wire").add(id, -1);
		// setup energy values
		if (Prototype.defaultValues) {
			Prototype.defaultValues.energy = 0;
		}
		else {
			Prototype.defaultValues = {
				energy: 0
			};
		}

		const BasePrototype = Machine.ElectricMachine.prototype;
		Prototype.getTier ??= BasePrototype.getTier;
		Prototype.getMaxPacketSize ??= BasePrototype.getMaxPacketSize;
		Prototype.getExplosionPower ??= BasePrototype.getExplosionPower;
		Prototype.energyReceive ??= BasePrototype.energyReceive;

		this.registerPrototype(id, Prototype);
		// register for energy net
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	}

	export function registerGenerator(id: number, Prototype: TileEntity.TileEntityPrototype) {
		const BasePrototype = Machine.Generator.prototype;
		Prototype.energyTick ??= BasePrototype.energyTick;
		Prototype.canReceiveEnergy ??= BasePrototype.canReceiveEnergy;
		Prototype.canExtractEnergy ??= BasePrototype.canExtractEnergy;
		this.registerElectricMachine(id, Prototype);
	}

	export function createStorageInterface(blockID: number, descriptor: StorageDescriptor) {
		descriptor.liquidUnitRatio = 0.001;
		descriptor.getInputTank ??= function() {
			return this.tileEntity.liquidTank;
		}
		descriptor.getOutputTank ??= function() {
			return this.tileEntity.liquidTank;
		}
		descriptor.canReceiveLiquid ??= function(liquid: string) {
			return this.getInputTank().isValidLiquid(liquid);
		}
		descriptor.canTransportLiquid ??= () => true;
		StorageInterface.createInterface(blockID, descriptor);
	}

	export function setStoragePlaceFunction(blockID: string | number, hasVerticalRotation?: boolean) {
		Block.registerPlaceFunction(blockID, function(coords, item, block, player, blockSource) {
			const region = new WorldRegion(blockSource);
			const place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
			const rotation = TileRenderer.getBlockRotation(player, hasVerticalRotation);
			region.setBlock(place, item.id, rotation);
			// region.playSound(place.x + .5, place.y + .5, place.z + .5, "dig.stone", 1, 0.8)
			const tile = region.addTileEntity(place);
			if (item.extra) {
				tile.data.energy = item.extra.getInt("energy");
			}
		});
	}

	/**@deprecated */
	export function getMachineDrop(blockID: number, level: number): ItemInstanceArray[] {
		const drop = [];
		if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
			const dropID = TileEntity.getPrototype(blockID).getDefaultDrop();
			drop.push([dropID, 1, 0]);
		}
		return drop;
	}

	export function setMachineDrop(blockID: string | number, dropID?: number) {
		dropID ??= Block.getNumericId(blockID);
		BlockRegistry.registerDrop(blockID, function(coords, blockID, blockData, level) {
			const drop = [];
			if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
				drop.push([dropID, 1, 0]);
			}
			return drop;
		});
	}

	export function fillTankOnClick(tank: BlockEngine.LiquidTank, item: ItemInstance, playerUid: number): boolean {
		const liquid = tank.getLiquidStored();
		const empty = LiquidItemRegistry.getEmptyStack(item);
		if (empty && (!liquid && tank.isValidLiquid(empty.liquid) || empty.liquid == liquid) && !tank.isFull()) {
			const player = new PlayerEntity(playerUid);
			const freeAmount = tank.getLimit() - tank.getAmount(liquid);
			let resultStack: ItemInstance;
			if (freeAmount >= empty.amount) {
				tank.addLiquid(empty.liquid, empty.amount);
				resultStack = new ItemStack(empty.id, 1, empty.data, empty.extra);
			}
			else {
				const liquidItem = LiquidItemRegistry.getItemInterface(item.id);
				if (liquidItem) {
					resultStack = new ItemStack(item.id, 1, item.data, item.extra?.copy());
					const extractedAmount = liquidItem.getLiquid(resultStack, freeAmount);
					tank.addLiquid(empty.liquid, extractedAmount);
				}
			}
			if (resultStack) {
				if (item.count > 1) {
					player.addItemToInventory(resultStack);
					item.count--;
					player.setCarriedItem(item);
				}
				else {
					player.setCarriedItem(resultStack);
				}
			}
			return true;
		}
		return false;
	}

	/** @deprecated */
	export function isValidEUItem(id: number, count: number, data: number, container: UI.Container): boolean {
		const level = container.tileEntity.getTier();
		return ChargeItemRegistry.isValidItem(id, "Eu", level);
	}

	/** @deprecated */
	export function isValidEUStorage(id: number, count: number, data: number, container: UI.Container): boolean {
		const level = container.tileEntity.getTier();
		return ChargeItemRegistry.isValidStorage(id, "Eu", level);
	}

	export function updateGuiHeader(gui: any, text: string): void {
		const header = gui.getWindow("header");
		header.contentProvider.drawing[2].text = Translation.translate(text);
	}

	export function createInventoryWindow(header: string, uiDescriptor: {drawing?: UI.DrawingSet, elements: UI.ElementSet}, minHeight?: number) {
		const gui = new UI.StandartWindow({
			standard: {
				header: {text: {text: Translation.translate(header)}},
				inventory: {standard: true},
				background: {standard: true},
				minHeight: minHeight,
			},

			drawing: uiDescriptor.drawing || [],
			elements: uiDescriptor.elements
		});

		Callback.addCallback("LevelLoaded", function() {
			MachineRegistry.updateGuiHeader(gui, header);
		});

		return gui;
	}
}

const transferByTier = {
	1: 32,
	2: 256,
	3: 2048,
	4: 8192
}
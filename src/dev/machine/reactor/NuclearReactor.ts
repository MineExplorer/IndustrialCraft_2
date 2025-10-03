/// <reference path="IReactor.ts" />

BlockRegistry.createBlock("nuclearReactor", [
	{name: "Nuclear Reactor", texture: [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.nuclearReactor, "stone", 1);
ItemRegistry.setRarity(BlockID.nuclearReactor, EnumRarity.UNCOMMON);

TileRenderer.setStandardModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]]);
TileRenderer.registerRenderModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1]]);

Block.registerPlaceFunction(BlockID.nuclearReactor, function(coords, item, block, player, region) {
	const {x, y, z} = coords.relative;
	for (let i = 0; i < 6; i++) {
		const c = World.getRelativeCoords(x, y, z, i);
		if (region.getBlockId(c.x, c.y, c.z) == BlockID.reactorChamber) {
			const tileEnt = World.getTileEntity(c.x, c.y, c.z, region);
			if (tileEnt.core) {
				item.count++;
				return;
			}
		}
	}
	region.setBlock(x, y, z, item.id, 0);
	//World.playSound(x, y, z, "dig.stone", 1, 0.8)
	World.addTileEntity(x, y, z, region);
});

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.nuclearReactor, count: 1, data: 0}, [
		"xcx",
		"aaa",
		"x#x"
	], ['#', BlockID.primalGenerator, 0, 'a', BlockID.reactorChamber, 0, 'x', ItemID.densePlateLead, 0, 'c', ItemID.circuitAdvanced, 0]);
});


const reactorElements: UI.ElementSet = {
	"heatScale": {type: "scale", x: 346, y: 376, direction: 0, value: 0.5, bitmap: "reactor_heat_scale", scale: 3},
	"textInfo": {type: "text", font: {size: 24, color: Color.GREEN}, x: 685, y: 382, width: 256, height: 42, text: Translation.translate("Generating: ")},
}

for (let y = 0; y < 6; y++) {
	for (let x = 0; x < 9; x++) {
		const i = x*6 + y;
		reactorElements["slot"+i] = {type: "slot", x: 400 + 54 * x, y: 40 + 54 * y, size: 54}
	}
}

const guiNuclearReactor = MachineRegistry.createInventoryWindow("Nuclear Reactor", {
	drawing: [
		{type: "bitmap", x: 340, y: 370, bitmap: "reactor_info", scale: GUI_SCALE},
	],

	elements: reactorElements
});


namespace Machine {
	export class NuclearReactor extends Generator
	implements IReactor {
		defaultValues = {
			energy: 0,
			isEnabled: false,
			signal: 0,
			heat: 0,
			maxHeat: 10000,
			hem: 1,
			output: 0
		}

		chambers: ReactorChamber[] = [];

		getScreenByName(): UI.IWindow {
			return guiNuclearReactor;
		}

		onInit(): void {
			super.onInit();
			this.chambers = [];
			this.rebuildGrid();
			this.__initialized = true;
			for (let i = 0; i < 6; i++) {
				const coords = StorageInterface.getRelativeCoords(this, i);
				if (this.region.getBlockId(coords) == BlockID.reactorChamber) {
					const tileEnt = this.region.getTileEntity(coords) as ReactorChamber;
					if (tileEnt) {
						this.addChamber(tileEnt);
					}
				}
			}
		}

		setupContainer(): void {
			this.container.setGlobalAddTransferPolicy((container, name, id, amount, data) => {
				if (!ReactorItem.isReactorItem(id) || container.getSlot(name).count > 0) return 0;
				return 1;
			});
		}

		addChamber(chamber: ReactorChamber): void {
			if (!this.__initialized || chamber.remove || (chamber.core && chamber.core != this)) {
				return;
			}
			if (this.chambers.indexOf(chamber) == -1) {
				this.chambers.push(chamber);
				chamber.core = this;
				chamber.data.corePos = {x: this.x, y: this.y, z: this.z};
			}
			this.energyNode.addConnection(chamber.energyNode);
		}

		removeChamber(chamber: ReactorChamber): void {
			this.chambers.splice(this.chambers.indexOf(chamber), 1);
			const x = this.getReactorSize();
			for (let y = 0; y < 6; y++) {
				const slotName = this.getSlotName(x, y);
				const slot = this.container.getSlot(slotName);
				if (slot.id > 0) {
					this.region.dropAtBlock(chamber.x, chamber.y, chamber.z, slot);
					this.container.setSlot(slotName, 0, 0, 0);
				}
			}
		}

		getReactorSize(): number {
			return 3 + this.chambers.length;
		}

		processChambers(): void {
			const size = this.getReactorSize();
			for (let pass = 0; pass < 2; pass++) {
				for (let y = 0; y < 6; y++) {
					for (let x = 0; x < size; x++) {
						const slot = this.container.getSlot(this.getSlotName(x, y));
						const component = ReactorItem.getComponent(slot.id);
						if (component) {
							component.processChamber(slot, this, x, y, pass == 0);
						}
					}
				}
			}
		}

		onTick(): void {
			const reactorSize = this.getReactorSize();
			this.container.sendEvent("setFieldSize", {size: reactorSize});
			if (World.getThreadTime() % 20 == 0) {
				if (this.data.isEnabled) {
					this.data.maxHeat = 10000;
					this.data.hem = 1;
					this.data.output = 0;
					this.processChambers();
				} else {
					this.data.output = 0;
				}
				if (this.calculateHeatEffects()) {
					return;
				}
				this.setActive(this.data.heat >= 1000 || this.data.output > 0);
				if (this.networkData.getDouble(NetworkDataKeys.powerOutput) !== this.data.output) {
					this.networkData.putDouble(NetworkDataKeys.powerOutput, this.data.output);
					this.networkData.sendChanges();
				}
			}

			this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
			this.container.setText("textInfo", "Generating: " + this.getEnergyOutput() + " EU/t");
			this.container.sendChanges();
		}

		energyTick(type: string, src: EnergyTileNode): void {
			const output = this.getEnergyOutput();
			src.add(output, Math.min(output, 8192));
		}

		updateSignal() {
			let signal = this.data.signal;
			for (let chamber of this.chambers) {
				signal = Math.max(signal, chamber.data.signal);
			}
			this.data.isEnabled = signal > 0;
		}

		onRedstoneUpdate(signal: number): void {
			this.data.signal = signal;
			this.updateSignal();
		}

		getEnergyOutput(): number {
			return Math.floor(this.data.output * EnergyProductionModifiers.EUReactor);
		}

		getHeat(): number {
			return this.data.heat;
		}

		setHeat(heat: number): void {
			this.data.heat = heat;
		}

		addHeat(amount: number): number {
			return this.data.heat += amount;
		}

		addEmitHeat(heat: number): void {
			// not implemented
		}

		getMaxHeat(): number {
			return this.data.maxHeat;
		}

		setMaxHeat(newMaxHeat: number): void {
			this.data.maxHeat = newMaxHeat;
		}

		getHeatEffectModifier(): number {
			return this.data.hem;
		}

		setHeatEffectModifier(value: number): void {
			this.data.hem = value;
		}

		getSlotName(x: number, y: number): string {
			return "slot" + (x*6 + y);
		}

		getItemAt(x: number, y: number): ItemContainerSlot {
			if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
				return null;
			}
			return this.container.getSlot(this.getSlotName(x, y));
		}

		setItemAt(x: number, y: number, id: number, count: number, data: number, extra: ItemExtraData = null): void {
			if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
				return null;
			}
			this.container.setSlot(this.getSlotName(x, y), id, count, data, extra);
		}

		getOutput(): number {
			return this.data.output;
		}

		addOutput(energy: number): number {
			return this.data.output += energy;
		}

		isFluidCooled(): boolean {
			return false;
		}

		destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
			for (let chamber of this.chambers) {
				this.region.destroyBlock(chamber, true);
			}
		}

		explode(): void {
			let explode = false;
			let boomPower = 10;
			let boomMod = 1;
			for (let i = 0; i < this.getReactorSize() * 6; i++) {
				const slot = this.container.getSlot("slot"+i);
				const component = ReactorItem.getComponent(slot.id);
				if (component) {
					const f = component.influenceExplosion(slot, this)
					if (f > 0 && f < 1) {
						boomMod *= f;
					} else {
						if (f >= 1) explode = true;
						boomPower += f;
					}
				}
				this.container.setSlot("slot"+i, 0, 0, 0);
			}
			if (explode) {
				boomPower = Math.min(boomPower * this.data.hem * boomMod, IC2Config.getFloat("reactor_explosion_max_power"));
				RadiationAPI.addRadiationSource(this.x + .5, this.y + .5, this.z + .5, this.dimension, boomPower, 600);
				this.region.explode(this.x + .5, this.y + .5, this.z + .5, boomPower, false);
				this.selfDestroy();
			}
		}

		calculateHeatEffects(): boolean {
			const power = this.data.heat / this.data.maxHeat;
			if (power >= 1) {
				this.explode();
				return true;
			}
			if (power >= 0.85 && Math.random() <= 0.2 * this.data.hem) {
				const coord = this.getRandCoord(2);
				const blockId = this.region.getBlockId(coord);
				const material = ToolAPI.getBlockMaterialName(blockId);
				if (blockId == 0) {
					this.region.setBlock(coord, 51, 0);
				}
				else if (Block.getDestroyTime(blockId) > 0 && this.region.getTileEntity(coord) == null) {
					if ((material == "stone" || material == "dirt") && !(blockId == VanillaTileID.ice || ItemRegistry.getVanillaStringID(blockId).endsWith("_ice"))) {
						this.region.setBlock(coord, 11, 1);
					}
					else {
						this.region.setBlock(coord, 51, 0);
					}
				}
			}
			if (power >= 0.7 && World.getThreadTime()%20 == 0) {
				const pos = new Vector3(this.x + .5, this.y + .5, this.z + .5);
				const entities = EntityHelper.getEntitiesInRadius(this.region, pos, 4);
				for (let ent of entities) {
					if (EntityHelper.canTakeDamage(ent, DamageSource.radiation)) {
						RadiationAPI.addEffect(ent, Math.floor(4 * this.data.hem));
					}
				}
			}
			if (power >= 0.5 && Math.random() <= this.data.hem) {
				const coord = this.getRandCoord(2);
				const blockId = this.region.getBlockId(coord);
				if (blockId == 8 || blockId == 9) {
					this.region.setBlock(coord, 0, 0);
				}
			}
			if (power >= 0.4 && Math.random() <= this.data.hem) {
				const coord = this.getRandCoord(2);
				const blockId = this.region.getBlockId(coord);
				const material = ToolAPI.getBlockMaterialName(blockId);
				if (material == "wood" || material == "wool" || material == "fibre" || material == "plant") {
					for (let i = 0; i < 6; i++) {
						const coord2 = World.getRelativeCoords(coord.x, coord.y, coord.z, i);
						if (this.region.getBlockId(coord2) == 0) {
							this.region.setBlock(coord2, 51, 0);
							break;
						}
					}
				}
			}
			return false;
		}

		getRandCoord(rad: number): Vector {
			return new Vector3(this.x + MathUtil.randomInt(-rad, rad), this.y + MathUtil.randomInt(-rad, rad), this.z + MathUtil.randomInt(-rad, rad));
		}

		// Client Prototype
		clientTick(): void {
			super.clientTick();
			const output = this.networkData.getDouble(NetworkDataKeys.powerOutput);
			if (output > 0) {
				this.audioSource.playSingle(this.getLoopSound(), true);
				const geigerSound = this.getGeigerSound(output);
				const geigerStream = this.audioSource.streams.find(a => a.name.startsWith("Geiger"));
				if (!geigerStream) {
					this.audioSource.play(geigerSound, true);
				}
				else if (geigerStream.name !== geigerSound) {
					geigerStream.stop();
					this.audioSource.play(geigerSound, true);
				}
			} else {
				this.audioSource.stopAll();
			}
		}

		@ClientSide
		startPlaySound(): void { }

		@ClientSide
		stopPlaySound(): void { }

		@ClientSide
		getLoopSound(): string {
			return "NuclearReactorLoop.ogg";
		}

		@ClientSide
		getGeigerSound(output: number): string {
			if (output == 0) {
				return null;
			}
			if (output < 40) {
				return "GeigerLowEU.ogg";
			}
			if (output < 80) {
				return "GeigerMedEU.ogg";
			}
			return "GeigerHighEU.ogg";
		}

		/** @deprecated Container event, shouldn't be called */
		@ContainerEvent(Side.Client)
		setFieldSize(container: ItemContainer, window: any, content: any, data: {size: number}): void {
			if (content) {
				for (let y = 0; y < 6; y++) {
					for (let x = 0; x < 9; x++) {
						const newX = (x < data.size) ? 400 + 54 * x : 1400;
						content.elements["slot" + (x*6 + y)].x = newX;
					}
				}
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.nuclearReactor, new NuclearReactor());
}
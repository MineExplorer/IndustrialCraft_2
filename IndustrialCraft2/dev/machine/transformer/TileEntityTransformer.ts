class TileEntityTransformer 
extends TileEntityElectricMachine {
	defaultValues = {
		energy: 0,
		increaseMode: false
	}

	constructor(tier: number) {
		super(tier);
	}

	getEnergyStorage(): number {
		return this.getMaxPacketSize();
	}

	init(): void {
		if (this.data.meta != undefined) {
			this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, this.data.meta + 2);
			delete this.data.meta;
		}
	}

	energyTick(type: string, src: any): void {
		this.data.last_energy_receive = this.data.energy_receive;
		this.data.energy_receive = 0;
		this.data.last_voltage = this.data.voltage;
		this.data.voltage = 0;
	
		var maxVoltage = this.getMaxPacketSize();
		if (this.data.increaseMode) {
			if (this.data.energy >= maxVoltage) {
				this.data.energy += src.add(maxVoltage, maxVoltage) - maxVoltage;
			}
		}
		else {
			if (this.data.energy >= maxVoltage/4) {
				var output = this.data.energy;
				this.data.energy += src.add(output, maxVoltage/4) - output;
			}
		}
	}

	redstone(signal: {power: number, signal: number, onLoad: boolean}): void {
		var newMode = signal.power > 0;
		if (newMode != this.data.increaseMode) {
			this.data.increaseMode = newMode;
			EnergyNetBuilder.rebuildTileNet(this);
		}
	}

	isEnergySource(): boolean {
		return true;
	}

	canReceiveEnergy(side: number): boolean {
		if (side == this.data.meta) {
			return !this.data.increaseMode;
		}
		return this.data.increaseMode;
	}

	canExtractEnergy(side: number): boolean {
		if (side == this.data.meta) {
			return this.data.increaseMode;
		}
		return !this.data.increaseMode;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
		if (ICTool.isValidWrench(item, 1)) {
			if (this.onWrenchUse(coords, item, player))
				ICTool.useWrench(coords, item, 1);
			return true;
		}
		return false;
	}

	onWrenchUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
		let newFacing = coords.side;
		if (Entity.getSneaking(player)) {
			newFacing ^= 1;
		}
		if (this.setFacing(newFacing)) {
			EnergyNetBuilder.rebuildTileNet(this);
			return true;
		}
		return false;
	}

	getFacing(): number {
		return this.blockSource.getBlockData(this.x, this.y, this.z);
	}

	setFacing(side: number): boolean {
		if (this.getFacing() != side) {
			this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, side);
			return true;
		}
		return false;
	}
}

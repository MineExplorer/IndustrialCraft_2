class ElectricWrench
extends ItemElectric {
	constructor() {
		super("electricWrench", "electric_wrench", 10000, 100, 1);
		ICTool.registerWrench(this.id, 1, 100);
	}
}

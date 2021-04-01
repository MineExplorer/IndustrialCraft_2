class UpgradeModule extends ItemCommon
implements IUpgrade {
	type: string;

	constructor(stringID: string, name: string, type?: string) {
		super(stringID, `${name}_upgrade`, `upgrade_${name}`);
		if (type) this.type = type;
		UpgradeAPI.registerUpgrade(this.id, this);
	}
}
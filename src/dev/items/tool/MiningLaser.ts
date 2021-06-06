class ItemMiningLaser extends ItemElectric
implements IModeSwitchable {
	modes = {
		0: {name: "Mining", energy: 1250, power: 6},
		1: {name: "Low-Focus", energy: 100, range: 4, power: 6, blockBreaks: 1, dropChance: 1, sound: "MiningLaserLowFocus.ogg"},
		2: {name: "Long-Range", energy: 5000, power: 20, sound: "MiningLaserLongRange.ogg"},
		3: {name: "Horizontal", energy: 1250, power: 6},
		4: {name: "Super-Heat", energy: 2500, power: 8, smelt: true},
		5: {name: "Scatter", energy: 10000, power: 12, blockBreaks: 16, sound: "MiningLaserScatter.ogg"},
		6: {name: "3x3", energy: 10000, power: 6}
	};

	constructor() {
		super("miningLaser", "mining_laser", 1000000, 2048, 3);
		this.setHandEquipped(true);
		this.setRarity(EnumRarity.UNCOMMON);
		ToolHUD.setButtonFor(this.id, "button_switch");
	}

	readMode(extra: ItemExtraData): number {
		if (!extra) return 0;
		return extra.getInt("mode");
	}

	onNameOverride(item: ItemInstance, name: string): string {
		name = super.onNameOverride(item, name);
		let mode = this.readMode(item.extra);
		name += "\n"+this.getModeInfo(mode);
		return name;
	}

	onModeSwitch(item: ItemInstance, player: number): void {
		let client = Network.getClientForPlayer(player);
		let extra = item.extra || new ItemExtraData();
		let mode = (extra.getInt("mode") + 1) % 7;
		extra.putInt("mode", mode);
		client.sendMessage(this.getModeInfo(mode));
		Entity.setCarriedItem(player, item.id, 1, item.data, extra);
	}

	getModeData(mode: number): any {
		return this.modes[mode];
	}

	getModeInfo(mode: number): string {
		let modeName = this.getModeData(mode).name;
		return Translation.translate("Mode: ") + Translation.translate(modeName);
	}

	makeShot(item: ItemInstance, player: number): void {
		let laserSetting = this.readMode(item.extra);
		if (laserSetting == 3 || laserSetting == 6) return;
		let mode = this.getModeData(laserSetting);
		if (ICTool.useElectricItem(item, mode.energy, player)) {
			SoundManager.playSoundAtEntity(player, mode.sound || "MiningLaser.ogg");
			let pos = Entity.getPosition(player);
			let angle = Entity.getLookAngle(player);
			let dir = new Vector3(Entity.getLookVectorByAngle(angle));
			if (laserSetting == 5) {
				let look = dir;
				let right = look.copy().cross(Vector3.UP);
				if (right.lengthSquared() < 1e-4) {
					right.set(Math.sin(angle.yaw), 0.0, -Math.cos(angle.yaw));
				} else {
					right.normalize();
				}
				let up = right.copy().cross(look);
				look.scale(8.0);
				for (let r = -2; r <= 2; r++) {
					for (let u = -2; u <= 2; u++) {
						dir = look.copy().addScaled(right, r).addScaled(up, u).normalize();
						LaserShotProvider.shootLaser(player, pos, dir, mode);
                    }
				}
			} else {
				LaserShotProvider.shootLaser(player, pos, dir, mode);
			}
		}
	}

	onNoTargetUse(item: ItemStack, player: number): void {
		this.makeShot(item, player);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		let laserSetting = this.readMode(item.extra);
		if (laserSetting != 3 && laserSetting != 6) {
			this.makeShot(item, player);
			return;
		}
		let mode = this.getModeData(laserSetting);
		if (ICTool.useElectricItem(item, mode.energy, player)) {
			SoundManager.playSoundAtEntity(player, mode.sound || "MiningLaser.ogg");
			let pos = Entity.getPosition(player);
			let angle = Entity.getLookAngle(player);
			let dir = new Vector3(Entity.getLookVectorByAngle(angle));
			if (Math.abs(angle.pitch) < 1/Math.sqrt(2)) {
				dir.y = 0;
				dir.normalize();
				let start = {x: pos.x, y: coords.y + 0.5, z: pos.z};
				if (laserSetting == 6) {
					let playerRotation = TileRenderer.getBlockRotation(player);
					if (playerRotation <= 1) {
						for (let y = start.y - 1; y <= start.y + 1; y++) {
							for (let x = start.x - 1; x <= start.x + 1; x++) {
								LaserShotProvider.shootLaser(player, {x: x, y: y, z: start.z}, dir, mode);
							}
						}
					}
					else {
						for (let y = start.y - 1; y <= start.y + 1; y++) {
							for (let z = start.z - 1; z <= start.z + 1; z++) {
								LaserShotProvider.shootLaser(player, {x: start.x, y: y, z: z}, dir, mode);
							}
						}
					}
				} else {
					LaserShotProvider.shootLaser(player, start, dir, mode);
				}
			}
			else if (laserSetting == 6) {
                dir.x = 0.0;
				dir.z = 0.0;
				dir.normalize();
				let start = {x: coords.x + 0.5, y: pos.y, z: coords.z + 0.5};
				for (let x = start.x - 1; x <= start.x + 1; x++) {
					for (let z = start.z - 1; z <= start.z + 1; z++) {
						LaserShotProvider.shootLaser(player, {x: x, y: start.y, z: z}, dir, mode);
					}
				}
			} else {
				let client = Network.getClientForPlayer(player);
				BlockEngine.sendUnlocalizedMessage(client, "message.mining_laser.aiming");
			}
		}
	}
}

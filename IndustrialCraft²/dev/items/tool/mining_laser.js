IDRegistry.genItemID("miningLaser");
Item.createItem("miningLaser", "Mining Laser", {name: "mining_laser", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.miningLaser, "Eu", 1000000, 2048, 3, "tool", true);
Item.setToolRender(ItemID.miningLaser, true);

ItemName.setRarity(ItemID.miningLaser, 1);
Item.registerNameOverrideFunction(ItemID.miningLaser, function(item, name){
	name = ItemName.showItemStorage(item, name);
	var mode = item.extra? item.extra.getInt("mode") : 0;
	name += "\n"+MiningLaser.getModeInfo(mode);
	return name;
});

Recipes.addShaped({id: ItemID.miningLaser, count: 1, data: Item.getMaxDamage(ItemID.miningLaser)}, [
	"ccx",
	"aa#",
	" aa"
], ['#', ItemID.circuitAdvanced, 0, 'x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, "c", 331, 0], ChargeItemRegistry.transferEnergy);

UIbuttons.setToolButton(ItemID.miningLaser, "button_switch", true);

UIbuttons.registerSwitchFunction(ItemID.miningLaser, function(item){
	var extra = item.extra;
	if(!extra){
		extra = new ItemExtraData();
	}
	var mode = (extra.getInt("mode")+1)%7;
	extra.putInt("mode", mode);
	Game.message(MiningLaser.getModeInfo(mode));
	Player.setCarriedItem(item.id, 1, item.data, extra);
});

var MiningLaser = {
	modes: {
		0: {name: "Mining", energy: 1250, power: 6},
		1: {name: "Low-Focus", energy: 100, range: 4, power: 6, blockBreaks: 1, dropChance: 1, sound: "MiningLaserLowFocus.ogg"},
		2: {name: "Long-Range", energy: 5000, power: 20, sound: "MiningLaserLongRange.ogg"},
		3: {name: "Horizontal", energy: 1250, power: 6},
		4: {name: "Super-Heat", energy: 2500, power: 8, smelt: true},
		5: {name: "Scatter", energy: 10000, power: 12, blockBreaks: 16, sound: "MiningLaserScatter.ogg"},
		6: {name: "3x3", energy: 10000, power: 6}
	},
	getModeData: function(n){
		return this.modes[n];
	},
	getModeInfo: function(n){
		var modeName = this.getModeData(n).name;
		return Translation.translate("Mode: ") + Translation.translate(modeName);
	},
	lasers: [],
	shootLaser: function(pos, vel, mode){
		var ent = Entity.spawn(pos.x, pos.y, pos.z, EntityType.ARROW);
		Entity.setSkin(ent, "models/laser.png");
		Entity.setVelocity(ent, vel.x, vel.y, vel.z);
		this.lasers.push({ent: ent, start: pos, vel: vel, range: mode.range || 64, power: mode.power, blockBreaks: mode.blockBreaks || 128, smelt: mode.smelt || false, dropChance: mode.dropChance || 0.9, hitblock: false});
	},
	useItem: function(item){
		var laserSetting = item.extra? item.extra.getInt("mode") : 0;
		if(laserSetting == 3 || laserSetting == 6) return;
		var mode = this.getModeData(laserSetting);
		if(ICTool.useElectricItem(item, mode.energy)){
			SoundAPI.playSound("Tools/MiningLaser/" + (mode.sound || "MiningLaser.ogg"));
			var pos = Player.getPosition();
			var angle = Entity.getLookAngle(Player.get());
			var dir = new Vector3(Entity.getLookVectorByAngle(angle));
			if (laserSetting == 5) {
				var look = dir;
				right = look.copy().cross(Vector.UP);
				if (right.lengthSquared() < 1e-4) {
					right.set(Math.sin(angle.yaw), 0.0, -Math.cos(angle.yaw));
				} else {
					right.normalize();
				}
				var up = right.copy().cross(look);
				look.scale(8.0);
				for (var r = -2; r <= 2; r++) {
					for (var u = -2; u <= 2; u++) {
						dir = look.copy().addScaled(right, r).addScaled(up, u).normalize();
						this.shootLaser(pos, dir, mode);
                    }
				}
			} else {
				this.shootLaser(pos, dir, mode);
			}
		}
	},
	useItemOnBlock: function(item, coords){
		var laserSetting = item.extra? item.extra.getInt("mode") : 0;
		if(laserSetting != 3 && laserSetting != 6){
			this.useItem(item);
			return;
		}
		var mode = this.getModeData(laserSetting);
		if(ICTool.useElectricItem(item, mode.energy)){
			SoundAPI.playSound("Tools/MiningLaser/" + (mode.sound || "MiningLaser.ogg"));
			var pos = Player.getPosition();
			var angle = Entity.getLookAngle(Player.get());
			var dir = new Vector3(Entity.getLookVectorByAngle(angle));
			if (Math.abs(angle.pitch) < 1/Math.sqrt(2)) {
				dir.y = 0;
				dir.normalize();
				var start = {x: pos.x, y: coords.y + 0.5, z: pos.z};
				if (laserSetting == 6) {
					var playerRotation = TileRenderer.getBlockRotation();
					if (playerRotation <= 1) {
						for (var y = start.y - 1; y <= start.y + 1; y++){
							for (var x = start.x - 1; x <= start.x + 1; x++){
								this.shootLaser({x: x, y: y, z: start.z}, dir, mode);
							}
						}
					}
					else {
						for (var y = start.y - 1; y <= start.y + 1; y++){
							for (var z = start.z - 1; z <= start.z + 1; z++){
								this.shootLaser({x: start.x, y: y, z: z}, dir, mode);
							}
						}
					}
				}else{
					this.shootLaser(start, dir, mode);
				}
			}
			else if (laserSetting == 6) {
                dir.x = 0.0;
				dir.z = 0.0;
				dir.normalize();
				var start = {x: coords.x + 0.5, y: pos.y, z: coords.z + 0.5};
				for (var x = start.x - 1; x <= start.x + 1; x++){
					for (var z = start.z - 1; z <= start.z + 1; z++){
						this.shootLaser({x: x, y: start.y, z: z}, dir, mode);
					}
				}
			} else {
				Game.message("Mining laser aiming angle too steep");
			}
		}
	},
	destroyBlock: function(laser, x, y, z, block){
		var hardness = Block.getDestroyTime(block.id);
		laser.power -= hardness / 1.5;
        if (laser.power < 0) {
            return;
        }
        if(hardness > 0){
        	laser.blockBreaks--;
       }
       var material = ToolAPI.getBlockMaterialName(block.id);
		if(Math.random() < 0.5 && (material == "wood" || material == "plant" || material == "fibre" || material == "wool")){
			World.setBlock(x, y, z, 51);
		}else{
			World.setBlock(x, y, z, 0);
		}
		var drop = getBlockDrop({x: x, y: y, z: z}, block.id, block.data, 100, true);
		if(drop)
		for(var i in drop){
			var item = drop[i];
			if(laser.smelt && material == "stone"){
				laser.power = 0;
				var result = Recipes.getFurnaceRecipeResult(item[0]);
				if(result){
					item[0] = result.id;
					item[2] = result.data;
				}
				World.drop(x+0.5, y+0.5, z+0.5, item[0], item[1], item[2]);
			}
			else if(Math.random() < laser.dropChance){
				World.drop(x+0.5, y+0.5, z+0.5, item[0], item[1], item[2]);
			}
		}
	},
	update: function(){
		for(var i in this.lasers){
			laser = this.lasers[i];
			var distance = Entity.getDistanceBetweenCoords(Entity.getPosition(laser.ent), laser.start)
			if(laser.power <= 0 || laser.blockBreaks <= 0 || distance > laser.range){
				Entity.remove(laser.ent);
				this.lasers.splice(i, 1);
				i--;
			}else{
				if(laser.hitblock){
					laser.hitblock = false;
				}else{
					laser.power -= 0.25;
				}
				var vel = laser.vel;
				Entity.setVelocity(laser.ent, vel.x, vel.y, vel.z);
				var c = Entity.getPosition(laser.ent);
				this.checkBlock(laser, Math.floor(c.x), Math.floor(c.y), Math.floor(c.z));
			}
		}
	},
	checkBlock: function(laser, x, y, z){
		var block = World.getBlock(x, y, z);
		var material = ToolAPI.getBlockMaterialName(block.id);
		if(material == "unbreaking"){
			laser.power = 0;
		}
		else if(block.id > 0 && block.id != 50 && block.id != 51){
			this.destroyBlock(laser, x, y, z, block);
		}
	},
	projectileHit: function(projectile, target){
		for(var i in this.lasers){
			var laser = this.lasers[i];
			if(laser.ent==projectile){
				if(laser.power <= 0 || laser.blockBreaks <= 0){
					Entity.remove(laser.ent);
					this.lasers.splice(i, 1);
					break;
				}
				if(target.coords){
					Game.prevent();
					var c = target.coords;
					var block = World.getBlock(c.x, c.y, c.z);
					if(block.id != 7 && block.id != 120){
						this.destroyBlock(laser, c.x, c.y, c.z, block);
						laser.hitblock = true;
						var vel = laser.vel;
						Entity.setVelocity(laser.ent, vel.x, vel.y, vel.z);	
					}else{
						Entity.remove(laser.ent);
						this.lasers.splice(i, 1);
					}
				}
				else{
					var damage = laser.power;
					if(damage > 0){
						if(laser.smelt) damage *= 2;
						Entity.setFire(target.entity, 100, true);
						Entity.damageEntity(target.entity, damage, 3, {attacker: Player.get()});
					}
					Entity.remove(laser.ent);
					this.lasers.splice(i, 1);
				}
				break;
			}
		}
	}
}

Callback.addCallback("tick", function(){
	MiningLaser.update();
});

Callback.addCallback("ProjectileHit", function(projectile, item, target){
	MiningLaser.projectileHit(projectile, target);
});

Item.registerUseFunction("miningLaser", function(coords, item, block){
	MiningLaser.useItemOnBlock(item, coords);
});

Item.registerNoTargetUseFunction("miningLaser", function(item){
	MiningLaser.useItem(item);
});
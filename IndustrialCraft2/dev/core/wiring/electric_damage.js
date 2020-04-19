function isFriendlyMob(type){
	if(type >= 10 && type <= 31) return true;
	if(type == 74 || type == 75) return true;
	if(type == 108 || type == 109 || type >= 111 && type <= 113 || type == 115 || type == 118){
		return true;
	}
	return false;
}

function isHostileMob(type){
	if(type >= 32 && type <= 59) return true;
	if(type == 104 || type == 105 || type == 110 || type == 114 || type == 116){
		return true;
	}
	return false;
}

function canTakeDamage(entity, damageSource){
	var type = Entity.getType(entity);
	if(entity == player){
		if(Game.getGameMode() == 1) return false;
		switch(damageSource){
		case "electricity":
			if(Player.getArmorSlot(0).id == ItemID.hazmatHelmet && Player.getArmorSlot(1).id == ItemID.hazmatChestplate &&
			Player.getArmorSlot(2).id == ItemID.hazmatLeggings && Player.getArmorSlot(3).id == ItemID.rubberBoots){
				return false;
			}
		break;
		case "radiation":
			return RadiationAPI.checkPlayerArmor();
		}
		return true;
	}
	return isFriendlyMob(type) || isHostileMob(type);
}

function damageEntityInR(entity, x, y, z){
	for(var yy = y-2; yy <= y+1; yy++)
	for(var xx = x-1; xx <= x+1; xx++)
	for(var zz = z-1; zz <= z+1; zz++){
		var blockID = World.getBlockID(xx, yy, zz);
		var cableData = CableRegistry.getCableData(blockID);
		if(cableData && cableData.insulation < cableData.maxInsulation){
			var net = EnergyNetBuilder.getNetOnCoords(xx, yy, zz);
			if(net && net.energyName == "Eu" && net.lastVoltage > insulationMaxVolt[cableData.insulation]){
				var damage = Math.ceil(net.lastVoltage / 32);
				Entity.damageEntity(entity, damage);
				return;
			}
		}
	}
}

var insulationMaxVolt = {
	0: 5,
	1: 128,
	2: 512
}

Callback.addCallback("tick", function(){
	if(World.getThreadTime()%20 == 0){
		if(Config.wireDamageEnabled){
			var entities = Entity.getAll();
		} else {
			var entities = [player];
		}
		for(var i in entities){
			var ent = entities[i];
			if(canTakeDamage(ent, "electricity") && Entity.getHealth(ent) > 0){
				var coords = Entity.getPosition(ent);
				damageEntityInR(ent, Math.floor(coords.x), Math.floor(coords.y), Math.floor(coords.z));
			}
		}
	}
});

if(voltageEnabled){
	EU.onNetOverload = function(voltage) {
		for(var key in this.wireMap){
			var coords = key.split(':');
			var x = Math.floor(coords[0]), y = Math.floor(coords[1]), z = Math.floor(coords[2]);
			World.setBlock(x, y, z, 0);
			addBurnParticles(x, y, z);
		}
		EnergyNetBuilder.removeNet(this);
	}
}

var addBurnParticles = function(x, y, z){
	for(var i = 0; i < 32; i++){
		var px = x + Math.random();
		var pz = z + Math.random();
		var py = y + Math.random();
		Particles.addFarParticle(Native.ParticleType.smoke, px, py, pz, 0, 0.01, 0);
	}
}


var friendlyMobs = [EntityType.BAT, EntityType.CHICKEN, EntityType.COW, EntityType.MUSHROOM_COW, EntityType.OCELOT, EntityType.PIG, EntityType.RABBIT, EntityType.SHEEP, EntityType.SNOW_GOLEM, EntityType.SQUID, EntityType.VILLAGER, EntityType.WOLF, 23, 24, 25, 26, 27];
var evilMobs = [EntityType.BLAZE, EntityType.CAVE_SPIDER, EntityType.CREEPER, EntityType.ENDERMAN, EntityType.GHAST, EntityType.IRON_GOLEM, EntityType.LAVA_SLIME, EntityType.PIG_ZOMBIE, EntityType.SILVERFISH, EntityType.SKELETON, EntityType.SLIME, EntityType.SPIDER, EntityType.ZOMBIE, EntityType.ZOMBIE_VILLAGER, 45, 46, 47, 48, 49, 55];

function isMob(ent){
	var type = Entity.getType(ent);
	if(ent == player){
		if(Player.getArmorSlot(0).id == ItemID.hazmatHelmet && Player.getArmorSlot(1).id == ItemID.hazmatChestplate &&
		Player.getArmorSlot(2).id == ItemID.hazmatLeggings && Player.getArmorSlot(3).id == ItemID.rubberBoots){
			return false;
		}
		return true;
	}
	if(friendlyMobs.indexOf(type) != -1 || evilMobs.indexOf(type) != -1){
		return true;
	}
	return false;
}

function damageEntityInR(x, y, z, ent){
	for(var yy = y-2; yy < y+2; yy++){
		for(var xx = x-1; xx < x+2; xx++){
			for(var zz = z-1; zz < z+2; zz++){
				var block = World.getBlock(xx, yy, zz);
				if(block.data < IC_WIRES[block.id]){
					var net = EnergyNetBuilder.getNetOnCoords(xx, yy, zz);
					if(net && net.energyName == "Eu" && net.lastVoltage > insulationMaxVolt[block.data]){
						var damage = Math.ceil(net.lastVoltage / 32);
						Entity.damageEntity(ent, damage);
						return;
					}
				}
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
		if(wireDamageEnabled){
			var entities = Entity.getAll();
		}
		else{
			var entities = [player];
		}
		for(var i in entities){
			var ent = entities[i];
			if(isMob(ent) && Entity.getHealth(ent) > 0){
				var coords = Entity.getPosition(ent);
				damageEntityInR(Math.floor(coords.x), Math.floor(coords.y), Math.floor(coords.z), ent);
			}
		}
	}
});

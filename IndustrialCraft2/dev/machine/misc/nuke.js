IDRegistry.genBlockID("nuke");
Block.createBlock("nuke", [
	{name: "Nuke", texture: [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]], inCreative: true}
], "stone");
ItemName.setRarity(BlockID.nuke, 1, true);
TileRenderer.setStandartModel(BlockID.nuke, [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]]);
TileRenderer.registerRenderModel(BlockID.nuke, 0, [["tnt_active", 0]]);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.nuke, count: 1, data: 0}, [
		"ncn",
		"x#x",
		"ncn"
	], ['#', 46, -1, 'x', ItemID.uranium235, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
	
	Recipes.addShaped({id: BlockID.nuke, count: 1, data: 0}, [
		"ncn",
		"x#x",
		"ncn"
	], ['#', 46, -1, 'x', ItemID.plutonium, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
});


MachineRegistry.registerPrototype(BlockID.nuke, {
	defaultValues: {
		activated: false,
		timer: 300
	},
	
	explode: function(radius){
		let x = this.x, y = this.y, z = this.z;
		World.explode(x + 0.5, y + 0.5, z + 0.5, 1);
		let entities = Entity.getAll();
		let rad = radius * 1.5;
		for(let i in entities){
			let ent = entities[i];
			let c = Entity.getPosition(ent);
			let dx = Math.abs(x - c.x), dy = Math.abs(y - c.y), dz = Math.abs(z - c.z);
			let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
			if(dist <= rad){
				let damage = Math.ceil(rad*rad * 25 / (dist*dist));
				if(damage >= 100){
					Entity.damageEntity(ent, damage);
				} else {
					Entity.damageEntity(ent, damage, 11);
				}
			}
		}
		
		let height = radius/2;
		for(let dx = -radius; dx <= radius; dx++)
		for(let dy = -height; dy <= height; dy++)
		for(let dz = -radius; dz <= radius; dz++){
			if(Math.sqrt(dx*dx + dy*dy*4 + dz*dz) <= radius){
				let block = World.getBlock(x + dx, y + dy, z + dz);
				if(Block.getExplosionResistance(block.id) < 10000){
					World.setBlock(x + dx, y + dy, z + dz, 0);
					if(Math.random() < 0.01){
						let drop = getBlockDrop({x: x + dx, y: y + dy, z: z + dz}, block.id, block.data, 100);
						if(drop)
						for(let i in drop){
							let item = drop[i];
							World.drop(x + dx, y + dy, z + dz, item[0], item[1], item[2]);
						}
					}
				}
			}
		}

		let sound = SoundAPI.playSoundAt(this, "Tools/NukeExplosion.ogg", false, 128);
		RadiationAPI.addRadiationSource(this.x + 0.5, this.y + 0.5, this.z + 0.5, radius * 2, 600);
	},
	
	tick: function(){
		if(this.data.activated){
			if(this.data.timer <= 0){
				this.explode(20);
				this.selfDestroy();
				return;
			}
			if(this.data.timer % 10 < 5){
				TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, 0);
			} else {
				BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
			}
			this.data.timer--;
		}
	},
	
	redstone: function(signal){
		if(signal.power > 0){
			this.data.activated = true; 
		}
	}
});
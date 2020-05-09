IDRegistry.genBlockID("teslaCoil");
Block.createBlock("teslaCoil", [
	{name: "Tesla Coil", texture: [["tesla_coil", 0], ["tesla_coil", 0], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1]], inCreative: true},
], "opaque");
ItemName.addTierTooltip("teslaCoil", 3);

Block.registerDropFunction("teslaCoil", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.teslaCoil, count: 1, data: 0}, [
		"ror",
		"r#r",
		"cxc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingIron, 0, 'o', ItemID.coil, 0, 'r', 331, 0]);
});


MachineRegistry.registerElectricMachine(BlockID.teslaCoil, {
	getTier: function(){
		return 3;
	},
	
	tick: function(){
		if(this.data.energy >= 400 && this.data.isActive){
			if(World.getThreadTime()%32==0){
				var entities = Entity.getAll();
				var discharge = false;
				var damage = Math.floor(this.data.energy/400);
				for(var i in entities){
					var ent = entities[i];
					var coords = Entity.getPosition(ent);
					var dx = this.x + 0.5 - coords.x;
					var dy = this.y + 0.5 - coords.y;
					var dz = this.z + 0.5 - coords.z;
					if(Math.sqrt(dx*dx + dy*dy + dz*dz) < 4.5 && isMob(ent) && Entity.getHealth(ent) > 0){
						discharge = true;
						if(damage >= 24){
							Entity.setFire(ent, 1, true);
							Entity.damageEntity(ent, damage, 6);
						}
						else Entity.damageEntity(ent, damage);
					}
				}
				if(discharge) this.data.energy = 1;
			}
			this.data.energy--;
		}
	},

	redstone: function(signal){
		this.data.isActive = signal.power > 0;
	},

	getEnergyStorage: function(){
		return 10000;
	},
	
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

IDRegistry.genBlockID("nuclearReactor");
Block.createBlock("nuclearReactor", [
	{name: "Nuclear Reactor", texture: [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.nuclearReactor, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]]);
TileRenderer.registerRenderModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1]]);

Block.registerDropFunction("nuclearReactor", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

IDRegistry.genBlockID("reactorChamber");
Block.createBlock("reactorChamber", [
	{name: "Reactor Chamber", texture: [["machine_bottom", 0], ["machine_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true},
], "opaque");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.nuclearReactor, count: 1, data: 0}, [
		"xcx",
		"aaa",
		"x#x"
	], ['#', BlockID.primalGenerator, 0, 'a', BlockID.reactorChamber, 0, 'x', ItemID.plateLead, 0, 'c', ItemID.circuitAdvanced, 0]); // dense lead plate
	
	Recipes.addShaped({id: BlockID.reactorChamber, count: 1, data: 0}, [
		" x ",
		"x#x",
		" x "
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.plateLead, 0]);
});


var guiNuclearReactor = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Nuclear Reactor")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 340, y: 400, bitmap: "reactor_info", scale: GUI_SCALE},
	],
	
	elements: {
		"heatScale": {type: "scale", x: 340 + GUI_SCALE*2, y: 400 + GUI_SCALE*2, direction: 0, value: 0.5, bitmap: "reactor_heat_scale", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 400, y: 80},
		"textInfo": {type: "text", font: {size: 24, color: android.graphics.Color.GREEN}, x: 675 + GUI_SCALE*2, y: 400 + GUI_SCALE*2, width: 256, height: 42, text: Translation.translate("Generating: ")},
	}
});

MachineRegistry.registerGenerator(BlockID.nuclearReactor, {
	defaultValues: {
		chambers_count: 0,
		isEnabled: false,
		isActive: false,
		heat: 300,
		
	},
	
	getGuiScreen: function(){
		return guiNuclearReactor;
	},
	
	init: function(){
		this.rebuildEnergyNet();
	},
	
	rebuildEnergyNet: function(){
		var net = EnergyNetBuilder.buildForTile(this, EU);
		this.__energyNets.EU = net;
		for (var i = 0; i < 6; i++) {
			var coords = EnergyNetBuilder.getRelativeCoords(this.x, this.y, this.z, i);
			if(World.getBlockID(coords.x, coords.y, coords.z)==BlockID.reactorChamber){
				this.data.chambers_count++;
				for (var side = 0; side < 6; side++) {
					var c = EnergyNetBuilder.getRelativeCoords(coords.x, coords.y, coords.z, side);
					EnergyNetBuilder.buildTileNet(net, c.x, c.y, c.z, side + Math.pow(-1, side));
				}
			}
		}
	},
	
	tick: function(){
		var slot = this.container.getSlot("slot1");
		if(this.data.isEnabled && slot.id == ItemID.fuelRodUranium){
			this.data.heat += 100;
			this.data.energy = this.data.heat;
		}
		var maxHeat = this.getMaxHeat();
		if(this.data.heat >= maxHeat){
			//for(var i = 0; i < 5; i++){
				Entity.spawn(this.x + 0.5, this.y + 0.5, this.z + 0.5, EntityType.PRIMED_TNT);
			//}
			World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, 0.5);
		}
		this.container.setScale("heatScale", this.data.heat / maxHeat);
		this.container.setText("textInfo", "Generating: " + this.data.energy + " EU/t");
	},
	
	redstone: function(signal){
		this.data.isEnabled = (signal.power == 0);
	},
	
	getMaxHeat: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		src.add(this.data.energy);
		this.data.energy = 0;
	}
});

MachineRegistry.registerElectricMachine(BlockID.reactorChamber, {
	defaultValues: {
		core: null,
	},
	
});
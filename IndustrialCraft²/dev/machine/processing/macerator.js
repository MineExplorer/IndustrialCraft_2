IDRegistry.genBlockID("macerator");
Block.createBlockWithRotation("macerator", [
    {name: "Macerator", texture: [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.macerator);

Block.registerDropFunction("macerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
        "xxx",
        "b#b",
        " a "
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 318, 0, 'b', 4, -1, 'a', ItemID.circuitBasic, 0]);
});

var guiMacerator = new UI.StandartWindow({
    standart: {
        header: {text: {text: "Macerator"}},
        inventory: {standart: true},
        background: {standart: true}
    },
    
    drawing: [
        {type: "bitmap", x: 530, y: 146, bitmap: "macerator_bar_background", scale: GUI_BAR_STANDART_SCALE},
        {type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
    ],
    
    elements: {
        "progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "macerator_bar_scale", scale: GUI_BAR_STANDART_SCALE},
        "energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
        "slotSource": {type: "slot", x: 441, y: 75},
        "slotEnergy": {type: "slot", x: 441, y: 212},
        "slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 176},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
    }
});

Callback.addCallback("PreLoaded", function(){
    MachineRecipeRegistry.registerRecipesFor("macerator", {
        // ores
        14: {id: ItemID.dustGold, count: 2, data: 0},
        15: {id: ItemID.dustIron, count: 2, data: 0},
        "BlockID.oreCopper": {id: ItemID.dustCopper, count: 2, data: 0},
        "BlockID.oreTin": {id: ItemID.dustTin, count: 2, data: 0},
        "BlockID.oreLead": {id: ItemID.dustLead, count: 2, data: 0},
        // ingots
        265: {id: ItemID.dustIron, count: 1, data: 0},
        266: {id: ItemID.dustGold, count: 1, data: 0},
        "ItemID.ingotCopper": {id: ItemID.dustCopper, count: 1, data: 0},
        "ItemID.ingotTin": {id: ItemID.dustTin, count: 1, data: 0},
        "ItemID.ingotLead": {id: ItemID.dustLead, count: 1, data: 0},
        "ItemID.ingotSteel": {id: ItemID.dustIron, count: 1, data: 0},
        "ItemID.ingotBronze": {id: ItemID.dustBronze, count: 1, data: 0},
        // plates
        "ItemID.plateIron": {id: ItemID.dustIron, count: 1, data: 0},
        "ItemID.plateGold": {id: ItemID.dustGold, count: 1, data: 0},
        "ItemID.plateCopper": {id: ItemID.dustCopper, count: 1, data: 0},
        "ItemID.plateTin": {id: ItemID.dustTin, count: 1, data: 0},
        "ItemID.plateLead": {id: ItemID.dustLead, count: 1, data: 0},
        "ItemID.plateSteel": {id: ItemID.dustIron, count: 1, data: 0},
        "ItemID.plateBronze": {id: ItemID.dustBronze, count: 1, data: 0},
        // other resources
        22: {id: ItemID.dustLapis, count: 9, data: 0},
        173: {id: ItemID.dustCoal, count: 9, data: 0},
        "263:0": {id: ItemID.dustCoal, count: 1, data: 0},
        264: {id: ItemID.dustDiamond, count: 1, data: 0},
        "351:4": {id: ItemID.dustLapis, count: 1, data: 0},
        // other materials
        1: {id: 4, count: 1, data: 0},
        4: {id: 12, count: 1, data: 0},
        13: {id: 318, count: 1, data: 0},
		35: {id: 287, count: 2, data: 0},
		89: {id: 348, count: 4, data: 0},
        152: {id: 406, count: 4, data: 0},
        156: {id: 406, count: 6, data: 0},
        352: {id: 351, count: 5, data: 15}, 
		369: {id: 377, count: 5, data: 0}
    }, true);
});

MachineRegistry.registerPrototype(BlockID.macerator, {
    defaultValues: {
		energy_storage: 2000,
		energy_consumption: 2,
		work_time: 300,
		progress: 0,
    },
    
    getGuiScreen: function(){
        return guiMacerator;
    },
    
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
    tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
        var sourceSlot = this.container.getSlot("slotSource");
        var result = MachineRecipeRegistry.getRecipeResult("macerator", sourceSlot.id, sourceSlot.data);
        if(result && (sourceSlot.data == result.ingredientData || !result.ingredientData)){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
				}
				if(this.data.progress >= 1){
                    sourceSlot.count--;
                    resultSlot.id = result.id;
                    resultSlot.data = result.data;
                    resultSlot.count += result.count;
                    this.container.validateAll();
                    this.data.progress = 0;
                }
            }
        }
        else {
            this.data.progress = 0;
        }
        
        var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
        
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    
    getEnergyStorage: function(){
        return this.data.energy_storage;
    },
    
    energyTick: MachineRegistry.basicEnergyReceiveFunc
});
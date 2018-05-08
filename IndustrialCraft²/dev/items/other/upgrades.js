IDRegistry.genItemID("upgradeMFSU");
Item.createItem("upgradeMFSU", "MFSU Upgrade Kit", {name: "mfsu_upgrade", meta: 0});

IDRegistry.genItemID("upgradeOverclocker");
Item.createItem("upgradeOverclocker", "Overclocker Upgrade", {name: "upgrade_overclocker", meta: 0}, {stack: 16});

IDRegistry.genItemID("upgradeEnergyStorage");
Item.createItem("upgradeEnergyStorage", "Energy Storage Upgrade", {name: "upgrade_energy_storage", meta: 0});

//IDRegistry.genItemID("upgradeTransformer");
//Item.createItem("upgradeTransformer", "Transformer Upgrade", {name: "upgrade_transformer", meta: 0});

IDRegistry.genItemID("upgradeRedstone");
Item.createItem("upgradeRedstone", "Redstone Signal Inverter Upgrade", {name: "upgrade_redstone_inv", meta: 0});

IDRegistry.genItemID("upgradePulling");
IDRegistry.genItemID("upgradePulling1");
IDRegistry.genItemID("upgradePulling2");
IDRegistry.genItemID("upgradePulling3");
IDRegistry.genItemID("upgradePulling4");
IDRegistry.genItemID("upgradePulling5");
IDRegistry.genItemID("upgradePulling6");
Item.createItem("upgradePulling", "Pulling Upgrade", {name: "upgrade_pulling", meta: 0});
Item.createItem("upgradePulling1", "Pulling Upgrade", {name: "upgrade_pulling", meta: 1}, {isTech: true});
Item.createItem("upgradePulling2", "Pulling Upgrade", {name: "upgrade_pulling", meta: 2}, {isTech: true});
Item.createItem("upgradePulling3", "Pulling Upgrade", {name: "upgrade_pulling", meta: 3}, {isTech: true});
Item.createItem("upgradePulling4", "Pulling Upgrade", {name: "upgrade_pulling", meta: 4}, {isTech: true});
Item.createItem("upgradePulling5", "Pulling Upgrade", {name: "upgrade_pulling", meta: 5}, {isTech: true});
Item.createItem("upgradePulling6", "Pulling Upgrade", {name: "upgrade_pulling", meta: 6}, {isTech: true});

IDRegistry.genItemID("upgradeEjector");
IDRegistry.genItemID("upgradeEjector1");
IDRegistry.genItemID("upgradeEjector2");
IDRegistry.genItemID("upgradeEjector3");
IDRegistry.genItemID("upgradeEjector4");
IDRegistry.genItemID("upgradeEjector5");
IDRegistry.genItemID("upgradeEjector6");
Item.createItem("upgradeEjector", "Ejector Upgrade", {name: "upgrade_ejector", meta: 0});
Item.createItem("upgradeEjector1", "Ejector Upgrade", {name: "upgrade_ejector", meta: 1}, {isTech: true});
Item.createItem("upgradeEjector2", "Ejector Upgrade", {name: "upgrade_ejector", meta: 2}, {isTech: true});
Item.createItem("upgradeEjector3", "Ejector Upgrade", {name: "upgrade_ejector", meta: 3}, {isTech: true});
Item.createItem("upgradeEjector4", "Ejector Upgrade", {name: "upgrade_ejector", meta: 4}, {isTech: true});
Item.createItem("upgradeEjector5", "Ejector Upgrade", {name: "upgrade_ejector", meta: 5}, {isTech: true});
Item.createItem("upgradeEjector6", "Ejector Upgrade", {name: "upgrade_ejector", meta: 6}, {isTech: true});

IDRegistry.genItemID("upgradeFluidEjector");
IDRegistry.genItemID("upgradeFluidEjector1");
IDRegistry.genItemID("upgradeFluidEjector2");
IDRegistry.genItemID("upgradeFluidEjector3");
IDRegistry.genItemID("upgradeFluidEjector4");
IDRegistry.genItemID("upgradeFluidEjector5");
IDRegistry.genItemID("upgradeFluidEjector6");
Item.createItem("upgradeFluidEjector", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 0});
Item.createItem("upgradeFluidEjector1", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 1}, {isTech: true});
Item.createItem("upgradeFluidEjector2", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 2}, {isTech: true});
Item.createItem("upgradeFluidEjector3", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 3}, {isTech: true});
Item.createItem("upgradeFluidEjector4", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 4}, {isTech: true});
Item.createItem("upgradeFluidEjector5", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 5}, {isTech: true});
Item.createItem("upgradeFluidEjector6", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 6}, {isTech: true});


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.upgradeMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', ItemID.wrench, 0, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 1, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', ItemID.cellWater, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeEnergyStorage, count: 1, data: 0}, [
		"aaa",
		"x#x",
		"aca"
	], ['#', ItemID.storageBattery, -1, 'x', ItemID.cableCopper1, 0, 'a', 5, -1, 'c', ItemID.circuitBasic, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeRedstone, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, 0, '#', 69, -1]);
	
	Recipes.addShaped({id: ItemID.upgradePulling, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', 29, -1, 'b', 410, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeEjector, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', 33, -1, 'b', 410, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeFluidEjector, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, 0, '#', ItemID.electricMotor, 0]);
});


Item.registerUseFunction("upgradeMFSU", function(coords, item, block){
	if(block.id==BlockID.storageMFE){
		var tile = World.getTileEntity(coords.x ,coords.y, coords.z);
		var data = tile.data;
		tile.selfDestroy();
		World.setBlock(coords.x ,coords.y, coords.z, BlockID.storageMFSU, block.data);
		block = World.addTileEntity(coords.x ,coords.y, coords.z);
		block.data = data;
		item.count--;
		if(!item.count){item.id = 0;}
		Player.setCarriedItem(item.id, item.count, 1);
	}
});

function PULLING_UPGRADE_FUNC(machine, container, coords, direction){
	if(World.getThreadTime()%20 == 0){
		var items = [];
		var slots = machine.getTransportSlots().input;
		for(var i in slots){
			var item = container.getSlot(slots[i]);
			if(item.count < Item.getMaxStack(item.id)){
				items.push(item);
			}
		}
		if(items.length){
			var containers = UpgradeAPI.findNearestContainers(coords, direction);
			getItemsFrom(items, containers, machine);
		}
	}
}

function EJECTOR_UPGRADE_FUNC(machine, container, coords, direction){
	var items = [];
	var slots = machine.getTransportSlots().output;
	for(var i in slots){
		var item = container.getSlot(slots[i]);
		if(item.id){items.push(item);}
	}
	if(items.length){
		var containers = UpgradeAPI.findNearestContainers(coords, direction);
		addItemsToContainers(items, containers, machine);
	}
}

function FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, direction){
	var mstorage = machine.liquidStorage
	var liquid = mstorage.getLiquidStored();
	if(liquid){
		var storages = UpgradeAPI.findNearestLiquidStorages(coords, direction);
		addLiquidToStorages(liquid, mstorage, storages);
	}
}

UpgradeAPI.addUpgradeCallback(ItemID.upgradeOverclocker, "tick", function(count, machine, container, data, coords){
	if(data.work_time){
		data.energy_consumption = Math.round(data.energy_consumption * Math.pow(1.6, count));
		data.work_time = Math.round(data.work_time * Math.pow(0.7, count));
	}
});

UpgradeAPI.addUpgradeCallback(ItemID.upgradeEnergyStorage, "tick", function(count, machine, container, data, coords){
	data.energy_storage += 10000 * count;
});

UpgradeAPI.addUpgradeCallback(ItemID.upgradeRedstone, "tick", function(count, machine, container, data, coords){
	data.isHeating = !data.isHeating;
});

UpgradeAPI.addUpgradeCallback(ItemID.upgradePulling, "tick", function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords);
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradePulling1, "tick", function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "down");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradePulling2, "tick", function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "up");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradePulling3, "tick", function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "north");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradePulling4, "tick", function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "south");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradePulling5, "tick", function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "west");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradePulling6, "tick", function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "east");
});

UpgradeAPI.addUpgradeCallback(ItemID.upgradeEjector, "tick", function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords);
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeEjector1, "tick", function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "down");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeEjector2, "tick", function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "up");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeEjector3, "tick", function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "north");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeEjector4, "tick", function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "south");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeEjector5, "tick", function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "west");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeEjector6, "tick", function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "east");
});

UpgradeAPI.addUpgradeCallback(ItemID.upgradeFluidEjector, "tick", function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords);
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeFluidEjector1, "tick", function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "down");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeFluidEjector2, "tick", function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "up");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeFluidEjector3, "tick", function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "north");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeFluidEjector4, "tick", function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "south");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeFluidEjector5, "tick", function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "west");
});
UpgradeAPI.addUpgradeCallback(ItemID.upgradeFluidEjector6, "tick", function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "east");
});


Item.registerUseFunction("upgradePulling", function(coords, item, block){
	Player.setCarriedItem(ItemID["upgradePulling" + (coords.side+1)], item.count);
});
for(var i = 1; i <= 6; i++){
Item.registerUseFunction("upgradePulling"+i, function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradePulling, item.count);
});
}

Item.registerUseFunction("upgradeEjector", function(coords, item, block){
	Player.setCarriedItem(ItemID["upgradeEjector" + (coords.side+1)], item.count);
});
for(var i = 1; i <= 6; i++){
Item.registerUseFunction("upgradeEjector"+i, function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeEjector, item.count);
});
}

Item.registerUseFunction("upgradeFluidEjector", function(coords, item, block){
	Player.setCarriedItem(ItemID["upgradeFluidEjector" + (coords.side+1)], item.count);
});
for(var i = 1; i <= 6; i++){
Item.registerUseFunction("upgradeFluidEjector"+i, function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
});
}

/*
  _____                                           __   _          _           
 | ____|  _ __     ___   _ __    __ _   _   _    |  \ | |   ___  | |_   
 |  _|   | '_ \   / _ \ | '__|  / _` | | | | |   | \ \| |  / _ \ | __|  
 | |___  | | | | |  __/ | |    | (_| | | |_| |   | |\ | | |  __/ | |_  
 |_____| |_| |_|  \___| |_|     \__, |  \__, |   |_| \__|  \___|  \__| 
                                |___/   |___/                                                      
*/

LIBRARY({
	name: "EnergyNet",
	version: 3,
	shared: true,
	api: "CoreEngine"
});


Translation.addTranslation("Energy", {ru: "Энергия"});

function EnergyType(name) {
	this.name = name;

	this.value = 1;

	this.wireData = {};

	this.registerWire = function(id, maxValue, overloadFunc) {
		this.wireData[id] = maxValue;
		EnergyRegistry.wireData[id] = {type: this.name, value: maxValue, onOverload: overloadFunc};
		
		Block.registerPlaceFunction(id, function(coords, item, block){
			var place = coords.relative;
			if(World.getBlockID(place.x, place.y, place.z) == 0){
				World.setBlock(place.x, place.y, place.z, item.id, item.data);
				Player.setCarriedItem(item.id, item.count - 1, item.data);
				EnergyRegistry.onWirePlaced(place.x, place.y, place.z);
			}
		});
	}
}

var EnergyRegistry = {
	energyTypes: {},

	/**
	 * name - name of this energy type
	 * value - value of one unit in [Eu] (Industrial Energy)
	*/
	createEnergyType: function(name, value, wireParams) {
		if (this.energyTypes[name]) {
			alert("WARNING: duplicate energy types for name: " + name + "!");
			Logger.Log("duplicate energy types for name: " + name + "!", "ERROR");
		}
		
		var energyType = new EnergyType(name);
		energyType.value = value || 1;

		this.energyTypes[name] = energyType;
		
		return energyType;
	},

	assureEnergyType: function(name, value, wireParams) {
		if (this.getEnergyType(name)) {
			return this.getEnergyType(name);
		}
		else {
			return this.createEnergyType(name, value, wireParams);
		}
	},

	getEnergyType: function(name) {
		return this.energyTypes[name];
	},

	getValueRatio: function(name1, name2) {
		var type1 = this.getEnergyType(name1);
		var type2 = this.getEnergyType(name2);
		
		if (type1 && type2) {
			return type1.value / type2.value;
		}
		else {
			Logger.Log("get energy value ratio failed: some of this 2 energy types is not defiled: " + [name1, name2], "ERROR");
			return -1;
		}
	},

	wireData: {},
	
	getWireData: function(id) {
		return this.wireData[id];
	},
	
	isWire: function(id, type) {
		var wireData = this.getWireData(id);
		if (wireData) {
			if (!type) return true;
			if (wireData.type == type) return true;
		}
		return false;
	},
	
	onWirePlaced: function(x, y, z) {
		var id = World.getBlockID(x, y, z);
		var net;
		for(var s = 0; s < 6; s++){
			var c = EnergyNetBuilder.getRelativeCoords(x, y, z, s);
			if (!net) {
				net = EnergyNetBuilder.getNetByBlock(c.x, c.y, c.z, id);
			}
			if (net) break;
		}
		
		if (net) {
			EnergyNetBuilder.rebuildRecursive(net, id, x, y, z);
		}
		else {
			EnergyNetBuilder.buildForWire(x, y, z, id);
		}
	},

	onWireDestroyed: function(x, y, z, id) {
		var net = EnergyNetBuilder.getNetOnCoords(x, y, z);
		if (net) {
			EnergyNetBuilder.removeNet(net);
			EnergyNetBuilder.rebuildForWire(x-1, y, z, id);
			EnergyNetBuilder.rebuildForWire(x+1, y, z, id);
			EnergyNetBuilder.rebuildForWire(x, y-1, z, id);
			EnergyNetBuilder.rebuildForWire(x, y+1, z, id);
			EnergyNetBuilder.rebuildForWire(x, y, z-1, id);
			EnergyNetBuilder.rebuildForWire(x, y, z+1, id);
		}
	}
}

Callback.addCallback("DestroyBlock", function(coords, block) {
    if (EnergyRegistry.isWire(block.id)) {
        EnergyRegistry.onWireDestroyed(coords.x, coords.y, coords.z, block.id);
    }
});


var TileEntityRegistry = {
	// adds energy type for tile entity prototype
	addEnergyType: function(Prototype, energyType) {
		if (!Prototype.__energyLibInit) {
			this.setupInitialParams(Prototype);
		}
		
		Prototype.__energyTypes[energyType.name] = energyType;
	},

	//same as addEnergyType, but works on already created prototypes, accessing them by id
	addEnergyTypeForId: function(id, energyType) {
		var Prototype = TileEntity.getPrototype(id);
		if (Prototype) {
			this.addEnergyType(Prototype, energyType);
		}
		else {
			Logger.Log("cannot add energy type no prototype defined for id " + id, "ERROR");
		}
	},

	setupInitialParams: function(Prototype) {
		Prototype.__energyLibInit = true;
		
		Prototype.__energyTypes = {};
		Prototype.__energyNets = {};
		Prototype.__connectedNets = {};

		Prototype.__init = Prototype.init || function() {};
		Prototype.__tick = Prototype.tick || function() {};
		Prototype.__destroy = Prototype.destroy || function() {};
		
		if (!Prototype.energyTick) {
			Prototype.energyTick = function(type, src) {
				// called for each energy type
			}
		}
		
		Prototype.energyReceive = Prototype.energyReceive || function() {
			return 0;
		}
		
		Prototype.canReceiveEnergy = Prototype.canReceiveEnergy || function() {
			return true;
		}
		
		if (Prototype.isEnergySource) {
			Prototype.canExtractEnergy = Prototype.canExtractEnergy || function() {
				return true;
			}
		}
		else {
			Prototype.canExtractEnergy = function() {
				return false;
			}
			Prototype.isEnergySource = function(type) {
				return false;
			}
		}
		
		Prototype.init = function() {
			this.__energyNets = {};
			this.__connectedNets = {};
			TileEntityRegistry.addMacineAccessAtCoords(this.x, this.y, this.z, this);
			
			EnergyNetBuilder.rebuildTileConnections(this.x, this.y, this.z, this);
			
			this.__init();
		}
		
		Prototype.destroy = function() {
			TileEntityRegistry.removeMachineAccessAtCoords(this.x, this.y, this.z);
			
			for (var i in this.__connectedNets) {
				this.__connectedNets[i].removeTileEntity(this);
			}
			for (var i in this.__energyNets) {
				EnergyNetBuilder.removeNet(this.__energyNets[i]);
			}
			
			this.__destroy();
		}
			
		Prototype.tick = function() {
			this.__tick();
			for (var name in this.__energyTypes) {
				if (this.isEnergySource(name)) {
					var net = this.__energyNets[name];
					if (!net) {
						net = EnergyNetBuilder.buildForTile(this, this.__energyTypes[name]);
						this.__energyNets[name] = net;
					}
					var src = net.source;
					this.energyTick(name, src);
				}else{
					this.energyTick(name, null);
				}
			}
		}
	},



	/* machine is tile entity, that uses energy */
	machineIDs: {},

	isMachine: function(id) {
		return this.machineIDs[id];
	},

	quickCoordAccess: {},

	addMacineAccessAtCoords: function(x, y, z, machine) {
		this.quickCoordAccess[x + ":" + y + ":" + z] = machine;
	},

	removeMachineAccessAtCoords: function(x, y, z) {
		delete this.quickCoordAccess[x + ":" + y + ":" + z];
	},

	accessMachineAtCoords: function(x, y, z) {
		return this.quickCoordAccess[x + ":" + y + ":" + z];
	},

	executeForAllInNet: function(net, func) {
		for (var i in net.tileEntities) {
			var mech = net.tileEntities[i];
			func(mech);
		}
	},
};

Callback.addCallback("LevelLoaded", function() {
    TileEntityRegistry.quickCoordAccess = {};
});


var EnergyNetBuilder = {
	energyNets: [],
	addEnergyNet: function(net) {
		this.energyNets.push(net);
	},

	removeNet: function(net) {
		TileEntityRegistry.executeForAllInNet(net, function(tileEntity) {
			delete tileEntity.__connectedNets[net.netId];
		});
		
		for (var i in net.connectedNets) {
			net.connectedNets[i].removeConnection(net);
		}
		net.removed = true;
		for (var i in this.energyNets) {
			if (this.energyNets[i] == net) {
				this.energyNets.splice(i, 1);
				break;
			}
		}
	},

	removeNetOnCoords: function(x, y, z) {
		var net = this.getNetOnCoords(x, y, z);
		if (net) {
			this.removeNet(net);
		}
	},

	removeNetByBlock: function(x, y, z, wireId) {
		if (World.getBlockID(x, y, z) == wireId) {
			EnergyNetBuilder.removeNetOnCoords(x, y, z);
		}
	},
	
	mergeNets: function(net1, net2) {
		for (var key in net2.wireMap) {
			net1.wireMap[key] = true;
		}
		for (var i in net2.tileEntities) {
			net1.addTileEntity(net2.tileEntities[i]);
		}
		for (var i in net2.connectedNets) {
			var otherNet = net2.connectedNets[i];
			net1.addConnection(otherNet);
			otherNet.addConnection(net1);
		}
		this.removeNet(net2);
	},
	
	buildForTile: function(tile, type) {
		var net = new EnergyNet(type);
		net.sourceTile = tile;
		this.addEnergyNet(net);
		
		for (var side = 0; side < 6; side++) {
			if (tile.canExtractEnergy(side, type.name)) {
				var c = this.getRelativeCoords(tile.x, tile.y, tile.z, side);
				this.buildTileNet(net, c.x, c.y, c.z, side + Math.pow(-1, side));
			}
		}
		
		return net;
	},
	
	buildTileNet: function(net, x, y, z, side) {
		var type = net.energyName;
		var tile = TileEntityRegistry.accessMachineAtCoords(x, y, z);
		if (tile && tile.__energyTypes[type]) {
			if (tile.canReceiveEnergy(side, type)) {
				net.addTileEntity(tile);
			}
		}
		else {
			var wireNet = this.getNetOnCoords(x, y, z);
			if (wireNet) {
				if (wireNet.energyName == type) {
					net.addConnection(wireNet);
					wireNet.addConnection(net);
				}
			}
			else {
				var block = World.getBlockID(x, y, z);
				if (EnergyRegistry.isWire(block, type)) {
					var wireNet = this.buildForWire(x, y, z, block);
					net.addConnection(wireNet);
					wireNet.addConnection(net);
				}
			}
		}
	},
	
	
	buildForWire: function(x, y, z, id) {
		var wireData = EnergyRegistry.getWireData(id);
		var type = EnergyRegistry.getEnergyType(wireData.type);
		var net = new EnergyNet(type, wireData.value, wireData.onOverload);
		net.wireId = id;
		this.addEnergyNet(net);
		this.rebuildRecursive(net, id, x, y, z);
		return net;
	},

	rebuildForWire: function(x, y, z, id) {
		if (World.getBlockID(x, y, z) == id && !EnergyNetBuilder.getNetOnCoords(x, y, z)) {
			this.buildForWire(x, y, z, id);
		}
	},
	
	rebuildRecursive: function(net, wireId, x, y, z, side) {
		if(net.removed) return;
		
		var coordKey = x + ":" + y + ":" + z;
		if (net.wireMap[coordKey]) {
			return;
		}
		
		var type = net.energyName;
		var tileEntity = TileEntityRegistry.accessMachineAtCoords(x, y, z);
		if (tileEntity && tileEntity.__energyTypes[type]) {
			if (tileEntity.isEnergySource(type) && tileEntity.canExtractEnergy(side, type)) {
				var tnet = tileEntity.__energyNets[type];
				if (tnet) {
					tnet.addConnection(net);
					net.addConnection(tnet);
				}
			}
			if (tileEntity.canReceiveEnergy(side, type)) {
				net.addTileEntity(tileEntity);
			}
		}
		else {
			var otherNet = this.getNetOnCoords(x, y, z);
			if (otherNet == net) {
				return;
			}
			var block = World.getBlockID(x, y, z);
			if (wireId == block) {
				if (otherNet) {
					this.mergeNets(net, otherNet);
				}
				else {
					net.wireMap[coordKey] = true;
					this.rebuildFor6Sides(net, wireId, x, y, z);
				}
			}
			else if (otherNet) {
				if (otherNet.energyName == type) {
					net.addConnection(otherNet);
					otherNet.addConnection(net);
				}
			}
			else if (EnergyRegistry.isWire(block, type)) {
				this.buildForWire(x, y, z, block);
			}
		}
	},

	rebuildFor6Sides: function(net, wireId, x, y, z) {
		this.rebuildRecursive(net, wireId, x, y + 1, z, 0);
		this.rebuildRecursive(net, wireId, x, y - 1, z, 1);
		this.rebuildRecursive(net, wireId, x, y, z + 1, 2);
		this.rebuildRecursive(net, wireId, x, y, z - 1, 3);
		this.rebuildRecursive(net, wireId, x + 1, y, z, 4);
		this.rebuildRecursive(net, wireId, x - 1, y, z, 5);
	},
	
	
	rebuildTileNet: function(tile){
		var nets = tile.__energyNets;
		for (var i in nets) {
			EnergyNetBuilder.removeNet(nets[i]);
			delete nets[i];
		}
		
		for(var i in tile.__connetedNets){
			tile.__connetedNets[i].removeTileEntity();
		}
		EnergyNetBuilder.rebuildTileConnections(tile.x, tile.y, tile.z, tile);
	},
	
	rebuildTileConnections: function(x, y, z, tile) {
		for (var name in tile.__energyTypes) {
			for (var side = 0; side < 6; side++) {
				if (tile.canReceiveEnergy(side, name)) {
					var c = this.getRelativeCoords(x, y, z, side);
					var tileSource = TileEntityRegistry.accessMachineAtCoords(c.x, c.y, c.z);
					if (tileSource && tileSource.__energyTypes[name]) {
						if (tileSource.canExtractEnergy(side + Math.pow(-1, side), name)) {
							var net = tileSource.__energyNets[name];
							if (net) net.addTileEntity(tile);
						}
					}
					else {
						var net = this.getNetOnCoords(c.x, c.y, c.z);
						if (net && net.energyName == name) {
							net.addTileEntity(tile);
						}
					}
				}
			}
		}
	},

	getNetOnCoords: function(x, y, z) {
		for (var i in this.energyNets) {
			var net = this.energyNets[i];
			var key = x + ":" + y + ":" + z;
			if (net.wireMap[key]) return net;
		}
		return null;
	},
	
	getNetByBlock: function(x, y, z, wireId) {
		if (World.getBlockID(x, y, z) == wireId) {
			return this.getNetOnCoords(x, y, z);
		}
		return null;
	},

	tickEnergyNets: function() {
		for (var i in this.energyNets) {
			this.energyNets[i].tick();
		}
	},
	
	getRelativeCoords: function(x, y, z, side) {
		var directions = [
			{x: 0, y: -1, z: 0}, // down
			{x: 0, y: 1, z: 0}, // up
			{x: 0, y: 0, z: -1}, // east
			{x: 0, y: 0, z: 1}, // west
			{x: -1, y: 0, z: 0}, // south
			{x: 1, y: 0, z: 0} // north
		]
		var dir = directions[side];
		return {x: x + dir.x, y: y + dir.y, z: z + dir.z};
	},
}

Callback.addCallback("LevelLoaded", function() {
    EnergyNetBuilder.energyNets = [];
});

Callback.addCallback("tick", function() {
    EnergyNetBuilder.tickEnergyNets();
});


var GLOBAL_WEB_ID = 0;

function EnergyNet(energyType, maxPacketSize, overloadFunc) {
	this.energyType = energyType;
	this.energyName = energyType.name;
	this.maxPacketSize = maxPacketSize || 2e9;
	
	this.netId = GLOBAL_WEB_ID++;
	
	this.wireMap = {};
	this.onOverload = overloadFunc || function() {};
	
	this.store = 0;
	this.transfered = 0;
	this.voltage = 0;
	this.lastStore = 0;
	this.lastTransfered = 0;
	this.lastVoltage = 0;
	
	var self = this;
	this.source = {
		parent: function() {
			return self;
		},
		
		add: function(amount, voltage) {
			var add = self.addEnergy(amount, voltage || amount, self.sourceTile, {});
			return amount - add;
		},
		
		addAll: function(amount, voltage) {
			if (!voltage) voltage = amount;
			if(self.connectionsCount == 1 && self.tileEntities.length == 0){
				for(var i in self.connectedNets)
				self.connectedNets[i].addToBuffer(amount, voltage);
				self.transfered = amount;
				self.voltage = voltage;
			}
			else {
				self.addToBuffer(amount, voltage);
			}
		}
	}

	this.connectedNets = {};
	this.connectionsCount = 0;
	this.addConnection = function(net) {
		if(!this.connectedNets[net.netId]){
			this.connectedNets[net.netId] = net;
			this.connectionsCount++;
		}
	}

	this.removeConnection = function(net) {
		delete this.connectedNets[net.netId];
		this.connectionsCount--;
	}

	this.tileEntities = [];
	this.addTileEntity = function(tileEntity) {
		if (!tileEntity.__connectedNets[this.netId]) {
			this.tileEntities.push(tileEntity);
			tileEntity.__connectedNets[this.netId] = this;
		}
	}

	this.removeTileEntity = function(tileEntity) {
		for (var i in this.tileEntities) {
			if (this.tileEntities[i] == tileEntity) {
				this.tileEntities.splice(i, 1);
				break;
			}
		}
	}

	this.addEnergy = function(amount, voltage, source, explored) {
		if (explored[this.netId]) {
			return 0;
		}
		explored[this.netId] = true;
		
		var inVoltage = voltage;
		if (voltage > this.maxPacketSize) {
			voltage = this.maxPacketSize;
			amount = Math.min(amount, voltage);
		}
		var inAmount = amount;
		var n = this.tileEntities.length;
		for (var i in this.tileEntities) {
			if (amount <= 0) break;
			var tile = this.tileEntities[i];
			if (tile != source) {
				amount -= tile.energyReceive(this.energyName, Math.ceil(amount/n), voltage);
			}
			n--;
		}
		for (var i in this.tileEntities) {
			if (amount <= 0) break;
			var tile = this.tileEntities[i];
			if (tile != source) {
				amount -= tile.energyReceive(this.energyName, amount, voltage);
			}
		}
		
		for (var i in this.connectedNets) {
			if (amount <= 0) break;
			var net = this.connectedNets[i];
			if (!net.tileSource) {
				amount -= net.addEnergy(amount, voltage, source, explored);
			}
		}
		
		if (inAmount > amount){
			if (inVoltage > voltage){
				this.onOverload(inVoltage);
			}
			this.voltage = Math.max(this.voltage, voltage);
			this.transfered += inAmount - amount;
		}
		return inAmount - amount;
	}
	
	this.addToBuffer = function(amount, voltage) {
		this.store += amount;
		this.voltage = Math.max(this.voltage, voltage);
	}

	this.toString = function() {
		var r = function(x) {return Math.round(x * 100) / 100};
		return "[EnergyNet id=" + this.netId + " type=" + this.energyName + "| stored =" + this.lastStore + "| connections=" + this.connectionsCount + " units=" + this.tileEntities.length + " | transfered=" + r(this.lastTransfered) + " | voltage=" + r(this.lastVoltage) + "]";
	}

	this.tick = function() {
		this.lastStore = this.store;
		if (this.store > 0) {
			this.addEnergy(this.store, this.voltage, null, {});
			this.store = 0;
		}
		this.lastTransfered = this.transfered;
		this.lastVoltage = this.voltage;
		this.transfered = 0;
		this.voltage = 0;
	}
}


registerAPIUnit("EnergyTypeRegistry", EnergyRegistry);
registerAPIUnit("EnergyNetBuilder", EnergyNetBuilder);
registerAPIUnit("EnergyTileRegistry", TileEntityRegistry);


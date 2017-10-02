/*
  _____                                           _       _   _         ____           _           
 | ____|  _ __     ___   _ __    __ _   _   _    | |     (_) | |__     | __ )    ___  | |_    __ _ 
 |  _|   | '_ \   / _ \ | '__|  / _` | | | | |   | |     | | | '_ \    |  _ \   / _ \ | __|  / _` |
 | |___  | | | | |  __/ | |    | (_| | | |_| |   | |___  | | | |_) |   | |_) | |  __/ | |_  | (_| |
 |_____| |_| |_|  \___| |_|     \__, |  \__, |   |_____| |_| |_.__/    |____/   \___|  \__|  \__,_|
                                |___/   |___/                                                      
*/

var libconfig = new Config(FileTools.workdir + "config-energylib.json");

libconfig.checkAndRestore({
    performance: {
        lazy_web_rebuild: false
    },
    util: {
        logger_tag: "ENERGY_LIB"
    }
});

var LOGGER_TAG = libconfig.access("util.logger_tag");

if (getCoreAPILevel() >= 8) {
    Logger.Log("API Level check successful", LOGGER_TAG);
}
else {
    Logger.Log("API Level check failed: required=8 current=" + getCoreAPILevel(), LOGGER_TAG);
}

Translation.addTranslation("Energy", {ru: "Энергия"});



var EnergyLib = {
    getConfig: function() {
        return libconfig;
    }
}




function EnergyType(name) {
    this.name = name;
    
    this.value = 1;
    
    this.wireIds = {};
    
    this.getWireSpecialType = function() {
        return null; // method is no longer supported
    }
    
    this.registerWire = function(id) {
        this.wireIds[id] = true;
        EnergyRegistry.wireIds[id] = true;
    }
    
    this.toString = function() {
        return "[EnergyType name=" + this.name + " value=" + this.value + " wire=" + this.wireId + "]";
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
            alert("WARNING: dublicate energy types for name: " + name + "!");
            Logger.Log("dublicate energy types for name: " + name + "!", "ERROR");
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
    
    
    
    wireIds: {},
    
    isWire: function(id, data) {
        return this.wireIds[id];
    },
    
    onWirePlaced: function() {
        EnergyWebBuilder.postWebRebuild();
    },
    
    onWireDestroyed: function() {
        EnergyWebBuilder.postWebRebuild();
    },
    
    registerWirePlaced: function() {
        this.onWirePlaced();
    }
}

Callback.addCallback("ItemUse", function(coords, item, block) {
    if (EnergyRegistry.isWire(item.id, item.data)) {
        EnergyRegistry.onWirePlaced();
    }
});

Callback.addCallback("DestroyBlock", function(coords, block) {
    if (EnergyRegistry.isWire(block.id, block.data)) {
        EnergyRegistry.onWireDestroyed();
    }
});


var TileEntityRegistry = {
    /**
     * adds energy type for tile entity prototype
    */
    addEnergyType: function(Prototype, energyType) {
        if (!Prototype.__energyLibInit) {
            this.setupInitialParams(Prototype);
        }
        
        Prototype.__energyTypes[energyType.name] = energyType;
    },
    
    /**
     * same as addEnergyType, but works on already created prototypes, accessing them by id
    */
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
        
        Prototype.__energyWebs = {};
        Prototype.__energyTypes = {}; 
        
        if (!Prototype.energyReceive) {
            Prototype.energyReceive = function(type, src) {
                // called before energy tick, if some energy of this type exists in the web
            }
        }
        
        if (!Prototype.energyTick) {
            Prototype.energyTick = function(type, src) {
                // called for each energy web
            }
        } 
        
        Prototype.__init = Prototype.init || function() {};
        Prototype.__destroy = Prototype.destroy || function() {};
        Prototype.__tick = Prototype.tick || function() {};
        
        Prototype.isGenerator = Prototype.isGenerator || function() {
            return false;
        };
        
        Prototype.init = function() {
            TileEntityRegistry.addMacineAccessAtCoords(this.x, this.y, this.z, this);
            
            this.__energyWebs = {};
            
            this.__init();
        }
        
        Prototype.destroy = function() {
            TileEntityRegistry.removeMachineAccessAtCoords(this.x, this.y, this.z);
        
            EnergyWebBuilder.postWebRebuild();
            
            this.__destroy();
        }
        
        if (libconfig.access("performance.lazy_web_rebuild")) {
            Prototype.tick = function() {
                if (World.getThreadTime() % 30 == 0) {
                    for (var name in this.__energyTypes) {
                        var web = this.__energyWebs[name];
                        if (!web) {
                            web = EnergyWebBuilder.buildFor(this, this.__energyTypes[name]);
                        }
                    }
                }
                
                for (var name in this.__energyTypes) {
                    var web = this.__energyWebs[name];
                    if (!web) {
                        continue;
                    }
                    var src = web.source;
                    if (src.any()) {
                        this.energyReceive(name, src);
                    }
                    this.energyTick(name, src);
                }
                
                this.__tick();
            }
        }
        else {
            Prototype.tick = function() {
                for (var name in this.__energyTypes) {
                    var web = this.__energyWebs[name];
                    if (!web) {
                        web = EnergyWebBuilder.buildFor(this, this.__energyTypes[name]);
                    }
                    var src = web.source;
                    if (src.any()) {
                        this.energyReceive(name, src);
                    }
                    this.energyTick(name, src);
                }
                
                this.__tick();
            }
        }
    },



    /* machine is tile entity, that uses energy */
    machineIDs: {},
    
    isMachine: function(id){
        return this.machineIDs[id];
    },
    
    quickCoordAccess: {},
    
    addMacineAccessAtCoords: function(x, y, z, machine){
        this.quickCoordAccess[x + ":" + y + ":" + z] = machine;
    },
    
    removeMachineAccessAtCoords: function(x, y, z){
        delete this.quickCoordAccess[x + ":" + y + ":" + z];
    },
    
    accessMachineAtCoords: function(x, y, z){
        return this.quickCoordAccess[x + ":" + y + ":" + z];
    },
    
    executeForAll: function(func){
        for (var key in this.quickCoordAccess){
            var mech = this.quickCoordAccess[key];
            if (mech){
                func(mech);
            }
        }
    },
};

Callback.addCallback("LevelLoaded", function(){
    TileEntityRegistry.quickCoordAccess = {};
});


var EnergyWebBuilder = {
    
    buildFor: function(tileEntity, type){
        var web = new EnergyWeb(type);
        
        this.rebuildRecursive(web, type.wireIds, tileEntity.x, tileEntity.y, tileEntity.z, {});
        
        this.addEnergyWeb(web);
        return web;
    },
    
    energyWebs: [],
    addEnergyWeb: function(web) {
        this.energyWebs.push(web);
    },
    
    removeEnergyWeb: function(web) {
        for (var i in this.energyWebs) {
            if (this.energyWebs[i] == web) {
                this.energyWebs.splice(i--, 1);
            }
        }
    },
    
    tickEnergyWebs: function() {
        for (var i in this.energyWebs) {
            this.energyWebs[i].tick();
        }
    },
    
    rebuildRecursive: function(web, wireIds, x, y, z, explored){
        var coordKey = x + ":" + y + ":" + z;
        if (explored[coordKey]){
            return;
        }
        else{
            explored[coordKey] = true;
        }
        
        var tileEntity = TileEntityRegistry.accessMachineAtCoords(x, y, z);
        if (tileEntity && tileEntity.__energyTypes[web.energyName]){
            web.addTileEntity(tileEntity);
            this.rebuildFor6Sides(web, wireIds, x, y, z, explored);
        }
        else {
            var tile = World.getBlockID(x, y, z);
            if (wireIds[tile]){
                this.rebuildFor6Sides(web, wireIds, x, y, z, explored);
            }
            else {
                return;
            }
        }
    },
    
    rebuildFor6Sides: function(web, wireIds, x, y, z, explored){
        this.rebuildRecursive(web, wireIds, x - 1, y, z, explored);
        this.rebuildRecursive(web, wireIds, x + 1, y, z, explored);
        this.rebuildRecursive(web, wireIds, x, y - 1, z, explored);
        this.rebuildRecursive(web, wireIds, x, y + 1, z, explored);
        this.rebuildRecursive(web, wireIds, x, y, z - 1, explored);
        this.rebuildRecursive(web, wireIds, x, y, z + 1, explored);
    },
    
    postedRebuildTimer: 0,
    
    clearWebData: function(){
        for (var i in this.energyWebs) {
            this.energyWebs[i].remove = true;
        }
        this.energyWebs = [];
        TileEntityRegistry.executeForAll(function(tileEntity){
            tileEntity.__energyWebs = {};
        });
    },
    
    postWebRebuild: function(delay){
        this.postedRebuildTimer = delay || 60;
    }
}

Callback.addCallback("LevelLoaded", function() {
    EnergyWebBuilder.energyWebs = [];
});

Callback.addCallback("tick", function(){
    if (EnergyWebBuilder.postedRebuildTimer > 0){
        EnergyWebBuilder.postedRebuildTimer--;
        if (EnergyWebBuilder.postedRebuildTimer <= 0){
            EnergyWebBuilder.clearWebData();
        }
    }
    EnergyWebBuilder.tickEnergyWebs();
});


var GLOBAL_WEB_ID = 0;

function EnergyWeb(energyType) {
    this.energyType = energyType;
    this.energyName = energyType.name;
    
    this.releaseAmount = 0;
    this.receivedAmount = 0;
    this.retreivedAmount = 0;
    
    this.avaibleAmount = 0;
    this.lastInAmount = 0;
    this.lastOutAmount = 0;
    
    this.currPotentialInAmount = 0;
    this.lastPotentialInAmount = 0;
    this.currPotentialOutAmount = 0;
    this.lastPotentialOutAmount = 0;
    
    this.webId = GLOBAL_WEB_ID++;
    
    this.minTransportAmount = 16;
    
    var self = this;
    this.source = {
        parent: function() {
            return self;
        },
        
        amount: function() {
            return self.releaseAmount;
        },
        
        any: function() {
            return self.releaseAmount > 0;
        },
        
        get: function(amount, doNotRegister) {
            var got = Math.min(self.releaseAmount, Math.min(self.avaibleAmount / Math.max(self.consumerCount, 1), amount));
            self.releaseAmount -= got;
            self.retreivedAmount += got;
            if (!doNotRegister) {
                self.currPotentialOutAmount += amount;
            }
            return got;
        },
        
        getAll: function(amount, doNotRegister) {
            var got = Math.min(self.releaseAmount, amount);
            self.releaseAmount -= got;
            self.retreivedAmount += got;
            if (!doNotRegister) {
                self.currPotentialOutAmount += amount;
            }
            return got;
        },
        
        add: function(amount, doNotRegister) {
            var add = Math.min(amount, this.free());
            self.receivedAmount += add;
            if (!doNotRegister) {
                self.currPotentialInAmount += amount;
            }
            return amount - add;
        },
        
        addAll: function(amount, doNotRegister) {
            var lastMinAmount = self.minTransportAmount;
            self.minTransportAmount = amount;
            var left = this.add(amount, doNotRegister);
            self.minTransportAmount = lastMinAmount;
            return left;
        },
        
        storage: function(amountReceive, amountRetreive) {
            if (self.lastPotentialInAmount > self.lastPotentialOutAmount) {
                var got = this.getAll(Math.min(amountReceive, self.lastPotentialInAmount - self.lastPotentialOutAmount), true);
                return got;
            }
            else {
                var left = this.add(amountRetreive, true);
                return left - amountRetreive;
            }
            
            return 0;
        },
        
        free: function() {
            return Math.max((self.lastOutAmount + self.minTransportAmount) - (self.receivedAmount + self.releaseAmount), 0);
        }
    }
    
    this.consumerCount = 0;
    this.generatorCount = 0;
    this.calcAmount = function() {
        this.consumerCount = 0;
        this.generatorCount = 0;
    
        for (var i in this.tileEntities) {
            var tileEntity = this.tileEntities[i];
            if (tileEntity.isGenerator()) {
                this.generatorCount++;
            }
            else {
                this.consumerCount++;
            }
        }
    }
    
    this.tileEntities = [];
    this.addTileEntity = function(tileEntity) {
        if (!tileEntity.__energyWebs) {
            tileEntity.__energyWebs = {};
        }
        if (tileEntity.__energyWebs[this.energyName]) {
            tileEntity.__energyWebs[this.energyName].removeTileEntity(tileEntity);
        }
        
        this.tileEntities.push(tileEntity);
        tileEntity.__energyWebs[this.energyName] = this;
        
        if (tileEntity.isGenerator()) {
            this.generatorCount++;
        }
        else {
            this.consumerCount++;
        }
    }
    
    this.removeTileEntity = function(tileEntity) {
        for (var i in this.tileEntities) {
            if (this.tileEntities[i] == tileEntity) {
                tileEntity.__energyWebs[this.energyName] = null;
                this.tileEntities.splice(i--, 1);
            }
        }
        
        this.calcAmount();
    }
    
    
    this.toString = function() {
        var r = function(x) {return Math.round(x * 10) / 10};
        return "[EnergyWeb id=" + this.webId + " type=" + this.energyName + " units=" + this.tileEntities.length + " | stored=" + r(this.releaseAmount) + " in=" + r(this.lastInAmount) + "(" + r(this.lastPotentialInAmount) + ")" + " out=" + r(this.lastOutAmount)  + "(" + r(this.lastPotentialOutAmount) + ")" + "]";
    }
    
    
    
    this.tick = function() {
        if (this.tileEntities.length == 0) {
            EnergyWebBuilder.removeEnergyWeb(this);
            return;
        }
        
        this.isOverfilling = this.releaseAmount > 0;
        
        this.lastInAmount = this.receivedAmount;
        this.lastOutAmount = this.retreivedAmount;
        this.lastPotentialInAmount = this.currPotentialInAmount;
        this.lastPotentialOutAmount = this.currPotentialOutAmount;
        this.currPotentialInAmount = 0;
        this.currPotentialOutAmount = 0;
        
        this.releaseAmount += this.receivedAmount;
        this.avaibleAmount = this.releaseAmount;
        this.receivedAmount = 0;
        this.retreivedAmount = 0;
    }
}

registerAPIUnit("EnergyLibCore", EnergyLib);
registerAPIUnit("EnergyTypeRegistry", EnergyRegistry);
registerAPIUnit("EnergyTileRegistry", TileEntityRegistry);





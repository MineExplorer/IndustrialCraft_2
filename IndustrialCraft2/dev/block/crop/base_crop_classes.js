AgricultureAPI.abstractFunctions["IC2CropCard"] = {
    baseSeed: {
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 1,
    getOptimalHarvestSize(te) {
        return te.crop.maxSize;
    },
    getDiscoveredBy: function() {
        return "IC2 Team";
    },
    isWeed: function(te){return false},
    tick: function(te){},
    dropGainChance: function(te){
        return Math.pow(0.95, te.crop.properties.tier);
    },
    canGrow: function(te){
        return te.data.currentSize < te.crop.maxSize;
    },
    canBeHarvested: function(te){
        return te.data.currentSize == te.crop.maxSize;
    },
    getGrowthDuration: function(te){
        return te.crop.properties.tier * 200;
    },
    getSeeds: function(te){
        return te.generateSeeds(te.data);
    },
    getSeedDropChance: function(te){
        if (te.data.currentSize == 1) return 0;
        var base = .5;
        if (te.data.currentSize ==  2) base /= 2;
        base *= Math.pow(0.8, te.crop.properties.tier);
        return base;
    },
    onLeftClick: function(te){return te.pick()},
    onRightClick: function(te){return te.performManualHarvest()},
    onEntityCollision: function(te){return true},
    getSizeAfterHarvest: function(te){return 1},
    getRootsLength: function(te){return 1}
};

AgricultureAPI.abstractFunctions["CropVanilla"] = {
    getDiscoveredBy: function() {
        return "Notch";
    },
    getProduct: function(){return {id: 0, count: 1, data: 0}},
    canGrow: function(tileentity){
        var light = World.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
        return tileentity.data.currentSize < tileentity.crop.maxSize && light >= 9;
    },
    getGain: function(te){
        return te.crop.getProduct();
    },
    getSeeds: function(te){
        if (te.data.statGain <= 1 && te.data.statGrowth <= 1 && te.data.statResistance <= 1) {
            return AgricultureAPI.abstractFunctions["CropVanilla"].getSeed();
        }
        return AgricultureAPI.abstractFunctions["IC2CropCard"].getSeeds(te);
    },
    getSeed: function(){return {id: 0, count: 0, data: 0}}
};

AgricultureAPI.abstractFunctions["CropColorFlower"] = {
    getDiscoveredBy: function() {
        if (this.name == "dandelion" || this.name == "rose") {
            return "Notch";
        }
        return "Alblaka";
    },
    properties: {
        tier: 2,
        chemistry: 1,
        consumable: 1 ,
        defensive: 0,
        colorful: 5,
        weed: 1
    },
    maxSize: 4,
    color: 0,
    getOptimalHarvestSize: function(crop){return 4},
    canGrow(tileentity) {
        var light = World.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
        return tileentity.data.currentSize < tileentity.crop.maxSize &&  light >= 12;
    },
    getGain: function(te){return {id: 351, count: 1, data: this.color}},
    getSizeAfterHarvest: function(te){return 3},
    getGrowthDuration(crop) {
        if (crop.data.currentSize  ==  3) {
            return 600;
        }
        return 400;
    }
};

AgricultureAPI.abstractFunctions["CropBaseMushroom"] = {
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 4 ,
        defensive: 0,
        colorful: 0,
        weed: 4
    },
    maxSize: 3,
    canGrow: function(crop) {
        return crop.data.currentSize < this.maxSize && crop.data.storageWater > 0;
    },
    getGrowthDuration: function(crop){return 200;}
};

AgricultureAPI.abstractFunctions["CropBaseMetalCommon"] = {
    properties: {
        tier: 6,
        chemistry: 2,
        consumable: 0 ,
        defensive: 0,
        colorful: 1,
        weed: 0
    },
    maxSize: 4,
    cropRootsRequirement: [],
    getOptimalHarvestSize: function(crop){return 4},
    getRootsLength: function(crop) {return 5},
    canGrow: function(crop) {
        if (crop.data.currentSize < 3) return true;
        if (crop.data.currentSize  ==  3) {
            if (!this.cropRootsRequirement || !this.cropRootsRequirement.length ) return true;
            for(var ind in this.cropRootsRequirement){
                var id = this.cropRootsRequirement[ind];
                if(crop.isBlockBelow(eval(id))) return true;
            }
        }
        return false;
    },
    canBeHarvested(crop) {
        return crop.data.currentSize == 4;
    },
    dropGainChance: function() {
        return  AgricultureAPI.abstractFunctions["IC2CropCard"] / 2;
    },
    getGrowthDuration: function(crop) {
        if (crop.data.currentSize == 3) {
            return 2000;
        }
        return 800;
    },
    getSizeAfterHarvest: function(crop) {
        return 2;
    }
};

AgricultureAPI.abstractFunctions["CropBaseMetalUncommon"] = {
    properties: {
        tier: 6,
        chemistry: 2,
        consumable: 0 ,
        defensive: 0,
        colorful: 2,
        weed: 0
    },
    maxSize: 5,
    cropRootsRequirement: [],
    getOptimalHarvestSize: function(crop){return 5},
    getRootsLength: function(crop) {return 5},
    canGrow: function(crop) {
        if (crop.data.currentSize < 4) return true;
        if (crop.data.currentSize == 4) {
            if (!this.cropRootsRequirement || !this.cropRootsRequirement.length) return true;
            for(var ind in this.cropRootsRequirement){
                var id = this.cropRootsRequirement[ind];
                if(crop.isBlockBelow(eval(id))) return true;
            }
        }
        return false;
    },
    canBeHarvested(crop) {
        return crop.data.currentSize == 5;
    },
    dropGainChance: function() {
        return Math.pow(0.95, this.properties.tier);
    },
    getGrowthDuration: function(crop) {
        if (crop.data.currentSize == 4) {
            return 2200;
        }
        return 750;
    },
    getSizeAfterHarvest: function(crop) {
        return 2;
    }
};
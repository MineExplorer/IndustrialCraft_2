AgricultureAPI.registerCropCard({
    name:"weed",
    attributes: ["Weed", "Bad"],
    properties: {
        tier:0,
        chemistry:0,
        consumable:0 ,
        defensive: 1,
        colorful:0 ,
        weed:5
    },
    maxSize:5,
    getOptimalHarvestSize: function(crop){return 1},
    canBeHarvested: function(tileentity){return false},
    getGrowthDuration: function(){return 300},
    getGain: function(tileentity){return null}
});

AgricultureAPI.registerCropCard({
    name:"ic2_wheat",
    attributes: ["Yellow", "Food", "Wheat"],
    base: "CropVanilla",
    properties: {
        tier:1,
        chemistry:0,
        consumable:4 ,
        defensive: 0,
        colorful:0 ,
        weed:2 
    },
    baseSeed: {
        id: 295,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:7,
    sizeAfterHarvest:2,
    getProduct: function(){
        return {id:296, count:1, data:0};
    },
    getSeed: function(){
        return {id:295, count:1, data:0};
    }
});

AgricultureAPI.registerCropCard({
    name:"pumpkin",
    attributes: ["Orange", "Decoration", "Stem"],
    base: "CropVanilla",
    properties: {
        tier:1,
        chemistry:0,
        consumable:1 ,
        defensive: 0,
        colorful:3 ,
        weed:1 
    },
    baseSeed: {
        id: 361,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:4,
    getProduct: function(){
        return {id: 86, count: 1, data: 0}
    },
    getGrowthDuration(te) {
        if (te.data.currentSize == 3) return 600;  
        return 200;
    },
    getSeed: function(){
        return {id: 361, count: random(1, 4), data: 0}
    },
    getSizeAfterHarvest: function(te){
        return this.maxSize - 1;
    }
});

AgricultureAPI.registerCropCard({
    name:"melon",
    attributes: [ "Green", "Food", "Stem" ],
    base: "CropVanilla",
    properties: {
        tier:2,
        chemistry:0,
        consumable:4 ,
        defensive: 0,
        colorful:2 ,
        weed:0 
    },
    baseSeed: {
        id: 362,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:4,
    getProduct: function(){
        if(Math.random() < 0.5){
            return {id: 103, count: 1, data: 0}
        }
        return {id: 360, count: random(2, 6), data: 0}
    },
    getGrowthDuration(te) {
        if (te.currentSize == 3) {
            return 700;
        }
        return 250;
    },
    getSizeAfterHarvest: function(te){
        return this.maxSize - 1;
    },
    getSeed: function(){
        return {id: 362, count: random(1,3), data: 0}
    }
});

AgricultureAPI.registerCropCard({
    name:"dandelion",
    attributes: [  "Yellow", "Flower"],
    base: "CropColorFlower",
    baseSeed: {
        id: 37,
        size:4,
        growth:1,
        gain:1,
        resistance:1
    },
    color:0
});

AgricultureAPI.registerCropCard({
    name:"rose",
    attributes: ["Red", "Flower", "Rose"],
    base: "CropColorFlower",
    baseSeed: {
        id: 38,
        size:4,
        growth:1,
        gain:1,
        resistance:1
    },
    color:1
});

AgricultureAPI.registerCropCard({
    name:"blackthorn",
    attributes: ["Black", "Flower", "Rose" ],
    base: "CropColorFlower",
    color:0
});

AgricultureAPI.registerCropCard({
    name:"tulip",
    attributes: ["Purple", "Flower", "Tulip" ],
    base: "CropColorFlower",
    color:5
});

AgricultureAPI.registerCropCard({
    name:"cyazint",
    attributes: ["Blue", "Flower"],
    base: "CropColorFlower",
    color:6
});

AgricultureAPI.registerCropCard({
    name:"venomilia",
    attributes: ["Purple", "Flower", "Tulip", "Poison"],
    
    properties: {
        tier:3,
        chemistry:3,
        consumable:1 ,
        defensive: 3,
        colorful:3 ,
        weed:3 
    },
    maxSize:6,
    getOptimalHarvestSize: function(crop){return 4},
    getDiscoveredBy: function() {
        return "raGan";
    },
    canGrow: function(tileentity){
        var light = World.getLightLevel(tileentity.x,tileentity.y,tileentity.z);
        return (tileentity.data.currentSize <= 4 && light >= 12) || tileentity.data.currentSize== 5;
    },
    canBeHarvested(crop) {
        return crop.data.currentSize >= 4;
    },
    getGain(crop) {
        if (crop.data.currentSize== 5) {
            return {id:ItemID.grinPowder, count:1, data:0};
        }
        if (crop.data.currentSize >= 4) {
            return {id:351, count:1, data:5}
        }
        return null;
    },
    getSizeAfterHarvest(crop) {return 3},
    getGrowthDuration(crop) {
        if (crop.data.currentSize >= 3) {
            return 600;
        }
        return 400;
    },
    onRightClick(crop) {
        if (Player.getCarriedItem().id)this.onEntityCollision(crop);
        return crop.performManualHarvest();
    },
    onLeftClick(crop) {
        if (Player.getCarriedItem().id)this.onEntityCollision(crop);
        return crop.pick();
    },
    onEntityCollision(crop) {
        if (crop.data.currentSize == 5) {
            var armorSlot = Player.getArmorSlot(3);
            if (random(0,50)&&armorSlot.id)return AgricultureAPI.abstractFunctions["IC2CropCard"].onEntityCollision(crop);
            Entity.addEffect(Player.get(), MobEffect.poison, 1, (random(0,10) + 5) * 20);
            crop.data.currentSize = 4;
            crop.updateRender();
        }
        return AgricultureAPI.abstractFunctions["IC2CropCard"].onEntityCollision(crop);
    },
    isWeed(crop) {
        return crop.data.currentSize == 5 && crop.data.statGrowth >= 8;
    }
});


AgricultureAPI.registerCropCard({
    name:"reed",
    attributes: [ "Reed" ],
    properties: {
        tier:2,
        chemistry:0,
        consumable:0 ,
        defensive: 2,
        colorful:0 ,
        weed:2 
    },
    baseSeed: {
        id: 338,
        size:1,
        growth:3,
        gain:0,
        resistance:2
    },
    maxSize:3,
    getDiscoveredBy: AgricultureAPI.abstractFunctions["CropVanilla"].getDiscoveredBy,
    canBeHarvested: function(te) {
        return te.data.currentSize > 1
    },
    getGain: function(tileentity) {
        return {id:338, count:tileentity.data.currentSize-1, data:0};
    },
    onEntityCollision: function(te) {return false},
    getGrowthDuration: function(te) {
        return 200;
    }
});

AgricultureAPI.registerCropCard({
    name:"stickreed",
    attributes: ["Reed", "Resin" ],
    properties: {
        tier:2,
        chemistry:0,
        consumable:0 ,
        defensive: 2,
        colorful:0 ,
        weed:2 
    },
    baseSeed: {
        id: 338,
        size:1,
        growth:3,
        gain:0,
        resistance:2
    },
    maxSize:4,
    getOptimalHarvestSize: function(crop) {return 4},
    getDiscoveredBy: function() {
        return "raa1337";
    },
    canGrow: function(crop) {
        return crop.data.currentSize < 4;
    },
    canBeHarvested: function(te) {
        return te.data.currentSize > 1
    },
    getGain: function(crop) {
        if (crop.data.currentSize <= 3) {
            return {id: 338, count: crop.data.currentSize-1, data: 0};
        }
        return {id: ItemID.latex, count: 1, data: 0};
    },
    getSizeAfterHarvest: function(crop) {
        if (crop.data.currentSize == 4) {return random(0,3)}
        return 1;
    },
    onEntityCollision: function(crop) {return false},
    getGrowthDuration: function(crop) {
        if (crop.data.currentSize == 4) {return 400}
        return 100;
    }
});

AgricultureAPI.registerCropCard({
    name: "cocoa",
    attributes: ["Brown", "Food", "Stem"],
    properties: {
        tier:3,
        chemistry:1,
        consumable:3 ,
        defensive: 0,
        colorful:4 ,
        weed:0
    },
    baseSeed: {
        id: 351,
        data:3,
        size:1,
        growth:0,
        gain:0,
        resistance:0
    },
    maxSize:4,
    getDiscoveredBy:AgricultureAPI.abstractFunctions["IC2CropCard"].getDiscoveredBy,
    getOptimalHarvestSize: function(crop){return 4},
    canGrow: function(crop) {
        return crop.data.currentSize <= 3 && crop.data.storageNutrients >= 3;
    },
    canBeHarvested: function(crop) {
        return crop.data.currentSize == 4;
    },
    getGain: function(tileentity){
        return {id:351, count:1, data:3};
    },
    getGrowthDuration: function(crop) {
        if (crop.data.currentSize == 3) {
            return 900;
        }return 400;
    },
    getSizeAfterHarvest(crop){
        return 3;
    }
});

AgricultureAPI.registerCropCard({
    name:"red_mushroom",
    attributes: [ "Red", "Food", "Mushroom"],
    base: "CropBaseMushroom",
    baseSeed: {
        id: 40,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    getGain: function(te){
        return {id:40, count:1, data:0}
    }
});

AgricultureAPI.registerCropCard({
    name:"brown_mushroom",
    attributes: [ "Brown", "Food", "Mushroom" ],
    base: "CropBaseMushroom",
    baseSeed: {
        id: 39,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    getGain: function(te){
        return {id:39, count:1, data:0}
    }
});

AgricultureAPI.registerCropCard({
    name:"nether_wart",
    attributes: [ "Red", "Nether", "Ingredient", "Soulsand"],
    properties: {
        tier:5,
        chemistry:4,
        consumable:2 ,
        defensive: 0,
        colorful:2 ,
        weed:1 
    },
    baseSeed: {
        id: 372,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:3,
    getDiscoveredBy:AgricultureAPI.abstractFunctions["CropVanilla"].getDiscoveredBy,
    dropGainChance: function(te) {return 2},
    getGain: function(te){
        return {id:372, count:1, data:0}
    },
    tick: function(te){
        if(te.isBlockBelow(88)){
            if (te.crop.canGrow(te)) {
                te.data.growthPoints+=100
            }else if(te.isBlockBelow(80) && Math.random() < 1/300){
                te.data.crop = AgricultureAPI.getCardIndexFromName("terra_wart");
                te.crop = AgricultureAPI.cropCards[te.data.crop];
            }
        }
    }
});

AgricultureAPI.registerCropCard({
    name:"terra_wart",
    attributes: [ "Blue", "Aether", "Consumable", "Snow"],
    properties: {
        tier:5,
        chemistry:2,
        consumable:4 ,
        defensive: 0,
        colorful:3 ,
        weed:0 
    },
    baseSeed: {
        id: "ItemID.terraWart",
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:3,
    dropGainChance: function(te) {return .8},
    getGain: function(te){
        return {id:ItemID.terraWart, count:1, data:0}
    },
    tick: function(te){
        if(te.isBlockBelow(80)){
            if (te.crop.canGrow(te)) {
                te.data.growthPoints+=100
            }
			else if(te.isBlockBelow(88) && Math.random() < 1/300){
                te.data.crop = AgricultureAPI.getCardIndexFromName("nether_wart");
                te.crop = AgricultureAPI.cropCards[te.data.crop];
            }
        }
    }
});

AgricultureAPI.registerCropCard({
    name:"ferru",
    attributes: ["Gray", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: [15,42],
    getGain(crop) {
        return {id: ItemID.dustSmallIron, count:1, data:0}
    }
});

AgricultureAPI.registerCropCard({
    name:"cyprium",
    attributes: ["Orange", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: ["BlockID.blockCopper","BlockID.oreCopper"],
    getGain(crop) {
        return {id: ItemID.dustSmallCopper, count:1, data:0}
    }
});

AgricultureAPI.registerCropCard({
    name:"stagnium",
    attributes: ["Shiny", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: ["BlockID.blockTin","BlockID.oreTin"],
    getGain(crop) {
        return {id: ItemID.dustSmallTin, count:1, data:0}
    }
});

AgricultureAPI.registerCropCard({
    name:"plumbiscus",
    attributes: ["Dense", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: ["BlockID.blockLead","BlockID.oreLead"],
    getGain(crop) {
        return {id: ItemID.dustSmallLead, count:1, data:0}
    }
});

AgricultureAPI.registerCropCard({
    name:"aurelia",
    attributes: [ "Gold", "Leaves", "Metal"],
    base: "CropBaseMetalUncommon",
    cropRootsRequirement: [14,41],
    getGain(crop) {
        return {id: 371, count:1, data:0}
    }
});

AgricultureAPI.registerCropCard({
    name:"shining",
    attributes: [ "Silver", "Leaves", "Metal" ],
    base: "CropBaseMetalUncommon",
    cropRootsRequirement: ["BlockID.blockSilver","BlockID.oreSilver"],
    getGain(crop) {
        return {id: ItemID.dustSmallSilver, count:1, data:0}
    }
});

AgricultureAPI.registerCropCard({
    name:"redwheat",
    attributes: [  "Red", "Redstone", "Wheat"],
    properties: {
        tier:6,
        chemistry:3,
        consumable:0 ,
        defensive: 0,
        colorful:2 ,
        weed:0
    },
    baseSeed: {
        id: 391,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:7,
    getOptimalHarvestSize: function(crop){return 7},
    getDiscoveredBy: function() {
        return "raa1337";
    },
    canGrow: function(crop) {
        var light = World.getLightLevel(crop.x,crop.y,crop.z);
        return crop.data.currentSize < 7 && light <= 10 && light >= 5;
    },
    dropGainChance: function() {return 0.5},
    getGain(crop) {
        if (Math.random() < 0.5) return {id:331, count:1, data:0};
        return {id:295, count:1, data:0}
    },
    getGrowthDuration(crop){return 600},
    getSizeAfterHarvest(crop) {return 2}
});

AgricultureAPI.registerCropCard({
    name:"coffee",
    attributes: ["Leaves", "Ingredient", "Beans"],
    properties: {
        tier:7,
        chemistry:1,
        consumable:4,
        defensive: 1,
        colorful:2 ,
        weed:0
    },
    baseSeed: {
        id: "ItemID.coffeeBeans",
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:5,
    getDiscoveredBy: function() {
        return "Snoochy";
    },
    canGrow: function(crop) {
        var light = World.getLightLevel(crop.x,crop.y,crop.z);
        return crop.data.currentSize < 5 && light >= 9;
    },
    getGrowthDuration(crop) {
        var base = AgricultureAPI.abstractFunctions["IC2CropCard"];
        if (crop.data.currentSize == 3) {
            return Math.round(base.getGrowthDuration(crop) * 0.5);
        }
        if (crop.data.currentSize== 4) {
            return Math.round(base.getGrowthDuration(crop) * 1.5);
        }
        return base.getGrowthDuration(crop);
    },
    canBeHarvested(crop) {
        return crop.data.currentSize>= 4;
    },
    getGain: function(crop) {
        if (crop.data.currentSize == 4)return null;
        return {id:ItemID.coffeeBeans, count:1, data:0};
    },
    getSizeAfterHarvest: function(crop) {return 3}
});

AgricultureAPI.registerCropCard({
    name:"hops",
    attributes: [ "Green", "Ingredient", "Wheat"],
    properties: {
        tier:5,
        chemistry:2,
        consumable:2,
        defensive: 0,
        colorful:1 ,
        weed:1
    },
    maxSize:7,
    canGrow: function(crop) {
        var light = World.getLightLevel(crop.x,crop.y,crop.z);
        return crop.data.currentSize < 7 && light >= 9;
    },
    getGrowthDuration(crop) {
       return 600;
    },
    canBeHarvested(crop) {
        return crop.data.currentSize>= 4;
    },
    getGain: function(crop) {
        return {id:ItemID.hops, count:1, data:0};
    },
    getSizeAfterHarvest: function(crop) {return 3}
});

AgricultureAPI.registerCropCard({
    name:"ic2_carrots",
    attributes: ["Orange", "Food", "Carrots" ],
    base: "CropVanilla",
    properties: {
        tier:2,
        chemistry:0,
        consumable:4 ,
        defensive: 0,
        colorful:0 ,
        weed:2 
    },
    baseSeed: {
        id: 391,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:3,
    getProduct: function(){
        return {id:391, count:1, data:0}
    },
    getSeed:this.getProduct
});

AgricultureAPI.registerCropCard({
    name:"potato",
    attributes: ["Yellow", "Food", "Potato" ],
    properties: {
        tier:2,
        chemistry:0,
        consumable:4 ,
        defensive: 0,
        colorful:0 ,
        weed:2 
    },
    baseSeed: {
        id: 392,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:4,
    canGrow: AgricultureAPI.abstractFunctions["IC2CropCard"].canGrow,
    getOptimalHarvestSize: function(crop){return 3},
    canBeHarvested(crop) {
        return crop.data.currentSize >= 3;
    },
    getGain(crop) {
        if (crop.data.currentSize >= 4 && Math.random() < 0.05) {
            return {id:394, count:1, data:0};
        }
        if (crop.data.currentSize >= 3) {
            return {id:392, count:1, data:0};
        }return null;
    },
    getSizeAfterHarvest: function(te){return 1}
});

AgricultureAPI.registerCropCard({
    name:"eatingplant",
    attributes: ["Bad", "Food"],
    properties: {
        tier:6,
        chemistry:1,
        consumable:1 ,
        defensive: 3,
        colorful:1 ,
        weed:4 
    },
    baseSeed: {
        id: 81,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:6,
    getOptimalHarvestSize: function(crop){return 4},
    getDiscoveredBy: function() {
        return "Hasudako";
    },
    canGrow: function(crop) {
        var light = World.getLightLevel(crop.x,crop.y,crop.z);
        if (crop.data.currentSize < 3) {
            return light > 10;
        }
        return crop.isBlockBelow(10) && crop.data.currentSize< this.maxSize() && light > 10;
    },
    canBeHarvested(crop) {
        return crop.data.currentSize >= 4 && crop.data.currentSize< 6;
    },
    getGain(crop) {
        if (crop.data.currentSize >= 4 && crop.data.currentSize < 6) {
            return {id:81, count:1, data:0};
        }
        return null;
    },
    tick: function(te){//да, я понимаю, что это оч странная херня, но почти так было на пеке
        if(te.data.currentSize==1)return;
        var entity = Entity.findNearest({x:this.x+.5,y:this.y+.5,z:this.z+.5}, null, 2);
        if(!entity)return;
        Entity.damageEntity(entity,te.data.currentSize * 2);
        if(entity==player && !this.hasMetalArmor()){
            Entity.addEffect(player, MobEffect.poison, 1, 50);
        }
        if(te.crop.canGrow(te))te.data.growthPoints+=100;
        nativeDropItem(this.x, this.y, this.z, 0, 367, 1, 0, null);
    },
    nonMetalCheck: {
        298:true,
        299:true,
        300:true,
        301:true
    },
    hasMetalArmor: function(){
        for(var i = 0; i < 4; i++){
            var armorSlot = Player.getArmorSlot(i);
            if(!armorSlot.id||this.nonMetalCheck[armorSlot.id])return false;
        }return true;
    },
    getGrowthDuration: function(crop) {
        var multiplier = 1;
        var base = AgricultureAPI.abstractFunctions["IC2CropCard"];
        //доделать после добавления работы с биомами
        return Math.round(base.getGrowthDuration(crop) * multiplier);
    },
    getSizeAfterHarvest: function(te){return 1},
    getRootsLength(crop){return 5}
});


AgricultureAPI.registerCropCard({
    name:"beetroots",
    attributes: [ "Red", "Food", "Beetroot"],
    base: "CropVanilla",
    properties: {
        tier:1,
        chemistry:0,
        consumable:4 ,
        defensive: 0,
        colorful:1 ,
        weed:2 
    },
    baseSeed: {
        id: 458,
        size:1,
        growth:1,
        gain:1,
        resistance:1
    },
    maxSize:4,
    getProduct: function(){
        return {id:457, count:1, data:0};
    },
    getSeed: function(){
        return {id:458, count:1, data:0};
    }
});
IDRegistry.genBlockID("perches");
Block.createBlock("perches", [
    {name: "Perches", texture: [["stick", 0]], inCreative: false}
],"plant");
Block.registerDropFunctionForID(BlockID.perches, function(coords, id, data, diggingLevel, toolLevel){ 
    return [[0, 0, 0]];
});
var shape = new ICRender.CollisionShape();
shape.addEntry().addBox(7/8, 7/8, 7/8, 1/8, 1/8, 1/8);
BlockRenderer.setCustomCollisionShape(BlockID.perches, 0, shape);
BlockRenderer.enableCoordMapping(BlockID.perches, 0, TileRenderer.getCropModel(["stick", 0]));

TileEntity.registerPrototype(BlockID.perches, {
    defaultValues: {
        crop:null,
        dirty:true,
        statGrowth:0,
        statGain:0,
        statResistance:0,
        storageNutrients:0,
        storageWater:0,
        storageWeedEX:0,
        terrainAirQuality:-1,
        terrainHumidity:-1,
        terrainNutrients:-1,
        currentSize:1,
        growthPoints:0,
        scanLevel:0,
        crossingBase:false
    }, 
    init:function(){
        if(this.data.crop)this.crop = AgricultureAPI.cropCards[this.data.crop];
        this.updateRender();
    },
    tick: function () {
        this.checkGround();
        this.checkPlayerRunning();
        if(World.getThreadTime()%192==0)this.performTick();
    }, 
    click: function(id, count, data, coords){
        var card = AgricultureAPI.getCardFromSeed({id:id,data:data});
        if(id==ItemID.debugItem&&this.crop){
            this.data.currentSize = this.crop.maxSize;
            this.updateRender();
            return;
        }
        if(id==280&&this.data.crossingBase){
            this.attemptCrossing();
            return;
        }
        if(id){
            if (!this.crop && !this.data.crossingBase && id==ItemID.perches){
                this.data.crossingBase = true;
                this.data.dirty = true;
                Player.decreaseCarriedItem(1);
                this.updateRender();
                return;
            }
            if (this.crop && id == ItemID.fertilizer) {
                if (this.applyFertilizer(true))this.data.dirty = true;
                Player.decreaseCarriedItem(1);
                return;
            }
            if (this.applyHydration(id,data,true) || this.applyWeedEx(id,data, true)) {
                this.data.dirty = true;
                //Debug.m("addedHydration or EX in click()");
                return;
            }
            if (!this.crop && !this.data.crossingBase && card) {
                this.reset();
                this.data.crop = AgricultureAPI.getCardIndexFromName(card.name);
                this.crop = AgricultureAPI.cropCards[this.data.crop];
                this.data.currentSize = card.baseSeed.size;
                this.data.statGain = card.baseSeed.gain;
                this.data.statGrowth = card.baseSeed.growth;
                this.data.statResistance = card.baseSeed.resistance;
                Player.decreaseCarriedItem(1);
                this.updateRender();
                //Debug.m("setted crop :"+this.crop.name +" , stats are: "+this.data.statGain+" "+this.data.statGrowth+" "+this.data.statResistance);
                return;
            }
        }
        if(Entity.getSneaking(Player.get())){
            if(this.data.crossingBase){
                World.drop(this.x, this.y, this.z, ItemID.perches, 1, 0);
                this.data.crossingBase = false;
                this.data.dirty = true;
                this.updateRender();
            }else if(this.crop){ 
                this.crop.onLeftClick(this);
                return;
            }
        }
        if(this.crop&&this.crop.canBeHarvested(this))this.crop.onRightClick(this);
    },
    destroyBlock: function(coords, player){
        World.drop(this.x, this.y, this.z, ItemID.perches, 1, 0);
        if(this.data.crossingBase)World.drop(this.x, this.y, this.z, ItemID.perches, 1, 0);
        if(this.crop)this.crop.onLeftClick(this);
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    },
    updateRender:function(){
        var texture = ["stick", 0];
        if(this.crop){
            texture[0] = this.crop.name;
            texture[1] = this.data.currentSize;
        }else if(this.data.crossingBase)texture[1]=1;
        
        var render = TileRenderer.getCropModel(texture);
        BlockRenderer.mapAtCoords(this.x, this.y, this.z, render);
    }, 
    checkPlayerRunning:function(){
        if(!this.crop)return;
        var coords = Entity.getPosition(Player.get());
        if(Math.floor(coords.x)==this.x&&this.y==Math.floor(coords.y)-1&&Math.floor(coords.z)==this.z){
            var vel = Player.getVelocity();
            var horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z)
            if(horizontalVel > 0.15){
                if(this.crop.onEntityCollision(this))World.destroyBlock(this.x,this.y,this.z);
            }
        }
    },
    checkGround:function(){
        if(World.getBlockID(this.x,this.y-1,this.z)!=60)World.destroyBlock(this.x,this.y,this.z);
    },
    performTick:function(){
        if(World.getThreadTime()%768==0){
            this.updateTerrainHumidity();
            this.updateTerrainNutrients();
            this.updateTerrainAirQuality();
        }
        
        if (!this.crop  && (!this.data.crossingBase || !this.attemptCrossing())) {
            if (random(0,100) != 0 || this.data.storageWeedEX > 0) {
                if (this.data.storageWeedEX  > 0 && random(0,10)  == 0) {
                    this.data.storageWeedEX--;
                }
                return;
            }
            this.reset();
            this.data.crop = AgricultureAPI.getCardIndexFromName("weed");
            this.crop = AgricultureAPI.cropCards[this.data.crop];
            this.data.currentSize = 1;
            this.updateRender();
        }
        if(this.crop){
            this.crop.tick(this);
            if(this.crop.canGrow(this)){
                this.performGrowthTick();
                var growDuration = this.crop.getGrowthDuration(this);
                if (this.data.growthPoints >= growDuration) {
                    this.data.growthPoints = 0;
                    this.data.currentSize = this.data.currentSize+ 1;
                    this.data.dirty = true;
                    this.updateRender();
                }
            }  
        }//else{return}//тут пока хз может что то я просрал где то
        if (this.data.storageNutrients > 0) this.data.storageNutrients--;
        if (this.data.storageWater > 0) this.data.storageWater--;
        if (this.crop.isWeed(this) && random(0,50) - this.data.statGrowth <= 2) this.performWeedWork();
    },
    updateTerrainHumidity:function(){
        var humidity = AgricultureAPI.getHumidityBiomeBonus(this.x,this.z);
        if(World.getBlockData(this.x,this.y-1,this.z)==7)humidity+=2
        
        if (this.data.storageWater >= 5)humidity += 2;
        
        humidity += (this.data.storageWater + 24) / 25;
        this.data.terrainHumidity = humidity;
    },
    updateTerrainNutrients:function(){
        var nutrients = AgricultureAPI.getNutrientBiomeBonus(this.x,this.z);
        nutrients += (this.data.terrainNutrients + 19) / 20;
        for (var i = 2; i < 5; ++i){
            if(World.getBlockID(this.x,this.y-i,this.z)==3)nutrients++
        }
        this.data.terrainNutrients = nutrients;
    },
    updateTerrainAirQuality:function(){
        var value = 0;
        var height = Math.floor((this.y- 64) / 15);
        if (height > 4)height = 4;
        
        if (height < 0)height = 0;
        var fresh = 9;
        for (var x = this.x - 1; x < this.x+2; x++) {
            for (var z = this.z - 1; z < this.z + 2; z++) {
                if (World.getBlockID(x,this.y,z)) {
                    fresh--;
                }
            }
        }
        value += Math.floor( fresh / 2);
        if(GenerationUtils.canSeeSky(this.x, this.y + 1, this.z))value+=2;
        
        value += height;
        this.data.terrainAirQuality = value;
    },
    performGrowthTick:function(){
        if (!this.crop)return;
        
        var totalGrowth = 0;
        var properties = this.crop.properties;
        var baseGrowth = 3 + random(0,7) + this.data.statGrowth;
        var minimumQuality = (properties.tier - 1) * 4 + this.data.statGrowth + this.data.statGain + this.data.statResistance;
        minimumQuality = ((minimumQuality < 0) ? 0 : minimumQuality);
        var providedQuality = 75;
        if (providedQuality >= minimumQuality){
            totalGrowth = baseGrowth * (100 + (providedQuality - minimumQuality)) / 100;
        }else{
            var aux = (minimumQuality - providedQuality) * 4;
            if (aux > 100 && random(0,32) > this.data.statResistance) {
                this.reset();
                this.updateRender();
                totalGrowth = 0;
            }else {
                totalGrowth = baseGrowth * (100 - aux) / 100;
                totalGrowth = ((totalGrowth < 0) ? 0 : totalGrowth);
            }
        }
        this.data.growthPoints += Math.round(totalGrowth);
    },
    performWeedWork:function(){
        var crds = this.relativeCropCoords[random(0,3)];
        var relativeCoords = [this.x+crds[0],this.y+crds[0],this.z+crds[0]];
        if(World.getBlockID(relativeCoords[0],relativeCoords[1],relativeCoords[2])==BlockID.perches){
            var TE = World.getTileEntity(relativeCoords[0],relativeCoords[1],relativeCoords[2]);
            if(!TE.crop || (!TE.crop.isWeed(this) && random(0,32) >= TE.data.statResistance && !TE.hasWeedEX())){
                var newGrowth = Math.max(this.data.statGrowth, TE.data.statGrowth);
                if (newGrowth < 31 && random(0,1))newGrowth++;
                TE.reset();
                TE.data.crop = AgricultureAPI.getCardIndexFromName("weed");
                TE.crop = AgricultureAPI.cropCards[TE.data.crop];
                TE.data.currentSize = 1;
                TE.data.statGrowth = newGrowth;
                TE.updateRender();
            }
        }else if(World.getBlockID(relativeCoords[0],relativeCoords[1]-1,relativeCoords[2])==60){
            World.setBlock(relativeCoords[0],relativeCoords[1]-1,relativeCoords[2],2,0);
        }
    },
    reset:function(){
        //alert("reset crop");
        this.data.crop = null;
        this.crop = undefined;
        this.data.statGain = 0;
        this.data.statResistance = 0;
        this.data.statGrowth = 0;
        this.data.terrainAirQuality = -1;
        this.data.terrainHumidity = -1;
        this.data.terrainNutrients = -1;
        this.data.growthPoints = 0;
        this.data.scanLevel = 0;
        this.data.currentSize = 1;
        this.data.dirty = true;
    },
    hasWeedEX:function(){
        if (this.data.storageWeedEX > 0) {
            this.data.storageWeedEX -= 5;
            return true;
        }
        return false;
    },
    attemptCrossing:function(){//этот кусок изменен в сравнении с оригиналом
        //Debug.m("attempCrossing()");
        if (random(0,3) != 0)return false;
        var cropCoords = this.askCropJoinCross(this.relativeCropCoords);
        if (cropCoords.length < 2)return false;
        var cropCards = AgricultureAPI.cropCards;
        var ratios = [];
        var total = 0;
        for(var j in cropCards){
            var crop = cropCards[j];
            for(var crd in cropCoords){
                var coords = cropCoords[crd];
                var tileEnt = World.getTileEntity(coords.x, coords.y,coords.z);
                total += this.calculateRatioFor(crop, tileEnt.crop);
            }
            ratios[j] = total;
        }
        var search = random(0,total);
        var min = 0;
        var max = ratios.length - 1;
        while (min < max) {
            var cur = Math.floor((min + max) / 2);
            var value = ratios[cur];
            if (search < value){
                max = cur;   
            }else {
                min = cur + 1;
            }
        }
        this.data.crossingBase = false;
        this.crop = cropCards[min]
        this.data.crop = min;
        this.data.dirty = true;
        this.data.currentSize = 1;
        this.data.statGrowth = 0;
        this.data.statResistance = 0;
        this.data.statGain = 0;
        for(var i in cropCoords){
            var te2 = World.getTileEntity(cropCoords[i].x,cropCoords[i].y,cropCoords[i].z);
            this.data.statGrowth += te2.data.statGrowth;
            this.data.statResistance += te2.data.statResistance;
            this.data.statGain += te2.data.statGain;
        }
        var count = cropCoords.length;
        this.data.statGrowth = Math.floor(this.data.statGrowth/count);
        this.data.statResistance = Math.floor(this.data.statResistance/count);
        this.data.statGain = Math.floor(this.data.statGain/count);
        this.data.statGrowth += Math.round(random(0,1 + 2 * count) - count);
        this.data.statGain += Math.round(random(0,1 + 2 * count) - count);
        this.data.statResistance += Math.round(random(0,1 + 2 * count) - count);
        this.data.statGrowth = this.lim(this.data.statGrowth, 0, 31);
        this.data.statGain = this.lim(this.data.statGain, 0, 31);
        this.data.statResistance = this.lim(this.data.statResistance, 0, 31);
        //Debug.m("setting new crop in attempCrossing() "+this.crop.name);
        this.updateRender();
        return true;
    },
    lim:function(value, min, max){
        if (value <= min)return min;
        
        if (value >= max)return max;
        
        return value;
    },
    relativeCropCoords:[ [1,0,0], [-1,0,0], [0,0,1], [0,0,-1] ],
    askCropJoinCross:function(coordsArray){//изменен в сравнении с оригиналом
        var cropsCoords = [];
        for(var r in coordsArray){
            var pos = coordsArray[r];
            var coords = {x:this.x+pos[0],y:this.y+pos[1],z:this.z+pos[2]};
            var sideTileEnt = World.getTileEntity(coords.x,coords.y,coords.z);
            if(!sideTileEnt || !sideTileEnt.crop ||World.getBlockID(coords.x,coords.y,coords.z)!=BlockID.perches)continue;  
            
            if(sideTileEnt.data.currentSize <=3)continue;

            var base = 4;
            if (sideTileEnt.data.statGrowth >= 16) base++;
            
            if (sideTileEnt.data.statGrowth >= 30) base++;
            
            if (sideTileEnt.data.statResistance >= 28)base += 27 - sideTileEnt.data.statResistance;
            
            if (base >= random(0,20))cropsCoords.push(coords);
        }
        return cropsCoords
    },
    calculateRatioFor:function(newCrop, oldCrop ){
        if (newCrop.name == oldCrop.name)return 500;
        
        var value = 0;
        var propOld = oldCrop.properties;
        var propNew = newCrop.properties;
        for (var i in propOld) {
            var delta = Math.abs(propOld[i] - propNew[i]);
            value += -delta + 2;
        }

        var attributesOld = oldCrop.attributes;
        var attributesNew = newCrop.attributes;
        for(var iO in attributesOld){
            for(var iN in attributesNew){
                var attO = attributesOld[iO];
                var attN = attributesNew[iN];
                if(attO==attN)value += 5;
            }
        }
        
        var diff = newCrop.properties.tier - oldCrop.properties.tier;
        if (diff > 1)value -= 2 * diff;
        
        if (diff < -3)value -= -diff;
        
        return Math.max(value, 0);
    },
    applyFertilizer:function(manual){
        if (this.data.storageNutrients >= 100)return false;
        
        this.data.storageNutrients += manual ? 100 : 90;
        //alert("applyed fertilizer current: "+this.data.storageNutrients);
        return true;
    },
    applyWeedEx:function(id,manual){//вот тут я тоже не уверен
        
        if(id==ItemID.weedEx){
            var limit = manual ? 100 : 150;
            if (this.data.storageWeedEX >= limit)return false;
            
            var amount = manual ? 50 : 100;
            this.data.storageWeedEX += amount;
            if(manual) ToolAPI.breakCarriedTool(1);
            
            //alert("applyed weed EX current: "+this.data.storageWeedEX);
            return true;
        } return false;
    },
    applyHydration:function(id,data,manual){
        if(id==ItemID.hydrationCell){
            //alert("applying hydration");
            var limit = 200;
            if (this.data.storageWater >= limit)return false;
            var relativeAmount = limit - this.data.storageWater;
            var amount = relativeAmount < 1000-data ? relativeAmount : 1000-data ;
            if(manual) ToolAPI.breakCarriedTool(amount);
            this.data.storageWater += amount;
            return amount;
        }return false;
    },
    tryPlantIn:function(cropCardID, size, statGr, statGa, statRe, scan){
        //Debug.m("try plant in");
        var cropCard = AgricultureAPI.cropCards[cropCardID];
        //Debug.m(cropCard);
        if (!cropCard || cropCard.name =="weed" || this.data.crossingBase)return false;
        this.reset();
        this.data.crop = cropCardID;
        this.crop = cropCard;
        this.data.currentSize = size;
        this.data.statGain = statGa;
        this.data.statGrowth = statGr;
        this.data.statResistance = statRe;
        this.data.scanLevel = scan;
        this.updateRender();
        return true;
    },
    performHarvest:function(){//доделоть// кажеца ок, но это не точно
        if (!this.crop || !this.crop.canBeHarvested(this))return null;
        
        var chance = this.crop.dropGainChance(this);
        chance *= Math.pow(1.03, this.data.statGain);
        var dropCount2 = Math.max(0, Math.round(this.nextGaussian() * chance * 0.6827 + chance));
        var ret = [];
        for (var i = 0; i < dropCount2; i++) {
            ret[i] = this.crop.getGain(this);
            if (ret[i] && random(0,100) <= this.data.statGain) {
                ret[i] = ret[i].count++; //count++ кажется
            }
        }
        this.data.currentSize = this.crop.getSizeAfterHarvest(this);
        this.data.dirty = true;
        this.updateRender();
        return ret;
    },
    performManualHarvest:function(){
        var dropItems = this.performHarvest();
        //Debug.m(dropItems);
        if(!dropItems||!dropItems.length)return;

        for(var ind in dropItems){
            //Debug.m("try drop");
            //Debug.m(dropItems[ind]);
            var item = dropItems[ind];
            nativeDropItem(this.x, this.y, this.z, 0,item.id,item.count,item.data,null);
        }
    },
    nextGaussian:function(){
        //очень прошу прощения за это, было поздно я чем то обдолбался и не придумал ничего лучше, чем наговнокодить это
        // еще раз прошу прощения
        return Math.random()<.5 ? Math.random() : Math.random()*-1;
    },
    pick:function(){
        if(!this.crop)return false;
        var bonus = this.crop.canBeHarvested(this);
        var firstchance = this.crop.getSeedDropChance(this);
        firstchance *= Math.pow(1.1, this.data.statResistance);
        var dropCount = 0;
        if (bonus) {
            if (Math.random() <= (firstchance + 1.0) * 0.8)dropCount++;
            var chance = this.crop.getSeedDropChance(this) + this.data.statGrowth / 100.0;
            chance *= Math.pow(.95,this.statGain-23)
            if (Math.random() <= chance)dropCount++;
        }else if (Math.random() <= firstchance * 1.5)dropCount++;
        
        var item = this.crop.getSeeds(this);
        for(var ccount = 0;ccount<dropCount;ccount++){
            nativeDropItem(this.x, this.y, this.z, 0, item.id, 1, item.data, item.extra);
        }
        //Debug.m("in pick() bag dropped ");
        //Debug.m(this.crop.name+" "+item.id+" "+dropCount+" "+item.data+" ");
        this.reset();
        this.updateRender();
        return true;
    },
    generateSeeds:function(data){
        var extra = AgricultureAPI.generateExtraFromValues(data);
        return {id:ItemID.cropSeedBag,data:this.data.crop,extra:extra};
    },
    isBlockBelow:function(reqBlock){
        if (!this.crop)return false;
        for (var i = 1; i < this.crop.getRootsLength(this); i++) {
            var block = World.getBlockID(this.x, this.y-i, this.z);
            if(!block)return false;
            if (reqBlock==block)return true;
        }
        return false;
    }
});
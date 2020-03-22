IDRegistry.genBlockID("crop");
Block.createBlock("crop", [
	{name: "crop", texture: [["stick", 0]], inCreative: false}
], "plant");

var shape = new ICRender.CollisionShape();
shape.addEntry().addBox(7/8, 7/8, 7/8, 1/8, 1/8, 1/8);
BlockRenderer.setCustomCollisionShape(BlockID.crop, 0, shape);
BlockRenderer.enableCoordMapping(BlockID.crop, 0, TileRenderer.getCropModel(["stick", 0]));

Block.registerDropFunctionForID(BlockID.crop, function(coords, id, data, diggingLevel, toolLevel){ 
	return [];
});

TileEntity.registerPrototype(BlockID.crop, {
	defaultValues: {
		crop: null,
		dirty: true,
		statGrowth: 0,
		statGain: 0,
		statResistance: 0,
		storageNutrients: 0,
		storageWater: 0,
		storageWeedEX: 0,
		terrainAirQuality: -1,
		terrainHumidity: -1,
		terrainNutrients: -1,
		currentSize: 1,
		growthPoints: 0,
		scanLevel: 0,
		crossingBase: false
	},

	init: function(){
		if(this.data.crop) this.crop = AgricultureAPI.cropCards[this.data.crop];
		this.updateRender();
	},

	tick: function () {
		this.checkGround();
		this.checkPlayerRunning();
		if(World.getThreadTime() % 192 == 0) this.performTick();
	},

	click: function(id, count, data, coords){
		if(id){
			var card = AgricultureAPI.getCardFromSeed({id: id, data: data});
			if(id == ItemID.agriculturalAnalyzer) return;
			if(id == ItemID.debugItem && this.crop){
				this.data.currentSize = this.crop.maxSize;
				this.updateRender();
				return;
			}
			if(Config.debugMode && id == 351 && this.data.crossingBase){
				this.attemptCrossing();
				return;
			}

			if (!this.crop && !this.data.crossingBase && id == ItemID.cropStick){
				this.data.crossingBase = true;
				this.data.dirty = true;
				Player.decreaseCarriedItem(1);
				this.updateRender();
				return;
			}
			if (this.crop && id == ItemID.fertilizer) {
				if (this.applyFertilizer(true)) this.data.dirty = true;
				Player.decreaseCarriedItem(1);
				return;
			}
			if (id == ItemID.cellWater && count == 1) {
				var amount = this.applyHydration(1000 - data);
				if(amount > 0) {
					if(data + amount >= 1000) {
						Player.setCarriedItem(ItemID.cellEmpty, 1, 0);
					} else {
						Player.setCarriedItem(id, 1, data + amount);
					}
				}
				return;
			}
			if (this.applyWeedEx(id, true)) {
				this.data.dirty = true;
				return;
			}
			if (!this.crop && !this.data.crossingBase && card) {
				this.reset();

				this.data.crop = AgricultureAPI.getCardIndexFromID(card.id);
				this.crop = AgricultureAPI.cropCards[this.data.crop];
				this.data.currentSize = card.baseSeed.size;

				this.data.statGain = card.baseSeed.gain;
				this.data.statGrowth = card.baseSeed.growth;
				this.data.statResistance = card.baseSeed.resistance;

				Player.decreaseCarriedItem(1);
				this.updateRender();
				return;
			}
		}
		if(this.crop && this.crop.canBeHarvested(this)) this.crop.onRightClick(this);
	},

	onLongClick: function(){
		if(this.data.crossingBase){
			World.drop(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
			this.data.crossingBase = false;
			this.data.dirty = true;
			this.updateRender();
			return true;
		}
		else if(this.crop){
			return this.crop.onLeftClick(this);;
		}
		return false;
	},

	destroyBlock: function(coords, player){
		World.drop(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
		if(this.data.crossingBase) World.drop(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
		if(this.crop) this.crop.onLeftClick(this);
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	},

	updateRender: function(){
		var texture = ["stick", 0];
		if(this.crop){
			texture[0] = this.crop.texture;
			texture[1] = this.data.currentSize;
		}
		else if(this.data.crossingBase) texture[1] = 1;

		var render = TileRenderer.getCropModel(texture);
		BlockRenderer.mapAtCoords(this.x, this.y, this.z, render);
	},

	checkPlayerRunning: function(){
		if(!this.crop) return;

		var coords = Entity.getPosition(Player.get());
		var playerX = Math.floor(coords.x);
		var playerY = Math.floor(coords.y);
		var playerZ = Math.floor(coords.z);

		if(playerX == this.x && playerY - 1 == this.y && playerZ == this.z){
			var vel = Player.getVelocity();
			var horizontalVel = Math.sqrt(vel.x * vel.x + vel.z * vel.z)
			if(horizontalVel > 0.15 && this.crop.onEntityCollision(this)){
				World.destroyBlock(this.x, this.y, this.z);
			}
		}
	},

	checkGround: function(){
		if(World.getBlockID(this.x, this.y - 1, this.z) != 60){
			World.destroyBlock(this.x, this.y, this.z);
		}
	},

	performTick: function(){
		if(World.getThreadTime() % 768 == 0){
			this.updateTerrainHumidity();
			this.updateTerrainNutrients();
			this.updateTerrainAirQuality();
		}

		if (!this.crop  && (!this.data.crossingBase || !this.attemptCrossing())) {
			if (random(0, 100) != 0 || this.data.storageWeedEX > 0) {
				if (this.data.storageWeedEX  > 0 && random(0, 10)  == 0) {
					this.data.storageWeedEX--;
				}
				return;
			}
			this.reset();

			this.data.crop = AgricultureAPI.getCardIndexFromID("weed");
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
					this.data.currentSize = this.data.currentSize + 1;
					this.data.dirty = true;

					this.updateRender();
				}
			}
		}

		if (this.data.storageNutrients > 0) this.data.storageNutrients--;
		if (this.data.storageWater > 0) this.data.storageWater--;

		if (this.crop.isWeed(this) && random(0, 50) - this.data.statGrowth <= 2){
			this.performWeedWork();
		}
	},

	updateTerrainHumidity: function(){
		var humidity = AgricultureAPI.getHumidityBiomeBonus(this.x, this.z);

		if(World.getBlockData(this.x, this.y-1, this.z) == 7) humidity += 2
		if(this.data.storageWater >= 5) humidity += 2;

		humidity += (this.data.storageWater + 24) / 25;
		this.data.terrainHumidity = humidity;
	},

	updateTerrainNutrients: function(){
		var nutrients = AgricultureAPI.getNutrientBiomeBonus(this.x, this.z);
		nutrients += (this.data.terrainNutrients + 19) / 20;

		for (var i = 2; i < 5; ++i){
			if(World.getBlockID(this.x, this.y - i, this.z) == 3) nutrients++;
		}
		this.data.terrainNutrients = nutrients;
	},

	updateTerrainAirQuality: function(){
		var value = 0;
		var height = Math.floor((this.y - 64) / 15);
		if (height > 4) height = 4;
		if (height < 0) height = 0;

		var fresh = 9;
		for (var x = this.x - 1; x < this.x + 2; x++) {
			for (var z = this.z - 1; z < this.z + 2; z++) {
				if (World.getBlockID(x, this.y, z)) fresh--;
			}
		}
		if(GenerationUtils.canSeeSky(this.x, this.y + 1, this.z)) value += 2;
		value += Math.floor(fresh / 2);
		value += height;

		this.data.terrainAirQuality = value;
	},

	performGrowthTick: function(){
		if (!this.crop) return;

		var totalGrowth = 0;
		var baseGrowth = 3 + random(0, 7) + this.data.statGrowth;
		var properties = this.crop.properties;
		var sumOfStats = this.data.statGrowth + this.data.statGain + this.data.statResistance;
		var minimumQuality = (properties.tier - 1) * 4 + sumOfStats;
		minimumQuality = Math.max(minimumQuality, 0);
		var providedQuality = 75;

		if (providedQuality >= minimumQuality){
			totalGrowth = baseGrowth * (100 + (providedQuality - minimumQuality)) / 100;
		}
		else{
			var aux = (minimumQuality - providedQuality) * 4;
			if (aux > 100 && random(0, 32) > this.data.statResistance) {
				totalGrowth = 0;

				this.reset();
				this.updateRender();
			}
			else {
				totalGrowth = baseGrowth * (100 - aux) / 100;
				totalGrowth = Math.max(totalGrowth, 0);
			}
		}
		this.data.growthPoints += Math.round(totalGrowth);
	},

	performWeedWork: function(){
		var coords = this.relativeCropCoords[random(0, 3)];
		var preCoords = [this.x + coords[0], this.y + coords[0], this.z + coords[0]];
		if(World.getBlockID(preCoords[0], preCoords[1], preCoords[2]) == BlockID.crop){
			var TE = World.getTileEntity(preCoords[0], preCoords[1], preCoords[2]);
			if(!TE.crop || (!TE.crop.isWeed(this) && !TE.hasWeedEX() && random(0, 32) >= TE.data.statResistance)){
				var newGrowth = Math.max(this.data.statGrowth, TE.data.statGrowth);
				if (newGrowth < 31 && random(0, 1)) newGrowth++;

				TE.reset();
				TE.data.crop = AgricultureAPI.getCardIndexFromID("weed");
				TE.crop = AgricultureAPI.cropCards[TE.data.crop];
				TE.data.currentSize = 1;
				TE.data.statGrowth = newGrowth;
				TE.updateRender();
			}
		}
		else if(World.getBlockID(preCoords[0], preCoords[1] - 1, preCoords[2]) == 60){
			World.setBlock(preCoords[0], preCoords[1] - 1, preCoords[2] ,2 ,0);
		}
	},

	reset: function(){
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

	hasWeedEX: function(){
		if (this.data.storageWeedEX > 0) {
			this.data.storageWeedEX -= 5;
			return true;
		}
		return false;
	},

	attemptCrossing: function(){ // modified from the original
		if (random(0, 3) != 0) return false;

		var cropCoords = this.askCropJoinCross(this.relativeCropCoords);
		if (cropCoords.length < 2) return false;

		var cropCards = AgricultureAPI.cropCards;
		var ratios = [];
		var total = 0;
		for(var j in cropCards){
			var crop = cropCards[j];
			for(var crd in cropCoords){
				var coords = cropCoords[crd];
				var tileEnt = World.getTileEntity(coords.x, coords.y, coords.z);
				total += this.calculateRatioFor(crop, tileEnt.crop);
			}
			ratios[j] = total;
		}
		var search = random(0, total);
		var min = 0;
		var max = ratios.length - 1;
		while (min < max) {
			var cur = Math.floor((min + max) / 2);
			var value = ratios[cur];
			if (search < value){
				max = cur;
			} else {
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
			var te2 = World.getTileEntity(cropCoords[i].x, cropCoords[i].y, cropCoords[i].z);
			this.data.statGrowth += te2.data.statGrowth;
			this.data.statResistance += te2.data.statResistance;
			this.data.statGain += te2.data.statGain;
		}
		var count = cropCoords.length;

		this.data.statGrowth = Math.floor(this.data.statGrowth / count);
		this.data.statResistance = Math.floor(this.data.statResistance / count);
		this.data.statGain = Math.floor(this.data.statGain / count);

		this.data.statGrowth += Math.round(random(0, 1 + 2 * count) - count);
		this.data.statGain += Math.round(random(0, 1 + 2 * count) - count);
		this.data.statResistance += Math.round(random(0, 1 + 2 * count) - count);

		this.data.statGrowth = this.lim(this.data.statGrowth, 0, 31);
		this.data.statGain = this.lim(this.data.statGain, 0, 31);
		this.data.statResistance = this.lim(this.data.statResistance, 0, 31);

		this.updateRender();
		return true;
	},

	lim: function(value, min, max){
		if (value <= min) return min;
		if (value >= max) return max;
		return value;
	},

	relativeCropCoords: [ [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1] ],

	askCropJoinCross: function(coordsArray){ // modified from the original
		var cropsCoords = [];
		for(var r in coordsArray){
			var pos = coordsArray[r];
			var coords = { x: this.x + pos[0], y: this.y + pos[1], z: this.z + pos[2] };
			var sideTileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
			var blockId = World.getBlockID(coords.x, coords.y, coords.z)

			if(!sideTileEntity || !sideTileEntity.crop || blockId != BlockID.crop) continue;
			if(sideTileEntity.data.currentSize <= 3) continue;

			var base = 4;
			if (sideTileEntity.data.statGrowth >= 16) base++;
			if (sideTileEntity.data.statGrowth >= 30) base++;
			if (sideTileEntity.data.statResistance >= 28){
				base += 27 - sideTileEntity.data.statResistance;
			}
			if (base >= random(0, 20)) cropsCoords.push(coords);
		}
		return cropsCoords;
	},

	calculateRatioFor: function(newCrop, oldCrop){
		if (newCrop.id == oldCrop.id) return 500;

		var value = 0;
		var propOld = oldCrop.properties;
		var propNew = newCrop.properties;
		for (var i in propOld) {
			var delta = Math.abs(propOld[i] - propNew[i]);
			value += 2 - delta;
		}

		var attributesOld = oldCrop.attributes;
		var attributesNew = newCrop.attributes;
		for(var iO in attributesOld){
			for(var iN in attributesNew){
				var attO = attributesOld[iO];
				var attN = attributesNew[iN];
				if(attO == attN) value += 5;
			}
		}

		var diff = newCrop.properties.tier - oldCrop.properties.tier;
		if (diff > 1) value -= 2 * diff;
		if (diff < -3) value += diff;

		return Math.max(value, 0);
	},

	applyFertilizer: function(manual){
		if (this.data.storageNutrients >= 100) return false;

		this.data.storageNutrients += manual ? 100 : 90;
		return true;
	},

	applyWeedEx: function(id, manual){
		if(id == ItemID.weedEx){
			var limit = manual ? 100 : 150;
			if (this.data.storageWeedEX >= limit) return false;

			var amount = manual ? 50 : 100;
			this.data.storageWeedEX += amount;

			if(manual) ToolAPI.breakCarriedTool(1);
			return true;
		}
		return false;
	},

	applyHydration: function(amount){
		var limit = 200;
		if (this.data.storageWater >= limit) return 0;
		
		var relativeAmount = limit - this.data.storageWater;
		amount = Math.min(relativeAmount, amount);
		this.data.storageWater += amount;
		
		return amount;
	},

	tryPlantIn: function(cropCardID, size, statGr, statGa, statRe, scan){
		var cropCard = AgricultureAPI.cropCards[cropCardID];
		if (!cropCard || cropCard.id == "weed" || this.data.crossingBase) return false;

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

	performHarvest: function(){
		if (!this.crop || !this.crop.canBeHarvested(this)) return null;

		var chance = this.crop.dropGainChance(this);
		chance *= Math.pow(1.03, this.data.statGain);
		var dropCount2 = Math.max(0, Math.round(this.nextGaussian() * chance * 0.6827 + chance));
		var ret = [];
		for (var i = 0; i < dropCount2; i++) {
			ret[i] = this.crop.getGain(this);
			if (ret[i] && random(0, 100) <= this.data.statGain) {
				ret[i] = ret[i].count++;
			}
		}

		this.data.currentSize = this.crop.getSizeAfterHarvest(this);
		this.data.dirty = true;

		this.updateRender();
		return ret;
	},

	performManualHarvest: function(){
		var dropItems = this.performHarvest();
		if(!dropItems || !dropItems.length) return;

		for(var ind in dropItems){
			var item = dropItems[ind];
			nativeDropItem(this.x, this.y, this.z, 0, item.id, item.count, item.data, null);
		}
	},

	nextGaussian: function(){
		var v1, v2, s;
		do{
			v1 = 2 * Math.random() - 1; // Between -1.0 and 1.0.
			v2 = 2 * Math.random() - 1; // Between -1.0 and 1.0.
			s = v1 * v1 + v2 * v2;
		}while (s >= 1);

		var norm = Math.sqrt(-2 * Math.log(s) / s);
		return v1 * norm;
	},

	pick: function(){
		if(!this.crop) return false;

		var bonus = this.crop.canBeHarvested(this);
		var firstchance = this.crop.getSeedDropChance(this);
		firstchance *= Math.pow(1.1, this.data.statResistance);
		var dropCount = 0;

		if (bonus) {
			if (Math.random() <= (firstchance + 1) * .8) dropCount++;
			var chance = this.crop.getSeedDropChance(this) + this.data.statGrowth / 100;
			chance *= Math.pow(.95, this.statGain - 23);
			if (Math.random() <= chance) dropCount++;
		}
		else if (Math.random() <= firstchance * 1.5) dropCount++;

		var item = this.crop.getSeeds(this);
		nativeDropItem(this.x, this.y, this.z, 0, item.id, dropCount, item.data, item.extra);

		this.reset();
		this.updateRender();
		return true;
	},

	generateSeeds: function(data){
		var extra = AgricultureAPI.generateExtraFromValues(data);
		return {id: ItemID.cropSeedBag, data: this.data.crop, extra: extra};
	},

	isBlockBelow: function(reqBlockID){
		if (!this.crop) return false;

		var rootsLength = this.crop.getRootsLength(this);
		for (var i = 1; i < rootsLength; i++) {
			var blockID = World.getBlockID(this.x, this.y - i, this.z);
			if(!blockID) return false;
			if(reqBlockID == blockID) return true;
		}
		return false;
	}
});

Callback.addCallback("DestroyBlockStart", function(coords, block){
	if(block.id == BlockID.crop){
		var tileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
		if(tileEntity && tileEntity.onLongClick()){
			Game.prevent();
		}
	}
});
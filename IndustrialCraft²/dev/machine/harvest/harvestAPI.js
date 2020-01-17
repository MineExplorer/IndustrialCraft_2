Block.createSpecialType({
    base: 59,
    destroytime: 0,
    explosionres: 0,
    opaque: false,
    lightopacity: 0,
}, "plant");
var AgricultureAPI = {
    cropCards:[],
    abstractFunctions:{/* file: baseCropClasses.js */},
    nutrientBiomeBonusValue:{/* file: biome_bonuses.js */},
    registerCropCard:function(card){
        if(card.base){
            var funcs = AgricultureAPI.abstractFunctions[card.base];
            if(funcs)this.addMissingFuncsToCard(card,funcs);            
        }
        this.addMissingFuncsToCard(card,AgricultureAPI.abstractFunctions["IC2CropCard"]);
        if(card.baseSeed&&card.baseSeed.addToCreative!=false)Item.addToCreative(ItemID.cropSeedBag, 1,this.cropCards.length);
        this.cropCards.push(card);
        var base = card.base?card.base:" IC2CropCard";
        //alert("crop registred "+card.name+" on base "+base);
    },
    addMissingFuncsToCard:function(card,functions){ 
        for(var funcName in functions){
            if(!card[funcName])card[funcName] = functions[funcName];
        }
    },
    getCropCard:function(name){
        for(var i in this.cropCards){
            if(this.cropCards[i].name==name)return this.cropCards[i];
        }return null  
    },
    getCardIndexFromName:function(name){
        for(var i in this.cropCards){
            if(this.cropCards[i].name==name) return i;
        }return null  
    },
    getHumidityBiomeBonus:function(x,z){
        return 0;//доделоть// и так сойдет
    },
    getNutrientBiomeBonus:function(x,z){
        var biomeID = World.getBiome(x, z);
        var bonus = AgricultureAPI.nutrientBiomeBonusValue[biomeID];
        if(bonus)return bonus;
        return 0;//доделоть//кажется ок
    },
    getCardFromSeed:function(item){
        for(var i in this.cropCards){
            var seed = this.cropCards[i].baseSeed;
            if(!seed)continue;
            if(eval(seed.id)==item.id){
                if(seed.data&&seed.data!=item.data)continue;
                return this.cropCards[i];
            }
        }
        return null;
    },
    generateExtraFromValues:function( data){
        var exta = new ItemExtraData();
        exta.putInt("growth",data.statGrowth);
        exta.putInt("gain",data.statGain);
        exta.putInt("resistance",data.statResistance);
        exta.putInt("scan",data.scanLevel);
        return exta;
    },
    addDefaultExtra:function(item){
        //alert("added defaut values to itm");
        var extra = new ItemExtraData();
        var card = AgricultureAPI.cropCards[item.data];
        extra.putInt("growth",card.baseSeed.growth);
        extra.putInt("gain",card.baseSeed.gain);
        extra.putInt("resistance",card.baseSeed.resistance);
        extra.putInt("scan",4);
        Player.setCarriedItem(item.id, 1, item.data, extra);
        return extra;
    }
};
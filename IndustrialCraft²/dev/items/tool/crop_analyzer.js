IDRegistry.genItemID("agriculturalAnalyzer");
Item.createItem("agriculturalAnalyzer", "Crop Analyzer", {name: "cropnalyzer"}, {stack: 1});
Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: ItemID.agriculturalAnalyzer , count: 1 , data: 0}, [
		"xx ",
		"rgr",
		"rcr"
	], ['x', ItemID.cableCopper1, 0, 'r', 331, 0, 'g', 20, 0, "c", ItemID.circuitBasic, 0]);
});

var guiAddConst = 14;
var guiAnalyserObject = {
	location: {
		x: 0,
		y: 0,
		width: 1000,
		height: 1000
	},
	
	drawing: [
		{type: "background", color: 0},
		{type: "bitmap", x: 250, y: UI.getScreenHeight() / 10, bitmap: "agricultural_analyser", scale: GUI_SCALE / 2.3},
	],
	
	elements: {
		"closeButton": {type: "button", x: 672, y: 77, bitmap: "close_button_small", scale: GUI_SCALE, clicker: {onClick: function(container){
			AgriculturalAnalyser.dropItems(container);
            AgriculturalAnalyser.hideAllValues(container);
            container.close();
		}}},
		"textName": {type: "text", font: {size: 18}, x: 432, y: 86, width: 256, height: 42, text: Translation.translate("Crop Analyzer")},
		"slotSeedIn": {type: "slot", x: 265, y: 75, size: GUI_SCALE * 16, isValid: function(id, count, data){
			return id == ItemID.cropSeedBag;
		}},
		"slotSeedOut": {type: "slot", x: 360, y: 75, size: GUI_SCALE * 16, isValid: function(){return false;}},
		"slotEnergy": {type: "slot", x: 615, y: 75, size: GUI_SCALE * 16, isValid: MachineRegistry.isValidEUStorage}
	}
};
for(var i = 0; i < 10; i++){
	guiAnalyserObject.elements["slot" + i] = {type: "invSlot", x: 270 + i * 45, y: 455, size:GUI_SCALE * guiAddConst, index: i};
}
var guiAgriculturalAnalyzer = new UI.Window(guiAnalyserObject);
guiAgriculturalAnalyzer.setInventoryNeeded(true);

var AgriculturalAnalyser = {
    container: null,
    tick: function(){
        var container = AgriculturalAnalyser.container;
        if(!container) return;

        var slotIn = container.getSlot("slotSeedIn");
        var slotOut = container.getSlot("slotSeedOut");
        var slotEnergy = container.getSlot("slotEnergy");
        var currentEnergy = ChargeItemRegistry.getEnergyStored(slotEnergy, "Eu");

        if(slotIn.id && !slotOut.id && currentEnergy){
            var level = slotIn.extra.getInt("scan");
            if(level < 4){
                var ned = AgriculturalAnalyser.energyForLevel(level);
                if(currentEnergy > ned){
                    ICTool.dischargeItem(slotEnergy, ned);
                    slotIn.extra.putInt("scan", level + 1);
                }
            }
            slotOut.id = slotIn.id;
            slotOut.count = slotIn.count;
            slotOut.data = slotIn.data;
            slotOut.extra = slotIn.extra;
            slotIn.id = 0;

            AgriculturalAnalyser.showAllValues(container, slotOut);
            container.validateAll();
        }else if(!slotOut.id){
            AgriculturalAnalyser.hideAllValues(container);
        }
    },
    hideAllValues: function(container){
        var content = container.getGuiContent();
        if(!content) return;
        var elements = content.elements;
        elements["cropName"] = null;
        elements["textTier"] = null;
        elements["discoveredBy"] = null;
        elements["discoveredByText"] = null;
        elements["attributes0"] = null;
        elements["attributes1"] = null;
        elements["attributes2"] = null;
        elements["growth"] = null;
        elements["gain"] = null;
        elements["resist"] = null;
        elements["growthText"] = null;
        elements["gainText"] = null;
        elements["resistText"] = null;
    },
    showAllValues: function(container, seedBagSlot){
        var elements = container.getGuiContent().elements;
        var font = {size: 18, color: Color.WHITE}
        var level = seedBagSlot.extra.getInt("scan");
        var crop = AgricultureAPI.cropCards[seedBagSlot.data];

        switch(level){
            case 4:
                this.showStats(seedBagSlot, elements);
            case 3:
                this.showAttributes(crop, font, elements);
            case 2:
                this.showTier(crop, font, elements);
                this.showDiscoveredBy(crop, font, elements);
            case 1:
                this.showName(crop, font, elements);
        }
    },
    showStats: function(slot, elements){
        var growth = slot.extra.getInt("growth");
        var gain = slot.extra.getInt("gain");
        var resist = slot.extra.getInt("resistance");
        var statsXpos = 560;

        elements["growthText"] = {type: "text", font: {size: 18, color: Color.rgb(0, 128, 0)}, x: statsXpos, y: 160, width: 256, height: 42, text: "Growth: "};
        elements["growth"] = {type: "text", font: {size: 18, color: Color.rgb(0, 128, 0)}, x: statsXpos, y: 200, width: 256, height: 42, text: growth.toString()};
        elements["gainText"] = {type: "text", font: {size: 18, color: Color.rgb(255, 255, 0)}, x: statsXpos, y: 240, width: 256, height: 42, text: "Gain: "};
        elements["gain"] = {type: "text", font: {size: 18, color: Color.rgb(255, 255, 0)}, x: statsXpos, y: 280, width: 256, height: 42, text: gain.toString()};
        elements["resistText"] = {type: "text", font: {size: 18, color: Color.rgb(0, 255, 255)}, x: statsXpos, y: 320, width: 256, height: 42, text: "Resistance: "};
        elements["resist"] = {type: "text", font: {size: 18, color: Color.rgb(0, 255, 255)}, x: statsXpos, y: 360, width: 256, height: 42, text: resist.toString()};
    },
    showDiscoveredBy: function(crop, font, elements){
        var discBy = crop.getDiscoveredBy();
        elements["discoveredByText"] = {type: "text", font: font, x: 270, y: 240, width: 256, height: 42, text: "Discovered by: "};
        elements["discoveredBy"] = {type: "text", font: font, x: 270, y: 280, width: 256, height: 42, text: discBy};
    },
    showTier: function(crop, font, elements){
        var tier = "Tier: " + AgriculturalAnalyser.getStringTier(crop.properties.tier);
        elements["textTier"] = {type: "text", font: font, x: 270, y: 200, width: 256, height: 42, text: tier};
    },
    showAttributes: function(crop, font, elements){
        var arr = AgriculturalAnalyser.getAttributesText(crop.attributes)
        for(var i in arr){
            elements["attributes"+i] = {type: "text", font: font, x: 270, y: 320 + 40 * i, width: 256, height: 42, text: arr[i]};
        }
    },
    showName: function(crop, font, elements){
        var name = AgriculturalAnalyser.getSeedName(crop.id);
        elements["cropName"] = {type: "text", font: font, x: 270, y: 160, width: 256, height: 42, text: name};
    },
    getStringTier: function(tier){
        switch (tier) {
            default: {
                return "0";
            }
            case 1: {
                return "I";
            }
            case 2: {
                return "II";
            }
            case 3: {
                return "III";
            }
            case 4: {
                return "IV";
            }
            case 5: {
                return "V";
            }
            case 6: {
                return "VI";
            }
            case 7: {
                return "VII";
            }
            case 8: {
                return "VIII";
            }
            case 9: {
                return "IX";
            }
            case 10: {
                return "X";
            }
            case 11: {
                return "XI";
            }
            case 12: {
                return "XII";
            }
            case 13: {
                return "XIII";
            }
            case 14: {
                return "XIV";
            }
            case 15: {
                return "XV";
            }
            case 16: {
                return "XVI";
            }
        }
    },
    energyForLevel: function(level){
        switch (level) {
            default: {
                return 10;
            }
            case 1: {
                return 90;
            }
            case 2: {
                return 900;
            }
            case 3: {
                return 9000;
            }
        }
    },
    getSeedName: function(name){
        return Translation.translate(name);
    },
    getAttributesText: function(attributes){
        var arr = ["", "", ""];
        for(var i in attributes){
            var indForPush = Math.floor((i) / 3);
            arr[indForPush] += attributes[i]+' ';
        }
        return arr;
    },
    dropItems: function(container){
        var coords = Player.getPosition();
        var slots = ["slotSeedIn", "slotSeedOut", "slotEnergy"]
        for(var i in slots){
            var slot = container.getSlot(slots[i]);
            nativeDropItem(coords.x, coords.y, coords.z, 0, slot.id, slot.count, slot.data, slot.extra);
            slot.id = 0;
        }
        container.validateAll();
    },
    showCropValues: function(te){
        switch(te.data.scanLevel){
            case 4:
                Game.message("Growth: " + te.data.statGrowth);
                Game.message("Gain: " + te.data.statGain);
                Game.message("Resistance: " + te.data.statResistance);
            case 2:
                Game.message("Tier: " + te.crop.properties.tier);
                Game.message("Discovered by: " + te.crop.getDiscoveredBy());
            case 1:
                Game.message(Translation.translate(te.crop.id));
        }
    },
    useFunction: function(coords, item, block){
        if(block.id == BlockID.crop){
            var tileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
            if(!tileEntity.crop) return;
            AgriculturalAnalyser.showCropValues(tileEntity);
        }else{
            AgriculturalAnalyser.noTargetUseFunction(item);
        }
    },
    noTargetUseFunction: function(item){
        if(!AgriculturalAnalyser.container) AgriculturalAnalyser.container = new UI.Container();
        AgriculturalAnalyser.container.openAs(guiAgriculturalAnalyzer);
    }
};

Item.registerUseFunction("agriculturalAnalyzer", AgriculturalAnalyser.useFunction);
Item.registerNoTargetUseFunction("agriculturalAnalyzer", AgriculturalAnalyser.noTargetUseFunction);
Callback.addCallback("tick", AgriculturalAnalyser.tick);
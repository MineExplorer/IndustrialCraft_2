IDRegistry.genBlockID("nuclearReactor");
Block.createBlock("nuclearReactor", [
    { name: "Nuclear Reactor", texture: [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true },
], "machine");
ItemName.setRarity(BlockID.nuclearReactor, 1, true);
TileRenderer.setStandartModel(BlockID.nuclearReactor, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]]);
TileRenderer.registerRenderModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1]]);
IDRegistry.genBlockID("reactorChamber");
Block.createBlock("reactorChamber", [
    { name: "Reactor Chamber", texture: [["machine_bottom", 0], ["machine_top", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0]], inCreative: true },
], "machine");
ItemName.setRarity(BlockID.reactorChamber, 1, true);
MachineRegistry.setMachineDrop("nuclearReactor", BlockID.primalGenerator);
MachineRegistry.setMachineDrop("reactorChamber");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.nuclearReactor, count: 1, data: 0 }, [
        "xcx",
        "aaa",
        "x#x"
    ], ['#', BlockID.primalGenerator, 0, 'a', BlockID.reactorChamber, 0, 'x', ItemID.densePlateLead, 0, 'c', ItemID.circuitAdvanced, 0]);
    Recipes.addShaped({ id: BlockID.reactorChamber, count: 1, data: 0 }, [
        " x ",
        "x#x",
        " x "
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.plateLead, 0]);
});
var reactorElements = {
    "heatScale": { type: "scale", x: 346, y: 376, direction: 0, value: 0.5, bitmap: "reactor_heat_scale", scale: 3 },
    "textInfo": { type: "text", font: { size: 24, color: Color.GREEN }, x: 655, y: 382, width: 256, height: 42, text: Translation.translate("Generating: ") },
};
for (var y = 0; y < 6; y++) {
    for (var x = 0; x < 9; x++) {
        var i_1 = y * 9 + x;
        reactorElements["slot" + i_1] = { type: "slot", x: 400 + 54 * x, y: 40 + 54 * y, size: 54, maxStackSize: 1, isValid: function (id, count, data) {
                return ReactorAPI.isReactorItem(id);
            } };
    }
}
var guiNuclearReactor = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Nuclear Reactor") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 340, y: 370, bitmap: "reactor_info", scale: GUI_SCALE },
    ],
    elements: reactorElements
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiNuclearReactor, "Nuclear Reactor");
});
var EUReactorModifier = 5;
MachineRegistry.registerGenerator(BlockID.nuclearReactor, {
    defaultValues: {
        isEnabled: false,
        isActive: false,
        heat: 0,
        maxHeat: 10000,
        hem: 1,
        output: 0,
        boomPower: 0
    },
    chambers: [],
    getGuiScreen: function () {
        return guiNuclearReactor;
    },
    init: function () {
        this.chambers = [];
        this.renderModel();
        this.__initialized = true;
        this.rebuildEnergyNet();
    },
    rebuildEnergyNet: function () {
        var net = this.__energyNets.Eu;
        if (net) {
            EnergyNetBuilder.removeNet(net);
        }
        net = EnergyNetBuilder.buildForTile(this, EU);
        this.__energyNets.Eu = net;
        for (var i_2 = 0; i_2 < 6; i_2++) {
            var c = StorageInterface.getRelativeCoords(this, i_2);
            if (World.getBlockID(c.x, c.y, c.z) == BlockID.reactorChamber) {
                var tileEnt = World.getTileEntity(c.x, c.y, c.z);
                if (tileEnt) {
                    this.addChamber(tileEnt);
                }
            }
        }
    },
    addChamber: function (chamber) {
        if (!this.__initialized || chamber.remove || (chamber.core && chamber.core != this)) {
            return;
        }
        if (this.chambers.indexOf(chamber) == -1) {
            this.chambers.push(chamber);
            chamber.core = this;
            chamber.data.x = this.x;
            chamber.data.y = this.y;
            chamber.data.z = this.z;
        }
        var net = this.__energyNets.Eu;
        var chamberNets = chamber.__energyNets;
        if (chamberNets.Eu) {
            if (chamberNets.Eu != net) {
                EnergyNetBuilder.mergeNets(net, chamberNets.Eu);
            }
        }
        else {
            for (var side = 0; side < 6; side++) {
                var c = StorageInterface.getRelativeCoords(chamber, side);
                EnergyNetBuilder.buildTileNet(net, c.x, c.y, c.z, side ^ 1);
            }
        }
        chamberNets.Eu = net;
    },
    removeChamber: function (chamber) {
        this.chambers.splice(this.chambers.indexOf(chamber), 1);
        this.rebuildEnergyNet();
        var x = this.getReactorSize();
        for (var y = 0; y < 6; y++) {
            var slot = this.container.getSlot("slot" + (y * 9 + x));
            if (slot.id > 0) {
                World.drop(chamber.x + .5, chamber.y + .5, chamber.z + .5, slot.id, slot.count, slot.data);
                slot.id = slot.count = slot.data = 0;
            }
        }
    },
    getReactorSize: function () {
        return 3 + this.chambers.length;
    },
    processChambers: function () {
        var size = this.getReactorSize();
        for (var pass = 0; pass < 2; pass++) {
            for (var y = 0; y < 6; y++) {
                for (var x = 0; x < size; x++) {
                    var slot = this.container.getSlot("slot" + (y * 9 + x));
                    var component = ReactorAPI.getComponent(slot.id);
                    if (component) {
                        component.processChamber(slot, this, x, y, pass == 0);
                    }
                }
            }
        }
    },
    tick: function () {
        var content = this.container.getGuiContent();
        var reactorSize = this.getReactorSize();
        if (content) {
            for (var y = 0; y < 6; y++) {
                for (var x = 0; x < 9; x++) {
                    var newX = (x < reactorSize) ? 400 + 54 * x : 1400;
                    content.elements["slot" + (y * 9 + x)].x = newX;
                }
            }
        }
        if (this.data.isEnabled) {
            if (World.getThreadTime() % 20 == 0) {
                this.data.maxHeat = 10000;
                this.data.hem = 1;
                this.data.output = 0;
                this.processChambers();
                this.calculateHeatEffects();
            }
        }
        else {
            this.data.output = 0;
        }
        this.setActive(this.data.heat >= 1000 || this.data.output > 0);
        if (this.data.output > 0) {
            this.startPlaySound();
        }
        else {
            this.stopPlaySound();
        }
        this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
        this.container.setText("textInfo", "Generating: " + this.getEnergyOutput() + " EU/t");
    },
    energyTick: function (type, src) {
        var output = this.getEnergyOutput();
        src.add(output, Math.min(output, 8192));
    },
    redstone: function (signal) {
        this.data.isEnabled = signal.power > 0;
    },
    getEnergyOutput: function () {
        return parseInt(this.data.output * EUReactorModifier);
    },
    startPlaySound: function () {
        if (!Config.machineSoundEnabled || this.remove)
            return;
        if (!this.audioSource) {
            this.audioSource = SoundManager.createSource(AudioSource.TILEENTITY, this, "NuclearReactorLoop.ogg");
            ;
        }
        if (this.data.output < 40) {
            var geigerSound = "GeigerLowEU.ogg";
        }
        else if (this.data.output < 80) {
            var geigerSound = "GeigerMedEU.ogg";
        }
        else {
            var geigerSound = "GeigerHighEU.ogg";
        }
        if (!this.audioSourceGeiger) {
            this.audioSourceGeiger = SoundManager.createSource(AudioSource.TILEENTITY, this, geigerSound);
        }
        else if (this.audioSourceGeiger.soundName != geigerSound) {
            this.audioSourceGeiger.setSound(geigerSound, true);
        }
    },
    stopPlaySound: function () {
        if (this.audioSource) {
            SoundManager.removeSource(this.audioSource);
            this.audioSource = null;
        }
        if (this.audioSourceGeiger) {
            SoundManager.removeSource(this.audioSourceGeiger);
            this.audioSourceGeiger = null;
        }
    },
    getHeat: function () {
        return this.data.heat;
    },
    setHeat: function (heat) {
        this.data.heat = heat;
    },
    addHeat: function (amount) {
        this.data.heat += amount;
    },
    getMaxHeat: function () {
        return this.data.maxHeat;
    },
    setMaxHeat: function (newMaxHeat) {
        this.data.maxHeat = newMaxHeat;
    },
    getHeatEffectModifier: function () {
        return this.data.hem;
    },
    setHeatEffectModifier: function (newHEM) {
        this.data.hem = newHEM;
    },
    getItemAt: function (x, y) {
        if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
            return null;
        }
        return this.container.getSlot("slot" + (y * 9 + x));
    },
    setItemAt: function (x, y, id, count, data) {
        if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
            return null;
        }
        this.container.setSlot("slot" + (y * 9 + x), id, count || 0, data || 0);
    },
    addOutput: function (energy) {
        this.data.output += energy;
    },
    destroyBlock: function (coords, player) {
        for (var i_3 in this.chambers) {
            var c = this.chambers[i_3];
            World.destroyBlock(c.x, c.y, c.z, true);
        }
    },
    renderModel: MachineRegistry.renderModel,
    explode: function () {
        var explode = false;
        var boomPower = 10;
        var boomMod = 1;
        for (var i_4 = 0; i_4 < this.getReactorSize() * 6; i_4++) {
            var slot = this.container.getSlot("slot" + i_4);
            var component = ReactorAPI.getComponent(slot.id);
            if (component) {
                var f = component.influenceExplosion(slot, this);
                if (f > 0 && f < 1) {
                    boomMod *= f;
                }
                else {
                    if (f >= 1)
                        explode = true;
                    boomPower += f;
                }
            }
            this.container.setSlot("slot" + i_4, 0, 0, 0);
        }
        if (explode) {
            this.data.boomPower = Math.min(boomPower * this.data.hem * boomMod, __config__.access("reactor_explosion_max_power"));
            RadiationAPI.addRadiationSource(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.data.boomPower, 600);
            World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.data.boomPower);
            this.selfDestroy();
        }
    },
    calculateHeatEffects: function () {
        var power = this.data.heat / this.data.maxHeat;
        if (power >= 1) {
            this.explode();
        }
        if (power >= 0.85 && Math.random() <= 0.2 * this.data.hem) {
            var coord = this.getRandCoord(2);
            var block = World.getBlockID(coord.x, coord.y, coord.z);
            var material = ToolAPI.getBlockMaterialName(block);
            if (block == BlockID.nuclearReactor) {
                var tileEntity = World.getTileEntity(coord.x, coord.y, coord.z);
                if (tileEntity) {
                    tileEntity.explode();
                }
            }
            else if (material == "stone" || material == "dirt") {
                World.setBlock(coord.x, coord.y, coord.z, 11, 1);
            }
        }
        if (power >= 0.7 && World.getThreadTime() % 20 == 0) {
            var entities = Entity.getAll();
            for (var i_5 in entities) {
                var ent = entities[i_5];
                if (canTakeDamage(ent, "radiation")) {
                    var c = Entity.getPosition(ent);
                    if (Math.abs(this.x + 0.5 - c.x) <= 3 && Math.abs(this.y + 0.5 - c.y) <= 3 && Math.abs(this.z + 0.5 - c.z) <= 3) {
                        RadiationAPI.addEffect(ent, parseInt(4 * this.data.hem));
                    }
                }
            }
        }
        if (power >= 0.5 && Math.random() <= this.data.hem) {
            var coord = this.getRandCoord(2);
            var block = World.getBlockID(coord.x, coord.y, coord.z);
            if (block == 8 || block == 9) {
                World.setBlock(coord.x, coord.y, coord.z, 0);
            }
        }
        if (power >= 0.4 && Math.random() <= this.data.hem) {
            var coord = this.getRandCoord(2);
            var block = World.getBlockID(coord.x, coord.y, coord.z);
            var material = ToolAPI.getBlockMaterialName(block);
            if (block != 49 && (material == "wood" || material == "wool" || material == "fibre" || material == "plant")) {
                for (var i_6 = 0; i_6 < 6; i_6++) {
                    var c = World.getRelativeCoords(coord.x, coord.y, coord.z, i_6);
                    if (World.getBlockID(c.x, c.y, c.z) == 0) {
                        World.setBlock(c.x, c.y, c.z, 51);
                        break;
                    }
                }
            }
        }
    },
    getRandCoord: function (r) {
        return { x: this.x + randomInt(-r, r), y: this.y + randomInt(-r, r), z: this.z + randomInt(-r, r) };
    }
});
MachineRegistry.registerGenerator(BlockID.reactorChamber, {
    defaultValues: {
        x: -1,
        y: -1,
        z: -1
    },
    core: null,
    getGuiScreen: function () {
        if (this.core) {
            return guiNuclearReactor;
        }
        return null;
    },
    onItemClick: function (id, count, data, coords) {
        if (id == ItemID.debugItem || id == ItemID.EUMeter)
            return false;
        if (this.click(id, count, data, coords))
            return true;
        if (Entity.getSneaking(player))
            return false;
        var gui = this.getGuiScreen();
        if (gui) {
            this.core.container.openAs(gui);
            return true;
        }
    },
    init: function () {
        if (this.data.y >= 0 && World.getBlockID(this.data.x, this.data.y, this.data.z) == BlockID.nuclearReactor) {
            var tileEnt = World.getTileEntity(this.data.x, this.data.y, this.data.z);
            if (tileEnt) {
                tileEnt.addChamber(this);
            }
        }
        else
            for (var i_7 = 0; i_7 < 6; i_7++) {
                var c = StorageInterface.getRelativeCoords(this, i_7);
                if (World.getBlockID(c.x, c.y, c.z) == BlockID.nuclearReactor) {
                    var tileEnt = World.getTileEntity(c.x, c.y, c.z);
                    if (tileEnt) {
                        tileEnt.addChamber(this);
                        break;
                    }
                }
            }
    }
});
Block.registerPlaceFunction(BlockID.nuclearReactor, function (coords, item, block) {
    var x = coords.relative.x;
    var y = coords.relative.y;
    var z = coords.relative.z;
    for (var i_8 = 0; i_8 < 6; i_8++) {
        var c = World.getRelativeCoords(x, y, z, i_8);
        if (World.getBlockID(c.x, c.y, c.z) == BlockID.reactorChamber) {
            var tileEnt = World.getTileEntity(c.x, c.y, c.z);
            if (tileEnt.core) {
                item.count++;
                return;
            }
        }
    }
    World.setBlock(x, y, z, item.id, 0);
    World.playSound(x, y, z, "dig.stone", 1, 0.8);
    World.addTileEntity(x, y, z);
});
Block.registerPlaceFunction(BlockID.reactorChamber, function (coords, item, block) {
    var x = coords.relative.x;
    var y = coords.relative.y;
    var z = coords.relative.z;
    var reactorConnect = 0;
    for (var i_9 = 0; i_9 < 6; i_9++) {
        var c = World.getRelativeCoords(x, y, z, i_9);
        if (World.getBlockID(c.x, c.y, c.z) == BlockID.nuclearReactor) {
            reactorConnect++;
            if (reactorConnect > 1)
                break;
        }
    }
    if (reactorConnect == 1) {
        World.setBlock(x, y, z, item.id, 0);
        World.playSound(x, y, z, "dig.stone", 1, 0.8);
        World.addTileEntity(x, y, z);
    }
    else {
        item.count++;
    }
});

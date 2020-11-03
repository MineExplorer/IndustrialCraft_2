var MachineRegistry;
(function (MachineRegistry) {
    var machineIDs = {};
    function isMachine(id) {
        return machineIDs[id];
    }
    MachineRegistry.isMachine = isMachine;
    // register IC2 Machine
    function registerPrototype(id, Prototype) {
        // register ID
        machineIDs[id] = true;
        ToolAPI.registerBlockMaterial(id, "stone", 1, true);
        Block.setDestroyTime(id, 3);
        TileEntity.registerPrototype(id, Prototype);
        if (Prototype instanceof TileEntityElectricMachine) {
            // wire connection
            ICRender.getGroup("ic-wire").add(id, -1);
            // register for energy net
            EnergyTileRegistry.addEnergyTypeForId(id, EU);
        }
    }
    MachineRegistry.registerPrototype = registerPrototype;
    // for reverse compatibility
    function registerElectricMachine(id, Prototype) {
        // wire connection
        ICRender.getGroup("ic-wire").add(id, -1);
        // setup energy values
        if (Prototype.defaultValues) {
            Prototype.defaultValues.energy = 0;
            Prototype.defaultValues.energy_receive = 0;
            Prototype.defaultValues.last_energy_receive = 0;
            Prototype.defaultValues.voltage = 0;
            Prototype.defaultValues.last_voltage = 0;
        }
        else {
            Prototype.defaultValues = {
                energy: 0,
                energy_receive: 0,
                last_energy_receive: 0,
                voltage: 0,
                last_voltage: 0
            };
        }
        for (var key in TileEntityElectricMachine.prototype) {
            if (!Prototype.hasOwnProperty(key)) {
                Prototype[key] = TileEntityElectricMachine.prototype[key];
            }
        }
        this.registerPrototype(id, Prototype);
        // register for energy net
        EnergyTileRegistry.addEnergyTypeForId(id, EU);
    }
    MachineRegistry.registerElectricMachine = registerElectricMachine;
    function registerGenerator(id, Prototype) {
        for (var key in TileEntityGenerator.prototype) {
            if (!Prototype.hasOwnProperty(key)) {
                Prototype[key] = TileEntityGenerator.prototype[key];
            }
        }
        this.registerPrototype(id, Prototype);
    }
    MachineRegistry.registerGenerator = registerGenerator;
    function registerEUStorage(id, Prototype) {
        Prototype.isEnergySource = function () {
            return true;
        };
        Prototype.energyReceive = Prototype.energyReceive || this.basicEnergyReceiveFunc;
        Prototype.energyTick = Prototype.energyTick || this.basicEnergyOutFunc;
        Prototype.isTeleporterCompatible = true;
        this.registerElectricMachine(id, Prototype);
    }
    MachineRegistry.registerEUStorage = registerEUStorage;
    // standard functions
    function setStoragePlaceFunction(id, fullRotation) {
        Block.registerPlaceFunction(BlockID[id], function (coords, item, block) {
            var place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
            World.setBlock(place.x, place.y, place.z, item.id, 0);
            World.playSound(place.x, place.y, place.z, "dig.stone", 1, 0.8);
            var rotation = TileRenderer.getBlockRotation(fullRotation);
            var tile = World.addTileEntity(place.x, place.y, place.z);
            tile.data.meta = rotation;
            TileRenderer.mapAtCoords(place.x, place.y, place.z, item.id, rotation);
            if (item.extra) {
                tile.data.energy = item.extra.getInt("energy");
            }
        });
    }
    MachineRegistry.setStoragePlaceFunction = setStoragePlaceFunction;
    function getMachineDrop(coords, blockID, level, basicDrop, saveEnergyAmount) {
        var item = Player.getCarriedItem();
        var dropID = 0;
        if (ICTool.isValidWrench(item, 10)) {
            ICTool.useWrench(coords, item, 10);
            World.setBlock(coords.x, coords.y, coords.z, 0, 0);
            var chance = ICTool.getWrenchData(item.id).chance;
            if (Math.random() < chance) {
                dropID = blockID;
            }
            else {
                dropID = basicDrop || blockID;
            }
        }
        else if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
            dropID = basicDrop || blockID;
        }
        if (dropID == blockID && saveEnergyAmount) {
            var extra = new ItemExtraData();
            extra.putInt("energy", saveEnergyAmount);
            World.drop(coords.x + .5, coords.y + .5, coords.z + .5, dropID, 1, 0, extra);
            return [];
        }
        if (dropID)
            return [[dropID, 1, 0]];
        return [];
    }
    MachineRegistry.getMachineDrop = getMachineDrop;
    function setMachineDrop(nameID, basicDrop) {
        Block.registerDropFunction(nameID, function (coords, blockID, blockData, level) {
            return MachineRegistry.getMachineDrop(coords, blockID, level, basicDrop);
        });
        Block.registerPopResourcesFunction(nameID, function (coords, block) {
            if (Math.random() < 0.25) {
                World.drop(coords.x + .5, coords.y + .5, coords.z + .5, basicDrop || block.id, 1, 0);
            }
        });
    }
    MachineRegistry.setMachineDrop = setMachineDrop;
    function renderModel() {
        if (this.data.isActive) {
            TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, 0);
        }
        else {
            BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        }
    }
    MachineRegistry.renderModel = renderModel;
    function renderModelWithRotation() {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (this.data.isActive ? 4 : 0));
    }
    MachineRegistry.renderModelWithRotation = renderModelWithRotation;
    function renderModelWith6Variations() {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (this.data.isActive ? 6 : 0));
    }
    MachineRegistry.renderModelWith6Variations = renderModelWith6Variations;
    function setActive(isActive) {
        if (this.data.isActive != isActive) {
            this.data.isActive = isActive;
            this.renderModel();
        }
    }
    MachineRegistry.setActive = setActive;
    MachineRegistry.basicEnergyOutFunc = TileEntityGenerator.prototype.energyTick;
    MachineRegistry.basicEnergyReceiveFunc = TileEntityElectricMachine.prototype.energyTick;
    function getLiquidFromItem(liquid, inputItem, outputItem, byHand) {
        if (byHand)
            outputItem = { id: 0, count: 0, data: 0 };
        var empty = LiquidLib.getEmptyItem(inputItem.id, inputItem.data);
        if (empty && (!liquid && this.interface.canReceiveLiquid(empty.liquid) || empty.liquid == liquid) && !this.liquidStorage.isFull(empty.liquid)) {
            if (outputItem.id == empty.id && outputItem.data == empty.data && outputItem.count < Item.getMaxStack(empty.id) || outputItem.id == 0) {
                var liquidLimit = this.liquidStorage.getLimit(empty.liquid);
                var storedAmount = this.liquidStorage.getAmount(liquid).toFixed(3);
                var count = Math.min(byHand ? inputItem.count : 1, Math.floor((liquidLimit - storedAmount) / empty.amount));
                if (count > 0) {
                    this.liquidStorage.addLiquid(empty.liquid, empty.amount * count);
                    inputItem.count -= count;
                    outputItem.id = empty.id;
                    outputItem.data = empty.data;
                    outputItem.count += count;
                    if (!byHand)
                        this.container.validateAll();
                }
                else if (inputItem.count == 1 && empty.storage) {
                    var amount = Math.min(liquidLimit - storedAmount, empty.amount);
                    this.liquidStorage.addLiquid(empty.liquid, amount);
                    inputItem.data += amount * 1000;
                }
                if (byHand) {
                    if (outputItem.id) {
                        Player.addItemToInventory(outputItem.id, outputItem.count, outputItem.data);
                    }
                    if (inputItem.count == 0)
                        inputItem.id = inputItem.data = 0;
                    Player.setCarriedItem(inputItem.id, inputItem.count, inputItem.data);
                    return true;
                }
            }
        }
    }
    MachineRegistry.getLiquidFromItem = getLiquidFromItem;
    function addLiquidToItem(liquid, inputItem, outputItem) {
        var amount = this.liquidStorage.getAmount(liquid).toFixed(3);
        if (amount > 0) {
            var full = LiquidLib.getFullItem(inputItem.id, inputItem.data, liquid);
            if (full && (outputItem.id == full.id && outputItem.data == full.data && outputItem.count < Item.getMaxStack(full.id) || outputItem.id == 0)) {
                if (amount >= full.amount) {
                    this.liquidStorage.getLiquid(liquid, full.amount);
                    inputItem.count--;
                    outputItem.id = full.id;
                    outputItem.data = full.data;
                    outputItem.count++;
                    this.container.validateAll();
                }
                else if (inputItem.count == 1 && full.storage) {
                    if (inputItem.id == full.id) {
                        amount = this.liquidStorage.getLiquid(liquid, full.amount);
                        inputItem.data -= amount * 1000;
                    }
                    else {
                        amount = this.liquidStorage.getLiquid(liquid, full.storage);
                        inputItem.id = full.id;
                        inputItem.data = (full.storage - amount) * 1000;
                    }
                }
            }
        }
    }
    MachineRegistry.addLiquidToItem = addLiquidToItem;
    function isValidEUItem(id, count, data, container) {
        var level = container.tileEntity.getTier();
        return ChargeItemRegistry.isValidItem(id, "Eu", level);
    }
    MachineRegistry.isValidEUItem = isValidEUItem;
    function isValidEUStorage(id, count, data, container) {
        var level = container.tileEntity.getTier();
        return ChargeItemRegistry.isValidStorage(id, "Eu", level);
    }
    MachineRegistry.isValidEUStorage = isValidEUStorage;
    function updateGuiHeader(gui, text) {
        var header = gui.getWindow("header");
        header.contentProvider.drawing[2].text = Translation.translate(text);
    }
    MachineRegistry.updateGuiHeader = updateGuiHeader;
})(MachineRegistry || (MachineRegistry = {}));
var transferByTier = {
    1: 32,
    2: 256,
    3: 2048,
    4: 8192
};

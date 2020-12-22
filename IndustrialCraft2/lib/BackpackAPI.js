/*
     ____             _                     _        _    ____ ___
    | __ )  __ _  ___| | ___ __   __ _  ___| | __   / \  |  _ \_ _|
    |  _ \ / _` |/ __| |/ / '_ \ / _` |/ __| |/ /  / _ \ | |_) | |
    | |_) | (_| | (__|   <| |_) | (_| | (__|   <  / ___ \|  __/| |
    |____/ \__,_|\___|_|\_\ .__/ \__,_|\___|_|\_\/_/   \_\_|  |___|
                                         
    BackpackAPI library
     
    Условия использования:
      - Запрещено распространение библиотеки на сторонних источниках
        без ссылки на официальное сообщество (https://vk.com/forestry_pe)
      - Запрещено изменение кода библиотеки
      - Запрещено явное копирование кода в другие библиотеки или моды
      - Используя библиотеку вы автоматически соглашаетесь с описанными
        выше условиями
    
    Author:
    ©DDCompany (https://vk.com/forestry_pe)
    Contributor:
    ©MineExplorer (https://vk.com/vlad.gr2027)
*/
LIBRARY({
    name: "BackpackAPI",
    version: 9,
    shared: true,
    api: "CoreEngine",
});
var BackpackKind;
(function (BackpackKind) {
    BackpackKind["EXTRA"] = "extra";
    BackpackKind["META"] = "meta";
})(BackpackKind || (BackpackKind = {}));
EXPORT("BackpackKind", BackpackKind);
Translation.addTranslation("Backpack", { ru: "Рюкзак" });
Saver.addSavesScope("BackpacksScope", function read(scope) {
    var _a, _b;
    BackpackRegistry.nextUnique = (_a = scope.nextUnique) !== null && _a !== void 0 ? _a : 1;
    BackpackRegistry.containers = (_b = scope.containers) !== null && _b !== void 0 ? _b : {};
}, function save() {
    return {
        nextUnique: BackpackRegistry.nextUnique,
        containers: BackpackRegistry.containers
    };
});
var BackpackRegistry = /** @class */ (function () {
    function BackpackRegistry() {
    }
    /**
     * Backpack registration function.
     * @param id - item id
     * @param prototype - object representing properties of the backpack
     */
    BackpackRegistry.register = function (id, prototype) {
        var _a, _b, _c, _d, _e;
        if (id <= 0) {
            Logger.Log("id for backpack register function is not valid", "ERROR");
            return;
        }
        if (!prototype) {
            Logger.Log("object for backpack register function is not valid", "ERROR");
            return;
        }
        prototype.title = (_a = prototype.title) !== null && _a !== void 0 ? _a : "Backpack";
        prototype.kind = prototype.useExtraData ? BackpackKind.EXTRA : ((_b = prototype.kind) !== null && _b !== void 0 ? _b : BackpackKind.META);
        prototype.slots = (_c = prototype.slots) !== null && _c !== void 0 ? _c : 10;
        prototype.inRow = (_d = prototype.inRow) !== null && _d !== void 0 ? _d : prototype.slots;
        prototype.slotsCenter = (_e = prototype.slotsCenter) !== null && _e !== void 0 ? _e : true;
        var slots = prototype.slots;
        var isValidFunc = prototype.isValidItem || function (id, count, data) {
            return !BackpackRegistry.isBackpack(id) &&
                (prototype.items ? BackpackRegistry.isValidFor(id, data, prototype.items) : true);
        };
        if (!prototype.gui) {
            if (slots <= 0) {
                Logger.Log("slots amount is not valid", "ERROR");
                return;
            }
            prototype.gui = new UI.StandartWindow({
                standart: {
                    header: {
                        text: {
                            text: ""
                        }
                    },
                    inventory: {
                        standart: true
                    },
                    background: {
                        standart: true
                    },
                    minHeight: 90 + (slots / 10 * 61) + 70
                },
                drawing: [],
                elements: {}
            });
            BackpackRegistry.addSlotsToGui(prototype.gui, slots, isValidFunc, prototype.inRow, prototype.slotsCenter);
        }
        Item.registerUseFunctionForID(id, function (coords, item) {
            BackpackRegistry.openGuiFor(item);
        });
        Item.registerNoTargetUseFunction(id, function (item) {
            BackpackRegistry.openGuiFor(item);
        });
        this.prototypes[id] = prototype;
    };
    /**
     * Checks whether an item can be put in the backpack.
     * @param id - item id
     * @param data - item data
     * @param items - items than can be put in the backpack
     * @returns whether an item can be put in the backpack.
     */
    BackpackRegistry.isValidFor = function (id, data, items) {
        if (data === void 0) { data = 0; }
        var _a, _b, _c;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            switch (typeof item) {
                case "number":
                    if (id === item) {
                        return true;
                    }
                    break;
                case "object":
                    var rId = item.id;
                    var rData = (_a = item.data) !== null && _a !== void 0 ? _a : 0;
                    var isOk = true;
                    switch (typeof rId) {
                        case "string":
                            var match = (_b = IDRegistry.getNameByID(id)) === null || _b === void 0 ? void 0 : _b.match(rId);
                            isOk = match !== null && match !== undefined;
                            break;
                        case "number":
                            isOk = rId == id;
                            break;
                    }
                    if (isOk == true) {
                        switch (typeof rData) {
                            case "string":
                                if ((data + "").match(rData)) {
                                    return true;
                                }
                                break;
                            case "number":
                                if (rData == -1 || rData == data) {
                                    return true;
                                }
                                break;
                        }
                    }
                    break;
                case "string":
                    if ((_c = IDRegistry.getNameByID(id)) === null || _c === void 0 ? void 0 : _c.match(item)) {
                        return true;
                    }
                    break;
            }
        }
        return false;
    };
    /**
     * Open backpack gui.
     * @param item - item
     * @param notUpdateData - If false and no container has been created for the passed data, a new item will be set
     * in the player’s hand
     * @returns backpack container id.
     */
    BackpackRegistry.openGuiFor = function (item, notUpdateData) {
        var prototype = this.prototypes[item.id];
        if (prototype) {
            var containerID = void 0;
            var container = void 0;
            switch (prototype.kind) {
                case BackpackKind.META:
                    if (!item.data) {
                        item.data = BackpackRegistry.nextUnique++;
                        if (!notUpdateData)
                            Player.setCarriedItem(item.id, item.count, item.data);
                    }
                    containerID = "d" + item.data;
                    container = this.containers[containerID];
                    break;
                case BackpackKind.EXTRA:
                    if (!item.extra) {
                        item.extra = new ItemExtraData();
                    }
                    var data = item.extra.getInt("container", -1); // For backward compatibility
                    data = data === -1 ? item.extra.getInt("__backpack_id", -1) : data;
                    if (data === -1) {
                        data = BackpackRegistry.nextUnique++;
                        item.extra.putInt("__backpack_id", data);
                        if (!notUpdateData)
                            Player.setCarriedItem(item.id, item.count, item.data, item.extra);
                    }
                    containerID = "e" + data;
                    container = this.containers[containerID];
                    if (!container) { // For backward compatibility
                        containerID = "d" + data;
                        container = this.containers[containerID];
                    }
                    break;
            }
            if (!container) {
                container = new UI.Container();
                this.containers[containerID] = container;
            }
            container.openAs(prototype.gui);
            return containerID;
        }
        Logger.Log("item is not a backpack", "ERROR");
        return null;
    };
    ;
    /**
     * Checks whether the item is backpack or not.
     * @param id - item id
     * @returns whether the item is backpack or not
     */
    BackpackRegistry.isBackpack = function (id) {
        return !!this.prototypes[id];
    };
    /**
     * Helper function for adding items to the gui.
     * @param gui - gui to which slots will be added
     * @param slots - amount of slots
     * @param isValidFunc - validation function
     * @param inRow - Amount of slots in one row
     * @param center - Do the slots center?
     * @param x - Initial x coordinate. Ignored if the center argument is true
     * @param y - Initial y coordinate.
     * @returns gui.
     */
    BackpackRegistry.addSlotsToGui = function (gui, slots, isValidFunc, inRow, center, x, y) {
        if (x === void 0) { x = 345; }
        if (y === void 0) { y = 70; }
        var content = gui.getContent();
        x = center ? 300 + (700 - inRow * 61) / 2 : x;
        for (var i = 0; i < slots; i++) {
            content.elements["slot" + (i + 1)] = {
                type: "slot",
                x: x + i % inRow * 61,
                y: y + Math.floor(i / inRow) * 61,
                isValid: isValidFunc
            };
        }
        return gui;
    };
    /**
     * Next unique backpack identifier.
     */
    BackpackRegistry.nextUnique = 1;
    /**
     * Containers of backpacks. Key is 'dIdentifier'. For example, 'd1'.
     */
    BackpackRegistry.containers = {};
    /**
     * Object that store prototypes of backpacks. Key is backpack id.
     */
    BackpackRegistry.prototypes = {};
    return BackpackRegistry;
}());
EXPORT("BackpackRegistry", BackpackRegistry);
Callback.addCallback("LevelLoaded", function () {
    for (var id in BackpackRegistry.prototypes) {
        var prototype = BackpackRegistry.prototypes[id];
        if (!prototype.title) {
            continue;
        }
        var gui = prototype.gui;
        if (gui.getWindow) {
            var header = gui.getWindow("header");
            if (header) {
                var drawing = header.contentProvider.drawing[2];
                if (drawing) {
                    drawing.text = Translation.translate(prototype.title);
                }
            }
        }
    }
});

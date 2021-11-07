var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
LIBRARY({
    name: "TileRender",
    version: 21,
    shared: true,
    api: "CoreEngine"
});
var TileRenderer;
(function (TileRenderer) {
    var EntityGetYaw = ModAPI.requireGlobal("Entity.getYaw");
    var EntityGetPitch = ModAPI.requireGlobal("Entity.getPitch");
    TileRenderer.modelData = {};
    function createBlockModel(id, data, boxes) {
        var e_1, _a;
        var render = new ICRender.Model();
        var model = BlockRenderer.createModel();
        try {
            for (var boxes_1 = __values(boxes), boxes_1_1 = boxes_1.next(); !boxes_1_1.done; boxes_1_1 = boxes_1.next()) {
                var box = boxes_1_1.value;
                model.addBox(box[0], box[1], box[2], box[3], box[4], box[5], id, data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (boxes_1_1 && !boxes_1_1.done && (_a = boxes_1.return)) _a.call(boxes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        render.addEntry(model);
        return render;
    }
    TileRenderer.createBlockModel = createBlockModel;
    function setStaticModel(id, data, boxes) {
        var model = createBlockModel(id, data, boxes);
        BlockRenderer.setStaticICRender(id, data, model);
    }
    TileRenderer.setStaticModel = setStaticModel;
    function getRotatedBoxVertexes(box, rotation) {
        switch (rotation) {
            case 0:
                return box;
            case 1:
                return [1 - box[3], box[1], 1 - box[5], 1 - box[0], box[4], 1 - box[2]]; // rotate 180°
            case 2:
                return [box[2], box[1], 1 - box[3], box[5], box[4], 1 - box[0]]; // rotate 270°
            case 3:
                return [1 - box[5], box[1], box[0], 1 - box[2], box[4], box[3]]; // rotate 90°
        }
    }
    TileRenderer.getRotatedBoxVertexes = getRotatedBoxVertexes;
    function setStaticModelWithRotation(id, boxes) {
        var e_2, _a;
        for (var data = 0; data < 4; data++) {
            var newBoxes = [];
            try {
                for (var boxes_2 = (e_2 = void 0, __values(boxes)), boxes_2_1 = boxes_2.next(); !boxes_2_1.done; boxes_2_1 = boxes_2.next()) {
                    var box = boxes_2_1.value;
                    newBoxes.push(getRotatedBoxVertexes(box, data));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (boxes_2_1 && !boxes_2_1.done && (_a = boxes_2.return)) _a.call(boxes_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            setStaticModel(id, data, newBoxes);
        }
    }
    TileRenderer.setStaticModelWithRotation = setStaticModelWithRotation;
    function setCollisionShape(id, data, boxes, setRaycastShape) {
        if (setRaycastShape === void 0) { setRaycastShape = true; }
        var shape = new ICRender.CollisionShape();
        for (var i in boxes) {
            var box = boxes[i];
            shape.addEntry().addBox(box[0], box[1], box[2], box[3], box[4], box[5]);
        }
        BlockRenderer.setCustomCollisionShape(id, data, shape);
        if (setRaycastShape)
            BlockRenderer.setCustomRaycastShape(id, data, shape);
    }
    TileRenderer.setCollisionShape = setCollisionShape;
    function setShapeWithRotation(id, data, boxes) {
        var e_3, _a;
        for (var i = 0; i < 4; i++) {
            var newBoxes = [];
            try {
                for (var boxes_3 = (e_3 = void 0, __values(boxes)), boxes_3_1 = boxes_3.next(); !boxes_3_1.done; boxes_3_1 = boxes_3.next()) {
                    var box = boxes_3_1.value;
                    newBoxes.push(getRotatedBoxVertexes(box, i));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (boxes_3_1 && !boxes_3_1.done && (_a = boxes_3.return)) _a.call(boxes_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
            setStaticModel(id, data + i, newBoxes);
            setCollisionShape(id, data + i, newBoxes);
        }
    }
    TileRenderer.setShapeWithRotation = setShapeWithRotation;
    function setEmptyCollisionShape(id) {
        var shape = new ICRender.CollisionShape();
        shape.addEntry().addBox(1, 1, 1, 0, 0, 0);
        BlockRenderer.setCustomCollisionShape(id, -1, shape);
    }
    TileRenderer.setEmptyCollisionShape = setEmptyCollisionShape;
    function setStandardModel(id, data, texture) {
        var render = new ICRender.Model();
        var model = BlockRenderer.createTexturedBlock(texture);
        render.addEntry(model);
        BlockRenderer.enableCoordMapping(id, data, render);
    }
    TileRenderer.setStandardModel = setStandardModel;
    function setStandardModelWithRotation(id, data, texture, hasVertical) {
        var variations = [
            [texture[3], texture[2], texture[0], texture[1], texture[4], texture[5]],
            [texture[2], texture[3], texture[1], texture[0], texture[5], texture[4]],
            [texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
            [texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
            [texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]],
            [texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]],
        ];
        var startIndex = hasVertical ? 0 : 2;
        for (var i = startIndex; i < 6; i++) {
            setStandardModel(id, data + i - startIndex, variations[i]);
        }
        if (hasVertical) {
            setHandAndUiModel(id, data, variations[3]);
        }
    }
    TileRenderer.setStandardModelWithRotation = setStandardModelWithRotation;
    /** @deprecated use setStandardModel instead*/
    function setStandartModel(id, texture, data) {
        if (data === void 0) { data = 0; }
        setStandardModel(id, data, texture);
    }
    TileRenderer.setStandartModel = setStandartModel;
    function setHandAndUiModel(id, data, texture) {
        var model = BlockRenderer.createTexturedBlock(texture);
        ItemModel.getFor(id, data).setHandModel(model);
        ItemModel.getFor(id, data).setUiModel(model);
    }
    TileRenderer.setHandAndUiModel = setHandAndUiModel;
    function registerRenderModel(id, data, texture) {
        var _a;
        var render = new ICRender.Model();
        var model = BlockRenderer.createTexturedBlock(texture);
        render.addEntry(model);
        (_a = TileRenderer.modelData[id]) !== null && _a !== void 0 ? _a : (TileRenderer.modelData[id] = {});
        TileRenderer.modelData[id][data] = render;
    }
    TileRenderer.registerRenderModel = registerRenderModel;
    function registerModelWithRotation(id, data, texture, hasVertical) {
        var variations = [
            [texture[3], texture[2], texture[0], texture[1], texture[4], texture[5]],
            [texture[2], texture[3], texture[1], texture[0], texture[5], texture[4]],
            [texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
            [texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
            [texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]],
            [texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]]
        ];
        var startIndex = hasVertical ? 0 : 2;
        for (var i = startIndex; i < 6; i++) {
            registerRenderModel(id, data + i - startIndex, variations[i]);
        }
    }
    TileRenderer.registerModelWithRotation = registerModelWithRotation;
    /** @deprecated use registerModelWithRotation instead*/
    function registerRotationModel(id, data, texture) {
        registerModelWithRotation(id, data, texture);
    }
    TileRenderer.registerRotationModel = registerRotationModel;
    /** @deprecated use registerModelWithRotation instead*/
    function registerFullRotationModel(id, data, texture) {
        if (texture.length == 2) {
            for (var i = 0; i < 6; i++) {
                var textures = [];
                for (var j = 0; j < 6; j++) {
                    if (j == i)
                        textures.push(texture[1]);
                    else
                        textures.push(texture[0]);
                }
                registerRenderModel(id, i + data, textures);
            }
        }
        else {
            registerModelWithRotation(id, data, texture, true);
        }
    }
    TileRenderer.registerFullRotationModel = registerFullRotationModel;
    function getRenderModel(id, data) {
        var models = TileRenderer.modelData[id];
        if (models) {
            return models[data];
        }
        return null;
    }
    TileRenderer.getRenderModel = getRenderModel;
    /** Client-side only */
    function mapAtCoords(x, y, z, id, data) {
        var model = getRenderModel(id, data);
        if (model) {
            BlockRenderer.mapAtCoords(x, y, z, model);
        }
    }
    TileRenderer.mapAtCoords = mapAtCoords;
    function getBlockRotation(player, hasVertical) {
        var pitch = EntityGetPitch(player);
        if (hasVertical) {
            if (pitch < -45)
                return 0;
            if (pitch > 45)
                return 1;
        }
        var rotation = Math.floor((EntityGetYaw(player) - 45) % 360 / 90);
        if (rotation < 0)
            rotation += 4;
        rotation = [5, 3, 4, 2][rotation];
        return rotation;
    }
    TileRenderer.getBlockRotation = getBlockRotation;
    function setRotationFunction(id, hasVertical, placeSound) {
        Block.registerPlaceFunction(id, function (coords, item, block, player, region) {
            var place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
            var rotation = getBlockRotation(player, hasVertical);
            region.setBlock(place.x, place.y, place.z, item.id, rotation);
            World.playSound(place.x, place.y, place.z, placeSound || "dig.stone", 1, 0.8);
            return place;
        });
    }
    TileRenderer.setRotationFunction = setRotationFunction;
    /** @deprecated */
    function setRotationPlaceFunction(id, hasVertical, placeSound) {
        Block.registerPlaceFunction(id, function (coords, item, block, player, region) {
            var place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
            region.setBlock(place.x, place.y, place.z, item.id, 0);
            World.playSound(place.x, place.y, place.z, placeSound || "dig.stone", 1, 0.8);
            var rotation = getBlockRotation(player, hasVertical);
            if (!hasVertical)
                rotation -= 2;
            var tile = World.addTileEntity(place.x, place.y, place.z, region);
            tile.data.meta = rotation;
            mapAtCoords(place.x, place.y, place.z, item.id, rotation);
            return place;
        });
    }
    TileRenderer.setRotationPlaceFunction = setRotationPlaceFunction;
    function setupWireModel(id, data, width, groupName, preventSelfAdd) {
        var e_4, _a;
        var render = new ICRender.Model();
        var shape = new ICRender.CollisionShape();
        var group = ICRender.getGroup(groupName);
        if (!preventSelfAdd) {
            group.add(id, data);
        }
        // connections
        width /= 2;
        var boxes = [
            { side: [1, 0, 0], box: [0.5 + width, 0.5 - width, 0.5 - width, 1, 0.5 + width, 0.5 + width] },
            { side: [-1, 0, 0], box: [0, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width] },
            { side: [0, 1, 0], box: [0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width, 1, 0.5 + width] },
            { side: [0, -1, 0], box: [0.5 - width, 0, 0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width] },
            { side: [0, 0, 1], box: [0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, 1] },
            { side: [0, 0, -1], box: [0.5 - width, 0.5 - width, 0, 0.5 + width, 0.5 + width, 0.5 - width] }
        ];
        try {
            for (var boxes_4 = __values(boxes), boxes_4_1 = boxes_4.next(); !boxes_4_1.done; boxes_4_1 = boxes_4.next()) {
                var box = boxes_4_1.value;
                // render
                var model_1 = BlockRenderer.createModel();
                model_1.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data);
                var condition = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false);
                render.addEntry(model_1).setCondition(condition);
                // collision shape
                var entry_1 = shape.addEntry();
                entry_1.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5]);
                entry_1.setCondition(condition);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (boxes_4_1 && !boxes_4_1.done && (_a = boxes_4.return)) _a.call(boxes_4);
            }
            finally { if (e_4) throw e_4.error; }
        }
        // central box
        var model = BlockRenderer.createModel();
        model.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, id, data);
        render.addEntry(model);
        var entry = shape.addEntry();
        entry.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width);
        BlockRenderer.setStaticICRender(id, data, render);
        BlockRenderer.setCustomCollisionShape(id, data, shape);
        BlockRenderer.setCustomRaycastShape(id, data, shape);
        var itemModel = new BlockRenderer.Model(0, 0.5 - width, 0.5 - width, 1, 0.5 + width, 0.5 + width, id, data);
        ItemModel.getFor(id, data).setHandModel(itemModel);
        ItemModel.getFor(id, data).setUiModel(itemModel);
    }
    TileRenderer.setupWireModel = setupWireModel;
    function getCropModel(texture) {
        return createBlockModel(texture[0], texture[1], [
            [0.25, 0, 0, 0.25, 1, 1],
            [0.75, 0, 0, 0.75, 1, 1],
            [0, 0, 0.25, 1, 1, 0.25],
            [0, 0, 0.75, 1, 1, 0.75]
        ]);
    }
    TileRenderer.getCropModel = getCropModel;
    /** @deprecated use render types instead */
    function setCropModel(id, data, height) {
        if (height) {
            Block.setShape(id, 0, 0, 0, 1, height, 1, data);
        }
        var shape = new ICRender.CollisionShape();
        shape.addEntry().addBox(1, 1, 1, 0, 0, 0);
        BlockRenderer.setCustomCollisionShape(id, data, shape);
        var render = getCropModel([id, data]);
        BlockRenderer.setStaticICRender(id, data, render);
    }
    TileRenderer.setCropModel = setCropModel;
    var __plantVertex = [
        [0.15, 0, 0.15, 1, 1],
        [0.85, 0, 0.85, 0, 1],
        [0.85, 1, 0.85, 0, 0],
        [0.15, 0, 0.15, 1, 1],
        [0.15, 1, 0.15, 1, 0],
        [0.85, 1, 0.85, 0, 0],
        [0.15, 0, 0.85, 1, 1],
        [0.85, 0, 0.15, 0, 1],
        [0.85, 1, 0.15, 0, 0],
        [0.15, 0, 0.85, 1, 1],
        [0.15, 1, 0.85, 1, 0],
        [0.85, 1, 0.15, 0, 0]
    ];
    /** @deprecated use render types instead */
    function setPlantModel(id, data, texture, meta) {
        if (meta === void 0) { meta = 0; }
        var shape = new ICRender.CollisionShape();
        shape.addEntry().addBox(7 / 8, 1, 7 / 8, 1 / 8, 0, 1 / 8);
        BlockRenderer.setCustomCollisionShape(id, data, shape);
        var render = new ICRender.Model();
        var mesh = new RenderMesh();
        mesh.setBlockTexture(texture, meta);
        for (var i = 0; i < 12; i++) {
            var poly = __plantVertex[i];
            mesh.addVertex(poly[0], poly[1], poly[2], poly[3], poly[4]);
        }
        for (var i = 11; i >= 0; i--) {
            var poly = __plantVertex[i];
            mesh.addVertex(poly[0], poly[1], poly[2], poly[3], poly[4]);
        }
        render.addEntry(mesh);
        BlockRenderer.setStaticICRender(id, data, render);
    }
    TileRenderer.setPlantModel = setPlantModel;
    /** @deprecated not supported */
    function setSlabShape() { }
    TileRenderer.setSlabShape = setSlabShape;
    /** @deprecated not supported */
    function setSlabPlaceFunction() { }
    TileRenderer.setSlabPlaceFunction = setSlabPlaceFunction;
})(TileRenderer || (TileRenderer = {}));
EXPORT("TileRenderer", TileRenderer);

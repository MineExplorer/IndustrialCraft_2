LIBRARY({
	name: "TileRender",
	version: 13,
	shared: true,
	api: "CoreEngine"
});

var EntityGetYaw = ModAPI.requireGlobal("Entity.getYaw");
var EntityGetPitch = ModAPI.requireGlobal("Entity.getPitch");

// block place fix
function canTileBeReplaced(id, data) {
	if(id == 175 && (data%8 == 2 || data%8 == 3)) return true;
    return CONSTANT_REPLACEABLE_TILES[id] || false;
}
var canTileBeReplaced = ModAPI.requireGlobal("canTileBeReplaced = "+uneval(canTileBeReplaced));
var CONSTANT_REPLACEABLE_TILES = ModAPI.requireGlobal("CONSTANT_REPLACEABLE_TILES");
CONSTANT_REPLACEABLE_TILES[51] = true;
CONSTANT_REPLACEABLE_TILES[78] = true;
CONSTANT_REPLACEABLE_TILES[106] = true;
let VANILLA_UI_TILES = ModAPI.requireGlobal("CONSTANT_VANILLA_UI_TILES");
VANILLA_UI_TILES[25] = true;
VANILLA_UI_TILES[26] = true;
VANILLA_UI_TILES[92] = true;
VANILLA_UI_TILES[93] = true;
VANILLA_UI_TILES[94] = true;
VANILLA_UI_TILES[107] = true;
VANILLA_UI_TILES[117] = true;
VANILLA_UI_TILES[122] = true;
VANILLA_UI_TILES[125] = true;
VANILLA_UI_TILES[130] = true;
VANILLA_UI_TILES[138] = true;
VANILLA_UI_TILES[143] = true;
VANILLA_UI_TILES[146] = true;
VANILLA_UI_TILES[149] = true;
VANILLA_UI_TILES[150] = true;
VANILLA_UI_TILES[151] = true;
VANILLA_UI_TILES[154] = true;
VANILLA_UI_TILES[158] = false;
VANILLA_UI_TILES[178] = true;
VANILLA_UI_TILES[183] = true;
VANILLA_UI_TILES[184] = true;
VANILLA_UI_TILES[185] = true;
VANILLA_UI_TILES[186] = true;
VANILLA_UI_TILES[187] = true;
VANILLA_UI_TILES[193] = true;
VANILLA_UI_TILES[194] = true;
VANILLA_UI_TILES[195] = true;
VANILLA_UI_TILES[196] = true;
VANILLA_UI_TILES[197] = true;

var TileRenderer = {
	data: {},
	
	setStandartModel: function(id, texture, rotation){
		if(rotation){
			var textures = [
				[texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
				[texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
				[texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]],
				[texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]]
			]
			for(var i = 0; i < 4; i++){
				var render = new ICRender.Model();
				var model = BlockRenderer.createTexturedBlock(textures[i]);
				render.addEntry(model);
				BlockRenderer.enableCoordMapping(id, i, render);
			}
		}else{
			var render = new ICRender.Model();
			var model = BlockRenderer.createTexturedBlock(texture);
			render.addEntry(model);
			BlockRenderer.enableCoordMapping(id, -1, render);
		}
	},
	
	registerRenderModel: function(id, data, texture){
		var render = new ICRender.Model();
		var model = BlockRenderer.createTexturedBlock(texture);
		render.addEntry(model);
		if(!this.data[id]) this.data[id] = {};
		this.data[id][data] = render;
	},
	
	registerRotationModel: function(id, data, texture, reverse){
		reverse = reverse || 0;
		var textures = [
			[texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
			[texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
			[texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]],
			[texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]]
		]
		for(var i = 0; i < 4; i++){
			this.registerRenderModel(id, i + data + reverse * Math.pow(-1, i), textures[i]);
		}
	},
	
	registerFullRotationModel: function(id, data, texture){
		if(texture.length == 2){
			for(var i = 0; i < 6; i++){
				var textures = [];
				for(var j = 0; j < 6; j++){
					if(j == i) textures.push(texture[1]);
					else textures.push(texture[0]);
				}
				this.registerRenderModel(id, i + data, textures);
			}
		}else{
			var textures = [
				[texture[3], texture[2], texture[0], texture[1], texture[4], texture[5]],
				[texture[2], texture[3], texture[1], texture[0], texture[5], texture[4]],
				[texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
				[texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
				[texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]],
				[texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]],
			]
			for(var i = 0; i < 6; i++){
				this.registerRenderModel(id, i + data, textures[i]);
			}
		}
	},
	
	getRenderModel: function(id, data){
		var models = this.data[id];
		if(models){
			return models[data];
		}
		return 0;
	},
	
	mapAtCoords: function(x, y, z, id, data){
		var model = this.getRenderModel(id, data);
		if(model){
			BlockRenderer.mapAtCoords(x, y, z, model);
		}
	},
	
	getBlockRotation: function(isFull){
		var pitch = EntityGetPitch(Player.get());
		if(isFull){
			if(pitch < -45) return 0;
			if(pitch > 45) return 1;
		}
		var rotation = Math.floor((EntityGetYaw(Player.get())-45)%360 / 90);
		if(rotation < 0) rotation += 4;
		rotation = [3, 1, 2, 0][rotation];
		if(isFull) return rotation + 2;
		return rotation;
	},

	setRotationPlaceFunction: function(id, fullRotation){
		Block.registerPlaceFunction(id, function(coords, item, block){
			var place = canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
			World.setBlock(place.x, place.y, place.z, item.id, 0);
			var rotation = TileRenderer.getBlockRotation(fullRotation);
			var tile = World.addTileEntity(place.x, place.y, place.z);
			tile.data.meta = rotation;
			TileRenderer.mapAtCoords(place.x, place.y, place.z, item.id, rotation);
		});
	},
	
	setupWireModel: function(id, data, width, groupName, preventSelfAdd) {
		var render = new ICRender.Model();
		var shape = new ICRender.CollisionShape();

		var group = ICRender.getGroup(groupName);
		if (!preventSelfAdd) {
			group.add(id, data);
		}
		
		// connections
		width /= 2;
		var boxes = [
			{side: [1, 0, 0], box: [0.5 + width, 0.5 - width, 0.5 - width, 1, 0.5 + width, 0.5 + width]},
			{side: [-1, 0, 0], box: [0, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width]},
			{side: [0, 1, 0], box: [0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width, 1, 0.5 + width]},
			{side: [0, -1, 0], box: [0.5 - width, 0, 0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width]},
			{side: [0, 0, 1], box: [0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, 1]},
			{side: [0, 0, -1], box: [0.5 - width, 0.5 - width, 0, 0.5 + width, 0.5 + width, 0.5 - width]},
		]
		
		for (var i in boxes) {
			var box = boxes[i];
			// render
			var model = BlockRenderer.createModel();
			model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data);
			var condition = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false);
			render.addEntry(model).setCondition(condition);
			// collision shape
			var entry = shape.addEntry();
			entry.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5]);
			entry.setCondition(condition);
		}
		
		// central box
		var model = BlockRenderer.createModel();
		model.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, id, data);
		render.addEntry(model);
		
		var entry = shape.addEntry();
		entry.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width);
		
		width = Math.max(width, 0.25);
		Block.setShape(id, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, data);
		
		BlockRenderer.setStaticICRender(id, data, render);
		BlockRenderer.setCustomCollisionShape(id, data, shape);
	},
	
	__plantVertex: [
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
	],
	
	setPlantModel: function(id, data, texture, meta){
		var shape = new ICRender.CollisionShape();
		shape.addEntry().addBox(7/8, 1, 7/8, 1/8, 0, 1/8);
		BlockRenderer.setCustomCollisionShape(id, data, shape);
		var render = new ICRender.Model();
		var mesh = new RenderMesh();
		mesh.setBlockTexture(texture, meta || 0);
		for(var i = 0; i < 12; i++){
			var poly = this.__plantVertex[i];
			mesh.addVertex(poly[0], poly[1], poly[2], poly[3], poly[4]);
		}
		for(var i = 11; i >= 0; i--){
			var poly = this.__plantVertex[i];
			mesh.addVertex(poly[0], poly[1], poly[2], poly[3], poly[4]);
		}
		render.addEntry(mesh);
		BlockRenderer.setStaticICRender(id, data, render);	
	},
	
	setCropModel: function(id, data, height){
		if(height){
			Block.setShape(id, 0, 0, 0, 1, height, 1, data);
		}
		var shape = new ICRender.CollisionShape();
		shape.addEntry().addBox(1, 1, 1, 0, 0, 0);
		BlockRenderer.setCustomCollisionShape(id, data, shape);
		var render = new ICRender.Model();
		var model = BlockRenderer.createModel();
		model.addBox(0.25, 0, 0, 0.25, 1, 1, id, data);
		model.addBox(0.75, 0, 0, 0.75, 1, 1, id, data);
		model.addBox(0, 0, 0.25, 1, 1, 0.25, id, data);
		model.addBox(0, 0, 0.75, 1, 1, 0.75, id, data);
		render.addEntry(model);
		BlockRenderer.setStaticICRender(id, data, render);	
	},
	
	getCropModel:function(texture){   
        var render = new ICRender.Model(); 
        var model = BlockRenderer.createModel(); 
        model.addBox(0.2499, 0.01, 0,0.25, 0.99, 1, texture[0], texture[1]); 
        model.addBox(0, 0.01, 0.2499, 1, 0.99, 0.25, texture[0], texture[1]); 
        model.addBox(0.7499, 0.01, 0, 0.75, 0.99, 1, texture[0], texture[1]); 
        model.addBox(0, 0.01, 0.7499,1, 0.99, 0.75, texture[0], texture[1]); 
        render.addEntry(model); 
        return render; 

    }, 
	
	makeSlab: function(id, fullBlockID, fullBlockData){
		this.setSlabShape(id);
		this.setSlabPlaceFunction(id, fullBlockID, fullBlockData || 0);
	},
	
	setSlabShape: function(id){
		Block.setShape(id, 0, 0, 0, 1, 0.5, 1, 0);
		Block.setShape(id, 0, 0.5, 0, 1, 1, 1, 1);
	},
	
	setSlabPlaceFunction: function(id, fullBlockID, fullBlockData){
		Block.registerPlaceFunction(id, function(coords, item, block){
			Game.prevent();
			if(block.id == item.id && (block.data == (coords.side+1)%2)){
				World.setBlock(coords.x, coords.y, coords.z, fullBlockID, fullBlockData);
				return;
			}
			var x = coords.relative.x
			var y = coords.relative.y
			var z = coords.relative.z
			block = World.getBlock(x, y, z);
			if(canTileBeReplaced(block.id, block.data)){
				if(coords.vec.y - y < 0.5){
					World.setBlock(x, y, z, item.id, 0);
				}
				else {
					World.setBlock(x, y, z, item.id, 1);
				}
			}
		});
	}
}


EXPORT("TileRenderer", TileRenderer);
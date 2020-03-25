ModAPI.addAPICallback("RecipeViewer", function(api){
	let RecipeViewer = api.Core;
	const Bitmap = android.graphics.Bitmap;
	const Canvas = android.graphics.Canvas;
	const Rect = android.graphics.Rect;

	let bmp, cvs, source;
	let x = y = 0;


	RecipeViewer.registerRecipeType("icpe_macerator", {
		contents: {
			icon: BlockID.macerator,
			drawing: [
				{type: "bitmap", x: 430, y: 200, scale: 6, bitmap: "macerator_bar_scale"}
			],
			elements: {
				input0: {type: "slot", x: 280, y: 190, size: 120},
				output0: {type: "slot", x: 600, y: 190, size: 120}
			}
		},
		getList: function(id, data, isUsage){
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("macerator", id, data);
				return result ? [{
					input: [{id: id, count: 1, data: data}],
					output: [result]
				}] : [];
			}
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("macerator");
			let item;
			for(let key in recipe){
				result = recipe[key];
				if(result.id == id && (result.data == data || data == -1)){
					item = key.split(":");
					list.push({
						input: [{id: parseInt(item[0]), count: result.sourceCount || 1, data: parseInt(item[1] || 0)}],
						output: [result]
					});
				}
			}
			return list;
		}
	});


	RecipeViewer.registerRecipeType("icpe_compressor", {
		contents: {
			icon: BlockID.compressor,
			drawing: [
				{type: "bitmap", x: 430, y: 200, scale: 6, bitmap: "compressor_bar_scale"}
			],
			elements: {
				input0: {type: "slot", x: 280, y: 190, size: 120},
				output0: {type: "slot", x: 600, y: 190, size: 120}
			}
		},
		getList: function(id, data, isUsage){
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("compressor", id, data);
				return result ? [{
					input: [{id: id, count: result.sourceCount || 1, data: data}],
					output: [{id: result.id, count: result.count, data: result.data}]
				}] : [];
			}
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("compressor");
			let item;
			for(let key in recipe){
				result = recipe[key];
				if(result.id == id && (result.data == data || data == -1)){
					item = key.split(":");
					list.push({
						input: [{id: parseInt(item[0]), count: result.sourceCount || 1, data: parseInt(item[1] || 0)}],
						output: [{id: result.id, count: result.count, data: result.data}]
					});
				}
			}
			return list;
		}
	});


	RecipeViewer.registerRecipeType("icpe_extractor", {
		contents: {
			icon: BlockID.extractor,
			drawing: [
				{type: "bitmap", x: 430, y: 200, scale: 6, bitmap: "extractor_bar_scale"}
			],
			elements: {
				input0: {type: "slot", x: 280, y: 190, size: 120},
				output0: {type: "slot", x: 600, y: 190, size: 120}
			}
		},
		getList: function(id, data, isUsage){
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("extractor", id);
				return result ? [{
					input: [{id: id, count: 1, data: data}],
					output: [{id: result.id, count: result.count, data: 0}]
				}] : [];
			}
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("extractor");
			for(let key in recipe){
				result = recipe[key];
				if(result.id == id){
					list.push({
						input: [{id: parseInt(key), count: 1, data: 0}],
						output: [{id: result.id, count: result.count, data: 0}]
					});
				}
			}
			return list;
		}
	});


	RecipeViewer.registerRecipeType("icpe_solid_canner", {
		contents: {
			icon: BlockID.conserver,
			drawing: [
				{type: "bitmap", x: 325, y: 205, scale: 6, bitmap: "canner_arrow"},
				{type: "bitmap", x: 520, y: 205, scale: 6, bitmap: "arrow_bar_scale"}
			],
			elements: {
				input0: {type: "slot", x: 200, y: 190, size: 120},
				input1: {type: "slot", x: 390, y: 190, size: 120},
				output0: {type: "slot", x: 660, y: 190, size: 120}
			}
		},
		getList: function(id, data, isUsage){
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("solidCanner");
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("solidCanner", id);
				if(result){
					return [{
						input: [{id: id, count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
						output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
					}];
				}
				for(let key in recipe){
					result = recipe[key];
					if(result.storage[0] == id){
						list.push({
							input: [{id: parseInt(key), count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
							output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
						});
					}
				}
				return list;
			}
			for(let key in recipe){
				result = recipe[key];
				if(result.result[0] == id){
					list.push({
						input: [{id: parseInt(key), count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
						output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
					});
				}
			}
			return list;
		}
	});
	
	
	RecipeViewer.registerRecipeType("icpe_canner", {
		contents: {
			icon: BlockID.canner,
			drawing: [
				{type: "bitmap", x: 200, y: 50, bitmap: "canner_background_recipe", scale: 6},
				{type: "bitmap", x: 194, y: 216, bitmap: "liquid_bar", scale: 6},
				{type: "bitmap", x: 662, y: 216, bitmap: "liquid_bar", scale: 6}
			],
			elements: {
				input0: {type: "slot", x: 200, y: 50, size: 108, bitmap: "default_slot"},
				input1: {type: "slot", x: 434, y: 212, size: 108, bitmap: "canner_slot_source_0"},
				output0: {type: "slot", x: 668, y: 50, size: 108, bitmap: "default_slot"}
			}
		},
		getList: function(id, data, isUsage){
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("solidCanner");
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("solidCanner", id);
				if(result){
					return [{
						input: [{id: id, count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
						output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
					}];
				}
				for(let key in recipe){
					result = recipe[key];
					if(result.storage[0] == id){
						list.push({
							input: [{id: parseInt(key), count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
							output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
						});
					}
				}
				return list;
			}
			for(let key in recipe){
				result = recipe[key];
				if(result.result[0] == id){
					list.push({
						input: [{id: parseInt(key), count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
						output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
					});
				}
			}
			return list;
		}
	});

	let iconMetalFormer = [ItemID.craftingHammer, ItemID.cutter, ItemID.cableCopper0];

	RecipeViewer.registerRecipeType("icpe_metal_former", {
		contents: {
			icon: BlockID.metalFormer,
			drawing: [
				{type: "bitmap", x: 360, y: 220, scale: 6, bitmap: "metalformer_bar_scale"},
				{type: "bitmap", x: 450, y: 320, scale: 6, bitmap: "empty_button_up"}
			],
			elements: {
				slotMode: {type: "slot", x: 445, y: 320, z: 1, size: 112, visual: true, needClean: true, bitmap: "_default_slot_empty", source: {id: 0, count: 0, data: 0}},
				input0: {type: "slot", x: 220, y: 190, size: 120},
				output0: {type: "slot", x: 660, y: 190, size: 120}
			}
		},
		getList: function(id, data, isUsage){
			let list = [];
			let result;
			if(isUsage){
				for(let mode = 0; mode < 3; mode++){
					result = MachineRecipeRegistry.getRecipeResult("metalFormer" + mode, id);
					if(result){
						list.push({
							input: [{id: id, count: 1, data: data}],
							output: [{id: result.id, count: result.count, data: 0}],
							mode: mode
						});
					}
				}
				return list;
			}
			for(let mode = 0; mode < 3; mode++){
				let recipe = MachineRecipeRegistry.requireRecipesFor("metalFormer" + mode);
				for(let key in recipe){
					result = recipe[key];
					if(result.id == id){
						list.push({
							input: [{id: parseInt(key), count: 1, data: 0}],
							output: [{id: result.id, count: result.count, data: 0}],
							mode: mode
						});
					}
				}
			}
			return list;
		},
		onOpen: function(elements, data){
			if(!data){
				return;
			}
			let elem = elements.get("slotMode");
			elem.onBindingUpdated("source", {id: iconMetalFormer[data.mode], count: 1, data: 0});
		}
	});


	bmp = new Bitmap.createBitmap(63, 55, Bitmap.Config.ARGB_8888);
	cvs = new Canvas(bmp);
	source = UI.TextureSource.get("ore_washer_background");
	cvs.drawBitmap(source, new Rect(56, 17, 80, 72), new Rect(0, 0, 24, 55), null);
	cvs.drawBitmap(source, new Rect(80, 34, 119, 55), new Rect(24, 17, 63, 38), null);
	cvs.drawBitmap(UI.TextureSource.get("gui_water_scale"), 4, 4, null);
	cvs.drawBitmap(UI.TextureSource.get("ore_washer_bar_scale"), 42, 18, null);
	RecipeViewer.transparentBackground(bmp, Color.parseColor("#b3b3b3"));
	UI.TextureSource.put("ore_washer_background_edit", bmp);

	RecipeViewer.registerRecipeType("icpe_ore_washer", {
		contents: {
			icon: BlockID.oreWasher,
			drawing: [
				{type: "bitmap", x: 300, y: 110, scale: 5, bitmap: "ore_washer_background_edit"}
			],
			elements: {
				input0: {type: "slot", x: 515, y: 90, size: 90},
				output0: {type: "slot", x: 425, y: 315, size: 90},
				output1: {type: "slot", x: 515, y: 315, size: 90},
				output2: {type: "slot", x: 605, y: 315, size: 90}
			}
		},
		getList: function(id, data, isUsage){
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("oreWasher", id);
				return result ? [{
					input: [{id: id, count: 1, data: data}],
					output: [
						{id: result[0] || 0, count: result[1] || 0, data: 0},
						{id: result[2] || 0, count: result[3] || 0, data: 0},
						{id: result[4] || 0, count: result[5] || 0, data: 0}
					]
				}] : [];
			}
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("oreWasher");
			for(let key in recipe){
				result = recipe[key];
				if(result[0] == id || result[2] == id || result[4] == id){
					list.push({
						input: [{id: parseInt(key), count: 1, data: 0}],
						output: [
							{id: result[0] || 0, count: result[1] || 0, data: 0},
							{id: result[2] || 0, count: result[3] || 0, data: 0},
							{id: result[4] || 0, count: result[5] || 0, data: 0}
						]
					});
				}
			}
			return list;
		}
	});


	bmp = Bitmap.createBitmap(80, 60, Bitmap.Config.ARGB_8888);
	cvs = new Canvas(bmp);
	cvs.drawBitmap(UI.TextureSource.get("thermal_centrifuge_background"), -36, -15, null);
	cvs.drawBitmap(UI.TextureSource.get("thermal_centrifuge_scale"), 44, 7, null);
	cvs.drawBitmap(UI.TextureSource.get("heat_scale"), 28, 48, null);
	cvs.drawBitmap(UI.TextureSource.get("indicator_green"), 52, 44, null);
	RecipeViewer.transparentBackground(bmp, Color.parseColor("#b3b3b3"));
	UI.TextureSource.put("thermal_centrifuge_background_edit", bmp);

	RecipeViewer.registerRecipeType("icpe_thermal_centrifuge", {
		contents: {
			icon: BlockID.thermalCentrifuge,
			drawing: [
				{type: "bitmap", x: 300, y: 100, scale: 5, bitmap: "thermal_centrifuge_background_edit"}
			],
			elements: {
				input0: {type: "slot", x: 200, y: 110, size: 90},
				output0: {type: "slot", x: 710, y: 110, size: 90},
				output1: {type: "slot", x: 710, y: 200, size: 90},
				output2: {type: "slot", x: 710, y: 290, size: 90},
				textHeat: {type: "text", x: 430, y: 410}
			}
		},
		getList: function(id, data, isUsage){
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("thermalCentrifuge", id);
				return result ? [{
					input: [{id: id, count: 1, data: data}],
					output: [
						{id: result.result[0] || 0, count: result.result[1] || 0, data: 0},
						{id: result.result[2] || 0, count: result.result[3] || 0, data: 0},
						{id: result.result[4] || 0, count: result.result[5] || 0, data: 0}
					],
					heat: result.heat
				}] : [];
			}
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("thermalCentrifuge");
			for(let key in recipe){
				result = recipe[key];
				if(result.result[0] == id || result.result[2] == id || result.result[4] == id){
					list.push({
						input: [{id: parseInt(key), count: 1, data: 0}],
						output: [
							{id: result.result[0] || 0, count: result.result[1] || 0, data: 0},
							{id: result.result[2] || 0, count: result.result[3] || 0, data: 0},
							{id: result.result[4] || 0, count: result.result[5] || 0, data: 0}
						],
						heat: result.heat
					});
				}
			}
			return list;
		},
		onOpen: function(elements, data){
			let elem = elements.get("textHeat");
			elem.onBindingUpdated("text", data ? Translation.translate("Heat: ") + data.heat : "");
		}
	});


	bmp = Bitmap.createBitmap(104, 64, Bitmap.Config.ARGB_8888);
	cvs = new Canvas(bmp);
	cvs.drawBitmap(UI.TextureSource.get("blast_furnace_background"), 0, -11, null);
	cvs.drawBitmap(UI.TextureSource.get("progress_scale"), 50, 16, null);
	cvs.drawBitmap(UI.TextureSource.get("heat_scale"), 46, 52, null);
	cvs.drawBitmap(UI.TextureSource.get("indicator_green"), 70, 48, null);
	RecipeViewer.transparentBackground(bmp, Color.parseColor("#b3b3b3"));
	UI.TextureSource.put("blast_furnace_background_edit", bmp);

	RecipeViewer.registerRecipeType("icpe_blast_furnace", {
		contents: {
			icon: BlockID.blastFurnace,
			drawing: [
				{type: "bitmap", x: 200, y: 100, scale: 5, bitmap: "blast_furnace_background_edit"}
			],
			elements: {
				input0: {type: "slot", x: 240, y: 160, size: 90},
				input1: {type: "slot", x: 200, y: 284, size: 90, bitmap: "_default_slot_empty"},
				output0: {type: "slot", x: 730, y: 284, size: 90},
				output1: {type: "slot", x: 820, y: 284, size: 90}
			}
		},
		getList: function(id, data, isUsage){
			let list = [];
			let result, recipe;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("blastFurnace", id);
				if(result){
					return [{
						input: [
							{id: id, count: 1, data: 0},
							{id: ItemID.cellAir, count: 1, data: 0},
						],
						output: [
							{id: result.result[0], count: result.result[1], data: 0},
							{id: result.result[2] || 0, count: result.result[3] || 0, data: 0}
						]
					}];
				}
				if(id == ItemID.cellAir){
					recipe = MachineRecipeRegistry.requireRecipesFor("blastFurnace");
					for(let key in recipe){
						result = recipe[key];
						list.push({
							input: [
								{id: parseInt(key), count: 1, data: 0},
								{id: ItemID.cellAir, count: 1, data: 0},
							],
							output: [
								{id: result.result[0], count: result.result[1], data: 0},
								{id: result.result[2] || 0, count: result.result[3] || 0, data: 0}
							]
						});
					}
					return list;
				}
				return [];
			}
			recipe = MachineRecipeRegistry.requireRecipesFor("blastFurnace");
			for(let key in recipe){
				result = recipe[key];
				if(result.result[0] == id || result.result[2] == id){
					list.push({
						input: [
							{id: parseInt(key), count: 1, data: 0},
							{id: ItemID.cellAir, count: 1, data: 0},
						],
						output: [
							{id: result.result[0], count: result.result[1], data: 0},
							{id: result.result[2] || 0, count: result.result[3] || 0, data: 0}
						]
					});
				}
			}
			return list;
		}
	});


});

let RV: {Core: any, RecipeType: typeof RecipeType, RecipeTypeRegistry: RecipeTypeRegistry};

ModAPI.addAPICallback("RecipeViewer", (api: typeof RV) => {

	RV = api;

	const Bitmap = android.graphics.Bitmap;


	abstract class RecipeTypeForICPE extends api.RecipeType {

		constructor(name: string, icon: number, content: {params?: UI.BindingsSet, drawing?: UI.DrawingSet, elements: {[key: string]: object}}) {
			content.params ??= {};
			content.drawing ??= [];
			content.params.slot = "classic_slot";
			content.drawing.unshift({type: "frame", x: 0, y: 0, width: 1000, height: 540, bitmap: "classic_frame_bg_light", scale: 2});
			super(Translation.translate(name), icon, content);
		}

	}


	class BasicMachineRecipe extends RecipeTypeForICPE {

		constructor(private recipeKey: string, name: string, icon: number, scaleBmp: string) {
			super(name, icon, {
				drawing: [
					{type: "bitmap", x: 430, y: 200, scale: 6, bitmap: scaleBmp}
				],
				elements: {
					input0: {x: 280, y: 190, size: 120},
					output0: {x: 600, y: 190, size: 120}
				}
			});
		}

		getAllList(): RecipePattern[] {
			const list: RecipePattern[] = [];
			const recipe: {[key: string]: MachineRecipeRegistry.RecipeData} = MachineRecipeRegistry.requireRecipesFor(this.recipeKey);
			let input: string[];
			for (let key in recipe) {
				input = key.split(":");
				list.push({
					input: [{id: +input[0], count: recipe[key].sourceCount || 1, data: +input[1] || 0}],
					output: [{id: recipe[key].id, count: recipe[key].count || 0, data: recipe[key].data || 0}]
				});
			}
			return list;
		}

	}

	api.RecipeTypeRegistry.register("icpe_macerator", new BasicMachineRecipe("macerator", "Macerator", BlockID.macerator, "macerator_bar_scale"));
	api.RecipeTypeRegistry.register("icpe_compressor", new BasicMachineRecipe("compressor", "Compressor", BlockID.compressor, "compressor_bar_scale"));
	api.RecipeTypeRegistry.register("icpe_extractor", new BasicMachineRecipe("extractor", "Extractor", BlockID.extractor, "extractor_bar_scale"));


	class SolidCannerRecipe extends RecipeTypeForICPE {

		constructor() {
			super("Solid Canning", BlockID.solidCanner, {
				drawing: [
					{type: "bitmap", x: 209 + 20 * 6, y: 200 + 1 * 6, scale: 6, bitmap: "solid_canner_arrow"},
					{type: "bitmap", x: 209 + 54 * 6, y: 200 + 2 * 6, scale: 6, bitmap: "arrow_bar_scale"}
				],
				elements: {
					input0: {x: 209, y: 200, size: 18 * 6},
					input1: {x: 209 + 31 * 6, y: 200, size: 18 * 6},
					output0: {x: 209 + 79 * 6, y: 200, size: 18 * 6}
				}
			});
		}

		getAllList(): RecipePattern[] {
			const list: RecipePattern[] = [];
			const recipe: {[key: string]: {can: number, result: ItemInstance}} = MachineRecipeRegistry.requireRecipesFor("solidCanner");
			let input: string[];
			for (let key in recipe) {
				input = key.split(":");
				list.push({
					input: [
						{id: +input[0], count: 1, data: +input[1] || 0},
						{id: recipe[key].can, count: 1, data: 0}
					],
					output: [recipe[key].result]
				});
			}
			return list;
		}

	}

	api.RecipeTypeRegistry.register("icpe_solidCanner", new SolidCannerRecipe());


	class CannerRecipe extends RecipeTypeForICPE {

		constructor() {
			super("Canning", BlockID.canner, {
				drawing: [
					{type: "bitmap", x: 212 + 34 * 6, y: 20 + 6 * 6, scale: 6, bitmap: "extractor_bar_scale"},
					{type: "bitmap", x: 212 - 1 * 6, y: 20 + 26 * 6, scale: 6, bitmap: "liquid_bar"},
					{type: "bitmap", x: 212 + 77 * 6, y: 20 + 26 * 6, scale: 6, bitmap: "liquid_bar"},
				],
				elements: {
					input0: {x: 212, y: 20, size: 18 * 6},
					input1: {x: 212 + 39 * 6, y: 20 + 27 * 6, z: 2, size: 18 * 6, bitmap: "_default_slot_empty"},
					output0: {x: 212 + 78 * 6, y: 20, size: 18 * 6},
					inputLiq0: {x: 212 + 3 * 6, y: 20 + 30 * 6, width: 12 * 6, height: 47 * 6, scale: 6, overlay: "gui_liquid_storage_overlay"},
					outputLiq0: {x: 212 + 81 * 6, y: 20 + 30 * 6, width: 12 * 6, height: 47 * 6, scale: 6, overlay: "gui_liquid_storage_overlay"},
					background: {type: "scale", x: 212 + 18 * 6, y: 20, scale: 6, bitmap: "canner_background_0", value: 1},
					slotBack: {type: "scale", x: 212 + 39 * 6, y: 20 + 27 * 6, z: 1, scale: 6, bitmap: "canner_slot_source_0", value: 1},
					mode: {type: "scale", x: 212 + 21 * 6, y: 20 + 63 * 6, scale: 6, bitmap: "canner_mode_0", value: 1}
				}
			});
			this.setTankLimit(8000);
		}

		getAllList(): RecipePattern[] {
			const list: RecipePattern[] = [];
			const solidRecipe: {[key: string]: {can: number, result: ItemInstance}} = MachineRecipeRegistry.requireRecipesFor("solidCanner");
			let item: string[];
			for (let key in solidRecipe) {
				item = key.split(":");
				list.push({
					input: [
						{id: solidRecipe[key].can, count: 1, data: 0},
						{id: +item[0], count: 1, data: +item[1] || 0}
					],
					output: [solidRecipe[key].result],
					mode: 0
				});
			}
			const fluidRecipe: {input: [string, {id: number, count: number}], output: string}[] = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
			for (let i = 0; i < fluidRecipe.length; i++) {
				list.push({
					input: [
						null,
						{id: fluidRecipe[i].input[1].id, count: fluidRecipe[i].input[1].count, data: 0}
					],
					inputLiq: [{liquid: fluidRecipe[i].input[0], amount: 1000}],
					outputLiq: [{liquid: fluidRecipe[i].output, amount: 1000}],
					mode: 3
				});
			}
			let full: ItemInstance;
			let empty: ItemInstance;
			for (let key in LiquidRegistry.EmptyByFull) {
				item = key.split(":");
				full = {id: +item[0], count: 1, data: +item[1] || 0};
				empty = {id: LiquidRegistry.EmptyByFull[key].id, count: 1, data: LiquidRegistry.EmptyByFull[key].data || 0};
				list.push({
					input: [full],
					output: [empty],
					outputLiq: [{liquid: LiquidRegistry.EmptyByFull[key].liquid, amount: 1000}],
					mode: 1
				});
				list.push({
					input: [empty],
					output: [full],
					inputLiq: [{liquid: LiquidRegistry.EmptyByFull[key].liquid, amount: 1000}],
					mode: 2
				});
			}
			return list;
		}

		onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
			elements.get("background").setBinding("texture", "canner_background_" + recipe.mode);
			elements.get("slotBack").setBinding("texture", "canner_slot_source_" + recipe.mode);
			elements.get("mode").setBinding("texture", "canner_mode_" + recipe.mode);
		}

	}

	api.RecipeTypeRegistry.register("icpe_canner", new CannerRecipe());


	class MetalFormerRecipe extends RecipeTypeForICPE {

		constructor() {
			super("Metal Former", BlockID.metalFormer, {
				drawing: [
					{type: "bitmap", x: 360, y: 220, scale: 6, bitmap: "metalformer_bar_scale"}
				],
				elements: {
					mode: {type: "scale", x: 445, y: 320, bitmap: "metal_former_button_0", scale: 6, value: 1},
					input0: {x: 220, y: 190, size: 120},
					output0: {x: 660, y: 190, size: 120}
				}
			});
		}

		getAllList(): RecipePattern[] {
			const list: RecipePattern[] = [];
			let recipe: {[key: string]: MachineRecipeRegistry.RecipeData};
			let input: string[];
			for (let mode = 0; mode < 3; mode++) {
				recipe = MachineRecipeRegistry.requireRecipesFor("metalFormer" + mode);
				for (let key in recipe) {
					input = key.split(":");
					list.push({
						input: [{id: +input[0], count: recipe[key].sourceCount || 1, data: +input[1] || 0}],
						output: [{id: recipe[key].id, count: recipe[key].count || 0, data: recipe[key].data || 0}],
						mode: mode
					});
				}
			}
			return list;
		}

		onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
			elements.get("mode").setBinding("texture", "metal_former_button_" + recipe.mode);
		}

	}

	api.RecipeTypeRegistry.register("icpe_metalFormer", new MetalFormerRecipe());


	const numArray2Output = (arr: number[]): ItemInstance[] => {
		const output: ItemInstance[] = [];
		for (let i = 0; i < arr.length; i += 2) {
			output.push({id: arr[i], count: arr[i + 1], data: 0});
		}
		return output;
	};


	UI.TextureSource.put("ore_washer_background_trim", Bitmap.createBitmap(UI.TextureSource.get("ore_washer_background"), 56, 17, 63, 55, null, true));

	class OreWasherRecipe extends RecipeTypeForICPE {

		constructor() {
			super("Ore Washing", BlockID.oreWasher, {
				drawing: [
					{type: "bitmap", x: 263, y: 110, scale: 6, bitmap: "ore_washer_background_trim"},
					{type: "bitmap", x: 263 + 42 * 6, y: 110 + 18 * 6, scale: 6, bitmap: "ore_washer_bar_scale"}
				],
				elements: {
					inputLiq0: {x: 263 + 4 * 6, y: 110 + 4 * 6, width: 12 * 6, height: 47 * 6, scale: 6, overlay: "gui_liquid_storage_overlay"},
					input0: {x: 263 + 43 * 6, y: 110 - 4 * 6, size: 18 * 6},
					output0: {x: 263 + 25 * 6, y: 110 + 41 * 6, size: 18 * 6},
					output1: {x: 263 + 43 * 6, y: 110 + 41 * 6, size: 18 * 6},
					output2: {x: 263 + 61 * 6, y: 110 + 41 * 6, size: 18 * 6}
				}
			});
			this.setTankLimit(8000);
		}

		getAllList(): RecipePattern[] {
			const list: RecipePattern[] = [];
			const recipe: {[key: string]: number[]} = MachineRecipeRegistry.requireRecipesFor("oreWasher");
			let input: string[];
			for (let key in recipe) {
				input = key.split(":");
				list.push({
					input: [{id: +input[0], count: 1, data: +input[1] || 0}],
					output: numArray2Output(recipe[key]),
					inputLiq: [{liquid: "water", amount: 1000}]
				});
			}
			return list;
		}

	}

	api.RecipeTypeRegistry.register("icpe_oreWasher", new OreWasherRecipe());


	class ThermalCentrifugeRecipe extends RecipeTypeForICPE {

		constructor() {
			super("Thermal Centrifuge", BlockID.thermalCentrifuge, {
				drawing: [
					{type: "bitmap", x: 314, y: 100, scale: 6, bitmap: "thermal_centrifuge_background"},
					{type: "bitmap", x: 314 + 44 * 6, y: 100 + 7 * 6, scale: 6, bitmap: "thermal_centrifuge_scale"},
					{type: "bitmap", x: 314 + 28 * 6, y: 100 + 48 * 6, scale: 6, bitmap: "heat_scale"},
					{type: "bitmap", x: 314 + 52 * 6, y: 100 + 44 * 6, scale: 6, bitmap: "indicator_green"}
				],
				elements: {
					input0: {type: "slot", x: 314 - 20 * 6, y: 100 + 2 * 6, size: 18 * 6},
					output0: {type: "slot", x: 314 + 82 * 6, y: 100 + 2 * 6, size: 18 * 6},
					output1: {type: "slot", x: 314 + 82 * 6, y: 100 + 20 * 6, size: 18 * 6},
					output2: {type: "slot", x: 314 + 82 * 6, y: 100 + 38 * 6, size: 18 * 6},
					textHeat: {type: "text", x: 314 + 26 * 6, y: 100 + 62 * 6, font: {size: 40, color: Color.WHITE, shadow: 0.5}}
				}
			});
		}

		getAllList(): RecipePattern[] {
			const list: RecipePattern[] = [];
			const recipe: {[key: string]: {result: number[], heat: number}} = MachineRecipeRegistry.requireRecipesFor("thermalCentrifuge");
			let input: string[];
			for (let key in recipe) {
				input = key.split(":");
				list.push({
					input: [{id: +input[0], count: 1, data: +input[1] || 0}],
					output: numArray2Output(recipe[key].result),
					heat: recipe[key].heat
				});
			}
			return list;
		}

		onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
			elements.get("textHeat").setBinding("text", Translation.translate("Heat: ") + recipe.heat);
		}

	}

	api.RecipeTypeRegistry.register("icpe_thermalCentrifuge", new ThermalCentrifugeRecipe());


	class BlastFurnaceRecipe extends RecipeTypeForICPE {

		constructor() {
			super("Blast Furnace", BlockID.blastFurnace, {
				drawing: [
					{type: "bitmap", x: 200, y: 100 - 11 * 5, scale: 5, bitmap: "blast_furnace_background"},
					{type: "bitmap", x: 200 + 50 * 5, y: 100 + 16 * 5, scale: 5, bitmap: "blast_furnace_scale"},
					{type: "bitmap", x: 200 + 46 * 5, y: 100 + 52 * 5, scale: 5, bitmap: "heat_scale"},
					{type: "bitmap", x: 200 + 70 * 5, y: 100 + 48 * 5, scale: 5, bitmap: "indicator_green"}
				],
				elements: {
					input0: {type: "slot", x: 200 + 8 * 5, y: 100 + 12 * 5, size: 18 * 5},
					input1: {type: "slot", x: 200, y: 200 + 17 * 5, size: 18 * 5, bitmap: "_default_slot_empty"},
					output0: {type: "slot", x: 200 + 106 * 5, y: 100 + 17 * 5, size: 18 * 5},
					output1: {type: "slot", x: 200 + 124 * 5, y: 100 + 17 * 5, size: 18 * 5}
				}
			});
		}

		getAllList(): RecipePattern[] {
			const list: RecipePattern[] = [];
			const recipe: {[key: string]: {result: number[], duration: number}} = MachineRecipeRegistry.requireRecipesFor("blastFurnace");
			let input: string[];
			for (let key in recipe) {
				input = key.split(":");
				list.push({
					input: [
						{id: +input[0], count: 1, data: +input[1] || 0},
						{id: ItemID.cellAir, count: 1, data: 0}
					],
					output: numArray2Output(recipe[key].result),
				});
			}
			return list;
		}

	}

	api.RecipeTypeRegistry.register("icpe_blastFurnace", new BlastFurnaceRecipe());


	class FermenterRecipe extends RecipeTypeForICPE {

		constructor() {
			super("Fermenter", BlockID.icFermenter, {
				drawing: [
					{type: "bitmap", x: 20, y: 20, scale: 6, bitmap: "fermenter_background"},
					{type: "bitmap", x: 20 + 118 * 6, y: 20 + 4 * 6, scale: 6, bitmap: "liquid_bar"}
				],
				elements: {
					output0: {x: 20 + 78 * 6, y: 20 + 63 * 6, size: 18 * 6, bitmap: "slot_black"},
					inputLiq0: {x: 20 + 29 * 6, y: 20 + 31 * 6, width: 48 * 6, height: 30 * 6, scale: 6},
					outputLiq0: {x: 20 + 122 * 6, y: 20 + 8 * 6, width: 12 * 6, height: 47 * 6, scale: 6, overlay: "gui_liquid_storage_overlay"}
				}
			});
			this.setTankLimit(1000);
		}

		getAllList(): RecipePattern[] {
			return [{
				output: [{id: ItemID.fertilizer, count: 1, data: 0}],
				inputLiq: [{liquid: "biomass", amount: 500}],
				outputLiq: [{liquid: "biogas", amount: 500}]
			}]
		}

	}

	api.RecipeTypeRegistry.register("icpe_fermenter", new FermenterRecipe());


	class FluidFuelRecipe extends RecipeTypeForICPE {

		constructor() {
			super("Fluid Fuel", ItemID.cellEmpty, {
				drawing: [
					{type: "bitmap", x: 290, y: 140, scale: 8, bitmap: "furnace_burn"},
					{type: "bitmap", x: 280, y: 260, scale: 8, bitmap: "classic_slot"}
				],
				elements: {
					inputLiq0: {x: 288, y: 268, width: 16 * 8, height: 16 * 8},
					text: {type: "text", x: 450, y: 320, font: {size: 40, color: Color.WHITE, shadow: 0.5}}
				}
			});
			this.setDescription("Fuel");
			this.setTankLimit(100);
		}

		getAllList(): RecipePattern[] {
			const list: RecipePattern[] = [];
			const recipe: {[key: string]: {power: number, amount: number}} = MachineRecipeRegistry.requireFluidRecipes("fluidFuel");
			for (let liq in recipe) {
				list.push({
					inputLiq: [{liquid: liq, amount: recipe[liq].amount}],
					power: recipe[liq].power
				});
			}
			return list;
		}

		onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
			elements.get("text").setBinding("text", recipe.power + "EU / tick");
		}

	}

	api.RecipeTypeRegistry.register("icpe_fluidFuel", new FluidFuelRecipe());

});
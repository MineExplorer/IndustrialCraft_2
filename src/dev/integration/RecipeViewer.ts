let RV: {Core: any, RecipeType: typeof RecipeType, RecipeTypeRegistry: RecipeTypeRegistry};

ModAPI.addAPICallback("RecipeViewer", (api: typeof RV) => {

	RV = api;

	const Bitmap = android.graphics.Bitmap;


	abstract class RecipeTypeForICPE extends api.RecipeType {

		constructor(name: string, icon: number, content: {params?: UI.BindingSet, drawing?: UI.DrawingSet, elements: {[key: string]: object}}) {
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
			const dictionary: MachineRecipe.ProcessingRecipeDictionary = MachineRecipe.Registry.getDictionary(this.recipeKey);
			const recipes = dictionary.getAll();
			recipes.forEach(recipe => {
				const resultEntry = recipe.result[0];
				list.push({
					input: [{id: recipe.source.id, count: recipe.source.count, data: recipe.source.data}],
					output: [{id: resultEntry.id, count: resultEntry.count, data: resultEntry.data || 0}]
				});
			});
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
			const dictionary: Machine.SolidCannerRecipeDictionary = MachineRecipe.Registry.getDictionary("solidCanner");
			const recipes = dictionary.getAll();
			for (let recipe of recipes) {
				list.push({
					input: [
						{id: recipe.source.id, count: 1, data: recipe.source.data},
						{id: recipe.can, count: 1, data: 0},
					],
					output: [recipe.result],
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
			const solidDictionary: Machine.SolidCannerRecipeDictionary = MachineRecipe.Registry.getDictionary("solidCanner");
			const solidRecipes = solidDictionary.getAll();
			for (let recipe of solidRecipes) {
				list.push({
					input: [
						{id: recipe.can, count: 1, data: 0},
						{id: recipe.source.id, count: 1, data: recipe.source.data}
					],
					output: [recipe.result],
					mode: 0
				});
			}
			const fluidDictionary: MachineRecipe.FluidEnrichRecipeDictionary = MachineRecipe.Registry.getDictionary("fluidCanner");
			const fluidRecipes = fluidDictionary.getAll();
			for (let recipe of fluidRecipes) {
				list.push({
					input: [
						null,
						{id: recipe.source.id, count: recipe.source.count, data: recipe.source.data}
					],
					inputLiq: [{liquid: recipe.inputFluid.name, amount: recipe.inputFluid.amount}],
					outputLiq: [{liquid: recipe.outputFluid.name, amount: recipe.outputFluid.amount}],
					mode: 3
				});
			}
			let item: string[];
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
			const dictionaryData = [
				{mode: 0, key: "metalRolling"},
				{mode: 1, key: "metalCutting"},
				{mode: 2, key: "metalExtruding"}
			];
			for (let i = 0; i < dictionaryData.length; i++) {
				const modeData = dictionaryData[i];
				const dictionary: MachineRecipe.ProcessingRecipeDictionary = MachineRecipe.Registry.getDictionary(modeData.key);
				if (!dictionary) {
					continue;
				}
				const recipes = dictionary.getAll();
				recipes.forEach(recipe => {
					const resultEntry = recipe.result[0];
					list.push({
						input: [{id: recipe.source.id, count: recipe.source.count, data: recipe.source.data}],
						output: [{id: resultEntry.id, count: resultEntry.count, data: resultEntry.data || 0}]
					});
				});
			}
			return list;
		}

		onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
			elements.get("mode").setBinding("texture", "metal_former_button_" + recipe.mode);
		}

	}

	api.RecipeTypeRegistry.register("icpe_metalFormer", new MetalFormerRecipe());


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
			const dictionary: MachineRecipe.ProcessingRecipeDictionary = MachineRecipe.Registry.getDictionary("oreWasher");
			const recipes = dictionary.getAll();
			for (let i = 0; i < recipes.length; i++) {
				const recipe = recipes[i];
				list.push({
					input: [{id: recipe.source.id, count: recipe.source.count || 1, data: recipe.source.data || 0}],
					output: recipe.result.map(item => ({id: item.id, count: item.count, data: item.data || 0})),
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
			const dictionary: MachineRecipe.ThermalCentrifugeRecipeDictionary = MachineRecipe.Registry.getDictionary("thermalCentrifuge");
			const recipes = dictionary.getAll();
			recipes.forEach(recipe => {
				list.push({
					input: [{id: recipe.source.id, count: recipe.source.count || 1, data: recipe.source.data || 0}],
					output: recipe.result.map(item => ({id: item.id, count: item.count, data: item.data || 0})),
					heat: recipe.heat
				});
			});
			return list;
		}

		onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
			elements.get("textHeat").setBinding("text", Translation.translate("Heat: ") + recipe.heat);
		}

	}

	api.RecipeTypeRegistry.register("icpe_thermalCentrifuge", new ThermalCentrifugeRecipe());

	
	class BlockCuttingMachineRecipe extends RecipeTypeForICPE {

		constructor() {
			super("Block Cutting Machine", BlockID.blockCuttingMachine, {
				drawing: [
					{type: "bitmap", x: 377, y: 229, scale: 6, bitmap: "icpe.cutting_machine_bar_background"}
				],
				elements: {
					input0: {x: 210, y: 229, size: 18 * 6},
					input1: {x: 458, y: 229, size: 18 * 6, bitmap: "transparent_slot"},
					output0: {x: 709, y: 229, size: 18 * 6},
					progressScale: {type: "scale", x: 377, y: 229, scale: 6, direction: 0, value: 1, bitmap: "icpe.cutting_machine_bar_scale"}
				}
			});
		}

		private getBladeByHardness(hardnessLevel: number): ItemInstance {
			switch (hardnessLevel) {
				case 1:
					return {id: ItemID.cuttingBladeIron, count: 1, data: 0};
				case 2:
					return {id: ItemID.cuttingBladeSteel, count: 1, data: 0};
				case 3:
					return {id: ItemID.cuttingBladeDiamond, count: 1, data: 0};
				default:
					return null;
			}
		}

		getAllList(): RecipePattern[] {
			const list: RecipePattern[] = [];
			const dictionary: MachineRecipe.BlockCutterRecipeDictionary = MachineRecipe.Registry.getDictionary("cuttingMachine");
			if (!dictionary) {
				return list;
			}
			const recipes = dictionary.getAll().sort((recipe1, recipe2) =>
				recipe1.hardnessLevel != recipe2.hardnessLevel ? recipe1.hardnessLevel - recipe2.hardnessLevel :
				recipe1.result.id != recipe2.result.id ? recipe1.result.id - recipe2.result.id :
				recipe1.source.id != recipe2.source.id ? recipe1.source.id - recipe2.source.id :
				recipe1.source.data - recipe2.source.data
			);
			let blade: ItemInstance;
			for (let recipe of recipes) {
				blade = this.getBladeByHardness(recipe.hardnessLevel);
				if (!blade) {
					continue;
				}
				list.push({
					input: [
						{id: recipe.source.id, count: recipe.source.count, data: recipe.source.data},
						blade
					],
					output: [{
						id: recipe.result.id,
						count: recipe.result.count,
						data: recipe.result.data || 0
					}]
				});
			}
			return list;
		}

	}

	api.RecipeTypeRegistry.register("icpe_cutting_machine", new BlockCuttingMachineRecipe());


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
			const dictionary: MachineRecipe.ProcessingRecipeDictionary = MachineRecipe.Registry.getDictionary("blastFurnace");
			const recipes = dictionary.getAll();
			recipes.forEach(recipe => {
				list.push({
					input: [{id: recipe.source.id, count: recipe.source.count || 1, data: 0}],
					output: recipe.result.map(item => ({id: item.id, count: item.count, data: item.data || 0}))
				});
			});
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
			const recipe: {[key: string]: {power: number, amount: number}} = MachineRecipe.Registry.requireFluidRecipes("fluidFuel");
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


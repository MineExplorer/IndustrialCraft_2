ItemRegistry.createItem("matter", {name: "uu_matter", icon: "uu_matter", rarity: EnumRarity.RARE});

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.iridiumChunk, count: 2, data: 0}, [
		"x x",
		"xax",
		"xxx"
	], ['x', ItemID.matter, -1, 'a', ItemID.iridiumChunk, -1]);

	Recipes.addShaped({id: 264, count: 2, data: 0}, [
		"xxx",
		"xax",
		"xxx"
	], ['x', ItemID.matter, -1, 'a', 264, -1]);

	Recipes.addShaped({id: 17, count: 9, data: 0}, [
		" x ",
		" a ",
		"   "
	], ['x', ItemID.matter, -1, 'a', 17, 0]);

	Recipes.addShaped({id: 1, count: 16, data: 0}, [
		" a ",
		" x ",
		"   "
	], ['x', ItemID.matter, -1, 'a', 1, 0]);

	Recipes.addShaped({id: 2, count: 16, data: 0}, [
		" x ",
		" a ",
		" x "
	], ['x', ItemID.matter, -1, 'a', 2, 0]);

	Recipes.addShaped({id: 80, count: 5, data: 0}, [
		"   ",
		"xax",
		"   "
	], ['x', ItemID.matter, -1, 'a', 80, 0]);

	Recipes.addShaped({id: 35, count: 12, data: 0}, [
		"x x",
		" a ",
		" x "
	], ['x', ItemID.matter, -1, 'a', 35, 0]);

	Recipes.addShaped({id: VanillaBlockID.vine, count: 24, data: 0}, [
		"x  ",
		"xa ",
		"x  "
	], ['x', ItemID.matter, -1, 'a', VanillaBlockID.vine, 0]);

	Recipes.addShaped({id: VanillaItemID.snowball, count: 24, data: 0}, [
		"   ",
		" a ",
		"xxx"
	], ['x', ItemID.matter, -1, 'a', VanillaItemID.snowball, -1]);

	Recipes.addShaped({id: 20, count: 32, data: 0}, [
		" x ",
		"xax",
		" x "
	], ['x', ItemID.matter, -1, 'a', 20, 0]);

	Recipes.addShaped({id: 49, count: 12, data: 0}, [
		" x ",
		"xax",
		" x "
	], ['x', ItemID.matter, -1, 'a', 49, 0]);

	Recipes.addShaped({id: VanillaItemID.feather, count: 32, data: 0}, [
		" x ",
		"xax",
		" x "
	], ['x', ItemID.matter, -1, 'a', VanillaItemID.feather, -1]);

	Recipes.addShaped({id: VanillaItemID.ink_sac, count: 48, data: 0}, [
		" xx",
		"xa ",
		" xx"
	], ['x', ItemID.matter, -1, 'a', VanillaItemID.ink_sac, -1]);

	Recipes.addShaped({id: VanillaItemID.cocoa_beans, count: 32, data: 0}, [
		"xx ",
		" ax",
		"xx "
	], ['x', ItemID.matter, -1, 'a', VanillaItemID.cocoa_beans, -1]);

	Recipes.addShaped({id: VanillaItemID.lapis_lazuli, count: 10, data: 0}, [
		" x ",
		"xax",
		" x "
	], ['x', ItemID.matter, -1, 'a', VanillaItemID.lapis_lazuli, -1]);

	Recipes.addShaped({id: VanillaItemID.clay_ball, count: 48, data: 0}, [
		"xx ",
		"xa ",
		"xx "
	], ['x', ItemID.matter, -1, 'a', VanillaItemID.clay_ball, -1]);

	Recipes.addShaped({id: VanillaBlockID.mycelium, count: 24, data: 0}, [
		"   ",
		"xax",
		"xxx"
	], ['x', ItemID.matter, -1, 'a', VanillaBlockID.mycelium, 0]);

	Recipes.addShaped({id: VanillaItemID.flint, count: 32, data: 0}, [
		" x ",
		"xax",
		"x x"
	], ['x', ItemID.matter, -1, 'a', VanillaItemID.flint, -1]);

	Recipes.addShaped({id: VanillaBlockID.stonebrick, count: 48, data: 0}, [
		"x x",
		"xax",
		" x "
	], ['x', ItemID.matter, -1, 'a', VanillaBlockID.stonebrick, 0]);

	Recipes.addShaped({id: VanillaBlockID.glowstone, count: 9, data: 0}, [
		" x ",
		"xax",
		"xxx"
	], ['x', ItemID.matter, -1, 'a', VanillaBlockID.glowstone, 0]);

	Recipes.addShaped({id: VanillaBlockID.cactus, count: 48, data: 0}, [
		" x ",
		"xxx",
		"xax"
	], ['x', ItemID.matter, -1, 'a', VanillaBlockID.cactus, 0]);

	Recipes.addShaped({id: VanillaBlockID.reeds, count: 48, data: 0}, [
		"x x",
		"xax",
		"x x"
	], ['x', ItemID.matter, -1, 'a', VanillaBlockID.reeds, 0]);

	Recipes.addShaped({id: VanillaItemID.gunpowder, count: 16, data: 0}, [
		"xxx",
		"xa ",
		"xxx"
	], ['x', ItemID.matter, -1, 'a', VanillaItemID.gunpowder, -1]);

	Recipes.addShaped({id: 263, count: 20, data: 0}, [
		"  x",
		"xa ",
		"  x"
	], ['x', ItemID.matter, -1, 'a', 263, 0]);

	Recipes.addShaped({id: 331, count: 24, data: 0}, [
		" x ",
		"xax",
		" x "
	], ['x', ItemID.matter, -1, 'a', 331, -1]);

	Recipes.addShaped({id: VanillaItemID.emerald, count: 3, data: 0}, [
		"xxx",
		"xax",
		"xx "
	], ['x', ItemID.matter, -1, 'a', VanillaItemID.emerald, -1]);

	Recipes.addShaped({id: ItemID.latex, count: 22, data: 0}, [
		" x ",
		"xax",
		" x "
	], ['x', ItemID.matter, -1, 'a', ItemID.latex, -1]);

	Recipes.addShaped({id: VanillaBlockID.gold_ore, count: 3, data: 0}, [
		"x x",
		" a ",
		"xxx"
	], ['x', ItemID.matter, -1, 'a', VanillaBlockID.gold_ore, 0]);

	Recipes.addShaped({id: VanillaBlockID.iron_ore, count: 3, data: 0}, [
		"xxx",
		" a ",
		"x x"
	], ['x', ItemID.matter, -1, 'a', VanillaBlockID.iron_ore, 0]);

	Recipes.addShaped({id: BlockID.oreCopper, count: 6, data: 0}, [
		"  x",
		"xax",
		"   "
	], ['x', ItemID.matter, -1, 'a', BlockID.oreCopper, 0]);

	Recipes.addShaped({id: BlockID.oreTin, count: 6, data: 0}, [
		"   ",
		"xax",
		"  x"
	], ['x', ItemID.matter, -1, 'a', BlockID.oreTin, 0]);
});
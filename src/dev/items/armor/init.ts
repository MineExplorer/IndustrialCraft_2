/// <reference path="ArmorIC2.ts" />
/// <reference path="ArmorHazmat.ts" />
/// <reference path="ArmorJetpackElectric.ts" />
/// <reference path="ArmorBatpack.ts" />
/// <reference path="ArmorNightvisionGoggles.ts" />
/// <reference path="ArmorNanoSuit.ts" />
/// <reference path="ArmorQuantumSuit.ts" />
/// <reference path="ArmorSolarHelmet.ts" />

ItemRegistry.addArmorMaterial("bronze", {durabilityFactor: 14, enchantability: 10, repairMaterial: ItemID.ingotBronze});

ItemRegistry.registerItem(new ArmorIC2("bronzeHelmet", "bronze_helmet", {type: "helmet", defence: 2, texture: "bronze", material: "bronze"}));
ItemRegistry.registerItem(new ArmorIC2("bronzeChestplate", "bronze_chestplate", {type: "chestplate", defence: 6, texture: "bronze", material: "bronze"}));
ItemRegistry.registerItem(new ArmorIC2("bronzeLeggings", "bronze_leggings", {type: "leggings", defence: 6, texture: "bronze", material: "bronze"}));
ItemRegistry.registerItem(new ArmorIC2("bronzeBoots", "bronze_boots", {type: "boots", defence: 6, texture: "bronze", material: "bronze"}));

ItemRegistry.addArmorMaterial("composite", {durabilityFactor: 50, enchantability: 8, repairMaterial: ItemID.plateAlloy});

ItemRegistry.registerItem(new ArmorIC2("compositeHelmet", "composite_helmet", {type: "helmet", defence: 3, texture: "composite", material: "composite"}));
ItemRegistry.registerItem(new ArmorIC2("compositeChestplate", "composite_chestplate", {type: "chestplate", defence: 8, texture: "composite", material: "composite"}));
ItemRegistry.registerItem(new ArmorIC2("compositeLeggings", "composite_leggings", {type: "leggings", defence: 6, texture: "composite", material: "composite"}));
ItemRegistry.registerItem(new ArmorIC2("compositeBoots", "composite_boots", {type: "boots", defence: 3, texture: "composite", material: "composite"}));

ItemRegistry.registerItem(new ArmorHazmat("hazmatHelmet", "hazmat_helmet", {type: "helmet", defence: 1, texture: "hazmat"}));
ItemRegistry.registerItem(new ArmorHazmat("hazmatChestplate", "hazmat_chestplate", {type: "chestplate", defence: 1, texture: "hazmat"}));
ItemRegistry.registerItem(new ArmorHazmat("hazmatLeggings", "hazmat_leggings", {type: "leggings", defence: 1, texture: "hazmat"}));
ItemRegistry.registerItem(new ArmorHazmat("rubberBoots", "rubber_boots", {type: "boots", defence: 1, texture: "rubber"}));

ItemRegistry.registerItem(new ArmorJetpackElectric());

ItemRegistry.registerItem(new ArmorBatpack("batpack", "batpack", 60000, 100, 1));
ItemRegistry.registerItem(new ArmorBatpack("advBatpack", "advanced_batpack", 600000, 512, 2));
ItemRegistry.registerItem(new ArmorBatpack("energypack", "energypack", 2000000, 2048, 3));
ItemRegistry.registerItem(new ArmorBatpack("lappack", "lappack", 10000000, 8192, 4)).setRarity(EnumRarity.UNCOMMON);

Item.addCreativeGroup("batteryPack", Translation.translate("Battery Packs"), [
	ItemID.batpack,
	ItemID.advBatpack,
	ItemID.energypack,
	ItemID.lappack
]);

ItemRegistry.registerItem(new ArmorNightvisionGoggles());

ItemRegistry.registerItem(new ArmorNanoSuit("nanoHelmet", "nano_helmet", {type: "helmet", defence: 3, texture: "nano"}));
ItemRegistry.registerItem(new ArmorNanoSuit("nanoChestplate", "nano_chestplate", {type: "chestplate", defence: 8, texture: "nano"}));
ItemRegistry.registerItem(new ArmorNanoSuit("nanoLeggings", "nano_leggings", {type: "leggings", defence: 6, texture: "nano"}));
ItemRegistry.registerItem(new ArmorNanoSuit("nanoBoots", "nano_boots", {type: "boots", defence: 3, texture: "nano"}));

UIbuttons.setArmorButton(ItemID.nanoHelmet, "button_nightvision");

ItemRegistry.registerItem(new ArmorQuantumSuit("quantumHelmet", "quantum_helmet", {type: "helmet", defence: 3, texture: "quantum"}));
ItemRegistry.registerItem(new ArmorQuantumSuit("quantumChestplate", "quantum_chestplate", {type: "chestplate", defence: 8, texture: "quantum"}));
ItemRegistry.registerItem(new ArmorQuantumSuit("quantumLeggings", "quantum_leggings", {type: "leggings", defence: 6, texture: "quantum"}));
ItemRegistry.registerItem(new ArmorQuantumSuit("quantumBoots", "quantum_boots", {type: "boots", defence: 3, texture: "quantum"}));

UIbuttons.setArmorButton(ItemID.quantumHelmet, "button_nightvision");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_fly");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_hover");
UIbuttons.setArmorButton(ItemID.quantumBoots, "button_jump");

ItemRegistry.registerItem(new ArmorSolarHelmet("solarHelmet", "solar_helmet", {type: "helmet", defence: 2, texture: "solar"}));

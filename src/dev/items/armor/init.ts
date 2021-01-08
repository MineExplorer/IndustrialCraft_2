/// <reference path="./ArmorIC2.ts" />
/// <reference path="./ArmorHazmat.ts" />
/// <reference path="./ArmorJetpackElectric.ts" />
/// <reference path="./ArmorBatpack.ts" />
/// <reference path="./ArmorNightvisionGoggles.ts" />
/// <reference path="./ArmorNanoSuit.ts" />
/// <reference path="./ArmorQuantumSuit.ts" />
/// <reference path="./ArmorSolarHelmet.ts" />

ItemRegistry.addArmorMaterial("bronze", {durabilityFactor: 14, enchantability: 10, repairItem: ItemID.ingotBronze});

new ArmorIC2("bronzeHelmet", "bronze_helmet", {type: "helmet", defence: 2, texture: "bronze", material: "bronze"});
new ArmorIC2("bronzeChestplate", "bronze_chestplate", {type: "chestplate", defence: 6, texture: "bronze", material: "bronze"});
new ArmorIC2("bronzeLeggings", "bronze_leggings", {type: "leggings", defence: 6, texture: "bronze", material: "bronze"});
new ArmorIC2("bronzeBoots", "bronze_boots", {type: "boots", defence: 6, texture: "bronze", material: "bronze"});

ItemRegistry.addArmorMaterial("composite", {durabilityFactor: 50, enchantability: 8, repairItem: ItemID.plateAlloy});

new ArmorIC2("compositeHelmet", "composite_helmet", {type: "helmet", defence: 3, texture: "composite", material: "composite"});
new ArmorIC2("compositeChestplate", "composite_chestplate", {type: "chestplate", defence: 8, texture: "composite", material: "composite"});
new ArmorIC2("compositeLeggings", "composite_leggings", {type: "leggings", defence: 6, texture: "composite", material: "composite"});
new ArmorIC2("compositeBoots", "composite_boots", {type: "boots", defence: 3, texture: "composite", material: "composite"});

new ArmorHazmat("hazmatHelmet", "hazmat_helmet", {type: "helmet", defence: 1, texture: "hazmat"});
new ArmorHazmat("hazmatChestplate", "hazmat_chestplate", {type: "chestplate", defence: 1, texture: "hazmat"});
new ArmorHazmat("hazmatLeggings", "hazmat_leggings", {type: "leggings", defence: 1, texture: "hazmat"});
new ArmorHazmat("rubberBoots", "rubber_boots", {type: "boots", defence: 1, texture: "rubber"});

new ArmorJetpackElectric();

new ArmorBatpack("batpack", "batpack", 60000, 100, 1);
new ArmorBatpack("advBatpack", "advanced_batpack", 600000, 512, 2);
new ArmorBatpack("energypack", "energypack", 2000000, 2048, 3);
new ArmorBatpack("lappack", "lappack", 10000000, 8192, 4).setRarity(1);

Item.addCreativeGroup("batteryPack", Translation.translate("Battery Packs"), [
	ItemID.batpack,
	ItemID.advBatpack,
	ItemID.energypack,
	ItemID.lappack
]);

new ArmorNightvisionGoggles();

new ArmorNanoSuit("nanoHelmet", "nano_helmet", {type: "helmet", defence: 4});
new ArmorNanoSuit("nanoChestplate", "nano_chestplate", {type: "chestplate", defence: 9});
new ArmorNanoSuit("nanoLeggings", "nano_leggings", {type: "leggings", defence: 7});
new ArmorNanoSuit("nanoBoots", "nano_boots", {type: "boots", defence: 4});

new ArmorQuantumSuit("quantumHelmet", "quantum_helmet", {type: "helmet", defence: 4});
new ArmorQuantumSuit("quantumChestplate", "quantum_chestplate", {type: "chestplate", defence: 10});
new ArmorQuantumSuit("quantumLeggings", "quantum_leggings", {type: "leggings", defence: 7});
new ArmorQuantumSuit("quantumBoots", "quantum_boots", {type: "boots", defence: 4});

UIbuttons.setArmorButton(ItemID.quantumHelmet, "button_nightvision");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_fly");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_hover");
UIbuttons.setArmorButton(ItemID.quantumBoots, "button_jump");

new ArmorSolarHelmet("solarHelmet", "solar_helmet", {type: "helmet", defence: 2, texture: "solar"});

/// <reference path="./core-engine.d.ts"/>

declare namespace ToolLib {
    function setTool(id: number, toolMaterial: string | ToolAPI.ToolMaterial, toolType: any, brokenId?: number): void;
    function breakCarriedTool(damage: number, player: number): void;
    function getBlockDrop(coords: Vector, id: number, data: number, level: number, enchant?: ToolAPI.EnchantData, item?: ItemInstance, region?: BlockSource): ItemInstanceArray[];
    function isBlock(id: number): boolean;
    function isItem(id: number): boolean;
    function addBlockDropOnExplosion(nameID: string | number): void;
}

declare enum MiningLevel {
	STONE = 1,
	IRON = 2,
	DIAMOND = 3,
	OBSIDIAN = 4
}
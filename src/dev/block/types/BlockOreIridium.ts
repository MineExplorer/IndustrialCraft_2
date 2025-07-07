/// <reference path="./BlockOre.ts" />

class BlockOreIridium extends BlockOre {
    getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack): ItemInstanceArray[] {
        if (level > 3) {
            if (enchant.silk) {
                return [[block.id, 1, 0]];
            }
            let drop: ItemInstanceArray[] = [[ItemID.iridiumChunk, 1, 0]];
            if (Math.random() < enchant.fortune/6) {
                drop.push(drop[0]);
            }
            ToolAPI.dropOreExp(coords, 12, 28, enchant.experience);
            return drop;
        }
        return [];
    }
}
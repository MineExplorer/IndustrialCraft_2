class BlockReinforcedDoor extends BlockBase 
implements BlockBehavior {
	constructor(id: string, bottomTexture: [string, number][], topTexture: [string, number][]) {
		super(id, {
            baseBlock: 1,
            destroyTime: 25,
            explosionResistance: 150,
            renderLayer: 1,
            sound: "stone"
        });
        const name = `tile.${id}.name`;
        for (let i = 0; i < 8; i++) {
		    this.addVariation(name, bottomTexture);
        }
        for (let i = 8; i < 16; i++) {
		    this.addVariation(name, topTexture);
        }
        for (let i = 0; i < 4; i++) {
            this.setShape({x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 3/16}, i*4);
            this.setShape({x: 0, y: 0, z: 13/16}, {x: 1, y: 1, z: 1}, i*4 + 1);
            this.setShape({x: 0, y: 0, z: 0}, {x: 3/16, y: 1, z: 1}, i*4 + 2);
            this.setShape({x: 13/16, y: 0, z: 0}, {x: 1, y: 1, z: 1}, i*4 + 3);
        }

		this.setBlockMaterial("stone", 2);
        this.setupAsRedstoneReceiver(false);
	}

    getDrop(coords: Vector, block: Tile): ItemInstanceArray[] {
        if (block.data < 8) {
            return [[Item.getNumericId(this.stringID), 1, 0]];
        }
        return [];
    }

    onNeighbourChange(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void {
        if (block.data < 8 && (changeCoords.y < coords.y || changeCoords.y > coords.y && region.getBlockId(changeCoords.x, changeCoords.y, changeCoords.z) !== block.id)
            || block.data >= 8 && changeCoords.y < coords.y && region.getBlockId(changeCoords.x, changeCoords.y, changeCoords.z) !== block.id
        ) {
            region.destroyBlock(coords.x, coords.y, coords.z, true);
        }
    }

    onRedstoneUpdate(coords: Vector, params: { signal: number; onLoad: boolean; }, blockSource: BlockSource): void {
        const block = blockSource.getBlock(coords.x, coords.y, coords.z);
        const dimensionId = blockSource.getDimension();
        
        if (params.onLoad) {
            VirtualBlockData.addBlockEntry({ signal: params.signal }, dimensionId, coords.x, coords.y, coords.z);
            return;
        }
        
        const blockData: { signal: number } = VirtualBlockData.getBlockEntry(dimensionId, coords.x, coords.y, coords.z);
        if (!blockData) {
            Debug.error(`No data found for block ${coords.x}, ${coords.y}, ${coords.z}`);
            return;
        }
        const secondBlockData = block.data > 8 ? 
            VirtualBlockData.getBlockEntry(dimensionId, coords.x, coords.y - 1, coords.z) : 
            VirtualBlockData.getBlockEntry(dimensionId, coords.x, coords.y + 1, coords.z);
            
        const secondBlockPowered = secondBlockData?.signal > 0;
        const isPowered = params.signal > 0;
        const wasPowered = blockData.signal > 0;
        blockData.signal = params.signal;
        let stateByData: number[];
        if (wasPowered && !(isPowered || secondBlockPowered)) { // close door
            stateByData = [2, 3, 1, 0];
            //Debug.m(`close door: ${coords.x},${coords.y},${coords.z}`);
        }
        else if (!(wasPowered || secondBlockPowered) && isPowered) { // open door
            stateByData = [3, 2, 0, 1];
            //Debug.m(`open door: ${coords.x},${coords.y},${coords.z}`);
        } else {
            return;
        }

        const newData = stateByData[block.data % 4];
        this.updateState(blockSource, coords, block, newData);
    }

    updateState(blockSource: BlockSource, coords: Vector, block: Tile, newData: number) {
        // invert data for right sided doors
        if (block.data >= 4 && block.data <= 7 || block.data >= 12 && block.data <= 15) {
            newData ^= 1;
        }
        blockSource.setBlock(coords.x, coords.y, coords.z, block.id, this.getNewData(block.data, newData));
        if (block.data >= 8) {
            const secondBlockData = block.data - 8;
            blockSource.setBlock(coords.x, coords.y - 1, coords.z, block.id, this.getNewData(secondBlockData, newData));
        } else {
            const secondBlockData = block.data + 8;
            blockSource.setBlock(coords.x, coords.y + 1, coords.z, block.id, this.getNewData(secondBlockData, newData));
        }
    }

    getNewData(blockData: number, newData: number): number {
        return blockData - blockData % 4 + newData;
    }
}

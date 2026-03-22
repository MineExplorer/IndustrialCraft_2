type DamageChunk = {
	minX: number;
	minY: number;
	minZ: number;
	maxX: number;
	maxY: number;
	maxZ: number;
	maxSafetyVoltage: number;
	nodes: BlockNode[];
};

class CableDamageArea {
	static readonly CHUNK_SIZE = 16;

	maxSafetyVoltage: number = -1;
	readonly chunks: DamageChunk[] = [];

	/**
	 * Builds a cached view of hazardous cable blocks grouped by world chunk.
	 * Computes both per-chunk and total safe-voltage thresholds in one pass.
	 */
	constructor(blockNodes: {[key: string]: BlockNode}) {
		const chunkMap: {[key: string]: DamageChunk} = {};
		for (const key in blockNodes) {
			const blockNode = blockNodes[key];
			if (!blockNode.extraData.maxSafetyVoltage) continue;

			const {x, y, z} = blockNode;
			const chunkX = Math.floor(x / CableDamageArea.CHUNK_SIZE);
			const chunkZ = Math.floor(z / CableDamageArea.CHUNK_SIZE);
			const chunkKey = chunkX + ":" + chunkZ;
			let chunk = chunkMap[chunkKey];
			if (!chunk) {
				chunk = chunkMap[chunkKey] = {
					minX: Number.MAX_SAFE_INTEGER,
					minY: Number.MAX_SAFE_INTEGER,
					minZ: Number.MAX_SAFE_INTEGER,
					maxX: Number.MIN_SAFE_INTEGER,
					maxY: Number.MIN_SAFE_INTEGER,
					maxZ: Number.MIN_SAFE_INTEGER,
					maxSafetyVoltage: 0,
					nodes: []
				};
				this.chunks.push(chunk);
			}

			if (x < chunk.minX) chunk.minX = x;
			if (y < chunk.minY) chunk.minY = y;
			if (z < chunk.minZ) chunk.minZ = z;
			if (x > chunk.maxX) chunk.maxX = x;
			if (y > chunk.maxY) chunk.maxY = y;
			if (z > chunk.maxZ) chunk.maxZ = z;
			if (!chunk.maxSafetyVoltage || blockNode.extraData.maxSafetyVoltage < chunk.maxSafetyVoltage) {
				chunk.maxSafetyVoltage = blockNode.extraData.maxSafetyVoltage;
			}
			if (this.maxSafetyVoltage < 0 || chunk.maxSafetyVoltage < this.maxSafetyVoltage) {
				this.maxSafetyVoltage = chunk.maxSafetyVoltage;
			}
			chunk.nodes.push(blockNode);
		}
	}

	/** Returns true when there are no hazardous cable chunks to process. */
	isEmpty(): boolean {
		return this.chunks.length == 0;
	}

	/**
	 * Returns the chunk slice assigned to the current tick within a 20-tick cycle.
	 */
	getChunkBatch(threadTime: number): DamageChunk[] {
		const count = this.chunks.length;
		if (count == 0) return [];

		const batchSize = Math.ceil(count / 20);
		const start = (threadTime % 20) * batchSize;
		const end = Math.min(start + batchSize, count);
		return this.chunks.slice(start, end);
	}
}

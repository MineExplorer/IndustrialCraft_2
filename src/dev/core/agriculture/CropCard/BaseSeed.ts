namespace Agriculture {
	export type BaseSeed = {
		id?: number | string;
		data?: number;
		size: number;
		growth: number;
		gain: number;
		resistance: number;
		addToCreative: boolean;
	}
}

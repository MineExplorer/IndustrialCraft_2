namespace MathUtil {
	export function randomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	export function inRange(value: number, minValue: number, maxValue: number) {
		if (value < minValue) return minValue;
		if (value > maxValue) return maxValue;
		return value;
	}
}
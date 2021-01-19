declare namespace Flags {
	let allFlags: {};
	function addFlag(name: string): boolean;
	function getFlag(name: string): boolean;
	function addUniqueAction(name: string, action: Function): void;
	function assertFlag(name: string): void;
}
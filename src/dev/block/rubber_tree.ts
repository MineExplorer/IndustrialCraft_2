/// <reference path="./types/RubberTree/BlockRubberTreeLog.ts" />
/// <reference path="./types/RubberTree/BlockRubberTreeLogLatex.ts" />
/// <reference path="./types/RubberTree/BlockRubberTreeLeaves.ts" />
/// <reference path="./types/RubberTree/BlockRubberTreeSapling.ts" />

BlockRegistry.registerBlock(new BlockRubberTreeLog());
BlockRegistry.registerBlock(new BlockRubberTreeLogLatex());
BlockRegistry.registerBlock(new BlockRubberTreeLeaves());
BlockRegistry.registerBlock(new BlockRubberTreeSapling());

Recipes.addFurnace(BlockID.rubberTreeLog, 17, 3);
Recipes.addShapeless({id: 5, count: 3, data: 3}, [{id: BlockID.rubberTreeLog, data: -1}]);
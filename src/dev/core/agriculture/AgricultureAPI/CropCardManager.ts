namespace Agriculture {
    export class CropCardManager {
        private static cropCards: CropCard[] = [];

        static registerCropCard(cropCard: CropCard): void {
            this.cropCards.push(cropCard);
        }

        static getCropCardByIndex(index: number): CropCard {
            return this.cropCards[index] || null;
        }

        static getCardFromSeed(item: ItemInstance) {
            for (var i in this.cropCards) {
                var seed = this.cropCards[i].getBaseSeed();
                if (seed && seed.id == item.id && (!seed.data || seed.data == item.data)) {
                    return this.cropCards[i];
                }
            }
            return null;
        }
    }
}

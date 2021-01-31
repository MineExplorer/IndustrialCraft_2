namespace Agriculture {
    export class CropCardManager {
        private static cropCards: CropCard[] = [];

        /**
         * Register new card
         * @param {CropCard} cropCard
         * @returns {number} registred card ID
         */
        static registerCropCard(cropCard: CropCard): number {
            return this.cropCards.push(cropCard) - 1;
        }

        static getCropCardByIndex(index: number): CropCard {
            return this.cropCards[index] || null;
        }

        static getCardFromSeed(item: ItemInstance) {
            for (var i in this.cropCards) {
                const seed = this.cropCards[i].getBaseSeed();
                if (seed && seed.id == item.id && (!seed.data || seed.data == item.data)) {
                    return this.cropCards[i];
                }
            }
            return null;
        }
    }
}

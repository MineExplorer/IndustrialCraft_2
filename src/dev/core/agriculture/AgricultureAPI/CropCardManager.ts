namespace Agriculture {
    export class CropCardManager {
        private static cropCards: CropCard[] = [];

        /**
         * Register new card
         * @param {CropCard} cropCard
         * @returns {number} registred card ID
         */
        static registerCropCard(cropCard: CropCard): void {
            const cardID = this.cropCards.push(cropCard) - 1;
            cropCard.initialize(cardID);
        }

        static getALLCropCards(): CropCard[] {
            return this.cropCards;
        }

        static getCropCardByIndex(index: number): CropCard {
            return this.cropCards[index] || null;
        }

        static getIndexByCropCardID(id: string): number {
            for (const i in this.cropCards) {
                if (this.cropCards[i].getID() == id) {
                    return +i;
                }
            }
            return null;
        }

        static getCardFromSeed(item: ItemStack) {
            for (let i in this.cropCards) {
                const seed = this.cropCards[i].getBaseSeed();
                if (seed && seed.id == item.id && (!seed.data || seed.data == item.data)) {
                    return this.cropCards[i];
                }
            }
            return null;
        }

        static getCardFromID(id: string): CropCard {
            for (let i in this.cropCards) {
                if (this.cropCards[i].getID() == id) {
                    return this.cropCards[i];
                }
            }
            return null;
        }
    }
}

namespace Agriculture {
    export class AgricultureAPI {
        private static cropCards: CropCard[] = [];
        static getCropCardByIndex(index: number): CropCard {
            return this.cropCards[index] || null;
        }
    }
}

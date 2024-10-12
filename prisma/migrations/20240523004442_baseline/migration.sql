/*
  Warnings:

  - You are about to drop the column `_deckId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `evaluation` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `times` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `showDataTime` on the `Card` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card__deckId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_cardId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "_deckId",
DROP COLUMN "type",
ADD COLUMN     "deckId" TEXT,
ADD COLUMN     "evaluation" TEXT NOT NULL,
ADD COLUMN     "times" INTEGER NOT NULL,
DROP COLUMN "showDataTime",
ADD COLUMN     "showDataTime" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Evaluation";

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

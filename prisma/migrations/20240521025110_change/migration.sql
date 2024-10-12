/*
  Warnings:

  - You are about to drop the column `_evalId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `times` on the `Card` table. All the data in the column will be lost.
  - Added the required column `_cardId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card__evalId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "_evalId",
DROP COLUMN "times";

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "_cardId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation__cardId_fkey" FOREIGN KEY ("_cardId") REFERENCES "Card"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

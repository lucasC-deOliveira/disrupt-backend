/*
  Warnings:

  - You are about to drop the column `_cardId` on the `Evaluation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cardId]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cardId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation__cardId_fkey";

-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "_cardId",
ADD COLUMN     "cardId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_cardId_key" ON "Evaluation"("cardId");

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

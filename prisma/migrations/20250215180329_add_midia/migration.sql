/*
  Warnings:

  - You are about to drop the column `photo` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "photo";

-- CreateTable
CREATE TABLE "Midia" (
    "_id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "gridFsId" TEXT NOT NULL,

    CONSTRAINT "Midia_pkey" PRIMARY KEY ("_id")
);

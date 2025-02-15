/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Midia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gridFsId]` on the table `Midia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Midia_path_key" ON "Midia"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Midia_gridFsId_key" ON "Midia"("gridFsId");

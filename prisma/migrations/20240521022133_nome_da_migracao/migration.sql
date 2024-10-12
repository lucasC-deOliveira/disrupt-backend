-- CreateTable
CREATE TABLE "Evaluation" (
    "_id" TEXT NOT NULL,
    "times" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Card" (
    "_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "times" TEXT NOT NULL,
    "showDataTime" TEXT NOT NULL,
    "_evalId" TEXT NOT NULL,
    "_deckId" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Deck" (
    "_id" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card__evalId_fkey" FOREIGN KEY ("_evalId") REFERENCES "Evaluation"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card__deckId_fkey" FOREIGN KEY ("_deckId") REFERENCES "Deck"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

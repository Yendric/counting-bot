-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "goal" INTEGER NOT NULL DEFAULT 69420,
    "countChannelId" TEXT
);

-- CreateTable
CREATE TABLE "PlayerStats" (
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "contributedNumbers" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PlayerStats_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_userId_guildId_key" ON "PlayerStats"("userId", "guildId");


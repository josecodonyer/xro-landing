-- CreateTable
CREATE TABLE "UserProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "avatarCharName" TEXT,
    "avatarCharClass" INTEGER,
    "avatarCharSex" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `room_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "room_users" ADD COLUMN     "password" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "room_users_username_key" ON "room_users"("username");

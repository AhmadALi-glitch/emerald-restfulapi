/*
  Warnings:

  - Added the required column `avatar` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "avatar" TEXT NOT NULL;
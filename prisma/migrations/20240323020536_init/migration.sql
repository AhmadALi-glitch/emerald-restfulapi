/*
  Warnings:

  - You are about to alter the column `join_date_utc` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `create_date_utc` on the `Checkpoint` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `create_date_utc` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `start_date_utc` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `end_date_utc` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `create_date_utc` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `create_date_utc` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `appplying_date_utc` on the `eventJoinRequests` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `appplying_date_utc` on the `teamJoinRequests` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `join_date_utc` on the `teamsEvents` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "join_date_utc" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Checkpoint" ALTER COLUMN "create_date_utc" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "create_date_utc" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "start_date_utc" SET DATA TYPE INTEGER,
ALTER COLUMN "end_date_utc" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "create_date_utc" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "create_date_utc" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "eventJoinRequests" ALTER COLUMN "appplying_date_utc" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "teamJoinRequests" ALTER COLUMN "appplying_date_utc" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "teamsEvents" ALTER COLUMN "join_date_utc" SET DATA TYPE INTEGER;

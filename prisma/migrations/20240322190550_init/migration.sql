/*
  Warnings:

  - You are about to drop the column `join_date` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `create_date` on the `Checkpoint` table. All the data in the column will be lost.
  - You are about to drop the column `create_date` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `create_date` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `create_date` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `appplyingDate` on the `eventJoinRequests` table. All the data in the column will be lost.
  - You are about to drop the column `appplyingDate` on the `teamJoinRequests` table. All the data in the column will be lost.
  - Added the required column `join_date_utc` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date_utc` to the `Checkpoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date_utc` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date_utc` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date_utc` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appplying_date_utc` to the `eventJoinRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appplying_date_utc` to the `teamJoinRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `join_date_utc` to the `teamsEvents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "join_date",
ADD COLUMN     "join_date_utc" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Checkpoint" DROP COLUMN "create_date",
ADD COLUMN     "create_date_utc" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "create_date",
ADD COLUMN     "create_date_utc" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "create_date",
ADD COLUMN     "create_date_utc" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "create_date",
ADD COLUMN     "create_date_utc" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "eventJoinRequests" DROP COLUMN "appplyingDate",
ADD COLUMN     "appplying_date_utc" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "teamJoinRequests" DROP COLUMN "appplyingDate",
ADD COLUMN     "appplying_date_utc" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "teamsEvents" ADD COLUMN     "join_date_utc" BIGINT NOT NULL;

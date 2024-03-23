-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "join_date_utc" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Checkpoint" ALTER COLUMN "create_date_utc" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "create_date_utc" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "start_date_utc" SET DATA TYPE BIGINT,
ALTER COLUMN "end_date_utc" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "create_date_utc" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "create_date_utc" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "eventJoinRequests" ALTER COLUMN "appplying_date_utc" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "teamJoinRequests" ALTER COLUMN "appplying_date_utc" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "teamsEvents" ALTER COLUMN "join_date_utc" SET DATA TYPE BIGINT;

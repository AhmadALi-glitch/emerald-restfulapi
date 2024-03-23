-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_achievment_id_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "achievment_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_achievment_id_fkey" FOREIGN KEY ("achievment_id") REFERENCES "Achievment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

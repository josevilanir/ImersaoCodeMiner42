-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_host_id_fkey";

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "host_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "room_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

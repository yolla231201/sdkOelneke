-- AlterTable
ALTER TABLE "Guru" ADD COLUMN     "mapel" TEXT,
ADD COLUMN     "urutan" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Settings" ALTER COLUMN "id" DROP DEFAULT;

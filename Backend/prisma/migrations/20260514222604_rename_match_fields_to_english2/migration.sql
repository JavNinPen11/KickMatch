/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creado_en` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `creador_id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `hora` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `id_partido` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `max_jugadores` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `ubicacion` on the `Match` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_creador_id_fkey";

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
DROP COLUMN "creado_en",
DROP COLUMN "creador_id",
DROP COLUMN "estado",
DROP COLUMN "fecha",
DROP COLUMN "hora",
DROP COLUMN "id_partido",
DROP COLUMN "max_jugadores",
DROP COLUMN "ubicacion",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "maxPlayers" INTEGER,
ADD COLUMN     "state" "EstadoPartido" NOT NULL DEFAULT 'abierto',
ADD COLUMN     "time" TIME NOT NULL,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

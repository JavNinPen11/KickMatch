/*
  Warnings:

  - You are about to drop the column `maxJugadores` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "maxJugadores",
ADD COLUMN     "max_jugadores" INTEGER;

/*
  Warnings:

  - You are about to drop the `Partido` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Partido" DROP CONSTRAINT "Partido_creador_id_fkey";

-- DropTable
DROP TABLE "Partido";

-- CreateTable
CREATE TABLE "Match" (
    "id_partido" SERIAL NOT NULL,
    "titulo" VARCHAR(100),
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TIME NOT NULL,
    "ubicacion" VARCHAR(255),
    "maxJugadores" INTEGER,
    "estado" "EstadoPartido" NOT NULL DEFAULT 'abierto',
    "creador_id" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id_partido")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_creador_id_fkey" FOREIGN KEY ("creador_id") REFERENCES "User"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "public"."AppointmentType" AS ENUM ('PRESENTIAL', 'ONLINE');

-- CreateTable
CREATE TABLE "public"."appointments" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "public"."AppointmentType" NOT NULL,
    "notes" TEXT,
    "clientId" TEXT NOT NULL,
    "nutritionistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."appointments" ADD CONSTRAINT "appointments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointments" ADD CONSTRAINT "appointments_nutritionistId_fkey" FOREIGN KEY ("nutritionistId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

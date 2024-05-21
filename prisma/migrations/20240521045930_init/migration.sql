-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "officeArea" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "comments" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

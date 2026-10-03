-- CreateTable
CREATE TABLE "AppliedJob" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "applyUrl" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppliedJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppliedJob_appliedAt_idx" ON "AppliedJob"("appliedAt");

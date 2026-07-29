-- Add Razorpay payment details to confirmed registrations.
ALTER TABLE "Registration"
ADD COLUMN "razorpayPaymentId" TEXT,
ADD COLUMN "razorpayOrderId" TEXT,
ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'PAID',
ADD COLUMN "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "Registration_razorpayPaymentId_key"
ON "Registration"("razorpayPaymentId");

CREATE UNIQUE INDEX "Registration_razorpayOrderId_key"
ON "Registration"("razorpayOrderId");

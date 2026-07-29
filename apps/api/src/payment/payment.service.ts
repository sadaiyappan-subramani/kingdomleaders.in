import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly razorpay: Razorpay;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        'RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables',
      );
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  async createOrder(
    amountInPaise: number,
    currency: string = 'INR',
    receipt?: string,
  ): Promise<{ order_id: string; amount: number; currency: string }> {
    if (amountInPaise < 100) {
      throw new BadRequestException('Amount must be at least 100 paise (₹1)');
    }

    try {
      const order = await this.razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
      });

      this.logger.log(`Created Razorpay order: ${order.id}`);

      return {
        order_id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
      };
    } catch (error: any) {
      this.logger.error('Failed to create Razorpay order', error);
      throw new InternalServerErrorException(
        error?.error?.description || 'Failed to create payment order',
      );
    }
  }

  verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new InternalServerErrorException('Razorpay secret not configured');
    }

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  }
}

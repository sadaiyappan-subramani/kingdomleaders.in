import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * POST /payment/create-order
   * Creates a Razorpay order and returns order_id, amount, currency.
   */
  @Post('create-order')
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() dto: CreateOrderDto) {
    const order = await this.paymentService.createOrder(
      dto.amount,
      dto.currency || 'INR',
      dto.receipt,
    );
    return { success: true, ...order };
  }

  /**
   * POST /payment/verify
   * Verifies Razorpay payment signature using HMAC-SHA256.
   * Returns 400 if signature mismatch — does NOT mark as paid.
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyPayment(@Body() dto: VerifyPaymentDto) {
    const isValid = this.paymentService.verifyPayment(
      dto.razorpay_order_id,
      dto.razorpay_payment_id,
      dto.razorpay_signature,
    );

    if (!isValid) {
      throw new BadRequestException(
        'Payment signature verification failed. Payment not authorised.',
      );
    }

    return {
      success: true,
      message: 'Payment verified successfully',
      payment_id: dto.razorpay_payment_id,
      order_id: dto.razorpay_order_id,
    };
  }
}

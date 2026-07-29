import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @Min(100, { message: 'Amount must be at least 100 paise (₹1)' })
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string = 'INR';

  @IsString()
  @IsOptional()
  receipt?: string;
}

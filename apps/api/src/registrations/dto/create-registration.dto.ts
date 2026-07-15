import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  age: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  churchName: string;

  @IsString()
  @IsNotEmpty()
  denomination: string;

  @IsString()
  @IsNotEmpty()
  foodPreference: string;

  @IsString()
  @IsNotEmpty()
  accommodationRequired: string;

  @IsString()
  @IsOptional()
  expectations?: string;

  @IsString()
  @IsNotEmpty()
  agreeToTime: string;
}

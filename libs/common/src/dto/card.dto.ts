import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CardDto {
  // coppied from stripe credit card1 object
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  exp_month: number;

  @IsNumber()
  exp_year: number;

  @IsCreditCard()
  number: string;
}

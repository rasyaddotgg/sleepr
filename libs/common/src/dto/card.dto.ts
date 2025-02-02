import { Field, InputType } from '@nestjs/graphql';
import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CardDto {
  // coppied from stripe credit card1 object
  @IsString()
  @IsNotEmpty()
  @Field()
  cvc: string;

  @IsNumber()
  @Field()
  exp_month: number;

  @IsNumber()
  @Field()
  exp_year: number;

  @IsCreditCard()
  @Field()
  number: string;
}

import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from '../dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-06-20',
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  async createCharge({ amount, card, email }: PaymentsCreateChargeDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: { token: 'tok_mastercard' },
    });
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      confirm: true,
      payment_method: paymentMethod.id,
      currency: 'usd',
    });

    this.notificationsService.emit('notify_email', {
      email,
    });

    return paymentIntent;
  }

  async getPayments() {
    const payments = await this.stripe.paymentIntents.list();
    return payments.data;
  }
}

// bisa juga pake ini

// const paymentMethod = await this.stripe.paymentMethods.create({
//   type: 'card',
//   card: { token: 'tok_mastercard' },
// });
// const paymentIntent = await this.stripe.paymentIntents.create({
//   amount: amount * 100,
//   automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
//   confirm: true,
//   payment_method: paymentMethod.id,
//   currency: 'usd',
// });
// return paymentIntent;
// const paymentMethod = await this.stripe.paymentMethods.create({
//   type: 'card',
//   card,
// });

// const paymentIntent = await this.stripe.paymentIntents.create({
//   payment_method: paymentMethod.id,
//   // we multiply amount by 100 because by default
//   // this will be the smallest unit ( cent ) of currency
//   // to get dollar amount
//   amount: amount * 100,
//   confirm: true,
//   payment_method_types: ['card'],
//   currency: 'usd',
// });

// return paymentIntent;

import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from '../dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private notificationsService: NotificationsServiceClient;

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-06-20',
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
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

    if (!this.notificationsService) {
      this.notificationsService =
        this.client.getService<NotificationsServiceClient>(
          NOTIFICATIONS_SERVICE_NAME,
        );
    }

    this.notificationsService.notifyEmail({ email, text: 'test' }).subscribe();

    return paymentIntent;
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

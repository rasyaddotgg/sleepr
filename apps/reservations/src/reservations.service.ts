import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import {
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
  UserDto,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentsService: PaymentsServiceClient;

  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENTS_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentsService = this.client.getService<PaymentsServiceClient>(
      PAYMENTS_SERVICE_NAME,
    );
  }

  async create(
    createReservationDto: CreateReservationDto,
    { _id, email }: UserDto,
  ) {
    return this.paymentsService
      .createCharge({
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map((res) => {
          return this.reservationRepository.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId: _id,
          });
        }),
      );
  }

  findAll() {
    return this.reservationRepository.find({});
  }

  findOne(id: string) {
    return this.reservationRepository.findOne({ _id: id });
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      {
        _id: id,
      },
      updateReservationDto,
    );
  }

  remove(id: string) {
    return this.reservationRepository.findOneAndDelete({ _id: id });
  }
}

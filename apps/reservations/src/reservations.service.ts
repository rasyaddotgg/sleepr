import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { id, email }: UserDto,
  ) {
    return this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map((res) => {
          return this.prismaService.reservation.create({
            data: {
              startDate: createReservationDto.startDate,
              endDate: createReservationDto.endDate,
              InvoiceId: res.invoiceId,
              timestamp: new Date(),
              userId: id,
            },
          });
        }),
      );
  }

  findAll() {
    return this.prismaService.reservation.findMany({});
  }

  findOne(id: number) {
    return this.prismaService.reservation.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.prismaService.reservation.update({
      where: { id },
      data: updateReservationDto,
    });
  }

  remove(id: number) {
    return this.prismaService.reservation.delete({ where: { id } });
  }
}

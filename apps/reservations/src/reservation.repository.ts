import { AbstractRepostory } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Reservation } from './models/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReservationRepository extends AbstractRepostory<Reservation> {
  protected logger: Logger = new Logger(ReservationRepository.name);

  constructor(
    @InjectRepository(Reservation)
    reservationRepository: Repository<Reservation>,
    entityManager: EntityManager,
  ) {
    super(reservationRepository, entityManager);
  }
}

import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Ficha } from '../entities/Ficha';
import { Instructor } from '../entities/Instructor';
import { Ambiente } from '../entities/Ambiente';
import { Horario } from '../entities/Horario';

function createTimestampSubscriber<T extends { createdAt?: Date }>(
  entity: new () => T
) {
  @EventSubscriber()
  class Subscriber implements EntitySubscriberInterface<T> {
    listenTo() {
      return entity;
    }

    beforeInsert(event: InsertEvent<T>): void {
      if (event.metadata.columns.find((c) => c.propertyName === 'createdAt')) {
        (event.entity as { createdAt?: Date }).createdAt = new Date();
      }
    }
  }
  return Subscriber;
}

export const TimestampSubscriberFicha = createTimestampSubscriber(Ficha);
export const TimestampSubscriberInstructor = createTimestampSubscriber(Instructor);
export const TimestampSubscriberAmbiente = createTimestampSubscriber(Ambiente);
export const TimestampSubscriberHorario = createTimestampSubscriber(Horario);

export const TimestampSubscribers = [
  TimestampSubscriberFicha,
  TimestampSubscriberInstructor,
  TimestampSubscriberAmbiente,
  TimestampSubscriberHorario,
];

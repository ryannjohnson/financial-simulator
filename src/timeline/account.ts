import { stringFromJSON } from '../utils';
import { Effect, EffectJSON } from './effect';
import { Event, EventJSON } from './event';

export type AccountJSON = {
  effects: EffectJSON[];
  events: EventJSON[];
  name: string;
};

export class Account {
  public static fromJSON(value: AccountJSON): Account {
    const events = value.events.map(Event.fromJSON);
    const effects = value.effects.map(Effect.fromJSON);
    const name = stringFromJSON(value.name);
    return new Account(events, effects, name);
  }

  constructor(
    public events: Event[],
    public effects: Effect[],
    public name: string,
  ) {}

  public toJSON(): AccountJSON {
    return {
      effects: this.effects.map(a => a.toJSON()),
      events: this.events.map(a => a.toJSON()),
      name: this.name,
    };
  }
}

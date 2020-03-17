import { Event } from './event';

export class Timeline {
  public events = new Map<string, Event>();

  constructor(events: Event[]) {
    for (const event of events) {
      this.events.set(event.id(), event);
    }
  }

  public setEvent(event: Event) {
    this.events.set(event.id(), event);
  }
}

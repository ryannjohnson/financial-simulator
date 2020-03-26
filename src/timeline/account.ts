import { stringFromJSON } from '../utils';

export type AccountJSON = {
  effectIds: string[];
  id: string;
  name: string;
};

export class Account {
  public static fromJSON(value: AccountJSON): Account {
    const id = stringFromJSON(value.id);
    const effectIds = value.effectIds.map(stringFromJSON);
    const name = stringFromJSON(value.name);
    return new Account(id, effectIds, name);
  }

  constructor(
    public readonly id: string,
    public effectIds: string[],
    public name: string,
  ) {}

  public toJSON(): AccountJSON {
    return {
      effectIds: this.effectIds,
      id: this.id,
      name: this.name,
    };
  }
}

export type TrackItem = {
  id: string;
  type: TrackItemType;
};

export enum TrackItemType {
  Effect = 'EFFECT',
  Event = 'EVENT',
}

export function toString(trackItem: TrackItem): string {
  return `${trackItem.type}|${trackItem.id}`;
}

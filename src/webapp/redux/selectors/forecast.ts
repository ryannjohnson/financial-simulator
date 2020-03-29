import { CalendarDateJSON } from '../../../calendar-date';
import { State } from '../reducer';
import { TrackItem, TrackItemType } from '../reducer/forecast/props';

export function getChart(state: State) {
  return state.forecast.chart;
}

export function getEffect(state: State, effectId: string) {
  const effectJSON = state.forecast.effects[effectId];

  if (!effectJSON) {
    throw new Error(`Event by id "${effectId}" does not exist`);
  }

  return effectJSON;
}

export function getEvent(state: State, eventId: string) {
  const eventJSON = state.forecast.events[eventId];

  if (!eventJSON) {
    throw new Error(`Event by id "${eventId}" does not exist`);
  }

  return eventJSON;
}

export type TrackItemDetails = {
  endsOn: CalendarDateJSON | null;
  id: string;
  name: string;
  orientation: Orientation;
  type: TrackItemType;
  startsOn: CalendarDateJSON | null;
  trackIndex: number;
};

export enum Orientation {
  In = 'IN',
  Neutral = 'NEUTRAL',
  Out = 'OUT',
}

export function getTrackItemDetails(
  state: State,
  trackItem: TrackItem,
  accountId: string,
): TrackItemDetails {
  const trackIndex = getTrackItemTrackIndex(state, trackItem, accountId);
  let orientation = Orientation.Neutral;

  if (trackItem.type === TrackItemType.Effect) {
    const effect = state.forecast.effects[trackItem.id];
    return {
      ...trackItem,
      endsOn: effect.endsOn,
      name: effect.name,
      orientation,
      startsOn: effect.startsOn,
      trackIndex,
    };
  }

  if (trackItem.type === TrackItemType.Event) {
    const event = state.forecast.events[trackItem.id];

    if (event.fromAccountId === accountId) {
      orientation = Orientation.Out;
    } else if (event.toAccountId === accountId) {
      orientation = Orientation.In;
    }

    return {
      ...trackItem,
      endsOn: event.endsOn,
      name: event.name,
      orientation,
      startsOn: event.startsOn,
      trackIndex,
    };
  }

  throw new Error(`TrackItemType "${trackItem.type}" is not implemented yet`);
}

export function getTrackItemTrackIndex(
  state: State,
  trackItem: TrackItem,
  accountId: string,
) {
  const { tracks } = getAccountWrapper(state, accountId);

  let index = -1;
  for (const track of tracks) {
    index += 1;
    for (const item of track.items) {
      if (item.type === trackItem.type && item.id === trackItem.id) {
        return index;
      }
    }
  }

  throw new Error(
    `Cannot find trackItem by id "${trackItem.id}" and type ${trackItem.type}`,
  );
}

export function getSelectedAccountWrapper(state: State) {
  const { accountId } = state.forecast.timeline;

  if (!accountId) {
    return null;
  }

  return getAccountWrapper(state, accountId);
}

export function getAccountWrappers(state: State) {
  return state.forecast.accountWrappers;
}

export function getAccountWrapper(state: State, accountId: string) {
  const accountWrapper = state.forecast.accountWrappers.find(
    a => a.account.id === accountId,
  );

  if (!accountWrapper) {
    throw new Error(`Account by id "${accountId}" does not exist`);
  }

  return accountWrapper;
}

export function getSelectedTrackItem(state: State) {
  return state.forecast.selectedTrackItem;
}

export function getTimelineChartSampleSize(state: State) {
  return state.forecast.timeline.chartSampleSize;
}

export function getTimelineEndsOn(state: State) {
  return state.forecast.timeline.endsOn;
}

export function getTimelineStartsOn(state: State) {
  return state.forecast.timeline.startsOn;
}

export function getTrack(state: State, id: string) {
  for (const { tracks } of state.forecast.accountWrappers) {
    const track = tracks.find(t => t.id === id);

    if (track) {
      return track;
    }
  }

  throw new Error(`Track not found by id "${id}"`);
}

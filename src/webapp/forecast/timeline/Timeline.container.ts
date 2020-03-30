import { connect } from 'react-redux';

import * as actions from '../../redux/actions';
import { State } from '../../redux/reducer';
import { TrackItem } from '../../redux/reducer/forecast/props';
import * as selectors from '../../redux/selectors';
import TimelineComponent from './Timeline.component';

type Props = {
  accountId: string;
};

const mapState = (state: State, props: Props) => {
  const accountWrapper = selectors.forecast.getAccountWrapper(
    state,
    props.accountId,
  );

  let trackIds: string[] = [];
  let trackItems: TrackItem[] = [];
  for (const track of accountWrapper.tracks) {
    trackIds = [...trackIds, track.id];
    trackItems = [...trackItems, ...track.items];
  }

  return {
    trackIds,
    trackItems: [...trackItems].sort(lexographically),
  };
};

const mapDispatch = {
  addTrack: actions.forecast.addTrack,
  selectTrackItem: actions.forecast.selectTrackItem,
};

export default connect(mapState, mapDispatch)(TimelineComponent);

function lexographically(a: TrackItem, b: TrackItem): number {
  const byId = a.id.localeCompare(b.id);

  if (byId !== 0) {
    return byId;
  }

  return a.type.localeCompare(b.type);
}

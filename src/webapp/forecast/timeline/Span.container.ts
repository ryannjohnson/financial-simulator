import { connect } from 'react-redux';

import * as actions from '../../redux/actions';
import { State } from '../../redux/reducer';
import { TrackItem } from '../../redux/reducer/forecast/props';
import * as selectors from '../../redux/selectors';
import SpanComponent from './Span.component';

type Props = TrackItem & {};

const mapState = (state: State, props: Props) => {
  const accountWrapper = selectors.forecast.getSelectedAccountWrapper(state);

  if (!accountWrapper) {
    throw new Error('Span cannot exist without an account');
  }

  const {
    endsOn,
    name,
    orientation,
    startsOn,
    trackIndex,
  } = selectors.forecast.getTrackItemDetails(
    state,
    props,
    accountWrapper.account.id,
  );

  const selectedTrackItem = selectors.forecast.getSelectedTrackItem(state);

  const isSelected =
    selectedTrackItem !== null &&
    selectedTrackItem.type === props.type &&
    selectedTrackItem.id === props.id;

  return {
    accountId: accountWrapper.account.id,
    endsOn,
    isSelected,
    label: name || `[${props.type} ${props.id}]`,
    orientation,
    startsOn,
    timelineEndsOn: state.forecast.timeline.endsOn,
    timelineStartsOn: state.forecast.timeline.startsOn,
    trackIndex,
  };
};

const mapDispatch = {
  selectTrackItem: actions.forecast.selectTrackItem,
  setCalendarDates: actions.forecast.setTrackItemCalendarDates,
  setEndsOn: actions.forecast.setTrackItemEndsOn,
  setStartsOn: actions.forecast.setTrackItemStartsOn,
};

export default connect(mapState, mapDispatch)(SpanComponent);

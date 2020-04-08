import { connect } from 'react-redux';

import * as actions from '../../redux/actions';
import { State } from '../../redux/reducer';
import * as selectors from '../../redux/selectors';
import { TrackItem } from '../../track-item';
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
    shortDescription,
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

  const accruedAmount = selectors.forecast.getTrackItemAccruedAmount(
    state,
    props,
  );

  return {
    accountId: accountWrapper.account.id,
    accruedAmountCurrency: accruedAmount ? accruedAmount.currency : null,
    accruedAmountValue: accruedAmount ? accruedAmount.value : null,
    endsOn,
    isSelected,
    name,
    orientation,
    shortDescription,
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

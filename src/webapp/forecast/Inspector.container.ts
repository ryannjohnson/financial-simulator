import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import InspectorComponent from './Inspector.component';

const mapState = (state: State) => {
  const selectedAccountWrapper = selectors.forecast.getSelectedAccountWrapper(
    state,
  );

  return {
    selectedAccountId: selectedAccountWrapper
      ? selectedAccountWrapper.account.id
      : null,
    selectedTrackItem: selectors.forecast.getSelectedTrackItem(state),
  };
};

const mapDispatch = {
  exportTimeline: actions.forecast.exportTimeline,
  importTimeline: actions.forecast.importTimeline,
  removeEffect: actions.forecast.removeEffect,
  removeEvent: actions.forecast.removeEvent,
  setEvent: actions.forecast.setEvent,
};

export default connect(mapState, mapDispatch)(InspectorComponent);

import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import EventAccountIdsComponent from './EventAccountIds.component';

type Props = {
  eventId: string;
};

const mapState = (state: State, props: Props) => {
  const accounts = selectors.forecast
    .getAccountWrappers(state)
    .map(a => a.account);

  const event = selectors.forecast.getEvent(state, props.eventId);

  return {
    accounts,
    fromAccountId: event.fromAccountId,
    toAccountId: event.toAccountId,
  };
};

const mapDispatch = {
  setEventAccountIds: actions.forecast.setEventAccountIds,
};

export default connect(mapState, mapDispatch)(EventAccountIdsComponent);

import debounceRender from 'react-debounce-render';
import { connect } from 'react-redux';

import { EffectJSON, EventJSON } from '../../timeline';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import ChartComponent from './Chart.component';

const mapState = (state: State) => {
  const { currency } = state.forecast.chart;

  const {
    accountId,
    chartSampleSize,
    endsOn,
    startsOn,
  } = state.forecast.timeline;

  let effects: EffectJSON[] = [];
  let events: EventJSON[] = [];

  if (accountId) {
    const accountWrapper = selectors.forecast.getAccountWrapper(
      state,
      accountId,
    );
    effects = accountWrapper.account.effectIds.map(a =>
      selectors.forecast.getEffect(state, a),
    );
    events = Object.values(state.forecast.events)
      .filter(a => a.fromAccountId === accountId || a.toAccountId === accountId)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  return {
    accountId,
    chartSampleSize,
    currency,
    effects,
    endsOn,
    events,
    startsOn,
  };
};

const debounced = debounceRender(ChartComponent, 100, { leading: false });

export default connect(mapState)(debounced);

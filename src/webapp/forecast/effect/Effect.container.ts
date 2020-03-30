import { connect } from 'react-redux';

import * as actions from '../../redux/actions';
import { State } from '../../redux/reducer';
import * as selectors from '../../redux/selectors';
import EffectComponent from './Effect.component';

type Props = {
  effectId: string;
};

const mapState = (state: State, props: Props) => {
  const accountWrapper = selectors.forecast.getSelectedAccountWrapper(state);
  const accountId = accountWrapper ? accountWrapper.account.id : null;
  const effect = selectors.forecast.getEffect(state, props.effectId);

  return {
    accountId,
    ...effect,
  };
};

const mapDispatch = {
  setEffect: actions.forecast.setEffect,
};

export default connect(mapState, mapDispatch)(EffectComponent);

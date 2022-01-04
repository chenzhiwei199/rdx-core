import React, { useEffect } from 'react';
import { useRdxStateContext } from '../core/stateHooks';
import { RdxStore } from '../core/RdxStore';

const Batcher = (props: {
  setNotifyBatcherOfChange: any;
  context: React.Context<RdxStore>;
}) => {
  const [state, dispatch] = React.useReducer((s) => ({}), {});
  const storeRef = useRdxStateContext();
  // props.setNotifyBatcherOfChange(() => dispatch());
  useEffect(() => {
    if (storeRef.getUiQueue().size > 0) {
      // logger.info('UI Batcher', Array.from(storeRef.getUiQueue()));
      Array.from(storeRef.getUiQueue()).forEach((id) => {
        storeRef.getEventEmitter().emit(id);
      });
      storeRef.getUiQueue().clear();
    }
  });
  return null;
};

export default Batcher;

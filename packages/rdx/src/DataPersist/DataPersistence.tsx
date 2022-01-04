import * as React from 'react';
import { useRdxStateContext, RdxStore } from '../core';
import { NodeStatus } from '../graph';
import {
  DataPersistSnapShot,
  getDefaultSnapShot,
  IStateInfo,
  DataPersistType,
} from '../types/dataPersistType';

export enum DISPLAY_STATE {
  CANCEL = 'CANCEL',
  CONFLICT = 'CONFLICT',
}

export const stateColors = {
  [NodeStatus.Error]: 'red',
  [NodeStatus.Waiting]: 'rgb(230,189,45)',
  [NodeStatus.IDeal]: 'grey',
  [NodeStatus.IDeal]: 'grey',
  [DISPLAY_STATE.CANCEL]: 'pink',
  [DISPLAY_STATE.CONFLICT]: 'purple',
  init: 'rgb(165, 189,249)',
};
export const stateLabel = {
  init: '初始化',
  [NodeStatus.Error]: '错误',
  [NodeStatus.Waiting]: '运行',
  [NodeStatus.IDeal]: '运行结束',
  [DISPLAY_STATE.CANCEL]: '取消',
  [DISPLAY_STATE.CONFLICT]: '冲突',
};
export interface IGraph<IModel> {
  context: RdxStore;
}

export enum GraphType {
  Global = 'Global',
  PreRunning = 'PreRunning',
  Trigger = 'Trigger',
  EffectPoints = 'EffectPoints',
  ConflictPoints = 'ConflictPoints',
  AllPointsNow = 'AllPointsNow',
  RunnningPointsNotCut = 'RunnningPointsNotCut',
  BuildDAG = 'BuildDAG',
  RunnningPointsCut = 'RunnningPointsCut',
}
export interface IGraphState {
  version: number;
  visible: boolean;
  statusVersion: number;
}

export interface IDataPersistenData {
  realTimeState: any;
  allSnapShots: DataPersistSnapShot[];
  snapShots: DataPersistSnapShot[];
  temporarySnapShots: DataPersistSnapShot;
}
const isBrowser = () => typeof window !== 'undefined';
const DataPersistenceHook = () => {
  const context = useRdxStateContext();
  const temporarySnapShots = React.useRef(null);
  React.useMemo(() => {
    isBrowser() && ((window as any).__EASYCANVAS_DEVTOOL__ = true);
  }, []);
  function dispatchData() {
    if (temporarySnapShots.current && isBrowser()) {
      // Target can be any Element or other EventTarget.
      // logger.warn(temporarySnapShots.current);
      // document.dispatchEvent(new CustomEvent('__EASYCANVAS_BRIDGE_TOPANEL__', {
      //   detail:JSON.parse(JSON.stringify(temporarySnapShots.current)),
      // }))
    }
  }
  const initSnapShot = React.useCallback((type: DataPersistType) => {
    dispatchData();
    temporarySnapShots.current = getDefaultSnapShot(type);
  }, []);
  const mergeTemporarySnapShots = React.useCallback(() => {
    dispatchData();
    temporarySnapShots.current = null;
  }, []);

  const deleteEvent = React.useMemo(() => {
    context.getSubject().on(DataPersistType.UserAction, () => {
      initSnapShot(DataPersistType.UserAction);
    });

    context
      .getSubject()
      .on(DataPersistType.DynamicDepsUpdate, ({ type, process }) => {
        initSnapShot(type);
        temporarySnapShots.current = {
          ...temporarySnapShots.current,
          ...process,
        };
      });
    context.getSubject().on(DataPersistType.TaskLoad, ({ type, process }) => {
      initSnapShot(type);
      temporarySnapShots.current = {
        ...temporarySnapShots.current,
        ...process,
      };
    });
    context.getSubject().on(DataPersistType.Trigger, ({ type, process }) => {
      initSnapShot(type);
      temporarySnapShots.current = {
        ...temporarySnapShots.current,
        ...process,
      };
    });
    const endTypes = [
      DataPersistType.TaskLoadEnd,
      DataPersistType.TaskExecutingEnd,
    ];
    for (let type of endTypes) {
      context.getSubject().on(type, (process) => {
        temporarySnapShots.current = {
          ...temporarySnapShots.current,
          ...process,
        };
        mergeTemporarySnapShots();
      });
    }
    context
      .getSubject()
      .on(DataPersistType.StateChange, (stateInfo: IStateInfo) => {
        temporarySnapShots.current = {
          ...temporarySnapShots.current,
          states: [
            ...(temporarySnapShots.current && temporarySnapShots.current.states
              ? temporarySnapShots.current.states
              : []),
            stateInfo,
          ],
        };
      });
    return () => {
      const ee = context.getSubject();
      ee.removeAllListeners(DataPersistType.TaskLoad);
    };
  }, []);
  React.useEffect(() => {
    return () => {
      deleteEvent();
    };
  }, []);
  return {
    realTimeState: context.getAllTaskState(),
  };
};

export default DataPersistenceHook;

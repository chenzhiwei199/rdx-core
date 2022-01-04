import React, { useMemo, useRef } from 'react';
import {
  compute,
  DefaultValue,
  RdxContext,
  RdxState,
  atom,
  useRdxState,
  useRdxReset,
  atomFamily,
} from '@alife/rdx';

export default {
  title: 'EffectTest',
  parameters: {
    info: { inline: true },
  },
};
const rootAtom = atom({
  id: 'root',
  defaultValue: 2,
});
const relyAtom = atom({
  id: 'relyAtom',
  effects: [
    ({ setSelf, onDependenciesSet }) => {
      onDependenciesSet(
        (v) => {
          console.log('deps change', v);
          setSelf(0);
        },
        [rootAtom]
      );
    },
  ],
  defaultValue: 3,
});
const relyAtomFamily = atomFamily({
  id: 'relyAtomFamily',
  defaultValue: 4,
  effects: () => [({ setSelf, onDependenciesSet }) => {
    onDependenciesSet(
      (v) => {
        console.log('deps change', v);
        setSelf(0);
      },
      [rootAtom]
    );
  },]
})
const localStorageEffect = (key: string, transform: (v: any) => any ) => {
  return ({ setSelf, onSet }) => {
    const v = localStorage.getItem(key);
    if (v !== null) {
      setSelf(transform(v));
    }
    onSet((newValue, preValue) => {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(key)
      } else {
        // 数据同步到localStorage中
        localStorage.setItem(key, newValue.toString());
      }
    });
  }
}
const localStorageAtom = atom({
  id: 'localStorageAtom',
  defaultValue: 0,
  effects: [
    ({ setSelf, onSet }) => {
      const v = localStorage.getItem('test');
      if (v !== null) {
        setSelf(parseInt(v));
      }
      onSet((newValue, preValue) => {
        if (newValue instanceof DefaultValue) {
          localStorage.removeItem('test')
        } else {
          // 数据同步到localStorage中
          localStorage.setItem('test', newValue.toString());
        }
      });
    },
  ],
});
interface ICommand {
  label: string;
  redo: () => void;
  undo: () => void;
}
function createHistory() {
  let undoStack: Array<ICommand> = [];
  let reDoStack: Array<ICommand> = [];
  const execute = (command: ICommand, isRedo: boolean = false) => {
    undoStack.push(command);
    // 用户操作，则清空redo,如果是redo的执行，则不清空
    if (reDoStack.length !== 0 && !isRedo) {
      reDoStack = [];
    }
  };
  return {
    redoStackLabel: () => {
      return reDoStack.map((item) => item.label).join(',');
    },
    undoStackLabel: () => {
      return undoStack.map((item) => item.label).join(',');
    },
    undo: () => {
      if (undoStack.length === 0) {
        alert('没有更旧的版本了');
      } else {
        const pop = undoStack.pop();
        pop.undo();
        reDoStack.push(pop);
      }
    },
    redo: () => {
      if (reDoStack.length === 0) {
        alert('已经是最新的');
      } else {
        const redoCommand = reDoStack.pop();
        redoCommand.redo();
      }
    },
    execute,
  };
}
const history = createHistory();
const historyEffect = (name) => ({ setSelf, onSet }) => {
  onSet((newValue, oldValue) => {
    function execute(oldValue, newValue, clear = false) {
      history.execute(
        {
          label: `${name}: ${JSON.stringify(oldValue)} -> ${JSON.stringify(
            newValue
          )}`,
          undo: () => {
            setSelf(oldValue);
          },
          redo: () => {
            setSelf((oldValue) => {
              execute(oldValue, newValue, true);
              return newValue;
            });
          },
        },
        clear
      );
    }
    execute(oldValue, newValue);
  });
};
const historySample = atom({
  id: 'historySample',
  defaultValue: 0,
  effects: [historyEffect('test')],
});
const areaAtom = atom({
  id: 'areaAtom',
  defaultValue: 0,
  effects: [
    ({ onSet }) => {
      onSet((newValue, preValue) => {
        console.log('日志记录', `${preValue} => ${newValue}`);
      });
    },
  ],
});

const areaAtomSelfCount = atom({
  id: 'areaAtomSelfCount',
  defaultValue: 0,
  effects: [
    ({ onSet, setSelf, resetSelf }) => {
      onSet((newValue, preValue) => {
        if (newValue instanceof DefaultValue) {
          resetSelf();
        } else {
          setSelf(newValue + 1);
        }
      });
    },
  ],
});

const setDefaultAtom = atom({
  id: 'setDefaultAtom',
  defaultValue: 0,
  effects: [
    ({ onSet, setSelf }) => {
      setSelf(1);
    },
  ],
});

const setAsyncDefaultAtom = atom({
  id: 'setAsyncDefaultAtom',
  defaultValue: 0,
  effects: [
    ({ onSet, setSelf }) => {
      setTimeout(() => {
        setSelf(1);
      }, 2000);
    },
  ],
});
const areaCompute = compute({
  id: 'areaCompute',
  get: ({ get }) => {
    return get(areaAtom);
  },
  set: ({ set }, newValue) => {
    set(areaAtom, newValue);
  },
});

const BaseTest = (props: { title: string; state: RdxState<any> }) => {
  const { title, state } = props;
  const [computeState, setComputeState] = useRdxState(state);
  const reset = useRdxReset(state);
  return (
    <div>
      <h2>{title}</h2>
      <button
        onClick={() => {
          setComputeState(computeState + 1);
        }}
      >
        {title} {computeState}
      </button>
      <button
        onClick={() => {
          reset();
        }}
      >
        重置
      </button>
    </div>
  );
};
const HistoryTest = () => {
  const [computeState, setComputeState] = useRdxState(historySample);
  console.log('history: ', history);
  return (
    <div>
      <h2>历史记录</h2>
      <button
        onClick={() => {
          setComputeState(computeState + 1);
        }}
      >
        历史记录 {computeState}
      </button>
      <button
        onClick={() => {
          history.undo();
        }}
      >
        undo
      </button>
      <button
        onClick={() => {
          history.redo();
        }}
      >
        redo
      </button>
      <div>undo: {history.undoStackLabel()}</div>
      <div>redo: {history.redoStackLabel()}</div>
    </div>
  );
};

const DepsTest = () => {
  const [rootState, setRootState] = useRdxState(rootAtom);
  const [relyState, setRelyState] = useRdxState(relyAtom);
  // const [relyFamilyState, setRelyFamilyState] = useRdxState(relyAtomFamily('hahah'));
  return (
    <div>
      <h2>DEPS test</h2>
      <button
        onClick={() => {
          setRootState(rootState + 1);
        }}
      >
        {rootState}
      </button>
      <button
        onClick={() => {
          setRelyState(relyState + 1);
        }}
      >
        {relyState}
      </button>
      {/* <button
        onClick={() => {
          setRelyFamilyState(relyFamilyState + 1);
        }}
      >
        {relyFamilyState}
      </button> */}
    </div>
  );
};

export const 简单搜索列表_查询控制 = () => {
  return (
    <RdxContext>
      <BaseTest title='history Sample' state={areaAtom} />
      <BaseTest title='onSet监听并自增Compute测试' state={areaAtomSelfCount} />
      <BaseTest title='重置测试' state={areaCompute} />
      <BaseTest title='同步默认值设置测试' state={setDefaultAtom} />
      <BaseTest title='异步默认值设置测试' state={setAsyncDefaultAtom} />
      <BaseTest title='同步localStorage状态' state={localStorageAtom} />
      <HistoryTest />
      <DepsTest />
    </RdxContext>
  );
};

import * as React from 'react';
import {
  formBuilder,
  FormLayout,
  IFormComponentProps,
  LayoutType,
  ObjectField,
  useRdxRefresh,
  FormStore,
  isLoading,
  compute,
  ArrayCardField,
} from '@alife/rdx-form';
import {
  Input,
  DatePicker,
  Select,
  Button,
  Notification,
  NumberPicker,
} from '@alife/hippo';
import '@alife/hippo/dist/hippo.css';
import { InputProps } from '@alife/hippo/lib/input';
import { RangePickerProps } from '@alife/hippo/lib/date-picker';
import { SelectProps } from '@alife/hippo/lib/select';
import { NumberInputProps } from '@alife/hippo/lib/number-input';
import { ArrayTableField } from '@alife/hippo-form-library';

const { RangePicker } = DatePicker;
export default {
  title: '例子',
  parameters: {
    info: { inline: true },
  },
};

interface IModel {
  startDate: string;
  endDate: string;
  country: string;
  province: string;
  city: string;
  test: number;
  useIds: string[];
  useIds2: string[];
  count: number;
  user: {
    name: string;
    title: string;
  };
}

// const proxy = new Proxy({} as { [key: string]: any }, {
//   get: (obj, prop) => {
//     return obj[prop as any];
//   },
// });
const baseForm = formBuilder({
  components: {
    object: ObjectField,
    array: ArrayCardField,
    arrayTable: ArrayTableField,
    number: (props: IFormComponentProps<NumberInputProps>) => {
      const { componentProps, ...rest } = props;
      return <NumberPicker {...rest} {...componentProps} />;
    },
    string: (props: IFormComponentProps<InputProps>) => {
      const { componentProps, ...rest } = props;
      return <Input {...rest} {...componentProps} />;
    },
    input: (props: IFormComponentProps<InputProps>) => {
      const { componentProps, ...rest } = props;
      return <Input {...rest} {...componentProps} />;
    },
    select: (props: IFormComponentProps<SelectProps>) => {
      const { componentProps } = props;
      return <Select {...props} {...componentProps} />;
    },
    rangePicker: (props: IFormComponentProps<RangePickerProps>) => {
      return <RangePicker {...props} {...props.componentProps} />;
    },
  },
});
const AreaForms = baseForm<IModel>();

export const 多个属性对应一个视图 = () => {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <AreaForms.FormItem
        title='区间选择'
        defaultValue={['2020-01-06', '2020-01-07']}
        name='startDate|endDate'
        type='array'
        require
        componentType='rangePicker'
      />
    </AreaForms.RdxFormRoot>
  );
};
export const 一个属性对应多个视图 = () => {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <AreaForms.FormItem
        title='省份【1】'
        name='province'
        require={true}
        type='string'
        componentType='input'
      />
      <AreaForms.FormItem
        title='省份【2】'
        alias={'province-copy'}
        name='province'
        type='string'
        componentType='input'
      />
    </AreaForms.RdxFormRoot>
  );
};
export const 数据结构和视图结构不一致 = () => {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <AreaForms.FormItem name='user' type='object'>
        <AreaForms.FormItem
          type='string'
          title='用户名称'
          name='name'
        ></AreaForms.FormItem>
      </AreaForms.FormItem>
      <AreaForms.FormItem name='user' type='object'>
        <AreaForms.FormItem
          type='string'
          title='职位'
          name='title'
        ></AreaForms.FormItem>
      </AreaForms.FormItem>
    </AreaForms.RdxFormRoot>
  );
};
const BaseView = () => {
  return (
    <FormLayout layoutType={LayoutType.Classic}>
      <AreaForms.FormItem
        title='省份'
        require
        name='province'
        type='string'
        componentType='input'
      ></AreaForms.FormItem>
      <AreaForms.FormItem
        title='城市'
        require
        name='city'
        type='string'
        componentType='input'
      ></AreaForms.FormItem>
    </FormLayout>
  );
};
function ModifyStateInner() {
  const [state, setState] = AreaForms.useReferencedFormValueState('province');
  return (
    <div>
      <div>当前省份: {state.content}</div>
      <Button
        onClick={() => {
          setState('浙江省');
        }}
      >
        {' '}
        省份设置为浙江省
      </Button>
    </div>
  );
}
export const Context内部修改值 = () => {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <BaseView />
      <ModifyStateInner />
    </AreaForms.RdxFormRoot>
  );
};
export const Context外部修改值 = () => {
  const storeRef = React.useRef(AreaForms.createFormStore({}));
  return (
    <AreaForms.RdxFormRoot store={storeRef.current} enabledStatePreview={true}>
      <BaseView />
      <Button
        onClick={() => {
          storeRef.current.setFormValue('province', '浙江省');
        }}
      >
        {' '}
        省份设置为浙江省
      </Button>
    </AreaForms.RdxFormRoot>
  );
};

function ModifyStatusInner() {
  const [state, setState] = AreaForms.useReferencedFormStatusState('province');
  const status = ['disabled', 'visible', 'require', 'preview'];
  return (
    <div>
      <pre>当前省份: {JSON.stringify(state.content)}</pre>
      {status.map((item) => (
        <Button
          onClick={() => {
            setState((state) => ({ ...state, [item]: !state[item] }));
          }}
        >
          {' '}
          切换{item}状态
        </Button>
      ))}
    </div>
  );
}

export const 表单作用域外部修改状态 = () => {
  const storeRef = React.useRef(AreaForms.createFormStore({}));
  const status = ['disabled', 'visible', 'require', 'preview'];
  return (
    <AreaForms.RdxFormRoot store={storeRef.current} enabledStatePreview={true}>
      <BaseView />
      {status.map((item) => (
        <Button
          onClick={() => {
            storeRef.current.setFormStatus('province', (state) => ({
              ...state,
              [item]: !state[item],
            }));
          }}
        >
          切换{item}状态
        </Button>
      ))}
    </AreaForms.RdxFormRoot>
  );
};
export const Context内部修改状态 = () => {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <BaseView />
      <ModifyStatusInner />
    </AreaForms.RdxFormRoot>
  );
};

function ModifyComputeInner() {
  //
  const [state, setState] = AreaForms.useReferencedFormComputeState('province');
  const status = ['disabled', 'visible', 'require', 'preview'];
  return (
    <div>
      <pre>当前省份: {JSON.stringify(state.content)}</pre>
      {status.map((item) => (
        <Button
          onClick={() => {
            setState((state) => {
              console.log('state: ', state);
              return { ...state, [item]: !state[item] };
            });
          }}
        >
          {' '}
          切换{item}状态
        </Button>
      ))}
    </div>
  );
}
export const Context内部通过Compute修改状态 = () => {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <BaseView />
      <ModifyComputeInner />
    </AreaForms.RdxFormRoot>
  );
};

export const Context内部校验 = () => {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <BaseView />
      <ValidateInner />
    </AreaForms.RdxFormRoot>
  );
};

export const Context外部校验 = () => {
  const storeRef = React.useRef(AreaForms.createFormStore({}));
  return (
    <AreaForms.RdxFormRoot store={storeRef.current} enabledStatePreview={true}>
      <BaseView />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={() => {
            storeRef.current.validate('province').then((msg) => {
              Notification.warning({
                content: JSON.stringify(msg),
              });
            });
          }}
        >
          校验单个省份
        </Button>
        <Button
          onClick={() => {
            storeRef.current.validate(['province', 'city']).then((msg) => {
              Notification.warning({
                content: JSON.stringify(msg),
              });
            });
          }}
        >
          校验多个：省份 & 城市
        </Button>
        <Button
          onClick={() => {
            storeRef.current.validate().then((msg) => {
              Notification.warning({
                content: JSON.stringify(msg),
              });
            });
          }}
        >
          校验全部
        </Button>
      </div>
    </AreaForms.RdxFormRoot>
  );
};

function ValidateInner() {
  const validate = AreaForms.useValidator();
  return (
    <div>
      <h3>内部校验</h3>
      <Button
        onClick={() => {
          validate('province').then((msg) => {
            Notification.warning({
              content: JSON.stringify(msg),
            });
          });
        }}
      >
        校验单个省份
      </Button>
      <Button
        onClick={() => {
          validate(['province', 'city']).then((msg) => {
            Notification.warning({
              content: JSON.stringify(msg),
            });
          });
        }}
      >
        校验多个：省份 & 城市
      </Button>
      <Button
        onClick={() => {
          validate().then((msg) => {
            Notification.warning({
              content: JSON.stringify(msg),
            });
          });
        }}
      >
        校验全部
      </Button>
    </div>
  );
}

export const 自定义规则校验 = () => {
  const storeRef = React.useRef(AreaForms.createFormStore({}));
  return (
    <AreaForms.RdxFormRoot store={storeRef.current} enabledStatePreview={true}>
      <FormLayout layoutType={LayoutType.Classic}>
        <AreaForms.FormItem
          title='城市'
          require
          name='city'
          type='string'
          componentProps={{
            placeholder: '输入222会提示不合法哦',
          }}
          rules={[
            async ({ value, get }) => {
              if (value.value === '222') {
                return '222不合法';
              }
            },
          ]}
          componentType='input'
        ></AreaForms.FormItem>
      </FormLayout>
    </AreaForms.RdxFormRoot>
  );
};

export const 自动校验 = () => {
  return (
    <AreaForms.RdxFormRoot autoValidate={true}>
      <AreaForms.FormItem
        title='省份'
        name='province'
        type='string'
        componentType='input'
      ></AreaForms.FormItem>
      <AreaForms.FormItem
        title='城市'
        name='city'
        type='string'
        rules={[
          async ({ get }) => {
            if (get('province').value === '222') {
              return '省份不能输入2222';
            }
          },
        ]}
        componentType='input'
      ></AreaForms.FormItem>
    </AreaForms.RdxFormRoot>
  );
};
export const Context数据订阅 = () => {
  const storeRef = React.useRef(AreaForms.createFormStore({}));
  React.useEffect(() => {
    storeRef.current.subscribe('city', (v) => {
      console.log('v: ', v);
    });
  }, []);
  React.useEffect(() => {
    storeRef.current.subscribe(['city', 'province'], (v) => {
      console.log('v2: ', v);
    });
    storeRef.current.subscribeAll((v) => {
      Notification.success({
        content: JSON.stringify(v),
      });
    });
  }, []);

  return (
    <AreaForms.RdxFormRoot store={storeRef.current} enabledStatePreview={true}>
      <BaseView />
    </AreaForms.RdxFormRoot>
  );
};

const pause = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const fetchData = compute({
  id: 'fetchData',
  get: async ({ get }) => {
    await pause(3000);
    return [
      { label: '北京' + Math.random(), value: '010' },
      { label: '上海', value: '021' },
    ];
  },
});
const RefreshDataSource = () => {
  const refresh = useRdxRefresh(fetchData);
  return (
    <div>
      <Button onClick={refresh}> 点击刷新</Button>
    </div>
  );
};

export const 优雅的表单数据源获取 = () => {
  return (
    <AreaForms.RdxFormRoot autoValidate={true}>
      <AreaForms.FormItem
        title='省份'
        name='province'
        type='string'
        get={async ({ get }) => {
          return {
            componentProps: {
              dataSource: get(fetchData),
            },
          };
        }}
        componentType='select'
      ></AreaForms.FormItem>
      <RefreshDataSource></RefreshDataSource>
    </AreaForms.RdxFormRoot>
  );
};

const StoreContext = React.createContext<{ store: FormStore<IModel, any> }>({
  store: null,
});
const Show = () => {
  const { store } = React.useContext(StoreContext);
  const [state, setState] = store.useLinkFormComputeState('province');
  if (isLoading(state.status)) {
    return <div>加载中...</div>;
  }
  return (
    <div onClick={() => setState((state) => ({ ...state, value: '浙江市' }))}>
      <strong>设置区域</strong>
      {state.content.value}
      <hr />
    </div>
  );
};
export const context外部联动展示 = () => {
  const storeRef = React.useRef(AreaForms.createFormStore({}));

  return (
    <StoreContext.Provider value={{ store: storeRef.current }}>
      <Show />
      <AreaForms.RdxFormRoot
        store={storeRef.current}
        enabledStatePreview={true}
      >
        {/* <Show /> */}
        <BaseView />
      </AreaForms.RdxFormRoot>
    </StoreContext.Provider>
  );
};

function InnerCountPlus() {
  const [count, setCount] = AreaForms.useReferencedFormValueState('count');
  return (
    <div>
      <Button
        onClick={() => {
          setCount((count) => count + 1);
          setCount((count) => count + 1);
          setCount((count) => count + 1);
        }}
      >
        连续增加{count.content}
      </Button>
      <Button
        onClick={() => {
          setTimeout(() => {
            setCount((count) => count + 1);
          }, 0);
          setTimeout(() => {
            setCount((count) => count + 1);
          }, 0);
          setTimeout(() => {
            setCount((count) => count + 1);
          }, 0);
        }}
      >
        异步增加{count.content}
      </Button>
    </div>
  );
}
export function 计数() {
  return (
    <AreaForms.RdxFormRoot>
      <AreaForms.FormItem
        type='number'
        name='count'
        defaultValue={0}
      ></AreaForms.FormItem>
      <InnerCountPlus />
    </AreaForms.RdxFormRoot>
  );
}

export function 数组() {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      {/* <AreaForms.FormItem type='array' name='useIds'>
        <AreaForms.FormItem type='string' title='用户id'></AreaForms.FormItem>
      </AreaForms.FormItem> */}
      <AreaForms.FormItem
        type='array'
        alias={'test'}
        defaultValue={['张三']}
        name='useIds'
        disabled={true}
      >
        <AreaForms.FormItem
          type='string'
          title='用户id'
          name='name'
        ></AreaForms.FormItem>
      </AreaForms.FormItem>
      <AreaForms.FormItem
        type='array'
        title='cxxx'
        name='useIds222'
      >
        <AreaForms.FormItem type='object'>
          <AreaForms.FormItem
            type='string'
            title='用户id'
            name='name'
          ></AreaForms.FormItem>
        </AreaForms.FormItem>
      </AreaForms.FormItem>
      <AreaForms.FormItem
        type='array'
        alias={'Table'}
        componentType={'arrayTable'}
        defaultValue={['张三']}
        name='useIds'
        disabled={true}
      >
        <AreaForms.FormItem
          type='string'
          title='用户id'
          name='name'
        ></AreaForms.FormItem>
      </AreaForms.FormItem>
      <AreaForms.FormItem
        type='array'
        name='useIds22222'
        componentType={'array'}
        componentProps={{
          renderAddition: ({ mutators }) => <Button>自定义新增</Button>,
          renderTitle: ({ mutators }) => <span>自定义标题</span>,
          renderEmpty: () => (
            <div style={{ height: 50, lineHeight: '50px' }}>自定义空样式</div>
          ),
          renderOperations: ({ mutators, currentIndex }) => {
            return (
              <span
                onClick={() => {
                  mutators.remove(currentIndex);
                }}
              >
                删除
              </span>
            );
          },
        }}
      >
        <AreaForms.FormItem type='string' title='用户id' defaultValue='hahah'></AreaForms.FormItem>
      </AreaForms.FormItem>
    </AreaForms.RdxFormRoot>
  );
}

export function 表格数组() {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <AreaForms.FormItem
        type='array'
        name='useIds'
        componentType={'arrayTable'}
      >
        <AreaForms.FormItem type='string' title='用户id'></AreaForms.FormItem>
      </AreaForms.FormItem>
    </AreaForms.RdxFormRoot>
  );
}
export function 对象数组() {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <AreaForms.FormItem type='array' name='useIds'>
        <AreaForms.FormItem type='object'>
          <AreaForms.FormItem
            name='test'
            type='string'
            title='用户id'
          ></AreaForms.FormItem>
        </AreaForms.FormItem>
      </AreaForms.FormItem>
    </AreaForms.RdxFormRoot>
  );
}

export function 对象表格数组() {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <AreaForms.FormItem
        type='array'
        name='useIds'
        componentType={'arrayTable'}
      >
        <AreaForms.FormItem type='string' title='用户id'></AreaForms.FormItem>
      </AreaForms.FormItem>
    </AreaForms.RdxFormRoot>
  );
}

export function RenderProps() {
  return (
    <AreaForms.RdxFormRoot enabledStatePreview={true}>
      <AreaForms.FormItem
        title='省份'
        name='province'
        type='string'
        get={async ({ get }) => {
          return {
            componentProps: {
              dataSource: get(fetchData),
            },
          };
        }}
      >
        {(props: IFormComponentProps<{ dataSource: any[] }>) => {
          const { value, onChange, componentProps } = props;
          return (
            <Select
              value={value}
              onChange={(v) => onChange(v)}
              dataSource={componentProps.dataSource}
            />
          );
        }}
      </AreaForms.FormItem>
    </AreaForms.RdxFormRoot>
  );
}

import * as React from 'react';
import { Table, Balloon, Tab } from '@alife/hippo';
import { DataPersistSnapShot, PointWithWeight, union } from '@alife/rdx';
import { GlobalDepsViewer } from './GraphViewer';
import { DataPersistence } from '../panel';
import ReactJson from 'react-inspector'
const { Column } = Table;

const EventStatusComponent = (props: {
  activeIndex: number;
  setActiveIndex: (v: number) => void;
  allSnapShots: DataPersistSnapShot[];
}) => {
  const { activeIndex, setActiveIndex, allSnapShots = [] } = props;
  console.log('allSnapShots: ', allSnapShots);
  return (
    <div
      style={{
        flex: '0 0 40vw',
        maxWidth: '40vw',
        background: '#2A2F3A',
        borderRight: '3px solid rgba(190, 190 ,190, 0.5)',
        borderRightStyle: 'double',
        overflow: 'auto',
      }}
      // dataSource={allSnapShots}
      // maxBodyHeight={300}
      // cellProps={(rowIndex) => {
      //   return {
      //     style: { background: rowIndex === activeIndex && '#87befd88' },
      //   };
      // }}
      // onRowClick={(record, index) => {
      //   setActiveIndex(index);
      // }}
    >
      {allSnapShots.map((item, rowIndex) => {
        const active = rowIndex === activeIndex;
        return (
          <div
            style={{
              color: '#FFFFFF',
              opacity: active ? 1 : 0.6,
              padding: '5px 10px',
              fontSize: 12,
              background: active && 'rgba(190, 190 ,190, 0.2)',
              borderBottom: '1px solid rgba(190, 190 ,190, 0.5)',
              lineHeight: '32px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              display: 'flex',
            }}
            onClick={() => {
              setActiveIndex(rowIndex);
            }}
          >
            <div style={{ maxWidth: '70%' }}>{item.type}</div>
          </div>
        );
      })}
    </div>
  );
};
const StateCompoonent = ({ stateDataSource }) => {
  const [filterParams, setFilterParams] = React.useState({});
  const targetTypeDataSource = union(
    stateDataSource
      .map((item) => item.targetType)
      .map((item) => ({ label: item, value: item }))
  );

  return (
    <div style={{ overflow: 'auto' }}>
      <Table
        // @ts-ignore
        maxBodyHeight={500}
        isZebra={true}
        dataSource={filterDataSource(stateDataSource, filterParams)}
        onFilter={(filterParams) => {
          setFilterParams(filterParams);
        }}
      >
        <Column
          title='action类型'
          width={100}
          dataIndex={'actionType'}
        ></Column>
        <Column title='目标id' width={100} dataIndex={'key'}></Column>
        <Column
          title='目标类型'
          width={100}
          dataIndex={'targetType'}
          filters={targetTypeDataSource}
        ></Column>
        <Column
          title='当前变化数据'
          dataIndex={'value'}
          cell={(value) => {
            return (
              <Balloon
                popupStyle={{
                  minWidth: 500,
                  height: 300,
                  overflow: 'auto',
                }}
                trigger={
                  <div
                    style={{
                      maxWidth: '200px',
                      maxHeight: '100px',
                      overflow: 'hidden',
                    }}
                  >
                    {JSON.stringify(value, getCircularReplacer())}
                  </div>
                }
                triggerType={'click'}
              >
                <div>{value}</div>
              </Balloon>
            );
          }}
        ></Column>
      </Table>
    </div>
  );
};

export default () => {
  const state = React.useContext(DataPersistence);
  const { allSnapShots = [], realTimeState } = state;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const currentSnapShots = allSnapShots[activeIndex];
  if (!currentSnapShots) {
    return <div>暂时没有获取到数据哦</div>;
  }
  return (
    <div style={{ display: 'flex', maxHeight: '100vh', overflow: 'hidden' }}>
      <EventStatusComponent
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        allSnapShots={allSnapShots}
      />
      <div style={{ flex: '0 0 60vw' }}>
        <Tab>
          <Tab.Item title={'依赖关系实时预览'}>
            <GlobalDepsViewer snapShot={currentSnapShots}></GlobalDepsViewer>
          </Tab.Item>
          <Tab.Item title={'事件状态'}>
            <StateCompoonent stateDataSource={currentSnapShots.states || []} />
          </Tab.Item>
          <Tab.Item title={'当前状态'}>
            <ReactJson
              style={{ height: 300, overflow: 'auto' }}
              data={realTimeState}
            ></ReactJson>
          </Tab.Item>
          <Tab.Item title={'当前task信息'}>
            <ReactJson
              style={{ height: 300, overflow: 'auto' }}
              data={currentSnapShots.tasks}
            ></ReactJson>
          </Tab.Item>
        </Tab>
      </div>
    </div>
  );
};

function filterDataSource(ds, filterParams) {
  Object.keys(filterParams).forEach((key) => {
    const selectedKeys = filterParams[key].selectedKeys;
    if (selectedKeys.length) {
      ds = ds.filter((record) => {
        return selectedKeys.some((value) => {
          return record[key].indexOf(value) > -1;
        });
      });
    }
  });
  return ds;
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

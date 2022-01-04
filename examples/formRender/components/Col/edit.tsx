import React from 'react';
import { Button, Grid } from '@alife/hippo';
import Tag from '../../commonComponents/Tag';
import { DropZone } from '../../commonComponents/DropZone';
import { WidgetType } from '../../WidgetList';
import { createInsertFunc } from '../../utils/layoutUtils';
import { isEmpty } from '../../utils';
const { Col } = Grid;

const ColLayout = (props) => {
  const { span } = props.customProps;
  const insert = createInsertFunc();
  return (
    <Col style={{ position: 'relative' }} span={span}>
      {/* <Tag name={'col'}></Tag> */}
      {props.children}
      {isEmpty(props.children) && (
        <DropZone
          accept={WidgetType.Widget}
          onDrop={(options) => {
            insert(options.data);
          }}
        />
      )}
    </Col>
  );
};
export default ColLayout;

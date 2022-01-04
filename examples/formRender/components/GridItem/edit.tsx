import React from 'react';
// import { DropZone } from '../../commonComponents/DropZone';
// import { WidgetType } from '../../WidgetList';
import { createInsertFunc } from '../../utils/layoutUtils';
import { isEmpty } from '../../utils';

const GridItemLayout = (props) => {
  const insert = createInsertFunc();
  return (
    <div style={{ position: 'relative' }} >
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
    </div>
  );
};
export default GridItemLayout;

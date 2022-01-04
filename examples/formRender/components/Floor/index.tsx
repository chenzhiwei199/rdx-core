import React from 'react';
import Tag from '../../commonComponents/Tag';


const FloorLayout = (props) => {
  const { children, customProps } = props;
  const { title } = customProps;
  return (
    <div style={{ position: 'relative' }}>
      <Tag name={'floor'}></Tag>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
export default  FloorLayout
import React from 'react';

const GridLayout = (props: any) => {
  const { columnNumber = 3 } = props.customProps;

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: 12,
        gridTemplateColumns: `repeat(${columnNumber}, ${100 / columnNumber}%)`,
      }}
    >
      {props.children}
    </div>
  );
};
export default GridLayout;

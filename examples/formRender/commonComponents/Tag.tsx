import React from 'react';
export default  ({ name }) => {
  return (
    <div
      style={{
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
    >
      <div
        style={{
          background: '#a3b3ff',
          color: 'white',
          position: 'absolute',
          padding: 6,
          borderRadius: 4,
          top: 0,
          right: 20,
        }}
      >
        {name}
      </div>
    </div>
  );
};
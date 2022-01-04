import {
  LayoutContext,
  LayoutContextInstance,
  LayoutType,
} from '../../hooks/formLayoutHoooks';
import React from 'react';

export const FormLayout = (
  props: LayoutContext & { children?: React.ReactNode }
) => {
  
  let cmp = props.children;
  if(props.layoutType === LayoutType.Grid) {
    cmp = <div style={{ display: 'flex', flexWrap : props.autoRow ? 'wrap' : 'nowrap', }}>{props.children}</div>
  } else if(props.layoutType === LayoutType.CssGrid){
    cmp = <div style={{ display: 'grid', gridTemplateColumns:  `repeat(auto-fill, minmax(${100/ (props.cssGridColumns || 3)}%, 1fr))`}}>{props.children}</div>
  }
  return (
    <LayoutContextInstance.Provider value={props}>
      {cmp}
    </LayoutContextInstance.Provider>
  );
};

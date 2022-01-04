import React, { useCallback, useEffect, useRef, useState } from 'react';
export function Tooltip(props: {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { trigger } = props;
  const [isVisible, setVisible] = useState(false);
  const [_, forceUpdate] = useState(1);
  const timerRef = useRef(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  });
  const handleMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, 300);
  }, []);
  const handleMouseLeave = useCallback(() => {
    clearTimeout(timerRef.current);
    setVisible(false);
  }, []);
  useEffect(() => {
    forceUpdate(state => state  +1)
  }, [triggerRef.current, isVisible])
  const getLeft = () => {
    const { x, width } = triggerRef.current.getBoundingClientRect()  ;
    const tooltipRefRect = tooltipRef.current? tooltipRef.current.getBoundingClientRect() :  { width: 0}  ;
    return x - tooltipRefRect.width / 2 + width / 2;
  };
  return (
    <span  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span className='tooltip-trigger' ref={triggerRef}>
        {trigger}
      </span>
      {( isVisible &&
        <div
          ref={tooltipRef}
          style={{
            // marginLeft: getLeft(),
            position: 'absolute',
            opacity: tooltipRef.current ? 1: 0,
            // transition: 'all 1s',
            background: '#333',
            boxShadow: '0 8px 16px 0 rgba(0,0,0,.08)',
            color: 'white',
            left: getLeft(),
            maxWidth: '300px',
            textAlign: 'left',
            zIndex: 10,
            borderRadius: '2px',
            lineHeight: '14px',
            padding: '12px 12px 12px 12px',
          }}
        >
          {props.children}
          <div
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              left: 'calc(50% - 4px)',
              top: '-4px',
              boxShadow: '-1px -1px 1px 0 rgba(0,0,0,.1)',
              transform: 'rotate(45deg)',
              background: '#333',
            }}
          ></div>
        </div>
      )}
    </span>
  );
}

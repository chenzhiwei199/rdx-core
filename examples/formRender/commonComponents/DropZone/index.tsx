// import { DropOptions, useLayoutDrop } from '@alife/shuhe-dnd-layout';
// import * as React from 'react';
// import { useEffect } from 'react';

// enum IDropZoneSize {
//   Mini = 'mini',
//   Lite = 'lite',
// }

// enum DropStatusType {
//   CanDrop = 'CanDrop',
//   Over = 'Over',
// }

// function getStatusColor(type: DropStatusType) {
//   switch (type) {
//     case DropStatusType.CanDrop:
//       return '#00aa0033';
//     case DropStatusType.Over:
//       return '#23a3ff33';
//     default:
//       return 'rgb(218,218,218)';
//       break;
//   }
// }
// function getStatusType(canDrop, isOver) {
//   if (isOver) {
//     return DropStatusType.Over;
//   }
//   if (canDrop) {
//     return DropStatusType.CanDrop;
//   }
// }
// interface IDropZone {
//   onDrop: (options: DropOptions) => void;
//   onHover?: (options: DropOptions) => void;
//   onLeave?: () => void;
//   size?: IDropZoneSize;
//   accept?: string | string[];
// }

// export function useEventListener(
//   eventName: string,
//   handler: EventListener,
//   element: Element | Window = window
// ) {
//   // Create a ref that stores handler
//   const savedHandler = React.useRef<EventListener>();

//   // Update ref.current value if handler changes.
//   // This allows our effect below to always get latest handler ...
//   // ... without us needing to pass it in effect deps array ...
//   // ... and potentially cause effect to re-run every render.
//   useEffect(() => {
//     savedHandler.current = handler;
//   }, [handler]);

//   useEffect(
//     () => {
//       // Make sure element supports addEventListener
//       // On
//       const isSupported = element && element.addEventListener;
//       if (!isSupported) return;

//       // Create event listener that calls handler function stored in ref
//       const eventListener = (event: Event) => savedHandler.current(event);

//       // Add event listener
//       element.addEventListener(eventName, eventListener, false);

//       // Remove event listener on cleanup
//       return () => {
//         element.removeEventListener(eventName, eventListener);
//       };
//     },
//     [eventName, element] // Re-run if eventName or element changes
//   );
// }
// export function useDropZone(config: Omit<IDropZone, 'size'>) {
//   const { accept, onDrop, onHover, onLeave } = config;
//   const enterCount = React.useRef(0);
//   const dropResult = useLayoutDrop<HTMLDivElement>({
//     accept: accept as string,
//     onDrop: (dragPath, dropPath, options) => {
//       onDrop(options);
//       enterCount.current = 0;
//     },
//     onHover: (dragPath, dropPath, options) => {
//       // 当离开的时候，组织onHover
//       onHover && enterCount.current !== 0 && onHover(options);
//     },
//   });
//   const [collectProps, refs] = dropResult;
//   useEventListener(
//     'dragenter',
//     React.useCallback(() => {
//       console.log('dragenter: ');
//       enterCount.current = enterCount.current + 1;
//     }, []),
//     refs.current
//   );
//   useEventListener(
//     'dragleave',
//     () => {
//       enterCount.current = enterCount.current - 1;
//       console.log('dragleave: ', enterCount.current);
//       if (enterCount.current === 0) {
//         onLeave && onLeave();
//       }
//     },
//     refs.current
//   );
//   return dropResult;
// }
// export function DropZone(props: IDropZone) {
//   const { size = IDropZoneSize.Lite } = props;
//   const [collectProps, refs] = useDropZone(props);
//   const { isOver, canDrop } = collectProps;
//   return (
//     <div
//       style={{
//         border: '1px dashed lightgrey',
//         height: size === IDropZoneSize.Lite ? 100 : 40,
//         padding: 12,
//       }}
//       ref={refs}
//     >
//       <div
//         style={{
//           width: '100%',
//           height: '100%',
//           padding: 12,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           background: getStatusColor(getStatusType(canDrop, isOver)),
//         }}
//       >
//         DropZone
//       </div>
//     </div>
//   );
// }

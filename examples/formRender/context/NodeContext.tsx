import React, { useContext } from 'react';
import {RdxState} from '@alife/rdx'
import { ISingleWidgetState } from '../model';
export interface INodeContext {
  stateAtom: RdxState<ISingleWidgetState>
  uniqueId: string
  path: number[]
  parentUniqueId: string
}
export const NodeContext = React.createContext<INodeContext>(null)
export function useNodeContext() {
  return useContext(NodeContext)
}
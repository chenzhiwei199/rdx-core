import React, { useContext } from 'react';
import { IComponents } from '../components';
export const FormComponentsContext= React.createContext<{
  components: IComponents
  autoValidate: boolean
}>(null);

export function useFormContext() {
  return useContext(FormComponentsContext)
}
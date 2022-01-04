import React, { useContext } from 'react';
import { usePathContext } from '../../hooks';
import { IFormComponentProps } from '../Forms';

export interface IObjectItem {
  children: React.ReactNode;
}

const ObjectField = (props: IFormComponentProps<any>) => {
  const { children } = props;
  return <>{children}</>;
};

export default ObjectField;

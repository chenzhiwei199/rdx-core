import React from 'react';
export const FormItemContextInstance = React.createContext<{
  name?: string;
  parentIsArray?: boolean;
  virtual?: boolean;
}>({});



import React from "react";
import { useRef, useEffect } from "react";

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
export class DefaultValue {}
export const DEFAULT_VALUE: DefaultValue = new DefaultValue();
export function isDefaultValue(value: any) {
  return value instanceof DefaultValue
}
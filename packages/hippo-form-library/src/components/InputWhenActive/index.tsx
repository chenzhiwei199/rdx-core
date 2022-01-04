import { Icon, Input } from '@alife/hippo'
import { InputProps } from '@alife/hippo/lib/input'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { IFormComponentProps } from '@alife/rdx-form'

export const InputWhenActive = (props: IFormComponentProps<InputProps & { defaultActive?: boolean}>) => {
  const { value, onChange, componentProps, disabled, preview,  } = props
  const { defaultActive= true  } = componentProps
  const [innerPreview, setInnerPreview] = useState(!defaultActive)
  const ref = useRef<Input>()
  useEffect(() => {
    // (ref.current as any).focus();
    (ref.current as any)?.getInputNode?.()?.select?.();  
  }, [innerPreview === false])
  return (
    <span>
      <Input
        {...componentProps}
        disabled={disabled}
        ref={ref}
        value={value}
        onChange={onChange}
        onBlur={() => setInnerPreview(true)}
        // @ts-ignore
        isPreview={preview || innerPreview}
      ></Input>
      {innerPreview && (
        <Icon
          style={{ marginLeft: 12, cursor: 'pointer' }}
          size={componentProps.size}
          onClick={() => {
            // ;(ref.current as any).requestfocus()
            setInnerPreview(false)
          }}
          type="edit"
        ></Icon>
      )}
    </span>
  )
}

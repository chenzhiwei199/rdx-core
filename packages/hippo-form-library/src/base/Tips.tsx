import React from 'react'

export const Tips = (props: { tips: string }) => {
  return (
    <div>
      {props.tips && (
        <div
          style={{
            boxShadow: '0 0 8px 0 rgba(153, 163, 179, 0.28)',
            padding: 12,
            marginBottom: 12,
            borderRadius: 4,
            background: 'lightyellow',
            opacity: 0.8,
            color: 'rgb(134,134,130)',
          }}
        >
          tips: {props.tips}
        </div>
      )}
    </div>
  )
}

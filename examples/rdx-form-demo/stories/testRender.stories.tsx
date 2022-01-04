import React from 'react';
export default {
  title: '测试渲染',
  parameters: {
    info: { inline: true },
  },
};

function ListItem ({ label}) {
  console.log("render")
  React.useEffect(() => {
    return () => {
      console.log("unmount")
    }
  })
  return <div>{label}</div>
}
export function List () {
  const [state, setState] = React.useState([{ label: '1111'}])
  return <div>
    {
      state.map(item => <ListItem label={item.label}/>)
    }
    <div onClick={() => {
      setState([])
    }}>点击清空</div>
  </div>
}
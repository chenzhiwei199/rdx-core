import React, { useState } from 'react';
import { atom, RecoilRoot, selector, useRecoilStateLoadable, useRecoilValueLoadable } from 'recoil'

export default {
  title: 'TODO_APP',
  parameters: {
    info: { inline: true },
  },
};
const pause = (t: number) => new Promise((resolve) => setTimeout(resolve, t));
const TodoDataSource = atom({
  key: 'TododataSource',
  default: [] as { label: string, id: string}[]
})

const test1 = selector({
  key: 'test1',
  get: async () => {
    await pause(2000)
    return 1
  }
})

const test2 = selector({
  key: 'test2',
  get: async ({ get}) => {
    let res;
    try {
      res = get(test1)
    } catch (error) {
      console.log('error: ', error);
      
    }
    console.log('res: ', res);
    throw Promise.reject(new Error('哈哈'))
    return res
  }
})
export function TodoApp() {
  return <RecoilRoot>
    <List></List>
  </RecoilRoot>
}
// function AddWidget() {
//   const [list, setList] = useRecoilState<{ label: string, id: string}[]>(TodoDataSource)
//   return <button onClick={() => {
//     setList(list => [...list, { label: ''}])
//   }}>新增一项</button>
// }
function List() {
  const [list, setList] = useRecoilStateLoadable<{ label: string, id: string}[]>(TodoDataSource)
  const v = useRecoilValueLoadable(test2)
  console.log('v: ', v);
  if(list.state === 'loading'  || list.state === 'hasError') {
    return <div>111</div>
  }
  return <ul>
    {
      list.contents.map(item => (<li>{item.label}</li>))
    }
  </ul>
}
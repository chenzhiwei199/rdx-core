import { RdxState } from "../../types"

function computeOperator(props: { get , set }) {
  const cache = {}
  // 依赖数据
  // 执行
  return (source, subscriber) => {
    source.subscribe(() => {
      // 订阅执行
      subscriber.next()
    })
    
    subscriber.error()
  }
}

export class Operate extends RdxState<any> {
  load() {
    
  }
}
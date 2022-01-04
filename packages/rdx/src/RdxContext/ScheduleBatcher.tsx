import { useEffect, useLayoutEffect, useState } from 'react'
import { RdxStore } from '../core/RdxStore'
import { batchUpdate } from '../utils'

const ScheduleBatcher = (props: {
  // setNotifyBatcherOfChange: any;
  storeRef: RdxStore
}) => {
  const { storeRef } = props
  const [_, setState] = useState(1)
  useLayoutEffect(() => {
    storeRef.setBatcherOfChangeCallback(() => {
      batchUpdate(() => {
        // 这里还是会导致
        // react-dom.development.js:88 Warning: Cannot update a component (`ScheduleBatcher`) while rendering a different component (`FormItem`). To locate the bad setState() call inside `FormItem`
        setState(state => state + 1)
      })
    })
  }, [])
  
  useEffect(() => {
    storeRef.executeTask()
  }, [_])

  return null
}

export default ScheduleBatcher

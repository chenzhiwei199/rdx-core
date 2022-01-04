import { default as ScheduledCore } from '../scheduledCore'
import { render, waitFor } from '@testing-library/react'
import { AdvancedGraph } from '../../newGraph'

// test('任务调度，连续执行，执行结束所有入度结果和为0', async () => {
//   const advancedGraph = new AdvancedGraph({ directed: true })
//   advancedGraph.setEdge('A', 'B')
//   let scheduleCore = new ScheduledCore(advancedGraph, { canReuse: () => true })
//   function updateAndStart() {
//     scheduleCore = scheduleCore.fork([
//       {
//         key: 'A',
//         downStreamOnly: true,
//       },
//     ])
//     scheduleCore.start((id, { next }) => {
//       setTimeout(() => {
//         next()
//       }, 100)
//     })
//   }
//   updateAndStart()
//   updateAndStart()
//   updateAndStart()

//   await waitFor(
//     () => {
//       const sum = Array.from(scheduleCore.inDegree.values()).reduce((sum, current) => sum + current, 0)
//       expect(sum).toBe(0)
//     },
//     { timeout: 300 },
//   )
// })

// test('任务调度，连续执行，起始点复用应该只执行一次', async () => {
//   const advancedGraph = new AdvancedGraph({ directed: true })
//   advancedGraph.setEdge('A', 'B')
//   let scheduleCore = new ScheduledCore(advancedGraph, { canReuse: () => true })
//   const fn = jest.fn()
//   function updateAndStart() {
//     scheduleCore = scheduleCore.fork([
//       {
//         key: 'A',
//         downStreamOnly: true,
//       },
//     ])
//     scheduleCore.start((id, { next }) => {
//       fn()
//       setTimeout(() => {
//         next()
//       }, 100)
//     })
//   }
//   updateAndStart()
//   setTimeout(() => {
//     updateAndStart()
//     updateAndStart()
//   }, 50)
//   updateAndStart()
//   updateAndStart()

//   await waitFor(
//     () => {
//       expect(fn).toHaveBeenCalledTimes(2)
//     },
//     { timeout: 300 },
//   )
// })

test('任务不可以复用的情况', async () => {
  const advancedGraph = new AdvancedGraph({ directed: true })
  advancedGraph.setEdge('A', 'B')
  let scheduleCore = new ScheduledCore(advancedGraph, { canReuse: () => false })
  const fn = jest.fn()
  function updateAndStart() {
    scheduleCore = scheduleCore.fork([{ key: 'A', downStreamOnly: false}])
    scheduleCore.start((id, options) => {
      const { next } = options
      console.log('options: ', id, options.next);
      fn()
      setTimeout(() => {
        next &&  next()
      }, 100)
    })
  }
  updateAndStart()
  setTimeout(() => {
    updateAndStart()
    updateAndStart()
  }, 50)
  updateAndStart()
  updateAndStart()

  await waitFor(
    () => {
      expect(fn).toHaveBeenCalledTimes(6)
    },
    { timeout: 600 },
  )
})

test('被取消的异步任务，不能再向外派发消息', async () => {
  const advancedGraph = new AdvancedGraph({ directed: true })
  advancedGraph.setEdge('A', 'B')
  let scheduleCore = new ScheduledCore(advancedGraph, { canReuse: () => false })
  const fn = jest.fn()

  scheduleCore = scheduleCore.fork([])
  scheduleCore.start((id, { next }) => {
    setTimeout(() => {
      next(() => {
        // 被取消的任务，不能再向外派发消息
        fn()
      })
    }, 100)
  })
  function updateAndStart() {
    scheduleCore = scheduleCore.fork([{ key: 'A', downStreamOnly: false}])
    scheduleCore.start((id, { next }) => {
      setTimeout(() => {
        next()
      }, 100)
    })
  }
  updateAndStart()
  setTimeout(() => {
    updateAndStart()
    updateAndStart()
  }, 50)
  updateAndStart()
  updateAndStart()

  await waitFor(
    () => {
      expect(fn).toHaveBeenCalledTimes(0)
    },
    { timeout: 300 },
  )
})

test('被取消的同步任务，会直接触发外部任务', async () => {
  const advancedGraph = new AdvancedGraph({ directed: true })
  advancedGraph.setEdge('A', 'B')
  let scheduleCore = new ScheduledCore(advancedGraph, { canReuse: () => false })
  const fn = jest.fn()

  scheduleCore = scheduleCore.fork([{ key: 'A', downStreamOnly: false}])
  // 同步任务执行一次
  scheduleCore.start((id, { next }) => {
    next(() => {
      // 被取消的任务，不能再向外派发消息
      fn()
    })
  })
  function updateAndStart() {
    scheduleCore = scheduleCore.fork([{ key: 'A', downStreamOnly: false}])
    scheduleCore.start((id, { next }) => {
      setTimeout(() => {
        next()
      }, 100)
    })
  }
  updateAndStart()
  setTimeout(() => {
    updateAndStart()
    updateAndStart()
  }, 50)
  updateAndStart()
  // 异步任务执行一次
  updateAndStart()

  await waitFor(
    () => {
      expect(fn).toHaveBeenCalledTimes(2)
    },
    { timeout: 300 },
  )
})

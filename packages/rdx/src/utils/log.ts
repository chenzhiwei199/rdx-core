

// enum MsgType {
//   TaskAdd = 'taskAdd',
//   TaskExecuting = 'TaskExecuting',
// }
// interface TaskAddMsg {

// }
export class Log {
  debug: boolean;
  constructor(debug) {
    this.debug = debug;
  }
  stack: Map<string, { startInfo?: any, processInfo?: any[]}> = new Map()
  startPrimary (...args) {
    if (this.debug) {
      
      console.groupEnd()
      console.groupEnd()
      console.groupEnd()
      console.log("没有执行完成的节点 start")
      Array.from(this.stack.keys()).forEach((key) => {
        this.stack.get(key)?.startInfo && console.log(...this.stack.get(key)?.startInfo)
        this.stack.get(key)?.processInfo?.forEach((arg) => {
          console.log(...arg)
        })
      })
      console.log("没有执行完成的节点 end")
      console.group('%crdx-debug', 'font-size: 14px; color: #23a4ff;', ...args, )
    }
  }
  startSecondary (key, ...args) {
    if (this.debug) {
      // console.group('%crdx-debug', 'font-size: 14px; color: #23a4ff55;', ...args, )
      this.stack.set(key, {
        startInfo: args
      })
    }
  }
  infoSecondary(key, ...args) {
    if(this.stack.has(key)) {
      this.stack.set(key, {
        ...this.stack.get(key),
        processInfo: [...(this.stack.get(key)?.processInfo || []), args]
      })
    } else {
      this.info(key, ...args)
    }
    
  }
  endSecondary(key, ...args) {
    if (this.debug) {
      if(this.stack.has(key)) {
        console.group(`-------------------------------------------%crdx-debug ${key}` , 'font-size: 14px; color: #23a4ff;', '-----------------------' )
        this.stack.get(key)?.startInfo && console.log(...this.stack.get(key)?.startInfo)
        this.stack.get(key)?.processInfo?.forEach((arg) => {
          console.log(...arg)
        })
        this.stack.delete(key)
        console.log(...args)
        console.groupEnd()
        console.log(`----------------------------------------------%crdx-debug END ${key}` , 'font-size: 14px; color: #23a4ff;','-------------------')
      } else {
        console.error(key, '任务执行结束--出错拉', ...args)
      }
    
    }
  }
  end (...args) {
    if (this.debug) {
      console.groupEnd()
    }
  }
  infoAndend (...args) {
    if (this.debug) {
      console.groupEnd()
      console.log("%crdx-debug",'font-size: 14px; color: lightgreen;', ...args, )
    }
  }
  taskAdd(key, ...args) {
    if (this.debug) {
      if(this.stack.has(key)) {
        this.infoSecondary(key, "%crdx-debug: TaskAdd", 'color: red',...args)
      } else {
        console.log("%crdx-debug: TaskAdd" + `FROM ${key}`, 'color: red',...args,)
      }
      
    }
  }
  taskExecuteInfo(...args) {
    if (this.debug) {
      console.log("%crdx-debug: TaskExecuteInfo", 'color: lightgreen',...args)
    }
    
  }
  info(...args) {
    if (this.debug) {
      console.log("rdx-debug",...args)
    }
  }
  groupEnd(key: string) {
    this.stack.get(key)
  }
  warn(...args) {
    if (this.debug) {
      console.warn("rdx-debug", ...args)
    }
  }
  error(...args) {
    // if (dev) {
      console.error(...args)
    // }
  }
}


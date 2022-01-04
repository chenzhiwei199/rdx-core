 class LogUtils {
  warn(...args)  {
    console.warn("Rdx devtools", ...args)
  }
  log(...args)  {
    console.log("Rdx devtools", ...args)
  }
}

export default new LogUtils()

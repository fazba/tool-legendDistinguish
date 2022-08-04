/**
 * 为目标函数添加防抖
 * @param func 目标函数
 * @param time 防抖时间间隔
 * @param immediately 是否立刻执行
 * @returns 防抖的目标函数
 */
export function antiShake<T extends (...args: any) => void>(func: T, time = 0, immediately = false): T {
  let handler = 0;
  let lock = 0;
  if (immediately) {
    return function (...args: any) {
      const now = Date.now();
      if (handler) {
        clearTimeout(handler);
      }
      if (lock < now) {
        func(...args);
        lock = now + time;
      } else {
        handler = setTimeout(() => {
          handler = 0;
          func(...args);
        }, time);
      }
    } as T;
  } else {
    return function (...args: any) {
      if (handler) {
        clearTimeout(handler);
      }
      handler = setTimeout(() => {
        handler = 0;
        func(...args);
      }, time);
    } as T;
  }
}

/**
 * 保存JSON数据到本地
 * @param data 数据
 * @param filename 文件名
 */
export function saveJson(data: object, filename = "data.json") {
  const blob = new Blob([JSON.stringify(data, null, "\t")], { type: "text/json" });
  const a = document.createElement("a");
  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.click();
}





/**根据坐标访问一维数组的rgba */
export function initRGBaFromXY(width: number, arr: Uint8ClampedArray) {
  return (x: number, y: number) => {
    if (x >= width) {
      throw new Error('x长度错误')
    }
    const p = (y * width + x) * 4
    return arr.slice(p, p + 4)
  }
}
/**'s,s,r,g,b,a' 转为'rgba(r,g,b,a)' */
export function strConvertRgba(str: string) {
  const rgbaStr = str.split(',').slice(2)
  const alpha = ~~rgbaStr[3] / 255
  return 'rgba(' + [rgbaStr[0], rgbaStr[1], rgbaStr[2], alpha].join() + ')'
}
/**广度优先搜索 */
export function findLand(
  x: number,
  y: number,
  width: number,
  height: number,
  backView: Uint8Array[],
  _continue: (x: number, y: number) => boolean
) {
  const queue: number[][] = []
  let count = 1
  if (y < height - 1) {
    queue.push([x, y + 1])
  }
  if (y > 0) {
    queue.push([x, y - 1])
  }
  if (x < width - 1) {
    queue.push([x + 1, y])
  }
  if (x > 0) {
    queue.push([x - 1, y])
  }
  while (queue.length) {
    const [x, y] = queue.shift() || []
    if (_continue(x, y)) continue
    count++
    backView[y][x] = 1
    if (y < height - 1) {
      queue.push([x, y + 1])
    }
    if (y > 0) {
      queue.push([x, y - 1])
    }
    if (x < width - 1) {
      queue.push([x + 1, y])
    }
    if (x > 0) {
      queue.push([x - 1, y])
    }
  }
  return count
}
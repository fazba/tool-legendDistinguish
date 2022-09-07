import { initRGBaFromXY, strConvertRgba, findLand } from "./math";
import { getImageData } from "./base";

export type LegendType = {
  bgColor: string;
  legend: {
    color: string;
    num: number;
    label: string;
  }[];
  name: string;
  unit: string;
};

export default async function pickUpLegend(imgUrl: string) {
  const { data, height, width } = await getImageData(imgUrl);
  console.time("time");
  /**Map<连续色块，面积> */
  const map = numIslands(data, width, height);
  const { bgColor, legend, name, unit } = autoDistinguish(map);

  console.timeEnd("time");
  return { bgColor, legend, name, unit };
}

/**
 * utils
 *
 *
 */

/**识别图例、和背景 */
function autoDistinguish(map: Map<string, number>) {
  let bgColor = "";
  const legend: Array<{ color: string; num: number; label: string }> = [];
  const obj: { [P: string]: number } = {};
  //面积排序
  map.forEach(v => {
    obj[v] > 0 ? obj[v]++ : Reflect.set(obj, v, 1);
  });
  debugger;
  //获取[...,图例，背景]
  let [legendCount, bgColorCount] = Object.keys(obj).slice(-2);
  //是否包含背景
  if (obj[bgColorCount] > 1) {
    legendCount = bgColorCount;
    bgColorCount = "0";
  }
  //写入颜色
  map.forEach((v, k) => {
    if (~~legendCount >= v && ~~legendCount - 50 < v) {
      legend.push({
        color: strConvertRgba(k),
        num: 0,
        label: "0.00",
      });
    } else if (~~bgColorCount === v) {
      bgColor = strConvertRgba(k);
    }
  });
  //测试
  console.log(map);
  console.log(obj);
  console.log(Object.entries(obj));

  return {
    bgColor,
    legend,
    name: "",
    unit: "",
  };
}
/**创建连续色块的像素量map */
function numIslands(data: Uint8ClampedArray, width: number, height: number) {
  const map = new Map<string, number>();
  const backView: Uint8Array[] = Array.from({ length: height }, () => new Uint8Array(width).fill(0));
  const xyToRGBa = initRGBaFromXY(width, data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (backView[y][x] === 1) continue;
      //当前颜色
      const str = xyToRGBa(x, y).join();
      //
      const _continue = isContinueFindLand(str, backView, xyToRGBa);
      // debugger;
      //当前色块面积
      const acreage = findLand(x, y, width, height, backView, _continue);
      //如果透明度为0，则不记录
      // if (str.slice(-2) === ',0') continue
      map.set(`${x},${y},${str}`, acreage);
      //调试
      console.log({ 颜色: str, acreage });
      console.log(backView.map(v => v.join()));
    }
  }
  return map;
}
const isContinueFindLand = (
  compared: string,
  backView: Uint8Array[],
  xyToRGBa: (x: number, y: number) => Uint8ClampedArray
) => {
  return (x: number, y: number) => {
    return backView[y][x] !== 0 || xyToRGBa(x, y).join() !== compared;
  };
};

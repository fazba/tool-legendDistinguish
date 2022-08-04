



//
export async function getImageData(imgUrl: string) {
  const imgDom = await createImg(imgUrl)
  const canvas = document.createElement("canvas");
  canvas.width = imgDom.width
  canvas.height = imgDom.height
  // document.getElementById('app')!.appendChild(canvas)  //测试
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imgDom, 0, 0)
  const imageData = ctx.getImageData(0, 0, imgDom.width, imgDom.height);
  return imageData
}
//
function createImg(imgUrl: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      resolve(img)
    }
    img.onerror = (e) => {
      throw new Error('图片加载失败:' + e)
    }
    img.src = imgUrl
  })
}
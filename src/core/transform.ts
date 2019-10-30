import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    // 转成数组方便后面遍历
    fns = [fns]
  }

  fns.forEach(fn => {
    // 执行每一个fn函数 并将处理完的data传入下一个fn
    // console.log(data)
    data = fn(data, headers)
  })

  return data
}

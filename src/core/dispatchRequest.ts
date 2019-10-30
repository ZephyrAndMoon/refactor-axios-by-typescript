import xhr from './xhr'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

// function isPromise(obj: any): boolean {
//   return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
// }

// console.log(transformResponseData)

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {
    // 对res.data做处理以后再返
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // config.transformRequest是defaults中的transformRequest
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 因为接口类型中method是可选参数  所以可能不存在  但是有设置默认值  所以一定有method 使用断言
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  // 返回一个处理后的url
  // 修改AxiosRequestConfig url为可选属性之后可能为undefined 使用类型断言
  return buildURL(url!, params)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  // 如果config有cancelToken
  if (config.cancelToken) {
    // 通过这个方法检测是否cancelToken使用过
    config.cancelToken.throwIfRequested()
  }
}

import xhr from './xhr'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    // 对res.data做处理以后再返回
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // transformRequestData会把data处理为字符串，就不是普通对象了
  // 所以要先对headers进行处理
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
  // 因为接口类型中method是可选参数  所以可能不存在  但是有设置默认值  所以一定有method 使用断言
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  // 返回一个处理后的url
  // 修改AxiosRequestConfig url为可选属性之后可能为undefined 使用类型断言
  return buildURL(url!, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  // 返回处理后的data
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  // 传入headers默认值 保证当data为普通对象且没有headers值的时候也会添加一个headers
  const { headers = {}, data } = config
  // 返回处理后的headers
  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

export default axios

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'

import { parseHeaders } from '../helpers/headers'

import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, data = null, method = 'get', headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }
    // 修改AxiosRequestConfig url为可选属性之后可能为undefined 使用类型断言
    request.open(method.toUpperCase(), url!, true)

    Object.keys(headers).forEach(name => {
      // 如果data为空则删除content-type属性
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

    //
    request.onreadystatechange = function handleLoad() {
      // 判断是否 请求已完成且响应已就绪   不是的话返回
      if (request.readyState !== 4) {
        return
      }

      // 网络错误或者超时错误的时候status是0
      if (request.status === 0) {
        return
      }

      //  返回所有响应头
      // 因为getAllResponseHeaders获取的是字符串，通过parseHeaders工具函数转换成对象
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())

      const responseData = responseType !== 'text' ? request.response : request.responseText

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        // 包含 HTTP 服务器返回的响应状态
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    // 错误处理
    request.onerror = function handleError() {
      // 不传response因为onerror接收不到response
      reject(createError('Network Error', config, null, request))
    }

    // 超时处理
    request.ontimeout = function handleTimeout() {
      // timeout也拿不到response
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}

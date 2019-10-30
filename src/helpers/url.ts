import { isDate, isPlainObject } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]
    // 如果不是有效值则跳出这次forEach循环进入下一次
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values = []

    if (Array.isArray(val)) {
      values = val
      // url中参数key值为数组的时候需要在后面加上[]
      // 例如 http://localhost:8080/e3izm/NavimenuitemController/selectAll?nmiids[]=1&nmiids[]=2&pageno=1&pagesize=8
      key += '[]'
    } else {
      // 方便下面做遍历
      values = [val]
    }

    values.forEach(val => {
      if (isDate(val)) {
        // 转化为url中时间格式
        val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }

      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')
  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 有问号说明后面已经有参数，可以直接加 '&' 再拼接上遍历后得到的参数
    // 没问号加上 '?' 再拼接参数
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

// 判断是否为同源请求
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

// 利用a标签的dom对象解析出protocol host
const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

// 解析url
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}

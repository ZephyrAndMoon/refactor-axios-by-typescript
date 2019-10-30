import { CancelExecutor, CancelTokenSource, Canceler } from '../types'

import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      // 把resolvePromise指向resolve 后续调用resolvePromise就等于执行了resolve
      // 就可以把Promise从pending变成resolve
      // 会执行xhr.ts中res.send之前的逻辑
      resolvePromise = resolve
    })

    // 第一种取消请求的方法
    executor(message => {
      // 防止这个函数多次调用
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    // 因为cancel赋值是在一个函数中，如果不断言的话return中会判断它未赋值报错
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })

    return {
      cancel,
      token
    }
  }
}

import { RejectedFn, ResolvedFn } from '../types/index'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  // interptors每个元素都是Interceptor泛型的一个接口 都有resolved和rejected(可选)属性
  private interptors: Array<Interceptor<T> | null>

  constructor() {
    this.interptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interptors.push({
      resolved,
      rejected
    })

    return this.interptors.length - 1
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interptors.forEach(interceptor => {
      // 每一项遍历的元素都是Interceptor<T>类型
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    if (this.interptors[id]) {
      // 如果直接删除元素会使use方法返回的id值错乱
      // 所以置为null 并把interptors属性的类型变更为联合类型 Array<Interceptor<T> | null>
      this.interptors[id] = null
    }
  }
}

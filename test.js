function isPlainObject(val) {
  return toString.call(val) === '[object Object]'
}

function deepMerge(...objs) {
  const result = Object.create(null)

  // objs可能是对象数组
  objs.forEach(obj => {
    if (obj) {
 
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        // 如果val是对象

        if (isPlainObject(val)) {
          // 如果result[key]已经存在且是对象
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          //  如果val不是对象直接赋值给result[key]
          result[key] = val
        }
      })
    }
  })

  return result
  console.log(result)
}

const aa = {
  'a': 'a-1',
  'b': {
    'b-1': 'b-1-1',
    'b-2': 'b-2-2'
  },
  'c': {
    'c-1': 'c-1-1',
    'c-2': 'c-2-1',
    'c-3': 'c-3-1'
  }
}

const bb = {
  'd': 'd-1',
  'b': {
    'b-1': 'b-1-1',
    'b-2': 'b-2-1',
    'b-3': 'b-3-1'
  },
  'e': {
    'e-1': {
      'e-1-2': 'e-1-2-1'
    },
    'e-2': 'c-2-1',
    'e-3': 'c-3-1'
  }
}

const o = deepMerge(aa, bb)
console.log(o)
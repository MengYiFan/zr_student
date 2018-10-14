// 获得对象的类型值
export const getDataType = (data) => {
  return toString.call(data).replace(/[\[\]]/ig, '').split(' ')[1].toLowerCase()
}

// 检查对象类型是否对头
export const checkObjectType = (data, type) => {
  if (typeof type !== 'string')
    return false
  if (getDataType(data) === type)
    return true
  return false
}

// 对象转uri数组
export const obj2uri = (obj) => {
  return Object.keys(obj).map((i) => {
    if (i == 'vediomediaurl') {
      return encodeURIComponent(i) + "=" + encodeURIComponent(obj[i])
    }
    return `${i}=${obj[i]}`
  }).join('&')
}

// uri转对象
export const uri2obj = (str) => {
  let res = {}
  str.split('&').forEach((item, index) => {
    let tmp = item.split('=')
    res[tmp[0]] = tmp[1]
  })
  return res
}

// 字符串转为数组对象
export const string2array = (data) => {
  if (checkObjectType(data) !== 'string') {
    return false
  }
  let res
  try {
    res = JSON.parse(data)
  } catch (e) {
    res = false
  }
  return false
}

// 获得全局变量数值
export const getGlobalData = (param) => {
  return getApp().globalData[param]
}

// 设置全局变量
export const setGlobalData = (param, data) => {
  // if (getDataType(data) == 'object') {
  //   data = JSON.stringify(data)
  // }
  getApp().globalData[param] = data
}

// 检测手机号码
export const isPhone = (str) => {
  let re = /^1\d{10}$/
  return re.test(str)
}

// 检测电话号码
export const isTel = (str) => {
  let re = /^0\d{2,3}-?\d{7,8}$/
  return re.test(str)
}

// 验证邮箱
export const isEmail = (str) => {
  let re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  return re.test(str)
}

// 大数组分小数组
export const chunkArr = (data, size) => {
  if (getDataType(data) != 'array') {
    return false
  }
  let res = [],
      count = 0,
      rowIdx = 0
  data.forEach(function (val, index, arr) {
    if (count == size) {
      rowIdx += 1
      count = 0
    }
    res[rowIdx] = res[rowIdx] || []
    res[rowIdx].push(val)
    count++
  })

  return res
}

export const getRandomColor = () => {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

export const getImageUrl = (str) => {
  if (-1 == str.search(/^(http|https):\/\//gi)) {
    str = `https://app.shangnarxue.com/edq/${str}`
  }
  return str
}


class Event {
  constructor() {
    this.cbs = new Map()
  }
  // 注册
  on(type, cb) {
    this.add(type, cb)
    console.log(this.cbs)
  }
  // once注册,返回一个实例,可链式调用
  once(type, cb) {
    this.cbs.set(type, cb)
    return this
  }
  // 触发
  emit(...argues) {
    const type = argues[0]
    const args = argues.slice(1)
    const cbs = this.cbs.get(type)
    if (cbs && Array.isArray(cbs)) {
      // 绑定this及参数
      cbs.forEach(cb => cb.apply(this, args))
    } else if (cbs && !Array.isArray(cbs)) {
      cbs.apply(this, args)
      this.removeListener(type)
    }
  }
  // 删除单一
  removeListener(type) {
    this.cbs.delete(type)
  }
  // 删除所有
  removeAllListeners() {
    for (let [key] of this.cbs) {
      this.removeListener(key)
    }
  }
  add(type, cb) {
    let res = this.cbs.get(type)
    if (!res) {
      this.cbs.set(type, [cb])
    } else {
      res.push(cb)
    }
  }
}

module.exports = Event
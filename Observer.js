// 被观察者
class Observered {
    constructor(name, age, state) {
        this.name = name
        this.age = age
        this.state = state
        this.observers = []
    }
    addOb(observer) {
        this.observers.push(observer)
    }
    setState(newVal) {
        this.state = newVal
        this.observers.forEach((ob) => {
            ob.update(this.name, this.age, newVal)
        })
    }

}

// 观察者
class Observer {
    constructor() {
        this.callback = []
    }
    add(fn) {
        this.callback.push(fn)
    }
    update(...args) {
        this.callback.forEach((fn) => {
            fn(...args)
        })
    }
}

let ob1 = new Observered('小明', 14, '吃饭')
let fn1 = (name, age, state) => {
    console.log(`${name}今年${age}岁，正在${state}`)
}
let fn2 = (name, age, state) => {
    console.log(`你好，我是${name}，我今年${age}，正在${state}`)
}
let watcher = new Observer()
watcher.add(fn1)
watcher.add(fn2)
ob1.addOb(watcher)
ob1.setState('学习')
//小明今年14岁，正在学习
//你好，我是小明，我今年14，正在学习
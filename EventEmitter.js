class EventEmitter {
    constructor() {
        //同名事件都多个回调函数
        this.events = {}
    }
    // 订阅事件
    on(event, fn) {
        if (!this.events[event]) {
            this.events[event] = [fn]
        } else {
            this.events[event].push(fn)
        }
    }
    // 取消订阅事件
    off(event,fn){
        if(this.events[event]){
            let index = this.events[event].indexOf(fn)
            this.events[event].splice(index,1)
        }
    }
    // 发布事件
    emit(event,...args){
        if(this.events[event]){
            this.events[event].forEach((fn)=>{
                fn(...args)
            })
        }
    }
}
let eventBus = new EventEmitter()
let fn1 = function(name, age) {
	console.log(`${name} ${age}`)
}
let fn2 = function(name, age) {
	console.log(`hello, ${name} ${age}`)
}
eventBus.on('changeName', fn1)
eventBus.on('changeName', fn2)
eventBus.emit('changeName', '布兰', 12)
//布兰 12
//hello, 布兰 12
eventBus.off('changeName',fn1)
eventBus.emit('changeName', 'who am i', 21)
//hello, who am i 21

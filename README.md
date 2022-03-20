# vue-reactive-code
实现vue的双向数据绑定

利用数据劫持和发布订阅模式，实现vue2中的双向数据绑定
基础类包括：  
    1. Observer  
    2. Compile   
    3. Watcher  

- easy.html 仅使用Object.defineProperty()来实现数据双向绑定  
- hack.js 演示了数据劫持  
- proxy.js 演示了数据代理  
- EventEmitter.js 是发布订阅模式  
- Observer.js 是观察者模式  
- reduce.js 演示了Array.prototype.reduce的用法  
- index.html及vue.js实现了vue中数据双向绑定  
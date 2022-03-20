class Vue {
    constructor(options) {
        // this表示Vue实例 vm
        this.$data = options.data
        Observer(this.$data)
        this.proxyKeys(this, this.$data)
        // 调用模板编译的函数,传入数据和结构
        Compile(options.el, this)
    }
    // 做数据代理
    proxyKeys(dest, source) {
        Object.keys(source).forEach((key) => {
            Object.defineProperty(dest, key, {
                enumerable: true,
                configurable: true,
                set(newVal) {
                    source[key] = newVal
                },
                get() {
                    return source[key]
                }
            })
        })
    }
}

function defineReactive(obj, key, val) {
    Observer(val)
    const dep = new Dep()
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        set(newVal) {
            // console.log(`设置了${key}属性为${newVal}`);
            // 此处不可以使用obj[key]，因为本身就监听了obj[key]，为其设置了setter
            // 如果修改obj[key]的值，则会一直触发setter
            val = newVal
            // 新赋值的属性也添加setter和getter
            Observer(newVal)
            // 通知每个watcher来更新自己的DOM
            dep.notify()
        },
        get() {
            // console.log(`读取了${key}属性`);
            // 如果dep.target指向一个watcher实例，则将watcher实例加入到Dep中
            Dep.target && dep.add(Dep.target)
            return val
        }
    })
}

// 将data中所有属性都设置为响应式
// 劫持data中所有属性
function Observer(obj) {
    if (!obj || typeof obj !== 'object') return
    Object.keys(obj).forEach((key) => {
        defineReactive(obj, key, obj[key])
    })
}

// 对HTML结构进行模板编译
function Compile(el, vm) {
    // 取得真实的DOM对象，并且挂载到vue实例的$el属性上
    vm.$el = document.querySelector(el)
    // 创建文档碎片，去操作DOM，防止重排及重绘，提升性能
    // 开辟一块内存区域，dom元素移入到文档片段时，就不可以存在于DOM树中
    let fragment = document.createDocumentFragment()
    while (child = vm.$el.firstChild) {
        fragment.appendChild(child)
    }
    // 进行模板编译
    render(fragment)

    // 将fragment中所有子节点添加到DOM树中，只渲染一次，提升性能
    vm.$el.appendChild(fragment)

    function render(node) {
        // 先寻找文本节点
        const reg = /\{\{\s*(\S+)\s*\}\}/
        if (node.nodeType === 3) {
            let text = node.nodeValue
            let arr = reg.exec(text)
            if (arr) {
                let val = arr[1].split('.').reduce((obj, key) => obj[key], vm)
                // 更新DOM中的元素
                node.nodeValue = text.replace(arr[0], val)
                // 在修改DOM时，创建一个watcher实例
                new Watcher(vm, arr[1], (newVal) => {
                    node.nodeValue = text.replace(reg, newVal)
                })
            }
        }
        //判断有没有v-model
        if (node.nodeType === 1 && node.nodeName.toUpperCase() === 'INPUT') {
            let prop = Array.from(node.attributes).find(key => key.name == 'v-model')
            if (prop) {
                let val = prop.value.split('.').reduce((obj, key) => obj[key], vm)
                // 给input输入框的value赋值
                node.value = val
                // 创建一个订阅者watcher，再次修改其中值时可以获得消息
                new Watcher(vm, prop.value, (newVal) => {
                    node.value = newVal
                })
                // 实现双向数据绑定，在修改视图时也会修改model中的数据
                node.addEventListener('input', (e) => {
                    let arr = prop.value.split('.')
                    let propName = arr.slice(0, -1).reduce((obj, key) => obj[key], vm)
                    propName[arr[arr.length - 1]] = e.target.value
                })
            }
        }
        node.childNodes.forEach((child) => {
            render(child)
        })
    }
}

// 消息调度中心
class Dep {
    constructor() {
        this.watchers = []
    }
    // 添加新的订阅者
    add(watcher) {
        this.watchers.push(watcher)
    }
    // 通知订阅者，修改DOM
    notify() {
        this.watchers.forEach((watcher) => {
            watcher.update()
        })
    }
}

// 订阅者，用来修改DOM
class Watcher {
    constructor(vm, key, cb) {
        // 传入回调函数，在回调中用来修改DOM上的数据
        this.cb = cb
        // vm中的$data保存着最新的数据，用来拿到最新的数据
        this.vm = vm
        // 在vm上众多数据中，订阅了哪个数据
        this.key = key

        // 在Dep中添加watcher
        // Watcher是一个构造函数，this指向新创建的watcher实例
        Dep.target = this
        this.key.split('.').reduce((obj, prop) => obj[prop], this.vm)
        Dep.target = null
    }
    update() {
        // 获取到新值
        let val = this.key.split('.').reduce((obj, prop) => obj[prop], this.vm)
        // 利用回调函数cb来修改DOM
        this.cb(val)
    }
}

let data = {
    name: 'wan',
    age: '14',
    info: {
        address: 'nj',
        school: 'cc'
    }
}
let vm = {}
function proxyKeys(dest, source) {
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
proxyKeys(vm,data)
console.log(vm);

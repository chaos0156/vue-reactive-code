let obj = {
    name: 'wan',
    age: 12,
    gender: 'male'
}
Object.keys(obj).forEach((key) => {
    let value = obj[key]
    Object.defineProperty(obj, key, {
        set(newVal) {
            console.log(`设置了${key}属性为${newVal}`);
            value = newVal
        },
        get() {
            console.log(`读取了${key}属性`);
            return value
        }
    })
})

console.log(obj.gender)
obj.gender = 'female'
setTimeout(()=>{
    obj.name = 'chaos'
},3000)

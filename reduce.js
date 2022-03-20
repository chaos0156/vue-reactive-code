let arr = [1,2,3,4]
let ans = arr.reduce((a,b)=>a+b)
console.log(ans);   //10

let obj = {
    name:'zs',
    info:{
        address:{
            location:'南京'
        }
    }
}

let attrs = ['info','address','location']
let res = attrs.reduce((a,b)=>a[b],obj)
console.log(res);   // 南京

const str = 'info.address.location'
let result = str.split('.').reduce((a,b)=>a[b],obj)
console.log(result);    // 南京
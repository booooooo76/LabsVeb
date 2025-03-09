function findMinMax(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return 'Некоректний ввід';
    }
    return {
        min: Math.min(...arr),
        max: Math.max(...arr)
    };
}

function compareObjects(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) {
        return false;
    }
    
    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    
    return true;
}

console.log(findMinMax([3, 7, 2, 9, -5, 10])); // { min: -5, max: 10 }
console.log(compareObjects({a: 1, b: 2}, {a: 1, b: 2})); // true
console.log(compareObjects({a: 1, b: 2}, {a: 1, b: 3})); // false

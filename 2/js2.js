function isInRange(number, min, max) {
    return number >= min && number <= max;
}

// Тестування функції isInRange
console.log(isInRange(5, 1, 10));  // true
console.log(isInRange(15, 1, 10)); // false

let isActive = true;
console.log(isActive);  // true
isActive = !isActive;  // Зміна на false
console.log(isActive);  // false
isActive = !isActive;  // Зміна на true
console.log(isActive);  // true


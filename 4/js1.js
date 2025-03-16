let fruits = ["яблуко", "банан", "апельсин", "груша"];

fruits.pop();
console.log("1. Оновлений масив після видалення останнього елемента:", fruits);

fruits.unshift("ананас");
console.log("2. Масив після додавання 'ананас' на початок:", fruits);

fruits.sort().reverse();
console.log("3. Масив після сортування у зворотньому алфавітному порядку:", fruits);

let appleIndex = fruits.indexOf("яблуко");
console.log("4. Індекс 'яблуко' у масиві:", appleIndex);

let numbers = [1, 2, 3, 4, 5];

let squaredNumbers = numbers.map(num => num ** 2);
console.log("1. Масив після піднесення до квадрату:", squaredNumbers);

let evenNumbers = squaredNumbers.filter(num => num % 2 === 0);
console.log("2. Парні числа:", evenNumbers);

let sum = squaredNumbers.reduce((acc, num) => acc + num, 0);
console.log("3. Сума всіх елементів:", sum);

let additionalNumbers = [6, 7, 8, 9, 10];

numbers = numbers.concat(additionalNumbers);
console.log("4. Масив після додавання нових чисел:", numbers);

numbers.splice(0, 3);
console.log("5. Масив після видалення перших 3 елементів:", numbers);

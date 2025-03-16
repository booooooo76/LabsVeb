// Створюємо масив об'єктів працівників
let employees = [
    { name: "Олег", age: 30, position: "розробник" },
    { name: "Анна", age: 25, position: "дизайнер" },
    { name: "Іван", age: 35, position: "менеджер" },
    { name: "Марія", age: 28, position: "розробник" }
];

// 1. Сортуємо масив за іменами працівників (алфавітний порядок)
employees.sort((a, b) => a.name.localeCompare(b.name));
console.log("1. Масив після сортування за іменами:", employees);

// 2. Знаходимо всіх працівників, які мають посаду "розробник"
let developers = employees.filter(emp => emp.position === "розробник");
console.log("2. Працівники з посадою 'розробник':", developers);

// 3. Видаляємо працівника за певною умовою (наприклад, старше 30 років)
employees = employees.filter(emp => emp.age <= 30);
console.log("3. Масив після видалення працівників старше 30 років:", employees);

// 4. Додаємо нового працівника
employees.push({ name: "Василь", age: 29, position: "тестувальник" });
console.log("4. Масив після додавання нового працівника:", employees);

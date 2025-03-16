let students = [
    { name: "Олексій", age: 20, course: 2 },
    { name: "Ірина", age: 22, course: 3 },
    { name: "Андрій", age: 19, course: 1 },
    { name: "Марина", age: 21, course: 3 }
];

students = students.filter(student => student.name !== "Олексій");
console.log("1. Масив після видалення 'Олексія':", students);

students.push({ name: "Влад", age: 23, course: 4 });
console.log("2. Масив після додавання нового студента:", students);

students.sort((a, b) => b.age - a.age);
console.log("3. Масив після сортування за віком:", students);

let thirdCourseStudent = students.find(student => student.course === 3);
console.log("4. Студент, який навчається на 3-му курсі:", thirdCourseStudent);

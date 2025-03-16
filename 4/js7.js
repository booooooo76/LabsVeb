let student = {
    name: "Іван",
    age: 20,
    course: 2
};


student.subjects = ["Математика", "Фізика", "Програмування"];

delete student.age;

console.log(student);

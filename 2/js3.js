function getGrade(grade) {
    if (grade >= 90) {
        return "Відмінно";
    } else if (grade >= 75) {
        return "Добре";
    } else if (grade >= 50) {
        return "Задовільно";
    } else {
        return "Незадовільно";
    }
}

// Тестування функції
let studentGrade = parseInt(prompt("Введіть оцінку студента:"));
alert("Оцінка студента: " + getGrade(studentGrade));


function getSeason(month) {
    if (month === 12 || month === 1 || month === 2) {
        return "Зима";
    } else if (month >= 3 && month <= 5) {
        return "Весна";
    } else if (month >= 6 && month <= 8) {
        return "Літо";
    } else if (month >= 9 && month <= 11) {
        return "Осінь";
    } else {
        return "Невірний місяць";
    }
}

// Тестування функції
let month = parseInt(prompt("Введіть місяць (від 1 до 12):"));
alert("Сезон: " + getSeason(month));

function getSeasonTernary(month) {
    return (month === 12 || month === 1 || month === 2) ? "Зима" :
           (month >= 3 && month <= 5) ? "Весна" :
           (month >= 6 && month <= 8) ? "Літо" :
           (month >= 9 && month <= 11) ? "Осінь" :
           "Невірний місяць";
}

// Тестування функції
let monthTernary = parseInt(prompt("Введіть місяць (від 1 до 12):"));
alert("Сезон (тернарний оператор): " + getSeasonTernary(monthTernary));


document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    setInterval(updateClock, 1000);
    updateCalendar();
});

// 1️⃣ Цифровий годинник із мигаючим індикатором секунд
function updateClock() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let seconds = now.getSeconds().toString().padStart(2, "0");
    
    document.getElementById("clock").innerHTML = `${hours}:${minutes}:<span class="blink">${seconds}</span>`;
}

// 2️⃣ Таймер зворотного відліку
function startCountdown() {
    const userTime = new Date(document.getElementById("timerInput").value);
    if (isNaN(userTime)) {
        alert("Введіть коректний час!");
        return;
    }

    const interval = setInterval(() => {
        const now = new Date();
        let diff = userTime - now;
        if (diff <= 0) {
            clearInterval(interval);
            document.getElementById("countdown").innerText = "Час вийшов!";
            return;
        }

        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((diff / (1000 * 60)) % 60);
        let seconds = Math.floor((diff / 1000) % 60);

        document.getElementById("countdown").innerText = `${days}д ${hours}г ${minutes}хв ${seconds}с`;
    }, 1000);
}

// 3️⃣ Календар
function updateCalendar() {
    const picker = document.getElementById("monthPicker");
    const calendar = document.getElementById("calendar");

    let date = picker.value ? new Date(picker.value + "-01") : new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

    picker.value = `${year}-${(month + 1).toString().padStart(2, "0")}`;

    let firstDay = new Date(year, month, 1).getDay();
    let lastDate = new Date(year, month + 1, 0).getDate();
    
    let table = "<tr><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Нд</th></tr><tr>";
    
    for (let i = 0; i < firstDay; i++) {
        table += "<td></td>";
    }
    
    for (let day = 1; day <= lastDate; day++) {
        table += `<td>${day}</td>`;
        if ((firstDay + day) % 7 === 0) {
            table += "</tr><tr>";
        }
    }
    
    table += "</tr>";
    calendar.innerHTML = table;
}

// 4️⃣ День народження
function calculateTimeToBirthday() {
    let birthdayInput = document.getElementById("birthdayInput").value;
    if (!birthdayInput) {
        alert("Введіть дату народження!");
        return;
    }

    let now = new Date();
    let birthday = new Date(birthdayInput);
    birthday.setFullYear(now.getFullYear());

    if (birthday < now) {
        birthday.setFullYear(now.getFullYear() + 1);
    }

    let diff = birthday - now;

    let months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    let days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30;
    let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((diff / (1000 * 60)) % 60);
    let seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("birthdayCountdown").innerText = 
        `До дня народження: ${months} міс. ${days} д. ${hours}г ${minutes}хв ${seconds}с`;
}

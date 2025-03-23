document.addEventListener("DOMContentLoaded", () => {
    const redLight = document.getElementById("red");
    const yellowLight = document.getElementById("yellow");
    const greenLight = document.getElementById("green");
    const statusText = document.getElementById("status");
    const nextStateButton = document.getElementById("nextState");
    const changeDurationButton = document.getElementById("changeDuration");

    let durations = { red: 5000, yellow: 3000, green: 7000 }; // Початкові значення (в мс)
    let currentState = "red";
    let interval;
    
    function resetLights() {
        redLight.style.background = "gray";
        yellowLight.style.background = "gray";
        greenLight.style.background = "gray";
    }

    function setState(state) {
        resetLights();
        currentState = state;
        statusText.innerText = state.toUpperCase();

        switch (state) {
            case "red":
                redLight.style.background = "red";
                setTimeout(() => setState("yellow"), durations.red);
                break;
            case "yellow":
                yellowLight.style.background = "yellow";
                setTimeout(() => setState("green"), durations.yellow);
                break;
            case "green":
                greenLight.style.background = "green";
                setTimeout(() => blinkYellow(3), durations.green);
                break;
        }
    }

    function blinkYellow(times) {
        let count = 0;
        interval = setInterval(() => {
            yellowLight.style.background = yellowLight.style.background === "yellow" ? "gray" : "yellow";
            count++;
            if (count >= times * 2) {
                clearInterval(interval);
                setState("red");
            }
        }, 500);
    }

    nextStateButton.addEventListener("click", () => {
        clearTimeout(interval);
        if (currentState === "red") setState("yellow");
        else if (currentState === "yellow") setState("green");
        else if (currentState === "green") blinkYellow(3);
    });

    changeDurationButton.addEventListener("click", () => {
        let newRed = prompt("Введіть тривалість червоного світла (в секундах):", durations.red / 1000);
        let newYellow = prompt("Введіть тривалість жовтого світла (в секундах):", durations.yellow / 1000);
        let newGreen = prompt("Введіть тривалість зеленого світла (в секундах):", durations.green / 1000);
        
        if (newRed > 0) durations.red = newRed * 1000;
        if (newYellow > 0) durations.yellow = newYellow * 1000;
        if (newGreen > 0) durations.green = newGreen * 1000;

        alert("Тривалість змінена!");
    });

    setState("red");
});

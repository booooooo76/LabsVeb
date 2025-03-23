document.addEventListener("DOMContentLoaded", () => {
    const lamp = document.getElementById("lamp");
    const toggleButton = document.getElementById("toggleButton");
    const lampTypeSelect = document.getElementById("lampType");
    const brightnessButton = document.getElementById("brightnessButton");
    let autoOffTimeout;

    function resetAutoOffTimer() {
        clearTimeout(autoOffTimeout);
        autoOffTimeout = setTimeout(() => {
            lamp.src = "lamp-off.png";
        }, 300000); // 5 хвилин
    }

    toggleButton.addEventListener("click", () => {
        if (lamp.src.includes("lampOff")) {
            lamp.src = "lampOn.png";
        } else {
            lamp.src = "lampOff.png";
        }
        resetAutoOffTimer();
    });

    lampTypeSelect.addEventListener("change", () => {
        const selectedType = lampTypeSelect.value;
        lamp.dataset.type = selectedType;
        alert(`Ви вибрали: ${selectedType}`);
        resetAutoOffTimer();
    });

    brightnessButton.addEventListener("click", () => {
        const brightness = prompt("Введіть яскравість (0-100):", "50");
        if (brightness !== null && brightness >= 0 && brightness <= 100) {
            lamp.style.opacity = brightness / 100;
        } else {
            alert("Некоректне значення!");
        }
        resetAutoOffTimer();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('message');
    const button = document.getElementById('showMessageButton');

    button.addEventListener('click', () => {
        messageElement.textContent = 'Hello world!';
    });
});

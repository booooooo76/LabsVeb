// Склад для зберігання продуктів (Map)
let productCatalog = new Map();

// Set для відстеження замовлень
let orderHistory = new Set();

// WeakMap для зберігання історії змін продуктів
let productHistory = new WeakMap();

// WeakSet для відстеження змін продуктів без витоку пам'яті
let modifiedProducts = new WeakSet();

// Клас для продукту
class Product {
    constructor(name, price, quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.history = []; // Історія змін продукту
    }

    updateProduct(price, quantity) {
        if (this.price !== price) {
            this.history.push(`Ціна змінена на: ${price}`);
            this.price = price;
        }
        if (this.quantity !== quantity) {
            this.history.push(`Кількість змінена на: ${quantity}`);
            this.quantity = quantity;
        }
    }
}

// Додавання продукту
function addProduct() {
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const quantity = parseInt(document.getElementById("productQuantity").value);

    if (!name || isNaN(price) || isNaN(quantity)) {
        alert("Будь ласка, введіть всі дані!");
        return;
    }

    let product = new Product(name, price, quantity);
    productCatalog.set(name, product);
    modifiedProducts.add(product); // Відстежуємо змінений продукт

    updateProductList();
}

// Оновлення інформації про продукт
function updateProduct() {
    const name = document.getElementById("updateProductName").value;
    const price = parseFloat(document.getElementById("updateProductPrice").value);
    const quantity = parseInt(document.getElementById("updateProductQuantity").value);

    if (!productCatalog.has(name)) {
        alert("Продукт не знайдений!");
        return;
    }

    let product = productCatalog.get(name);
    product.updateProduct(price, quantity);
    productHistory.set(product, product.history); // Зберігаємо історію змін продукту

    updateProductList();
    updateHistoryList();
}

// Пошук продукту за назвою
function searchProduct() {
    const name = document.getElementById("searchProductName").value;
    if (productCatalog.has(name)) {
        const product = productCatalog.get(name);
        alert(`Продукт: ${name}\nЦіна: ${product.price}\nКількість: ${product.quantity}`);
    } else {
        alert("Продукт не знайдений!");
    }
}

// Видалення продукту
function deleteProduct() {
    const name = document.getElementById("deleteProductName").value;
    if (productCatalog.has(name)) {
        productCatalog.delete(name);
        modifiedProducts.delete(name); // Видаляємо змінений продукт
        updateProductList();
    } else {
        alert("Продукт не знайдений!");
    }
}

// Оформлення замовлення
function placeOrder() {
    const name = document.getElementById("orderProductName").value;
    const quantity = parseInt(document.getElementById("orderQuantity").value);

    if (!productCatalog.has(name)) {
        alert("Продукт не знайдений!");
        return;
    }

    let product = productCatalog.get(name);

    if (product.quantity < quantity) {
        alert("Недостатньо товару на складі!");
        return;
    }

    product.quantity -= quantity;
    orderHistory.add(`${quantity} одиниць продукту "${name}" замовлено.`);
    updateProductList();
    updateOrderHistory();
}

// Оновлення списку продуктів
function updateProductList() {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    productCatalog.forEach((product, name) => {
        let li = document.createElement("li");
        li.textContent = `Назва: ${name}, Ціна: ${product.price}, Кількість: ${product.quantity}`;
        productList.appendChild(li);
    });
}

// Оновлення історії змін продуктів
function updateHistoryList() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    productHistory.forEach((history, product) => {
        let li = document.createElement("li");
        li.textContent = `Продукт: ${product.name} - Історія змін: ${history.join(", ")}`;
        historyList.appendChild(li);
    });
}

// Оновлення історії замовлень
function updateOrderHistory() {
    const orderList = document.getElementById("orderHistory");
    orderList.innerHTML = "";
    orderHistory.forEach(order => {
        let li = document.createElement("li");
        li.textContent = order;
        orderList.appendChild(li);
    });
}


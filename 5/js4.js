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
        // Додаємо початкові дані до історії
        this.history.push(`Створено продукт з ціною: ${price} та кількістю: ${quantity}`);
        
        // Відразу зберігаємо історію в WeakMap
        productHistory.set(this, [...this.history]);
    }

    updateProduct(price, quantity) {
        if (this.price !== price) {
            this.history.push(`Ціна змінена з ${this.price} на: ${price}`);
            this.price = price;
        }
        if (this.quantity !== quantity) {
            this.history.push(`Кількість змінена з ${this.quantity} на: ${quantity}`);
            this.quantity = quantity;
        }
        
        // Оновлюємо історію в WeakMap
        productHistory.set(this, [...this.history]);
        // Додаємо в множину змінених продуктів
        modifiedProducts.add(this);
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
    
    // Оновлюємо UI
    updateProductList();
    updateHistoryList(); // Оновлюємо історію після додавання
    
    // Очищаємо поля введення
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productQuantity").value = "";
}

// Оновлення інформації про продукт
function updateProduct() {
    const name = document.getElementById("updateProductName").value;
    const price = parseFloat(document.getElementById("updateProductPrice").value);
    const quantity = parseInt(document.getElementById("updateProductQuantity").value);

    if (!name || isNaN(price) || isNaN(quantity)) {
        alert("Будь ласка, введіть всі дані!");
        return;
    }

    if (!productCatalog.has(name)) {
        alert("Продукт не знайдений!");
        return;
    }

    let product = productCatalog.get(name);
    product.updateProduct(price, quantity);

    // Оновлюємо UI
    updateProductList();
    updateHistoryList();
    
    // Очищаємо поля введення
    document.getElementById("updateProductName").value = "";
    document.getElementById("updateProductPrice").value = "";
    document.getElementById("updateProductQuantity").value = "";
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
    
    // Очищаємо поле введення
    document.getElementById("searchProductName").value = "";
}

// Видалення продукту
function deleteProduct() {
    const name = document.getElementById("deleteProductName").value;
    if (productCatalog.has(name)) {
        let product = productCatalog.get(name);
        productCatalog.delete(name);
        
        // Оновлюємо UI
        updateProductList();
        updateHistoryList(); // Оновлюємо історію після видалення
    } else {
        alert("Продукт не знайдений!");
    }
    
    // Очищаємо поле введення
    document.getElementById("deleteProductName").value = "";
}

// Оформлення замовлення
function placeOrder() {
    const name = document.getElementById("orderProductName").value;
    const quantity = parseInt(document.getElementById("orderQuantity").value);

    if (!name || isNaN(quantity) || quantity <= 0) {
        alert("Будь ласка, введіть коректні дані!");
        return;
    }

    if (!productCatalog.has(name)) {
        alert("Продукт не знайдений!");
        return;
    }

    let product = productCatalog.get(name);

    if (product.quantity < quantity) {
        alert("Недостатньо товару на складі!");
        return;
    }

    const oldQuantity = product.quantity;
    product.quantity -= quantity;
    product.history.push(`Зменшено кількість з ${oldQuantity} на ${product.quantity} через замовлення`);
    productHistory.set(product, [...product.history]);
    
    // Додаємо замовлення до історії
    const orderDate = new Date().toLocaleString();
    orderHistory.add(`${orderDate}: ${quantity} одиниць продукту "${name}" замовлено.`);
    
    // Оновлюємо UI
    updateProductList();
    updateHistoryList();
    updateOrderHistory();
    
    // Очищаємо поля введення
    document.getElementById("orderProductName").value = "";
    document.getElementById("orderQuantity").value = "";
}

// Оновлення списку продуктів
function updateProductList() {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    
    if (productCatalog.size === 0) {
        let li = document.createElement("li");
        li.textContent = "Немає доданих продуктів";
        productList.appendChild(li);
        return;
    }
    
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
    
    let historyFound = false;
    
    // Перебираємо всі продукти в каталозі та витягуємо їх історію з WeakMap
    productCatalog.forEach((product, name) => {
        const history = productHistory.get(product);
        if (history && history.length > 0) {
            historyFound = true;
            let li = document.createElement("li");
            li.textContent = `Продукт: ${name} - Історія змін: ${history.join("; ")}`;
            historyList.appendChild(li);
        }
    });
    
    if (!historyFound) {
        let li = document.createElement("li");
        li.textContent = "Немає історії змін";
        historyList.appendChild(li);
    }
}

// Оновлення історії замовлень
function updateOrderHistory() {
    const orderList = document.getElementById("orderHistory");
    orderList.innerHTML = "";
    
    if (orderHistory.size === 0) {
        let li = document.createElement("li");
        li.textContent = "Немає історії замовлень";
        orderList.appendChild(li);
        return;
    }
    
    orderHistory.forEach(order => {
        let li = document.createElement("li");
        li.textContent = order;
        orderList.appendChild(li);
    });
}

// Ініціалізація сторінки
document.addEventListener('DOMContentLoaded', function() {
    updateProductList();
    updateHistoryList();
    updateOrderHistory();
});


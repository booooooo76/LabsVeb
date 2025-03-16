function libraryManagement() {
    // Початковий масив книг
    let books = [
        { title: "1984", author: "George Orwell", genre: "Dystopian", pages: 328, isAvailable: true },
        { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", pages: 281, isAvailable: true },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", pages: 180, isAvailable: false },
    ];

    // Додавання нової книги
    function addBook(title, author, genre, pages) {
        books.push({ title, author, genre, pages, isAvailable: true });
    }

    // Видалення книги за назвою
    function removeBook(title) {
        books = books.filter(book => book.title !== title);
    }

    // Пошук книг за автором
    function findBooksByAuthor(author) {
        return books.filter(book => book.author === author);
    }

    // Позначення книги як взятої або повернутої
    function toggleBookAvailability(title, isBorrowed) {
        const book = books.find(book => book.title === title);
        if (book) {
            book.isAvailable = !isBorrowed;
        }
    }

    // Сортування книг за кількістю сторінок
    function sortBooksByPages() {
        books.sort((a, b) => a.pages - b.pages);
    }

    // Зведення статистики про книги
    function getBooksStatistics() {
        const totalBooks = books.length;
        const availableBooks = books.filter(book => book.isAvailable).length;
        const borrowedBooks = totalBooks - availableBooks;
        const averagePages = totalBooks > 0 ? books.reduce((acc, book) => acc + book.pages, 0) / totalBooks : 0;

        return {
            totalBooks,
            availableBooks,
            borrowedBooks,
            averagePages: averagePages.toFixed(2),
        };
    }

    // Повертаємо об'єкт з функціями для використання
    return {
        addBook,
        removeBook,
        findBooksByAuthor,
        toggleBookAvailability,
        sortBooksByPages,
        getBooksStatistics
    };
}

//приклд
const library = libraryManagement();

library.addBook("Brave New World", "Aldous Huxley", "Dystopian", 311);

library.removeBook("1984");

console.log(library.findBooksByAuthor("Harper Lee")); 

library.toggleBookAvailability("To Kill a Mockingbird", true);

library.sortBooksByPages();
console.log(library.getBooksStatistics()); 

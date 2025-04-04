const books = [
    { id: 1, title: "Stearling Cinderella", author: "Musiimenta J", genre: "Fairy Tale", status: "Read", favorite: true, image: "cinderella.jpg" },
    { id: 2, title: "Love Fool", author: "Masha V", genre: "Fairy Tale", status: "Unread", favorite: false, image: "love fool.jpg" },
    { id: 3, title: "Once Upon A Time", author: "Tophel T", genre: "Fairy Tale", status: "Read", favorite: false, image: "once upon a time.jpg" },
    { id: 4, title: "The Violet", author: "Farouk M", genre: "Fairy Tale", status: "Read", favorite: false, image: "violet book.jpg" },
    { id: 5, title: "The Winter Goodess", author: "Kugonza E", genre: "Fairy Tale", status: "Unread", favorite: false, image: "winter goodess.jpg" }
];

// Generate book cards
function createBookCard(book) {
    return `
        <div class="col-md-3">
            <div class="card shadow-sm book-card" data-id="${book.id}">
                <img src="${book.image}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h3 class="card-title">${book.title}</h3>
                    <p class="card-text">Author: ${book.author}</p>
                    <p class="card-text"><small>Genre: ${book.genre}</small></p>
                    <p class="card-text"><small>Status: ${book.status}</small></p>
                    <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                    <button class="btn btn-sm btn-info edit-btn">Edit</button>
                    <button class="btn btn-sm ${book.favorite ? 'btn-warning' : 'btn-outline-warning'} favorite-btn">
                        ${book.favorite ? 'Unfavorite' : 'Favorite'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Display books
function displayBooks() {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = books.map(createBookCard).join("");
}

// Event delegation for dynamic buttons
document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("book-list");

    bookList.addEventListener("click", (e) => {
        const card = e.target.closest(".book-card");
        const bookId = card?.dataset.id;

        if (e.target.classList.contains("delete-btn")) {
            handleDelete(bookId);
        } else if (e.target.classList.contains("edit-btn")) {
            handleEdit(bookId);
        } else if (e.target.classList.contains("favorite-btn")) {
            toggleFavorite(bookId);
        }
    });
});

function handleDelete(bookId) {
    const modal = document.getElementById("deleteModal");
    modal.style.display = "block";

    // Confirm deletion
    document.getElementById("confirmDeleteBtn").onclick = () => {
        alert(`Book with ID ${bookId} deleted.`);
        books.splice(books.findIndex((b) => b.id == bookId), 1);
        modal.style.display = "none";
        displayBooks(); // Refresh book list
    };

    // Cancel deletion
    document.getElementById("cancelDeleteBtn").onclick = () => {
        modal.style.display = "none";
    };
}

function handleEdit(bookId) {
    const modal = document.getElementById("editModal");
    modal.style.display = "block";

    // Save changes
    document.getElementById("saveChangesBtn").onclick = () => {
        alert(`Edit changes saved for book ID ${bookId}.`);
        modal.style.display = "none";
    };

    // Cancel editing
    document.getElementById("cancelEditBtn").onclick = () => {
        modal.style.display = "none";
    };
}

function toggleFavorite(bookId) {
    const book = books.find((b) => b.id == bookId);
    book.favorite = !book.favorite;
    displayBooks(); // Refresh book list
}

displayBooks(); // Initial display

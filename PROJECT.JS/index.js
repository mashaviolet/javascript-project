// References to elements
const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
const favoriteList = document.getElementById("favoriteList");
const unreadList = document.getElementById("unreadList");
const readList = document.getElementById("readList");

document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
});

document.getElementById("bookForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const bookId = document.getElementById("bookId").value.trim();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const genre = document.getElementById("genre").value.trim();
  const status = document.getElementById("status").value;
  const imageInput = document.getElementById("image");

  // Validate required values
  if (!title || !author || !genre) {
    alert("All fields are required!");
    return;
  }

  // Validate image file type
  const imageFile = imageInput.files[0];
  if (imageFile) {
    const reader = new FileReader();
    reader.onloadend = function () {
      saveBook(bookId, title, author, genre, status, reader.result);
    };
    reader.readAsDataURL(imageFile);
  } else {
    saveBook(bookId, title, author, genre, status, "");
  }
});

// Function to save a book
function saveBook(bookId, title, author, genre, status, image) {
  let books = JSON.parse(localStorage.getItem("books")) || [];

  if (bookId) {
    // Update existing book
    books = books.map(book =>
      book.id === bookId
        ? { ...book, title, author, genre, status, image: image || book.image }
        : book
    );
  } else {
    // Add new book
    const newBook = {
      id: crypto.randomUUID(),
      title,
      author,
      genre,
      status,
      image,
      favorite: false, // Default to false
    };
    books.push(newBook);
  }

  // Save to localStorage
  localStorage.setItem("books", JSON.stringify(books));
  loadBooks();

  // Reset form and close modal
  document.getElementById("bookForm").reset();
  document.getElementById("bookId").value = "";
  const modalElement = document.getElementById("addBookModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.hide();
}

// Open Edit book Modal
function openEditBookModal(bookId) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  let book = books.find(b => b.id === bookId);

  if (!book) {
    console.error("Book not found!");
    return;
  }

  // Show modal
  let modalElement = document.getElementById("addBookModal");
  let modal = new bootstrap.Modal(modalElement);
  modal.show();

  setTimeout(() => {
    // Set modal title and button text
    document.querySelector(".modal-title").innerText = "Edit Book";
    document.querySelector("button[type='submit']").innerText = "Update Book";

    // Set form values
    document.getElementById("bookId").value = book.id;
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("genre").value = book.genre;
    document.getElementById("status").value = book.status;
  }, 100);
}

// Fetch and load books
function loadBooks() {
  let books = JSON.parse(localStorage.getItem("books")) || [];

  // Clear current book lists
  bookList.innerHTML = "";
  favoriteList.innerHTML = "";
  unreadList.innerHTML = "";
  readList.innerHTML = "";

  books.forEach((book) => {
    const bookCard = createBookCard(book);

    // Append to correct tab
    bookList.appendChild(bookCard);
    if (book.favorite) favoriteList.appendChild(createBookCard(book));
    if (book.status === "Unread") unreadList.appendChild(createBookCard(book));
    else readList.appendChild(createBookCard(book));
  });
}

// Toggle favorite status
function toggleFavorite(bookId) {
  let books = JSON.parse(localStorage.getItem("books")) || [];

  books = books.map(book => {
    if (book.id === bookId) {
      return { ...book, favorite: !book.favorite };
    }
    return book;
  });

  localStorage.setItem("books", JSON.stringify(books));
  loadBooks();
}

// Create book card
function createBookCard(book) {
  const card = document.createElement("div");
  card.className = "col-md-3 mb-3";
  card.innerHTML = `
    <div class="card shadow-sm">
      <img src="${book.image || "cover-placeholder.jpg"}" class="card-img-top" alt="Book Cover">
      <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">Author: ${book.author}</p>
          <p class="card-text"><small>Genre: ${book.genre}</small></p>
          <p class="card-text"><small>Status: ${book.status}</small></p>
          <button class="btn btn-sm btn-success" id="delete-${book.id}">Delete</button>
          <button class="btn btn-sm btn-info" id="edit-${book.id}">Edit</button>
          <button class="btn btn-sm ${book.favorite ? "btn-warning" : "btn-outline-warning"}" id="favorite-${book.id}">
            ${book.favorite ? "Unfavorite" : "Favorite"}
          </button>
      </div>
    </div>
  `;

  // Reattach event listeners for buttons inside the card
  card.querySelector(`#delete-${book.id}`).addEventListener("click", () => deleteBook(book.id));
  card.querySelector(`#edit-${book.id}`).addEventListener("click", () => openEditBookModal(book.id));
  card.querySelector(`#favorite-${book.id}`).addEventListener("click", () => toggleFavorite(book.id));

  return card;
}

// Delete Book
function deleteBook(bookId) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books = books.filter(book => book.id !== bookId);
  localStorage.setItem("books", JSON.stringify(books));
  loadBooks();
}

// Search Books
function searchBooks(input) {
  let query = input.value.toLowerCase().trim();
  let books = JSON.parse(localStorage.getItem("books")) || [];

  // Filter books based on title or author
  let filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(query) || 
    book.author.toLowerCase().includes(query)
  );

  // Clear current list and display filtered books
  bookList.innerHTML = ""; // Clear current list

  filteredBooks.forEach(book => {
    bookList.appendChild(createBookCard(book));
  });

  // Show message if no books are found
  if (filteredBooks.length === 0) {
    bookList.innerHTML = `<p class="text-center text-muted">Book Not Found</p>`;
  }
}

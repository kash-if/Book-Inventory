// Book constructor
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI constructor
class UI {
  addBookToList(book) {
    const bookList = document.getElementById('book-list');

    // Create element tr
    const row = document.createElement('tr');
  
    // Add column data 
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</td>
    `;

    // Append child to bookList element
    bookList.appendChild(row);
  }

  clearInputFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

  displayMessage(className, text) {
    
    // To remove previous messages
    clearMsg();

    // Create new element
    const msgElement = document.createElement('div');

    // Add class to new created element
    msgElement.className = `msg ${className}`;

    // Add text message to div element
    msgElement.appendChild(document.createTextNode(text));

    // Get container class element
    const container = document.querySelector('.container');

    // Get book-form ID element
    const bookForm = document.querySelector('.book-form');

    // Insert new div element 
    container.insertBefore(msgElement, bookForm);
    
    // To remove msg after 3 seconds
    setTimeout(clearMsg, 3000);
  }

  deleteBookItem(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }
}

// Function to clear message
function clearMsg() {
  const msgElement = document.querySelector('.msg');
  if (msgElement !== null) {
    msgElement.remove();
  }
}

class Storage {

  static getBooks() {
    let books;
    if (localStorage.getItem('book') === null) {
      books = [];
    }
    else {
      books = JSON.parse(localStorage.getItem('book'));
    }
    return books;
  }

  static addBook(book) {
    const bookList = Storage.getBooks();
    bookList.push(book);
    localStorage.setItem('book', JSON.stringify(bookList));
  }

  static displayBooks() {
    const bookList = Storage.getBooks();
    if (bookList !== null) {
      bookList.forEach(function (book) {
      const ui = new UI;
      ui.addBookToList(book);
      });
    }
  }

  static removeBook(ispn) {
    const bookList = Storage.getBooks();
    if (bookList !== null) {
      bookList.forEach(function(book, index) {
        if (book.ispn = ispn) {
          bookList.splice(index,1);
          localStorage.setItem('book', JSON.stringify(bookList));
        }
      });
    }
  }
}

// Add event listener on document load
document.addEventListener('DOMContentLoaded', function() {
  Storage.displayBooks();
})

// Add event listener on submit button
document.addEventListener('submit', function(e) {

  // Get values from book form 
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
        
  // Instantiate book object
  const book = new Book(title, author, isbn);
        
  // Instantiate UI object
  const ui = new UI();
        
  if (title === '' || author === '' || isbn === '') {

    // Display message
    ui.displayMessage('error', 'Please enter data in input fields');
  }
  else {
  
    // Call function addBookToList for displaying book data
    ui.addBookToList(book);
    
    // Call function to add book in local storage
    Storage.addBook(book);
    // Call function clearInputFields 
    ui.clearInputFields();

    // Display message
    ui.displayMessage('success', 'Book added!');
  }

  e.preventDefault();
});

// Add Event Listener on delete buttons
document.getElementById('book-list').addEventListener('click', function(e){

  // Instantiate UI object
  const ui = new UI();

  // Call function to delete book item
  ui.deleteBookItem(e.target);

  // Get ISPN of book item
  Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Display message
  ui.displayMessage('success', 'Book removed!');

  e.preventDefault();
})
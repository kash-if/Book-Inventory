// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI constructor
function UI() {}

// Prototype method for adding books to booklist in document
UI.prototype.addBookToList = function(book) {
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

// Prototype function to clear input field of book form
UI.prototype.clearInputFields = function() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}

// Prototype function to display messages
UI.prototype.displayMessage = function(className, text) {
  
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

// Function to clear message
function clearMsg() {
  const msgElement = document.querySelector('.msg');
  if (msgElement !== null) {
    msgElement.remove();
  }
}

// Function to delete book item from book list
UI.prototype.deleteBookItem = function(target) {
  if (target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }
}

// Storage contructor
function Storage() {
}
  
Storage.getBooksFromLS = function() {
  let bookList;
  if (localStorage.getItem('book') === null) {
    bookList = [];
  }
  else {
    bookList = JSON.parse(localStorage.getItem('book'));
  }
  return bookList;
};

Storage.displayBookFromLS = function() {
  const bookList = Storage.getBooksFromLS();
  if (bookList !== null) {
    bookList.forEach(function(book) {
      // Instantiate UI object
      const ui = new UI();   
      ui.addBookToList(book);
    })
  }
};

Storage.addBookToLS = function(book) {
  const bookList = Storage.getBooksFromLS();
  bookList.push(book);
  localStorage.setItem('book', JSON.stringify(bookList));
}

Storage.removeBookFromLS = function(isbn) {
  const bookList = Storage.getBooksFromLS();
  console.log(bookList);
  if (bookList !== null) {
    bookList.forEach(function(book, index) {
      if (book.isbn === isbn) {
        // console.log('true');
        bookList.splice(index,1);
      }
    })
    // console.log(bookList);
    localStorage.setItem('book', JSON.stringify(bookList));
  }
}

//Add event listener on document load
document.addEventListener('DOMContentLoaded', function(){
  Storage.displayBookFromLS();
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
    
    // Call function clearInputFields 
    ui.clearInputFields();

    // Call function to add book in Local Storage
    Storage.addBookToLS(book);

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

  // Call function to remove book from Local Storage
  Storage.removeBookFromLS(e.target.parentElement.previousElementSibling.textContent);

  // Display message
  ui.displayMessage('success', 'Book removed!');

  e.preventDefault();
})
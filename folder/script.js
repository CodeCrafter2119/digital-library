document.getElementById('addBookForm').addEventListener('submit', addBook);
document.getElementById('issueBookForm').addEventListener('submit', issueBook);
document.getElementById('returnBookForm').addEventListener('submit', returnBook);


function addBook(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    fetch('/addBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchBooks();
        } else {
            alert('Error adding book');
        }
    });

    document.getElementById('addBookForm').reset();
}

// Function to delete a book
function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        fetch('/deleteBook', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchBooks(); // Refresh the book list after deleting
            } else {
                alert('Error deleting book');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}


function issueBook(e) {
    e.preventDefault();

    const bookId = document.getElementById('bookId').value;
    const user = document.getElementById('user').value;

    fetch('/issueBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, user })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchBooks();
        } else {
            alert('Error issuing book');
        }
    });

    document.getElementById('issueBookForm').reset();
}

function returnBook(e) {
    e.preventDefault();

    const bookId = document.getElementById('returnBookId').value;

    fetch('/returnBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchBooks();
        } else {
            alert('Error returning book');
        }
    });

    document.getElementById('returnBookForm').reset();
}

function fetchBooks() {
    fetch('/books')
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('bookList');
            bookList.innerHTML = '';
            data.books.forEach(book => {
                const li = document.createElement('li');
                li.innerHTML = `Book ID: ${book.bookId}, Title: ${book.title}, Author: ${book.author}, Issued: ${book.isIssued ? 'Yes' : 'No'}`;

                // Create a delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteBook(book.bookId); // Bind the delete function to the book's ID
                
                li.appendChild(deleteButton); // Add the delete button to each book item
                bookList.appendChild(li);
            });
        });
}



// Fetch books on page load
fetchBooks();

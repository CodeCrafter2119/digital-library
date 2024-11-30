const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path=require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));



app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
 });
 app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
 });
 app.get('/issue',(req,res)=>{
    res.sendFile(path.join(__dirname,'isuue.html'));
 });
 app.get('/add',(req,res)=>{
    res.sendFile(path.join(__dirname,'add.html'));
 });

 
// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/students')
const db=mongoose.connection

db.once('open',()=>{
   console.log('Database connected successfully');
})


// Book Schema
const bookSchema = new mongoose.Schema({
    bookId: String, // Custom Book ID
    title: String,
    author: String,
    isIssued: { type: Boolean, default: false },
    issuedTo: { type: String, default: '' }
});


const Book = mongoose.model('Book', bookSchema);

// Add new book
app.post('/addBook', async (req, res) => {
    const { title, author } = req.body;

    // Generate a simple book ID
    const bookId = 'BOOK-' + Math.floor(1000 + Math.random() * 9000);

    try {
        const newBook = new Book({ bookId, title, author });
        await newBook.save();
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err });
    }
});

// Delete a book by its bookId
app.delete('/deleteBook', async (req, res) => {
    const { bookId } = req.body;

    try {
        const book = await Book.findOneAndDelete({ bookId });
        if (!book) {
            return res.json({ success: false, error: 'Book not found' });
        }
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err });
    }
});


// Get all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();  // Fetch all books from the database
        res.json({ books });  // Send the books as a response
    } catch (err) {
        res.json({ success: false, error: err });  // Handle errors
    }
});


// Issue a book
app.post('/issueBook', async (req, res) => {
    const { bookId, user } = req.body;

    try {
        const book = await Book.findOne({ bookId });

        if (!book) {
            return res.json({ success: false, error: 'Book not found' });
        }
        if (book.isIssued) {
            return res.json({ success: false, error: 'Book already issued' });
        }

        // Mark the book as issued
        book.isIssued = true;
        book.issuedTo = user;
        await book.save();

        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err });
    }
});



// Return a book
app.post('/returnBook', async (req, res) => {
    const { bookId } = req.body;

    try {
        const book = await Book.findOne({ bookId });

        if (!book) {
            return res.json({ success: false, error: 'Book not found' });
        }
        if (!book.isIssued) {
            return res.json({ success: false, error: 'Book not issued' });
        }

        // Mark the book as returned
        book.isIssued = false;
        book.issuedTo = '';
        await book.save();

        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err });
    }
});



// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

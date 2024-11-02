const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books,null,4));
// });

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
      const response = await axios.get('http://localhost:5000/');
      res.send(JSON.stringify(books,null,4));
  } catch (error) {
      res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn=req.params.isbn;
//   res.send(books[isbn]);
//  });

 // Get book details based on ISBN using async await
 public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
      const bookDetails = books[isbn];

      if (bookDetails) {
          res.json(bookDetails); 
      } else {
          res.status(404).json({ message: "Book not found" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;
//   const bookEntries = Object.values(books);
//   const booksByAuthor = bookEntries.filter(book => book.author === author);

//   if (booksByAuthor.length > 0) {
//       res.json(booksByAuthor);
//   } else {
//       res.status(404).json({ message: "No books found by this author" });
//   }

// });

// Get book details based on author using async await
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
      const bookEntries = Object.values(books); 
      const booksByAuthor = bookEntries.filter(book => book.author === author); 

      if (booksByAuthor.length > 0) {
          res.json(booksByAuthor); 
      } else {
          res.status(404).json({ message: "No books found by this author" }); 
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching books by author", error: error.message }); 
  }
});


// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const bookEntries = Object.values(books);
//   const bookByTitle = bookEntries.filter((book)=>book.title===title);

//   if(bookByTitle){
//     res.json(bookByTitle);
//   }else{
//     res.status(404).json({message:"No book found for this title"});
//   }
// });

// Get all books based on title using async await
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
      const bookEntries = Object.values(books);
      const bookByTitle = bookEntries.filter(book => book.title === title); 

      if (bookByTitle.length > 0) {
          res.json(bookByTitle); 
      } else {
          res.status(404).json({ message: "No book found for this title" }); 
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching book by title", error: error.message }); 
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book){
    if(book.reviews>0){
      res.json(book.reviews);
    }else{
      res.status(400).json({message:"no reviews found"});
    }
    
  }else{
    res.status(400).json({message:"book not found"});
  }
});

module.exports.general = public_users;

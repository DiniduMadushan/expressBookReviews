const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  if (userswithsamename.length > 0) {
      return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validUsers = users.filter((user)=>{
    return(user.username === username && user.password === password);
  });

  if(validUsers.length>0){
    return true;
  }else{
    return false;
  }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  console.log(username);
  

  // Check if user is logged in
  if (!username) {
      return res.status(401).json({ message: "User must be logged in to post a review" });
  }

  // Validate input
  if (!review) {
      return res.status(400).json({ message: "Review text is required" });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review for the book
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
      return res.status(401).json({ message: "User must be logged in to delete a review" });
  }

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
  } else {
      return res.status(404).json({ message: "Review not found for this user" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database("blog.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY,
    text TEXT,
    blog_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY (blog_id) REFERENCES blogs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Users
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

app.post("/users", (req, res) => {
  const { username } = req.body;
  db.run("INSERT INTO users (username) VALUES (?)", [username], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ id: this.lastID, username });
    }
  });
});

app.get("/blogs", (req, res) => {
  db.all("SELECT * FROM blogs", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

app.post("/blogs", (req, res) => {
  const { title, content, user_id } = req.body;
  db.run(
    "INSERT INTO blogs (title, content, user_id) VALUES (?, ?, ?)",
    [title, content, user_id],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ id: this.lastID, title, content, user_id });
      }
    }
  );
});

app.get("/comments", (req, res) => {
  db.all("SELECT * FROM comments", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

app.post("/comments", (req, res) => {
  const { text, blog_id, user_id } = req.body;
  db.run(
    "INSERT INTO comments (text, blog_id, user_id) VALUES (?, ?, ?)",
    [text, blog_id, user_id],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ id: this.lastID, text, blog_id, user_id });
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

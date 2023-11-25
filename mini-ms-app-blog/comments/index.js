const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());

//store in memory
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const postId = req.params.id;
  //a single comment sent from users
  const { content } = req.body;
  //an array of comments for a specific post
  const comments = commentsByPostId[postId] || [];
  comments.push({ id, content });
  commentsByPostId[postId] = comments;
  res.status(201).send(comments);
});

app.listen(4000, () => {
  console.log("listening to port 4000");
});

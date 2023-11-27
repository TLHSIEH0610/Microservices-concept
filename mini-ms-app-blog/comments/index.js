const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

//store in memory
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/events", (req, res) => {
  console.log("Event received", req.body.type);
  res.send({});
});

app.post("/posts/:id/comments", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const postId = req.params.id;
  //a single comment sent from users
  const { content } = req.body;
  //an array of comments for a specific post
  const comments = commentsByPostId[postId] || [];
  comments.push({ id, content });
  commentsByPostId[postId] = comments;

  //emmit to eventbus
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: { id, content, postId },
  });

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("listening to port 4001");
});

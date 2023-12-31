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

app.post("/events", async (req, res) => {
  console.log("Event received", req.body.type);
  const { type, data } = req.body;

  //receive event from moderation service and update accordingly
  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((c) => c.id === id);
    comment.status = status;

    //emmit CommentUpdated message to event-bus (and then to query service)
    await axios
      .post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content,
        },
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  res.send({});
});

app.post("/posts/:id/comments", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const postId = req.params.id;
  //a single comment sent from users
  const { content } = req.body;
  //an array of comments for a specific post
  const comments = commentsByPostId[postId] || [];
  comments.push({ id, content, status: "pending" }); //default status: pending
  commentsByPostId[postId] = comments;

  //emmit to eventbus
  await axios
    .post("http://event-bus-srv:4005/events", {
      type: "CommentCreated",
      data: { id, content, postId, status: "pending" }, //this will go over to eventbus => query
    })
    .catch((err) => {
      console.error(err.message);
    });

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("listening to port 4001");
});

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  //Check content and update status
  if (type === "CommentCreated") {
    //update status based on content
    const status = data.content.includes("orange") ? "rejected" : "approved";
    //sent updated data back to event-bus
    await axios
      .post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("listening to port 4003");
});

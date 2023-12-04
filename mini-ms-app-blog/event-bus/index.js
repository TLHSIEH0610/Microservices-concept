const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
app.use(bodyParser.json());

// record all events that received
const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);

  axios.post("http://posts-srv:4000/events", event).catch((err) => {
    console.error(err.message);
  });
  axios.post("http://comments-srv:4001/events", event).catch((err) => {
    console.error(err.message);
  });
  axios.post("http://query-srv:4002/events", event).catch((err) => {
    console.error(err.message);
  });
  axios.post("http://moderation:4003/events", event).catch((err) => {
    console.error(err.message);
  }); //moderation service
  res.send({ status: "ok" });
});

//whenever we launch the query service, we'll have it reach out to the event bus and request all the events that have occurred, and we'll make sure that the query service attempts to process all that data.
app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("listening to port 4005");
});

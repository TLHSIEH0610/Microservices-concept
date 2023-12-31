import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

//sec arg: a random client id
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true) //manual acknowledgement mode: msg.ack()
    .setDeliverAllAvailable() //send all of the different events that was emitted over time when re-connect
    .setDurableName("accounting-service"); //NATS going to record whether or not this subscription has received and successfully processed that event.

  //sec arg: group
  const sub = stan.subscribe(
    "ticket:created",
    "order-service-queue-group",
    options
  );

  sub.on("message", (msg) => {
    const data = msg.getData();
    if (typeof data !== "string") console.log("message received", data);

    //tell NATS the message and has been processed(for manual ack).
    msg.ack();
  });
});

//close down client when program is terminated
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

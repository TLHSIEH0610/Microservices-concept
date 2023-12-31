import { Message, Stan } from "node-nats-streaming";

export abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;

  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true) //manual acknowledgement mode: msg.ack()
      .setDeliverAllAvailable() //send all of the different events that was emitted over time when re-connect
      .setDurableName("accounting-service"); //NATS going to record whether or not this subscription has received and successfully processed that event.
  }

  listen() {
    const subscription = this.client.subscribe(
      "ticket:created",
      "order-service-queue-group",
      this.subscriptionOptions()
    );

    subscription.on("message", (msg) => {
      console.log("Received Message", this.subject, this.queueGroupName);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}

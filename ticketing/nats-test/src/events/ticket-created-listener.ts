import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

export class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payment-service";
  onMessage(data: any, msg: Message) {
    console.log("Event Data", data);
    msg.ack(); //tell NATS the message and has been processed(for manual ack).
  }
}

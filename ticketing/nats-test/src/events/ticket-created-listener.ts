import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subject } from "./subject";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName = "payment-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event Data", data);
    msg.ack(); //tell NATS the message and has been processed(for manual ack).
  }
}

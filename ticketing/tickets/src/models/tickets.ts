import mongoose from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret.id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

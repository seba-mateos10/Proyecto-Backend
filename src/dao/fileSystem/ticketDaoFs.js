const fs = require("fs");

class TicketDaoFs {
  constructor() {
    this.path = "./ticket.json";
    this.tickets = [];
  }

  create = async (ticket) => {
    const newTicket = [{ id: this.tickets.length + 1, ticket }];

    if (this.path.length > 1) {
      const ticketsList = await this.get();
      newTicket = [...ticketsList, { id: cartList.length + 1, newTicket }];
    }

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(newTicket, "null", 2),
      "utf-8"
    );
    return "Ticket created";
  };

  get = async () => {
    let ticketList = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(ticketList);
  };

  getById = async (id) => {
    let tickets = await this.get();
    if (!tickets) return;
    return tickets.find((ticket) => ticket.id == id);
  };
}

module.exports = {
  TicketDaoFs,
};

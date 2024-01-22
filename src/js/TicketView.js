import Ticket from './Ticket';


// Класс для отображения тикетов на странице.
// Он содержит методы для генерации разметки тикета.

export default class TicketView {
  constructor(container, updateCallback, showFormCallback) {
    this.container = container;
    this.updateCallback = updateCallback;
    this.showFormCallback = showFormCallback;
    this.tickets = [];
  }

  bindToDOM(data) {
    data.forEach((item) => {
      const tableRow = document.createElement('tr');
      const ticket = new Ticket(
        item,
        tableRow,
        this.updateCallback,
        this.showFormCallback,
      );

      this.tickets.push(ticket);
      tableRow.setAttribute('data-row', item.id);
      tableRow.classList.add('ticket-row');
      this.container.append(tableRow);
    });
  }
}

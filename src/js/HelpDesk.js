import TicketForm from './TicketForm';
import TicketService from './TicketService';
import TicketView from './TicketView';

// ОСНОВНОЙ класс приложения
export default class HelpDesk {
  constructor(container, url) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.ticketService = new TicketService(url);
    this.form = null;
    this.ticketView = null;
    this.tableBody = null;
    this.deleteMessage = null;

    this.updateTicket = this.updateTicket.bind(this);
    this.showForm = this.showForm.bind(this);
    this.createTicket = this.createTicket.bind(this);
  }

  async init() {
    this.renderInitialMarkup();
    this.initializeDOMElements();
    this.initializeTicketView();
    this.initializeTicketForm();
    this.events();
    await this.reloadData();
  }

  renderInitialMarkup() {
    this.container.innerHTML = HelpDesk.markup();
  }

  initializeDOMElements() {
    this.tableBody = this.container.querySelector('tbody');
    this.deleteMessage = this.container.querySelector('.delete-message');
  }

  initializeTicketView() {
    this.ticketView = new TicketView(this.tableBody, this.updateTicket, this.showForm);
  }

  initializeTicketForm() {
    this.form = new TicketForm(this.container, this.updateTicket, this.createTicket);
  }

  events() {
    const addEl = this.container.querySelector('[data-id="add"]');
    const deleteTicket = this.container.querySelector('[data-toggle="delete-ticket"]');
    const closeMessage = this.container.querySelector('[data-toggle="close-message"]');

    addEl.addEventListener('click', () => this.showForm());
    deleteTicket.addEventListener('click', () => this.deleteTicket());
    closeMessage.addEventListener('click', () => this.closeMessage());
  }

  async reloadData() {
    while (this.tableBody.firstChild) {
      this.tableBody.removeChild(this.tableBody.firstChild);
    }
    const data = await this.ticketService.list();
    if (data) {
      this.ticketView.bindToDOM(data);
    }
  }

  async deleteTicket() {
    const result = await this.ticketService.delete(
      this.deleteMessage.dataset.id,
    );
    if (result !== null) {
      await this.reloadData();
      this.closeMessage();
    }
  }

  async createTicket(data) {
    const result = await this.ticketService.create(data);
    if (result !== null) {
      await this.reloadData();
      this.form.hide();
    }
  }

  async updateTicket(id, newData) {
    const result = await this.ticketService.update(id, newData);
    if (result !== null) {
      await this.reloadData();
      this.form.hide();
    }
  }

  async getTicket(id) {
    const ticket = await this.ticketService.get(id);
    return ticket;
  }

  closeMessage() {
    this.deleteMessage.classList.remove('delete-message_visible');
  }

  async showForm(id) {
    if (id) {
      const result = await this.getTicket(id);
      this.form.show(result);
    } else {
      this.form.show();
    }
  }

  static markup() {
    return `
      <table class="table">
        <thead>
          <tr class="tickets">
            <th colspan="6" style="text-align:right" data-id="add"><span class="add">Добавить тикет</span></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div class="delete-message">
        <h2>Удалить тикет</h2>
        <div>Вы уверены, что хотите удалить тикет? Это действие необратимо</div>
        <div class="ticket-btn">
          <button type="button" class="btn btn-close" data-toggle="close-message" title="Close delete message">Отмена</button>
          <button type="button" class="btn btn-add" data-toggle="delete-ticket" title="Button for delete ticket">Ok</button>
        </div>
      </div>
    `;
  }
}

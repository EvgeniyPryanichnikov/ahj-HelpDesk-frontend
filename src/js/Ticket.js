export default class Ticket {
  constructor(
    {
      id, name, description, status, created,
    },
    container,
    updateCallback,
    showFormCallback,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created = created;
    this.container = container;

    this.updateCallback = updateCallback;
    this.showFormCallback = showFormCallback;

    this.bind();
  }

  bind() {
    this.container.innerHTML = this.markup;
    this.events();
  }

  events() {
    const updateBtn = this.container.querySelector('.update');
    const deleteBtn = this.container.querySelector('.delete');
    const isDoneEl = this.container.querySelector('.done');
    const ticketBody = this.container.querySelector('.ticket-body');

    updateBtn.addEventListener('click', () => this.update());
    deleteBtn.addEventListener('click', () => this.delete());
    ticketBody.addEventListener('click', () => this.showDescription());
    isDoneEl.addEventListener('click', () => this.done());
  }

  update() {
    this.showFormCallback(this.id);
  }

  delete() {
    const deleteMessage = document.querySelector('.delete-message');
    deleteMessage.classList.add('delete-message_visible');
    deleteMessage.setAttribute('data-id', this.id);
  }

  showDescription() {
    const description = this.container.querySelector('.ticket-description');
    description.classList.toggle('ticket-description_visible');
  }

  done() {
    this.updateCallback(this.id, { status: !this.status });
  }

  get markup() {
    const date = new Date(this.created);
    const formattedDate = date.toLocaleString('ru-RU');

    return `
    <span class="done" data-status="${this.status}">${this.status ? '&#10003;' : ''}</span>
    <th class='ticket-body'> 
      <div>
      <span colspan="2" class="ticket-name" data-name="${this.name}">${this.name}</span>
      <span colspan="2" class="ticket-description" >${this.description}</span>
      </div>
      <span colspan="2" class="ticket-created">${formattedDate}</span>
    </th>
    <th class="ticket-actions"><span class="update">✎</span><span class="delete">✖</span></th>
    `;
  }
}

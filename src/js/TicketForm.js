//  Класс для создания формы создания нового тикета

export default class TicketForm {
  constructor(container, updateCallback, createCallback) {
    this.container = container;
    this.formContainer = null;
    this.errorElement = null;
    this.form = null;
    this.createCallback = createCallback;
    this.updateCallback = updateCallback;

    this.bindToDOM();
  }

  bindToDOM() {
    this.createFormContainer({ name: '', description: '' });
    this.events();
  }

  createFormContainer(formData) {
    this.formContainer = document.createElement('div');
    this.formContainer.classList.add('ticket-form-container');
    this.formContainer.innerHTML = TicketForm.markup(formData);
    this.container.append(this.formContainer);
  }

  events() {
    const closeBtn = this.formContainer.querySelector('[data-toggle="ticket-close"]');
    this.form = this.formContainer.querySelector('form');
    const inputElements = this.form.querySelectorAll('input, textarea');

    closeBtn.addEventListener('click', () => this.hide());
    this.form.addEventListener('submit', (e) => this.onSubmit(e));

    inputElements.forEach((input) => {
      input.addEventListener('input', () => TicketForm.removeErrorClass(input));
    });
  }

  async show(data) {
    this.formContainer.classList.add('ticket-form-container_visible');

    if (data) {
      this.ticketId = data.id;
      this.formContainer.innerHTML = TicketForm.markup(data);
      this.events();
    }
  }

  hide() {
    this.formContainer.classList.remove('ticket-form-container_visible');
    this.form.reset();
  }

  async onSubmit(e) {
    e.preventDefault();
    const elementsArray = Array.from(this.form.elements);
    const invalidElement = TicketForm.getNotValidEl(elementsArray);

    if (invalidElement) {
      invalidElement.classList.add('error');
      return;
    }

    const data = Object.fromEntries(new FormData(e.target));

    if (this.ticketId) {
      await this.updateCallback(this.ticketId, data);
      return;
    }
    await this.createCallback(data);
  }

  static removeErrorClass(input) {
    if (input.value.trim()) {
      input.classList.remove('error');
    }
  }

  static markup(formData) {
    return `
      <form id="ticket-form" novalidate>
      <div class="form-control form-ticket">
        <label class="label-ticket" for="name">Краткое описание</label>
        <input name="name" data-id="name" class="input input-ticket" type="text" placeholder="ticket name" autocomplete="off" value="${formData.name}" required> 
      </div>
      <div class="form-control form-ticket">
        <label for="description" class="label-ticket">Подробное описание</label>
        <textarea name="description" data-id="description" class="input input-ticket" placeholder="ticket description" autocomplete="off"
            cols="25" rows="5" maxlength="100" minlength="20" tabindex="0">${formData.description}</textarea>
      </div>
      <div class="ticket-btn">
        <button type="button" class="btn btn-add" data-toggle="ticket-close" title="Close ticket form">Отмена</button>
        <button type="submit" class="btn btn-close" data-toggle="ticket-add" title="Submit ticket form">ОК</button>
      </div>
    </form>`;
  }

  static getNotValidEl(array) {
    return array.find((el) => {
      if (el.type !== 'button' && el.type !== 'submit') {
        if (!el.value.trim()) return true;
      }
      return false;
    });
  }
}

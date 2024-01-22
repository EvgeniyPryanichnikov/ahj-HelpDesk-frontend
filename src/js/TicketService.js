import createRequest from './api/createRequest';


//  Класс для связи с сервером.
//  Содержит методы для отправки запросов на сервер и получения ответов

export default class TicketService {
  constructor(url) {
    this.url = url;
  }

  list() {
    return createRequest(this.url, 'allTickets');
  }

  get(id) {
    return createRequest(this.url, 'ticketById', { id });
  }

  create(data) {
    return createRequest(this.url, 'createTicket', data);
  }

  update(id, data) {
    return createRequest(this.url, 'updateById', { ...data, id });
  }

  delete(id) {
    return createRequest(this.url, 'deleteById', { id });
  }
}

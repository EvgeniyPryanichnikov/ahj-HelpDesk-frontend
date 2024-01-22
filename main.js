(()=>{"use strict";class t{constructor(t,e,i){this.container=t,this.formContainer=null,this.errorElement=null,this.form=null,this.createCallback=i,this.updateCallback=e,this.bindToDOM()}bindToDOM(){this.createFormContainer({name:"",description:""}),this.events()}createFormContainer(e){this.formContainer=document.createElement("div"),this.formContainer.classList.add("ticket-form-container"),this.formContainer.innerHTML=t.markup(e),this.container.append(this.formContainer)}events(){const e=this.formContainer.querySelector('[data-toggle="ticket-close"]');this.form=this.formContainer.querySelector("form");const i=this.form.querySelectorAll("input, textarea");e.addEventListener("click",(()=>this.hide())),this.form.addEventListener("submit",(t=>this.onSubmit(t))),i.forEach((e=>{e.addEventListener("input",(()=>t.removeErrorClass(e)))}))}async show(e){this.formContainer.classList.add("ticket-form-container_visible"),e&&(this.ticketId=e.id,this.formContainer.innerHTML=t.markup(e),this.events())}hide(){this.formContainer.classList.remove("ticket-form-container_visible"),this.form.reset()}async onSubmit(e){e.preventDefault();const i=Array.from(this.form.elements),s=t.getNotValidEl(i);if(s)return void s.classList.add("error");const a=Object.fromEntries(new FormData(e.target));this.ticketId?await this.updateCallback(this.ticketId,a):await this.createCallback(a)}static removeErrorClass(t){t.value.trim()&&t.classList.remove("error")}static markup(t){return`\n      <form id="ticket-form" novalidate>\n      <div class="form-control form-ticket">\n        <label class="label-ticket" for="name">Краткое описание</label>\n        <input name="name" data-id="name" class="input input-ticket" type="text" placeholder="ticket name" autocomplete="off" value="${t.name}" required> \n      </div>\n      <div class="form-control form-ticket">\n        <label for="description" class="label-ticket">Подробное описание</label>\n        <textarea name="description" data-id="description" class="input input-ticket" placeholder="ticket description" autocomplete="off"\n            cols="25" rows="5" maxlength="100" minlength="20" tabindex="0">${t.description}</textarea>\n      </div>\n      <div class="ticket-btn">\n        <button type="button" class="btn btn-add" data-toggle="ticket-close" title="Close ticket form">Отмена</button>\n        <button type="submit" class="btn btn-close" data-toggle="ticket-add" title="Submit ticket form">ОК</button>\n      </div>\n    </form>`}static getNotValidEl(t){return t.find((t=>"button"!==t.type&&"submit"!==t.type&&!t.value.trim()))}}const e=async function(t,e){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};try{let a;const n="allTickets"===e||e.startsWith("delete")||e.startsWith("ticket");switch(e){case"createTicket":a=await fetch(`${t}?method=${e}`,{method:"POST",body:JSON.stringify(i),headers:{"Content-Type":"application/json",...s}});break;case"updateById":if(!i.id)return console.error("ID is required for updateById method"),null;a=await fetch(`${t}?method=${e}&id=${i.id}`,{method:"POST",body:JSON.stringify(i),headers:{"Content-Type":"application/json",...s}});break;case"allTickets":case"ticketById":case"deleteById":{if(n&&"allTickets"!==e&&!i.id)return console.error("ID is required for ticketById and deleteById methods"),null;const r=new URLSearchParams(n?i:{}).toString();a=await fetch(`${t}?method=${e}${r?`&${r}`:""}`,{method:"GET",headers:{"Content-Type":"application/json",...s}});break}default:return console.error("Unsupported method:",e),null}return a.ok?"deleteById"===e?"success":await a.json():(console.error(`Server error: ${a.statusText}`),null)}catch(t){return console.error("Network error:",t),null}};class i{constructor(t){this.url=t}list(){return e(this.url,"allTickets")}get(t){return e(this.url,"ticketById",{id:t})}create(t){return e(this.url,"createTicket",t)}update(t,i){return e(this.url,"updateById",{...i,id:t})}delete(t){return e(this.url,"deleteById",{id:t})}}class s{constructor(t,e,i,s){let{id:a,name:n,description:r,status:o,created:c}=t;this.id=a,this.name=n,this.description=r,this.status=o,this.created=c,this.container=e,this.updateCallback=i,this.showFormCallback=s,this.bind()}bind(){this.container.innerHTML=this.markup,this.events()}events(){const t=this.container.querySelector(".update"),e=this.container.querySelector(".delete"),i=this.container.querySelector(".done"),s=this.container.querySelector(".ticket-body");t.addEventListener("click",(()=>this.update())),e.addEventListener("click",(()=>this.delete())),s.addEventListener("click",(()=>this.showDescription())),i.addEventListener("click",(()=>this.done()))}update(){this.showFormCallback(this.id)}delete(){const t=document.querySelector(".delete-message");t.classList.add("delete-message_visible"),t.setAttribute("data-id",this.id)}showDescription(){this.container.querySelector(".ticket-description").classList.toggle("ticket-description_visible")}done(){this.updateCallback(this.id,{status:!this.status})}get markup(){const t=new Date(this.created).toLocaleString("ru-RU");return`\n    <span class="done" data-status="${this.status}">${this.status?"&#10003;":""}</span>\n    <th class='ticket-body'> \n      <div>\n      <span colspan="2" class="ticket-name" data-name="${this.name}">${this.name}</span>\n      <span colspan="2" class="ticket-description" >${this.description}</span>\n      </div>\n      <span colspan="2" class="ticket-created">${t}</span>\n    </th>\n    <th class="ticket-actions"><span class="update">✎</span><span class="delete">✖</span></th>\n    `}}class a{constructor(t,e,i){this.container=t,this.updateCallback=e,this.showFormCallback=i,this.tickets=[]}bindToDOM(t){t.forEach((t=>{const e=document.createElement("tr"),i=new s(t,e,this.updateCallback,this.showFormCallback);this.tickets.push(i),e.setAttribute("data-row",t.id),e.classList.add("ticket-row"),this.container.append(e)}))}}class n{constructor(t,e){if(!(t instanceof HTMLElement))throw new Error("This is not HTML element!");this.container=t,this.ticketService=new i(e),this.form=null,this.ticketView=null,this.tableBody=null,this.deleteMessage=null,this.updateTicket=this.updateTicket.bind(this),this.showForm=this.showForm.bind(this),this.createTicket=this.createTicket.bind(this)}async init(){this.renderInitialMarkup(),this.initializeDOMElements(),this.initializeTicketView(),this.initializeTicketForm(),this.events(),await this.reloadData()}renderInitialMarkup(){this.container.innerHTML=n.markup()}initializeDOMElements(){this.tableBody=this.container.querySelector("tbody"),this.deleteMessage=this.container.querySelector(".delete-message")}initializeTicketView(){this.ticketView=new a(this.tableBody,this.updateTicket,this.showForm)}initializeTicketForm(){this.form=new t(this.container,this.updateTicket,this.createTicket)}events(){const t=this.container.querySelector('[data-id="add"]'),e=this.container.querySelector('[data-toggle="delete-ticket"]'),i=this.container.querySelector('[data-toggle="close-message"]');t.addEventListener("click",(()=>this.showForm())),e.addEventListener("click",(()=>this.deleteTicket())),i.addEventListener("click",(()=>this.closeMessage()))}async reloadData(){for(;this.tableBody.firstChild;)this.tableBody.removeChild(this.tableBody.firstChild);const t=await this.ticketService.list();t&&this.ticketView.bindToDOM(t)}async deleteTicket(){null!==await this.ticketService.delete(this.deleteMessage.dataset.id)&&(await this.reloadData(),this.closeMessage())}async createTicket(t){null!==await this.ticketService.create(t)&&(await this.reloadData(),this.form.hide())}async updateTicket(t,e){null!==await this.ticketService.update(t,e)&&(await this.reloadData(),this.form.hide())}async getTicket(t){return await this.ticketService.get(t)}closeMessage(){this.deleteMessage.classList.remove("delete-message_visible")}async showForm(t){if(t){const e=await this.getTicket(t);this.form.show(e)}else this.form.show()}static markup(){return'\n      <table class="table">\n        <thead>\n          <tr class="tickets">\n            <th colspan="6" style="text-align:right" data-id="add"><span class="add">Добавить тикет</span></th>\n          </tr>\n        </thead>\n        <tbody></tbody>\n      </table>\n      <div class="delete-message">\n        <h2>Удалить тикет</h2>\n        <div>Вы уверены, что хотите удалить тикет? Это действие необратимо</div>\n        <div class="ticket-btn">\n          <button type="button" class="btn btn-close" data-toggle="close-message" title="Close delete message">Отмена</button>\n          <button type="button" class="btn btn-add" data-toggle="delete-ticket" title="Button for delete ticket">Ok</button>\n        </div>\n      </div>\n    '}}const r=document.getElementById("root");new n(r,"http://localhost:3000/").init()})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixPQUN0Qy9FLEtBQUs0RixjQUFjK0IsUUFBUTVGLFlBR3JCL0IsS0FBS3FILGFBQ1hySCxLQUFLd0gsZUFFVCxDQUVBNUYsbUJBQW1CQyxHQUVGLGFBRE03QixLQUFLMkcsY0FBYzlCLE9BQU9oRCxXQUV2QzdCLEtBQUtxSCxhQUNYckgsS0FBS0csS0FBS21CLE9BRWQsQ0FFQU0sbUJBQW1CRyxFQUFJNkYsR0FFTixhQURNNUgsS0FBSzJHLGNBQWM3QixPQUFPL0MsRUFBSTZGLFdBRTNDNUgsS0FBS3FILGFBQ1hySCxLQUFLRyxLQUFLbUIsT0FFZCxDQUVBTSxnQkFBZ0JHLEdBRWQsYUFEcUIvQixLQUFLMkcsY0FBYy9CLElBQUk3QyxFQUU5QyxDQUVBeUYsZUFDRXhILEtBQUs0RixjQUFjaEYsVUFBVW9CLE9BQU8seUJBQ3RDLENBRUFKLGVBQWVHLEdBQ2IsR0FBSUEsRUFBSSxDQUNOLE1BQU04RixRQUFlN0gsS0FBSzhILFVBQVUvRixHQUNwQy9CLEtBQUtHLEtBQUs0SCxLQUFLRixFQUNqQixNQUNFN0gsS0FBS0csS0FBSzRILE1BRWQsQ0FFQWxGLGdCQUNFLE1BQVEsdXVCQWtCVixFQ2pJRixNQUFNbUYsRUFBT3RILFNBQVN1SCxlQUFlLFFBR3pCLElBQUl6QixFQUFTd0IsRUFGYiwwQkFJUkUsTSIsInNvdXJjZXMiOlsid2VicGFjazovL2Zyb250Ly4vc3JjL2pzL1RpY2tldEZvcm0uanMiLCJ3ZWJwYWNrOi8vZnJvbnQvLi9zcmMvanMvYXBpL2NyZWF0ZVJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vZnJvbnQvLi9zcmMvanMvVGlja2V0U2VydmljZS5qcyIsIndlYnBhY2s6Ly9mcm9udC8uL3NyYy9qcy9UaWNrZXQuanMiLCJ3ZWJwYWNrOi8vZnJvbnQvLi9zcmMvanMvVGlja2V0Vmlldy5qcyIsIndlYnBhY2s6Ly9mcm9udC8uL3NyYy9qcy9IZWxwRGVzay5qcyIsIndlYnBhY2s6Ly9mcm9udC8uL3NyYy9qcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gINCa0LvQsNGB0YEg0LTQu9GPINGB0L7Qt9C00LDQvdC40Y8g0YTQvtGA0LzRiyDRgdC+0LfQtNCw0L3QuNGPINC90L7QstC+0LPQviDRgtC40LrQtdGC0LBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja2V0Rm9ybSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgdXBkYXRlQ2FsbGJhY2ssIGNyZWF0ZUNhbGxiYWNrKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5mb3JtQ29udGFpbmVyID0gbnVsbDtcbiAgICB0aGlzLmVycm9yRWxlbWVudCA9IG51bGw7XG4gICAgdGhpcy5mb3JtID0gbnVsbDtcbiAgICB0aGlzLmNyZWF0ZUNhbGxiYWNrID0gY3JlYXRlQ2FsbGJhY2s7XG4gICAgdGhpcy51cGRhdGVDYWxsYmFjayA9IHVwZGF0ZUNhbGxiYWNrO1xuXG4gICAgdGhpcy5iaW5kVG9ET00oKTtcbiAgfVxuXG4gIGJpbmRUb0RPTSgpIHtcbiAgICB0aGlzLmNyZWF0ZUZvcm1Db250YWluZXIoeyBuYW1lOiAnJywgZGVzY3JpcHRpb246ICcnIH0pO1xuICAgIHRoaXMuZXZlbnRzKCk7XG4gIH1cblxuICBjcmVhdGVGb3JtQ29udGFpbmVyKGZvcm1EYXRhKSB7XG4gICAgdGhpcy5mb3JtQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5mb3JtQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3RpY2tldC1mb3JtLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuZm9ybUNvbnRhaW5lci5pbm5lckhUTUwgPSBUaWNrZXRGb3JtLm1hcmt1cChmb3JtRGF0YSk7XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kKHRoaXMuZm9ybUNvbnRhaW5lcik7XG4gIH1cblxuICBldmVudHMoKSB7XG4gICAgY29uc3QgY2xvc2VCdG4gPSB0aGlzLmZvcm1Db250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtdG9nZ2xlPVwidGlja2V0LWNsb3NlXCJdJyk7XG4gICAgdGhpcy5mb3JtID0gdGhpcy5mb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbiAgICBjb25zdCBpbnB1dEVsZW1lbnRzID0gdGhpcy5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCB0ZXh0YXJlYScpO1xuXG4gICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhpZGUoKSk7XG4gICAgdGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB0aGlzLm9uU3VibWl0KGUpKTtcblxuICAgIGlucHV0RWxlbWVudHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gVGlja2V0Rm9ybS5yZW1vdmVFcnJvckNsYXNzKGlucHV0KSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzaG93KGRhdGEpIHtcbiAgICB0aGlzLmZvcm1Db250YWluZXIuY2xhc3NMaXN0LmFkZCgndGlja2V0LWZvcm0tY29udGFpbmVyX3Zpc2libGUnKTtcblxuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLnRpY2tldElkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMuZm9ybUNvbnRhaW5lci5pbm5lckhUTUwgPSBUaWNrZXRGb3JtLm1hcmt1cChkYXRhKTtcbiAgICAgIHRoaXMuZXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLmZvcm1Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgndGlja2V0LWZvcm0tY29udGFpbmVyX3Zpc2libGUnKTtcbiAgICB0aGlzLmZvcm0ucmVzZXQoKTtcbiAgfVxuXG4gIGFzeW5jIG9uU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgZWxlbWVudHNBcnJheSA9IEFycmF5LmZyb20odGhpcy5mb3JtLmVsZW1lbnRzKTtcbiAgICBjb25zdCBpbnZhbGlkRWxlbWVudCA9IFRpY2tldEZvcm0uZ2V0Tm90VmFsaWRFbChlbGVtZW50c0FycmF5KTtcblxuICAgIGlmIChpbnZhbGlkRWxlbWVudCkge1xuICAgICAgaW52YWxpZEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gT2JqZWN0LmZyb21FbnRyaWVzKG5ldyBGb3JtRGF0YShlLnRhcmdldCkpO1xuXG4gICAgaWYgKHRoaXMudGlja2V0SWQpIHtcbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlQ2FsbGJhY2sodGhpcy50aWNrZXRJZCwgZGF0YSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuY3JlYXRlQ2FsbGJhY2soZGF0YSk7XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlRXJyb3JDbGFzcyhpbnB1dCkge1xuICAgIGlmIChpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG1hcmt1cChmb3JtRGF0YSkge1xuICAgIHJldHVybiBgXG4gICAgICA8Zm9ybSBpZD1cInRpY2tldC1mb3JtXCIgbm92YWxpZGF0ZT5cbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS10aWNrZXRcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzPVwibGFiZWwtdGlja2V0XCIgZm9yPVwibmFtZVwiPtCa0YDQsNGC0LrQvtC1INC+0L/QuNGB0LDQvdC40LU8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgbmFtZT1cIm5hbWVcIiBkYXRhLWlkPVwibmFtZVwiIGNsYXNzPVwiaW5wdXQgaW5wdXQtdGlja2V0XCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cInRpY2tldCBuYW1lXCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgdmFsdWU9XCIke2Zvcm1EYXRhLm5hbWV9XCIgcmVxdWlyZWQ+IFxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tdGlja2V0XCI+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJkZXNjcmlwdGlvblwiIGNsYXNzPVwibGFiZWwtdGlja2V0XCI+0J/QvtC00YDQvtCx0L3QvtC1INC+0L/QuNGB0LDQvdC40LU8L2xhYmVsPlxuICAgICAgICA8dGV4dGFyZWEgbmFtZT1cImRlc2NyaXB0aW9uXCIgZGF0YS1pZD1cImRlc2NyaXB0aW9uXCIgY2xhc3M9XCJpbnB1dCBpbnB1dC10aWNrZXRcIiBwbGFjZWhvbGRlcj1cInRpY2tldCBkZXNjcmlwdGlvblwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiXG4gICAgICAgICAgICBjb2xzPVwiMjVcIiByb3dzPVwiNVwiIG1heGxlbmd0aD1cIjEwMFwiIG1pbmxlbmd0aD1cIjIwXCIgdGFiaW5kZXg9XCIwXCI+JHtmb3JtRGF0YS5kZXNjcmlwdGlvbn08L3RleHRhcmVhPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwidGlja2V0LWJ0blwiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tYWRkXCIgZGF0YS10b2dnbGU9XCJ0aWNrZXQtY2xvc2VcIiB0aXRsZT1cIkNsb3NlIHRpY2tldCBmb3JtXCI+0J7RgtC80LXQvdCwPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1jbG9zZVwiIGRhdGEtdG9nZ2xlPVwidGlja2V0LWFkZFwiIHRpdGxlPVwiU3VibWl0IHRpY2tldCBmb3JtXCI+0J7QmjwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9mb3JtPmA7XG4gIH1cblxuICBzdGF0aWMgZ2V0Tm90VmFsaWRFbChhcnJheSkge1xuICAgIHJldHVybiBhcnJheS5maW5kKChlbCkgPT4ge1xuICAgICAgaWYgKGVsLnR5cGUgIT09ICdidXR0b24nICYmIGVsLnR5cGUgIT09ICdzdWJtaXQnKSB7XG4gICAgICAgIGlmICghZWwudmFsdWUudHJpbSgpKSByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxufVxuIiwiY29uc3QgY3JlYXRlUmVxdWVzdCA9IGFzeW5jICh1cmwsIG1ldGhvZCwgZGF0YSA9IHt9LCBoZWFkZXJzID0ge30pID0+IHtcbiAgdHJ5IHtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgY29uc3QgaXNHZXRNZXRob2QgPSBtZXRob2QgPT09ICdhbGxUaWNrZXRzJ1xuICAgICAgfHwgbWV0aG9kLnN0YXJ0c1dpdGgoJ2RlbGV0ZScpXG4gICAgICB8fCBtZXRob2Quc3RhcnRzV2l0aCgndGlja2V0Jyk7XG5cbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSAnY3JlYXRlVGlja2V0JzpcbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHt1cmx9P21ldGhvZD0ke21ldGhvZH1gLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgIC4uLmhlYWRlcnMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd1cGRhdGVCeUlkJzpcbiAgICAgICAgaWYgKCFkYXRhLmlkKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignSUQgaXMgcmVxdWlyZWQgZm9yIHVwZGF0ZUJ5SWQgbWV0aG9kJyk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHt1cmx9P21ldGhvZD0ke21ldGhvZH0maWQ9JHtkYXRhLmlkfWAsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgLi4uaGVhZGVycyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2FsbFRpY2tldHMnOlxuICAgICAgY2FzZSAndGlja2V0QnlJZCc6XG4gICAgICBjYXNlICdkZWxldGVCeUlkJzoge1xuICAgICAgICBpZiAoaXNHZXRNZXRob2QgJiYgbWV0aG9kICE9PSAnYWxsVGlja2V0cycgJiYgIWRhdGEuaWQpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdJRCBpcyByZXF1aXJlZCBmb3IgdGlja2V0QnlJZCBhbmQgZGVsZXRlQnlJZCBtZXRob2RzJyk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBxdWVyeVN0cmluZyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoXG4gICAgICAgICAgaXNHZXRNZXRob2QgPyBkYXRhIDoge30sXG4gICAgICAgICkudG9TdHJpbmcoKTtcbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcbiAgICAgICAgICBgJHt1cmx9P21ldGhvZD0ke21ldGhvZH0ke3F1ZXJ5U3RyaW5nID8gYCYke3F1ZXJ5U3RyaW5nfWAgOiAnJ31gLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgIC4uLmhlYWRlcnMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBtZXRob2Q6JywgbWV0aG9kKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICByZXR1cm4gbWV0aG9kID09PSAnZGVsZXRlQnlJZCcgPyAnc3VjY2VzcycgOiBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgfVxuXG4gICAgY29uc29sZS5lcnJvcihgU2VydmVyIGVycm9yOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignTmV0d29yayBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVJlcXVlc3Q7XG4iLCJpbXBvcnQgY3JlYXRlUmVxdWVzdCBmcm9tICcuL2FwaS9jcmVhdGVSZXF1ZXN0JztcblxuLy8gINCa0LvQsNGB0YEg0LTQu9GPINGB0LLRj9C30Lgg0YEg0YHQtdGA0LLQtdGA0L7QvC5cbi8vICDQodC+0LTQtdGA0LbQuNGCINC80LXRgtC+0LTRiyDQtNC70Y8g0L7RgtC/0YDQsNCy0LrQuCDQt9Cw0L/RgNC+0YHQvtCyINC90LAg0YHQtdGA0LLQtdGAINC4INC/0L7Qu9GD0YfQtdC90LjRjyDQvtGC0LLQtdGC0L7QslxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja2V0U2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHVybCkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICB9XG5cbiAgbGlzdCgpIHtcbiAgICByZXR1cm4gY3JlYXRlUmVxdWVzdCh0aGlzLnVybCwgJ2FsbFRpY2tldHMnKTtcbiAgfVxuXG4gIGdldChpZCkge1xuICAgIHJldHVybiBjcmVhdGVSZXF1ZXN0KHRoaXMudXJsLCAndGlja2V0QnlJZCcsIHsgaWQgfSk7XG4gIH1cblxuICBjcmVhdGUoZGF0YSkge1xuICAgIHJldHVybiBjcmVhdGVSZXF1ZXN0KHRoaXMudXJsLCAnY3JlYXRlVGlja2V0JywgZGF0YSk7XG4gIH1cblxuICB1cGRhdGUoaWQsIGRhdGEpIHtcbiAgICByZXR1cm4gY3JlYXRlUmVxdWVzdCh0aGlzLnVybCwgJ3VwZGF0ZUJ5SWQnLCB7IC4uLmRhdGEsIGlkIH0pO1xuICB9XG5cbiAgZGVsZXRlKGlkKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVJlcXVlc3QodGhpcy51cmwsICdkZWxldGVCeUlkJywgeyBpZCB9KTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja2V0IHtcbiAgY29uc3RydWN0b3IoXG4gICAge1xuICAgICAgaWQsIG5hbWUsIGRlc2NyaXB0aW9uLCBzdGF0dXMsIGNyZWF0ZWQsXG4gICAgfSxcbiAgICBjb250YWluZXIsXG4gICAgdXBkYXRlQ2FsbGJhY2ssXG4gICAgc2hvd0Zvcm1DYWxsYmFjayxcbiAgKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgIHRoaXMuY3JlYXRlZCA9IGNyZWF0ZWQ7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrID0gdXBkYXRlQ2FsbGJhY2s7XG4gICAgdGhpcy5zaG93Rm9ybUNhbGxiYWNrID0gc2hvd0Zvcm1DYWxsYmFjaztcblxuICAgIHRoaXMuYmluZCgpO1xuICB9XG5cbiAgYmluZCgpIHtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSB0aGlzLm1hcmt1cDtcbiAgICB0aGlzLmV2ZW50cygpO1xuICB9XG5cbiAgZXZlbnRzKCkge1xuICAgIGNvbnN0IHVwZGF0ZUJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy51cGRhdGUnKTtcbiAgICBjb25zdCBkZWxldGVCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlJyk7XG4gICAgY29uc3QgaXNEb25lRWwgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZG9uZScpO1xuICAgIGNvbnN0IHRpY2tldEJvZHkgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGlja2V0LWJvZHknKTtcblxuICAgIHVwZGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMudXBkYXRlKCkpO1xuICAgIGRlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuZGVsZXRlKCkpO1xuICAgIHRpY2tldEJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLnNob3dEZXNjcmlwdGlvbigpKTtcbiAgICBpc0RvbmVFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuZG9uZSgpKTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnNob3dGb3JtQ2FsbGJhY2sodGhpcy5pZCk7XG4gIH1cblxuICBkZWxldGUoKSB7XG4gICAgY29uc3QgZGVsZXRlTWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGUtbWVzc2FnZScpO1xuICAgIGRlbGV0ZU1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZGVsZXRlLW1lc3NhZ2VfdmlzaWJsZScpO1xuICAgIGRlbGV0ZU1lc3NhZ2Uuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgdGhpcy5pZCk7XG4gIH1cblxuICBzaG93RGVzY3JpcHRpb24oKSB7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGlja2V0LWRlc2NyaXB0aW9uJyk7XG4gICAgZGVzY3JpcHRpb24uY2xhc3NMaXN0LnRvZ2dsZSgndGlja2V0LWRlc2NyaXB0aW9uX3Zpc2libGUnKTtcbiAgfVxuXG4gIGRvbmUoKSB7XG4gICAgdGhpcy51cGRhdGVDYWxsYmFjayh0aGlzLmlkLCB7IHN0YXR1czogIXRoaXMuc3RhdHVzIH0pO1xuICB9XG5cbiAgZ2V0IG1hcmt1cCgpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGhpcy5jcmVhdGVkKTtcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZGF0ZS50b0xvY2FsZVN0cmluZygncnUtUlUnKTtcblxuICAgIHJldHVybiBgXG4gICAgPHNwYW4gY2xhc3M9XCJkb25lXCIgZGF0YS1zdGF0dXM9XCIke3RoaXMuc3RhdHVzfVwiPiR7dGhpcy5zdGF0dXMgPyAnJiMxMDAwMzsnIDogJyd9PC9zcGFuPlxuICAgIDx0aCBjbGFzcz0ndGlja2V0LWJvZHknPiBcbiAgICAgIDxkaXY+XG4gICAgICA8c3BhbiBjb2xzcGFuPVwiMlwiIGNsYXNzPVwidGlja2V0LW5hbWVcIiBkYXRhLW5hbWU9XCIke3RoaXMubmFtZX1cIj4ke3RoaXMubmFtZX08L3NwYW4+XG4gICAgICA8c3BhbiBjb2xzcGFuPVwiMlwiIGNsYXNzPVwidGlja2V0LWRlc2NyaXB0aW9uXCIgPiR7dGhpcy5kZXNjcmlwdGlvbn08L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxzcGFuIGNvbHNwYW49XCIyXCIgY2xhc3M9XCJ0aWNrZXQtY3JlYXRlZFwiPiR7Zm9ybWF0dGVkRGF0ZX08L3NwYW4+XG4gICAgPC90aD5cbiAgICA8dGggY2xhc3M9XCJ0aWNrZXQtYWN0aW9uc1wiPjxzcGFuIGNsYXNzPVwidXBkYXRlXCI+4pyOPC9zcGFuPjxzcGFuIGNsYXNzPVwiZGVsZXRlXCI+4pyWPC9zcGFuPjwvdGg+XG4gICAgYDtcbiAgfVxufVxuIiwiaW1wb3J0IFRpY2tldCBmcm9tICcuL1RpY2tldCc7XG5cbi8vINCa0LvQsNGB0YEg0LTQu9GPINC+0YLQvtCx0YDQsNC20LXQvdC40Y8g0YLQuNC60LXRgtC+0LIg0L3QsCDRgdGC0YDQsNC90LjRhtC1LlxuLy8g0J7QvSDRgdC+0LTQtdGA0LbQuNGCINC80LXRgtC+0LTRiyDQtNC70Y8g0LPQtdC90LXRgNCw0YbQuNC4INGA0LDQt9C80LXRgtC60Lgg0YLQuNC60LXRgtCwLlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja2V0VmlldyB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgdXBkYXRlQ2FsbGJhY2ssIHNob3dGb3JtQ2FsbGJhY2spIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrID0gdXBkYXRlQ2FsbGJhY2s7XG4gICAgdGhpcy5zaG93Rm9ybUNhbGxiYWNrID0gc2hvd0Zvcm1DYWxsYmFjaztcbiAgICB0aGlzLnRpY2tldHMgPSBbXTtcbiAgfVxuXG4gIGJpbmRUb0RPTShkYXRhKSB7XG4gICAgZGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICBjb25zdCB0aWNrZXQgPSBuZXcgVGlja2V0KFxuICAgICAgICBpdGVtLFxuICAgICAgICB0YWJsZVJvdyxcbiAgICAgICAgdGhpcy51cGRhdGVDYWxsYmFjayxcbiAgICAgICAgdGhpcy5zaG93Rm9ybUNhbGxiYWNrLFxuICAgICAgKTtcblxuICAgICAgdGhpcy50aWNrZXRzLnB1c2godGlja2V0KTtcbiAgICAgIHRhYmxlUm93LnNldEF0dHJpYnV0ZSgnZGF0YS1yb3cnLCBpdGVtLmlkKTtcbiAgICAgIHRhYmxlUm93LmNsYXNzTGlzdC5hZGQoJ3RpY2tldC1yb3cnKTtcbiAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZCh0YWJsZVJvdyk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBUaWNrZXRGb3JtIGZyb20gJy4vVGlja2V0Rm9ybSc7XG5pbXBvcnQgVGlja2V0U2VydmljZSBmcm9tICcuL1RpY2tldFNlcnZpY2UnO1xuaW1wb3J0IFRpY2tldFZpZXcgZnJvbSAnLi9UaWNrZXRWaWV3JztcblxuLy8g0J7QodCd0J7QktCd0J7QmSDQutC70LDRgdGBINC/0YDQuNC70L7QttC10L3QuNGPXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWxwRGVzayB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgdXJsKSB7XG4gICAgaWYgKCEoY29udGFpbmVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgaXMgbm90IEhUTUwgZWxlbWVudCEnKTtcbiAgICB9XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy50aWNrZXRTZXJ2aWNlID0gbmV3IFRpY2tldFNlcnZpY2UodXJsKTtcbiAgICB0aGlzLmZvcm0gPSBudWxsO1xuICAgIHRoaXMudGlja2V0VmlldyA9IG51bGw7XG4gICAgdGhpcy50YWJsZUJvZHkgPSBudWxsO1xuICAgIHRoaXMuZGVsZXRlTWVzc2FnZSA9IG51bGw7XG5cbiAgICB0aGlzLnVwZGF0ZVRpY2tldCA9IHRoaXMudXBkYXRlVGlja2V0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93Rm9ybSA9IHRoaXMuc2hvd0Zvcm0uYmluZCh0aGlzKTtcbiAgICB0aGlzLmNyZWF0ZVRpY2tldCA9IHRoaXMuY3JlYXRlVGlja2V0LmJpbmQodGhpcyk7XG4gIH1cblxuICBhc3luYyBpbml0KCkge1xuICAgIHRoaXMucmVuZGVySW5pdGlhbE1hcmt1cCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZURPTUVsZW1lbnRzKCk7XG4gICAgdGhpcy5pbml0aWFsaXplVGlja2V0VmlldygpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZVRpY2tldEZvcm0oKTtcbiAgICB0aGlzLmV2ZW50cygpO1xuICAgIGF3YWl0IHRoaXMucmVsb2FkRGF0YSgpO1xuICB9XG5cbiAgcmVuZGVySW5pdGlhbE1hcmt1cCgpIHtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBIZWxwRGVzay5tYXJrdXAoKTtcbiAgfVxuXG4gIGluaXRpYWxpemVET01FbGVtZW50cygpIHtcbiAgICB0aGlzLnRhYmxlQm9keSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5Jyk7XG4gICAgdGhpcy5kZWxldGVNZXNzYWdlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1tZXNzYWdlJyk7XG4gIH1cblxuICBpbml0aWFsaXplVGlja2V0VmlldygpIHtcbiAgICB0aGlzLnRpY2tldFZpZXcgPSBuZXcgVGlja2V0Vmlldyh0aGlzLnRhYmxlQm9keSwgdGhpcy51cGRhdGVUaWNrZXQsIHRoaXMuc2hvd0Zvcm0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZVRpY2tldEZvcm0oKSB7XG4gICAgdGhpcy5mb3JtID0gbmV3IFRpY2tldEZvcm0odGhpcy5jb250YWluZXIsIHRoaXMudXBkYXRlVGlja2V0LCB0aGlzLmNyZWF0ZVRpY2tldCk7XG4gIH1cblxuICBldmVudHMoKSB7XG4gICAgY29uc3QgYWRkRWwgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1pZD1cImFkZFwiXScpO1xuICAgIGNvbnN0IGRlbGV0ZVRpY2tldCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRvZ2dsZT1cImRlbGV0ZS10aWNrZXRcIl0nKTtcbiAgICBjb25zdCBjbG9zZU1lc3NhZ2UgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS10b2dnbGU9XCJjbG9zZS1tZXNzYWdlXCJdJyk7XG5cbiAgICBhZGRFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuc2hvd0Zvcm0oKSk7XG4gICAgZGVsZXRlVGlja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5kZWxldGVUaWNrZXQoKSk7XG4gICAgY2xvc2VNZXNzYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5jbG9zZU1lc3NhZ2UoKSk7XG4gIH1cblxuICBhc3luYyByZWxvYWREYXRhKCkge1xuICAgIHdoaWxlICh0aGlzLnRhYmxlQm9keS5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLnRhYmxlQm9keS5yZW1vdmVDaGlsZCh0aGlzLnRhYmxlQm9keS5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMudGlja2V0U2VydmljZS5saXN0KCk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMudGlja2V0Vmlldy5iaW5kVG9ET00oZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGVsZXRlVGlja2V0KCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMudGlja2V0U2VydmljZS5kZWxldGUoXG4gICAgICB0aGlzLmRlbGV0ZU1lc3NhZ2UuZGF0YXNldC5pZCxcbiAgICApO1xuICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgIGF3YWl0IHRoaXMucmVsb2FkRGF0YSgpO1xuICAgICAgdGhpcy5jbG9zZU1lc3NhZ2UoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBjcmVhdGVUaWNrZXQoZGF0YSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMudGlja2V0U2VydmljZS5jcmVhdGUoZGF0YSk7XG4gICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgYXdhaXQgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgICB0aGlzLmZvcm0uaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZVRpY2tldChpZCwgbmV3RGF0YSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMudGlja2V0U2VydmljZS51cGRhdGUoaWQsIG5ld0RhdGEpO1xuICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgIGF3YWl0IHRoaXMucmVsb2FkRGF0YSgpO1xuICAgICAgdGhpcy5mb3JtLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRUaWNrZXQoaWQpIHtcbiAgICBjb25zdCB0aWNrZXQgPSBhd2FpdCB0aGlzLnRpY2tldFNlcnZpY2UuZ2V0KGlkKTtcbiAgICByZXR1cm4gdGlja2V0O1xuICB9XG5cbiAgY2xvc2VNZXNzYWdlKCkge1xuICAgIHRoaXMuZGVsZXRlTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdkZWxldGUtbWVzc2FnZV92aXNpYmxlJyk7XG4gIH1cblxuICBhc3luYyBzaG93Rm9ybShpZCkge1xuICAgIGlmIChpZCkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5nZXRUaWNrZXQoaWQpO1xuICAgICAgdGhpcy5mb3JtLnNob3cocmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb3JtLnNob3coKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbWFya3VwKCkge1xuICAgIHJldHVybiBgXG4gICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgPHRyIGNsYXNzPVwidGlja2V0c1wiPlxuICAgICAgICAgICAgPHRoIGNvbHNwYW49XCI2XCIgc3R5bGU9XCJ0ZXh0LWFsaWduOnJpZ2h0XCIgZGF0YS1pZD1cImFkZFwiPjxzcGFuIGNsYXNzPVwiYWRkXCI+0JTQvtCx0LDQstC40YLRjCDRgtC40LrQtdGCPC9zcGFuPjwvdGg+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PjwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgICAgPGRpdiBjbGFzcz1cImRlbGV0ZS1tZXNzYWdlXCI+XG4gICAgICAgIDxoMj7Qo9C00LDQu9C40YLRjCDRgtC40LrQtdGCPC9oMj5cbiAgICAgICAgPGRpdj7QktGLINGD0LLQtdGA0LXQvdGLLCDRh9GC0L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMINGC0LjQutC10YI/INCt0YLQviDQtNC10LnRgdGC0LLQuNC1INC90LXQvtCx0YDQsNGC0LjQvNC+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aWNrZXQtYnRuXCI+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWNsb3NlXCIgZGF0YS10b2dnbGU9XCJjbG9zZS1tZXNzYWdlXCIgdGl0bGU9XCJDbG9zZSBkZWxldGUgbWVzc2FnZVwiPtCe0YLQvNC10L3QsDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1hZGRcIiBkYXRhLXRvZ2dsZT1cImRlbGV0ZS10aWNrZXRcIiB0aXRsZT1cIkJ1dHRvbiBmb3IgZGVsZXRlIHRpY2tldFwiPk9rPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcbiAgfVxufVxuIiwiaW1wb3J0IEhlbHBEZXNrIGZyb20gJy4vSGVscERlc2snO1xuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcbmNvbnN0IHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvJztcblxuY29uc3QgYXBwID0gbmV3IEhlbHBEZXNrKHJvb3QsIHVybCk7XG5cbmFwcC5pbml0KCk7XG4iXSwibmFtZXMiOlsiVGlja2V0Rm9ybSIsImNvbnN0cnVjdG9yIiwiY29udGFpbmVyIiwidXBkYXRlQ2FsbGJhY2siLCJjcmVhdGVDYWxsYmFjayIsInRoaXMiLCJmb3JtQ29udGFpbmVyIiwiZXJyb3JFbGVtZW50IiwiZm9ybSIsImJpbmRUb0RPTSIsImNyZWF0ZUZvcm1Db250YWluZXIiLCJuYW1lIiwiZGVzY3JpcHRpb24iLCJldmVudHMiLCJmb3JtRGF0YSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImlubmVySFRNTCIsIm1hcmt1cCIsImFwcGVuZCIsImNsb3NlQnRuIiwicXVlcnlTZWxlY3RvciIsImlucHV0RWxlbWVudHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhpZGUiLCJlIiwib25TdWJtaXQiLCJmb3JFYWNoIiwiaW5wdXQiLCJyZW1vdmVFcnJvckNsYXNzIiwiYXN5bmMiLCJkYXRhIiwidGlja2V0SWQiLCJpZCIsInJlbW92ZSIsInJlc2V0IiwicHJldmVudERlZmF1bHQiLCJlbGVtZW50c0FycmF5IiwiQXJyYXkiLCJmcm9tIiwiZWxlbWVudHMiLCJpbnZhbGlkRWxlbWVudCIsImdldE5vdFZhbGlkRWwiLCJPYmplY3QiLCJmcm9tRW50cmllcyIsIkZvcm1EYXRhIiwidGFyZ2V0Iiwic3RhdGljIiwidmFsdWUiLCJ0cmltIiwiYXJyYXkiLCJmaW5kIiwiZWwiLCJ0eXBlIiwidXJsIiwibWV0aG9kIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiaGVhZGVycyIsInJlc3BvbnNlIiwiaXNHZXRNZXRob2QiLCJzdGFydHNXaXRoIiwiZmV0Y2giLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnNvbGUiLCJlcnJvciIsInF1ZXJ5U3RyaW5nIiwiVVJMU2VhcmNoUGFyYW1zIiwidG9TdHJpbmciLCJvayIsImpzb24iLCJzdGF0dXNUZXh0IiwiVGlja2V0U2VydmljZSIsImxpc3QiLCJjcmVhdGVSZXF1ZXN0IiwiZ2V0IiwiY3JlYXRlIiwidXBkYXRlIiwiZGVsZXRlIiwiVGlja2V0IiwiX3JlZiIsInNob3dGb3JtQ2FsbGJhY2siLCJzdGF0dXMiLCJjcmVhdGVkIiwiYmluZCIsInVwZGF0ZUJ0biIsImRlbGV0ZUJ0biIsImlzRG9uZUVsIiwidGlja2V0Qm9keSIsInNob3dEZXNjcmlwdGlvbiIsImRvbmUiLCJkZWxldGVNZXNzYWdlIiwic2V0QXR0cmlidXRlIiwidG9nZ2xlIiwiZm9ybWF0dGVkRGF0ZSIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsIlRpY2tldFZpZXciLCJ0aWNrZXRzIiwiaXRlbSIsInRhYmxlUm93IiwidGlja2V0IiwicHVzaCIsIkhlbHBEZXNrIiwiSFRNTEVsZW1lbnQiLCJFcnJvciIsInRpY2tldFNlcnZpY2UiLCJ0aWNrZXRWaWV3IiwidGFibGVCb2R5IiwidXBkYXRlVGlja2V0Iiwic2hvd0Zvcm0iLCJjcmVhdGVUaWNrZXQiLCJyZW5kZXJJbml0aWFsTWFya3VwIiwiaW5pdGlhbGl6ZURPTUVsZW1lbnRzIiwiaW5pdGlhbGl6ZVRpY2tldFZpZXciLCJpbml0aWFsaXplVGlja2V0Rm9ybSIsInJlbG9hZERhdGEiLCJhZGRFbCIsImRlbGV0ZVRpY2tldCIsImNsb3NlTWVzc2FnZSIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsImRhdGFzZXQiLCJuZXdEYXRhIiwicmVzdWx0IiwiZ2V0VGlja2V0Iiwic2hvdyIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsImluaXQiXSwic291cmNlUm9vdCI6IiJ9
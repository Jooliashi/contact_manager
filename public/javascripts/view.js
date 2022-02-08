class View {
  constructor() {
    this.allContacts = this.getElement('#all_contacts')
    this.searchResult = this.getElement('#searchResult')
    this.#createTemplates();
    this.#registerHelper();
    this.#createAddContactBanner();
    this.#createAddContactForm();
    this.searchBar = this.getElement('#search')
    this.addContact = this.getElement('#add');
    this.#initLocalListeners();
  }

  #createTemplates() {
    this.templates = {};

    let temps = [...document.querySelectorAll('script[type="text/x-handlebars"]')];
    temps.forEach(temp => {
      this.templates[temp.id] = Handlebars.compile(temp.innerHTML);
    });
  }

  #registerHelper() {
    Handlebars.registerHelper('contains', function(str, keyword, options) {
      return str && str.match(keyword) ? options.fn(this) : options.inverse(this);
    })
  }

  #createAddContactForm() {
    let addHtml = this.templates.editContactTemplate({containerId: "add", heading: "Add Contact"})
    this.allContacts.insertAdjacentHTML("afterend", addHtml);
    this.getElement('#add').classList.add("fade_out");
  }

  #createAddContactBanner() {
    let addHtml = this.templates.addContactsBannerTemplate();
    this.allContacts.insertAdjacentHTML("beforebegin", addHtml);
  }

  #initLocalListeners() {
    document.addEventListener('click', e => {
      let ele = e.target;
      if (ele.classList.contains('add')) {
        e.preventDefault();
        this.#toggleContactsPage();
        this.#toggleView(this.getElement('.edit_add_form'));
      } else if (ele.classList.contains('cancel')) {
        e.preventDefault();
        this.#toggleView(ele.closest('.edit_add_form'));
        this.#toggleContactsPage()
      } 
    })

    this.bindFocusOut();
  }

  #toggleContactsPage() {
    document.querySelectorAll('.contacts_page').forEach(ele => this.#toggleView(ele));
  }

  #toggleView(ele) {
    ele.classList.toggle('fade_out');
  }

  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }

  displayContacts(contacts) {
    this.allContacts.innerHTML = '';
    this.searchResult.classList.add('fade_out')

    let contactsHtml = '';
    if (contacts.length !== 0) {
      contactsHtml = this.templates.singleContactTemplate({contacts})
    } else if (this.searchBar.value) {
      this.#toggleView(this.searchResult)
      this.searchResult.querySelector('p').innerHTML = `There is no contact starting with <span>${this.searchBar.value}</span>`
    } else {
      contactsHtml = this.templates.emptyContactsTemplate();
    }

    this.allContacts.innerHTML = contactsHtml;
  }

  #formDatatoJson(data) {
    let json = {}
    for (let pair of data.entries()) {
      if (json[pair[0]]) {
        json[pair[0]] += ', ' + pair[1]
      } else {
        json[pair[0]] = pair[1]
      }
    }
    return json;
  }

  #clearErrorMessage(form) {
    form.querySelector(".form_error_message").classList.add('fade_out');
    form.querySelector(".input_error_message").classList.add("fade_out");
  }

  #validateName(input) {
    if (input.validity.valueMissing) {
      input.nextElementSibling.textContent = "This is required"
      input.nextElementSibling.classList.remove("fade_out")
    } else if (input.validity.patternMismatch) {
      input.nextElementSibling.textContent = "You need a valid first name and a last name"
      input.nextElementSibling.classList.remove("fade_out")
    } else {
      this.#clearErrorMessage(input.closest('form'));
    }
  }


  bindFocusOut() {
    document.addEventListener('focusout', e => {
      if (e.target.tagName === "INPUT" && e.target.name === "full_name") {
        this.#validateName(e.target);
      }
    })
  }

  bindSubmitAddContact(handler) {
    this.addContact.addEventListener('click', e => {
      if (e.target.classList.contains('submit') && e.target.closest('.edit_add_form').id === "add") {
        e.preventDefault();
        let form = e.target.closest('form');
        if (form.checkValidity()) {
          let data = new FormData(form)
          let json = this.#formDatatoJson(data);
          form.reset();
          this.#clearErrorMessage(form);
          this.#toggleContactsPage();
          this.#toggleView(this.addContact)
          handler(json);
        } else {
          form.querySelector('.form_error_message').classList.remove("fade_out");
        }
      }
    })
  }

  bindEditButton(handler) {
    this.allContacts.addEventListener('click', e => {
      if (e.target.classList.contains('edit')) {
        e.preventDefault();
        let id = e.target.closest('li').dataset.id;
        this.#toggleContactsPage();
        handler(id);
      }
    })
  }

  displayEditContact(contact) {
    contact.containerId = "edit"
    contact.heading = "Edit Contact"
    let editFormHtml = this.templates.editContactTemplate(contact);
    document.body.insertAdjacentHTML("beforeend", editFormHtml)
  }

  bindSubmitEditContact(handler) {
    document.addEventListener('click', e => {
      if (e.target.classList.contains('submit') && e.target.closest('.edit_add_form').id === "edit") {
        e.preventDefault();
        let form = e.target.closest('form')
        if (form.checkValidity()) {
          let data = new FormData(form)
          let json = this.#formDatatoJson(data);
          json.id = e.target.closest('.edit_add_form').dataset.id;
          document.body.removeChild(this.getElement('#edit'))
          this.#toggleContactsPage();
          handler(json);
        } else {
          form.querySelector('.form_error_message').classList.remove("fade_out");
        }
      }
    })
  }

  bindDeleteButton(handler) {
    document.addEventListener('click', e => {
      if (e.target.classList.contains('delete')) {
        e.preventDefault();
        let confirmation = confirm("Are you sure you want to delete this contact?")
        if (confirmation) {
          let id = e.target.closest('li').dataset.id;
          handler(id);
        }
      }
    })
  }

  bindSearch(handler) {
    document.addEventListener('keyup', e => {
      if (e.target.id === "search") {
        let input = e.target.value;
        handler(input);
      }
    })
  }

  bindTags(handler) {
    this.allContacts.addEventListener('click', e => {
      if (e.target.tagName === 'SPAN') {
        handler(e.target.textContent)
      }
    })
  }

  bindShowAll(handler) {
    this.getElement('#add_contact_banner').addEventListener('click', e => {
      if (e.target.id === "show_all") {
        handler()
      }
    })
  }
}

export default View;
class Controller{
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.onContactsChanged();
    this.view.bindSubmitAddContact(this.handleAdd);
    this.view.bindEditButton(this.handleEdit)
    this.view.bindSubmitEditContact(this.handleSubmitEdit);
    this.view.bindDeleteButton(this.handleDelete);
    this.view.bindSearch(this.handleSearch)
    this.view.bindTags(this.handleTag);
    this.view.bindShowAll(this.onContactsChanged);
  }

  onContactsChanged = async () => {
    let contacts = await this.model.getAllContacts();
    this.view.displayContacts(contacts);
  }

  handleDelete = (id) => {
    this.model.deleteContact(id);
  }

  handleAdd = (json) => {
    this.model.addContact(json);
    this.onContactsChanged();
  }

  handleEdit = async (id) => {
    let contactInfo = await this.model.retrieveContact(id)
    this.view.displayEditContact(contactInfo);
  }

  handleSubmitEdit = (data) => {
    this.model.editContact(data);
    this.onContactsChanged();
  }

  handleDelete = (id) => {
    this.model.deleteContact(id);
    console.log("i'm here trying to show again")
    this.onContactsChanged();
  }

  handleSearch = (input) => {
    let filteredContacts = this.model.searchContact(input);
    this.view.displayContacts(filteredContacts);
  }

  handleTag = (tag) => {
    let filteredContacts = this.model.searchTag(tag);
    this.view.displayContacts(filteredContacts);
  }
}

export default Controller;

class Model {
  constructor() {
    this.contacts;
  }

  async getAllContacts() {
    let response = await fetch('/api/contacts')
    this.contacts = await response.json()
    this.contacts = this.contacts.map(contact => {
      if (contact.tags) {
        contact.tags = contact.tags.split(', ')
      }
      return contact;
    })
    return this.contacts;
  }

  async addContact(data) {
    let response = await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return await response.json().id;
  }

  async editContact(data) {
    let response = await fetch('/api/contacts/' + data.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
  }

  async retrieveContact(id) {
    let response = await fetch('/api/contacts/' + id);
    let data = await response.json()
    return data;
  }

  async deleteContact(id) {
    let response = await fetch('/api/contacts/' + id, {
      method: 'DELETE'
    })

    console.log(response.status)
  }

  searchContact(name) {
    let match = new RegExp(name, 'i')
    let filtered = this.contacts.filter(contact => contact.full_name.match(match))
    return filtered;
  }

  searchTag(tag) {
    let filtered = this.contacts.filter(contact => contact.tags && contact.tags.includes(tag));
    return filtered;
  }
}

export default Model;